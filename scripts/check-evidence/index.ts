#!/usr/bin/env node
/**
 * Evidence Check CLI
 *
 * Mechanical QA for dataset edges:
 *   1. Link rot - HEAD/GET every `evidenceUrl` and flag dead links.
 *   2. Missing evidence - flag edges with no evidence at all (no prose
 *      `evidence`, no `evidenceUrl`, and no `evidenceNodeId`).
 *
 * Link results are graded to avoid false alarms: 2xx/3xx is live; 404/410 or a
 * DNS failure is dead (a real problem); 401/403/405/429/5xx/timeout is
 * "uncertain" (often bot-blocking or a transient hiccup) and reported without
 * failing the run.
 *
 * Exit code is 1 only on confirmed problems (dead links or missing evidence),
 * so uncertain/transient results don't produce flaky failures.
 *
 * Usage:
 *   npx tsx scripts/check-evidence/index.ts [options]
 *
 * Options:
 *   --dataset <id>      Only this dataset (directory name). Default: all.
 *   --timeout <ms>      Per-request timeout. Default: 10000.
 *   --concurrency <n>   Max simultaneous requests. Default: 8.
 *   --quiet             Only show the per-dataset summary.
 *   --json              Emit the summary as JSON (implies --quiet).
 *   --help, -h          Show this help.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const DATASETS_DIR = 'public/datasets';
const USER_AGENT =
  'Scenius-check-evidence/1.0 (https://scenius-seven.vercel.app; link checker)';

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  evidence?: string;
  evidenceUrl?: string;
  evidenceNodeId?: string;
  [key: string]: unknown;
}

interface CLIOptions {
  dataset?: string;
  timeout: number;
  concurrency: number;
  quiet: boolean;
  json: boolean;
}

type LinkStatus = 'ok' | 'dead' | 'uncertain';

interface LinkResult {
  url: string;
  status: LinkStatus;
  code?: number;
  note?: string;
  edgeIds: string[];
}

interface DatasetEvidenceSummary {
  datasetId: string;
  edges: number;
  urls: number;
  ok: number;
  dead: number;
  uncertain: number;
  missingEvidence: string[];
  deadLinks: LinkResult[];
  uncertainLinks: LinkResult[];
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    timeout: 10000,
    concurrency: 8,
    quiet: false,
    json: false,
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--quiet':
        options.quiet = true;
        break;
      case '--json':
        options.json = true;
        options.quiet = true;
        break;
      case '--dataset':
        options.dataset = args[++i];
        break;
      case '--timeout':
        options.timeout = parseInt(args[++i], 10);
        break;
      case '--concurrency':
        options.concurrency = parseInt(args[++i], 10);
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          showHelp();
          process.exit(1);
        }
    }
  }
  return options;
}

function showHelp(): void {
  console.log(`
Evidence Check CLI for Scenius

Flags dead evidenceUrls and edges with no evidence at all.

Usage:
  npx tsx scripts/check-evidence/index.ts [options]

Options:
  --dataset <id>      Only this dataset. Default: all.
  --timeout <ms>      Per-request timeout. Default: 10000.
  --concurrency <n>   Max simultaneous requests. Default: 8.
  --quiet             Only show the per-dataset summary.
  --json              Emit the summary as JSON (implies --quiet).
  --help, -h          Show this help.

Examples:
  npx tsx scripts/check-evidence/index.ts --dataset enlightenment
  npx tsx scripts/check-evidence/index.ts --json
`);
}

async function getDatasetDirectories(
  datasetsPath: string,
  specificDataset?: string
): Promise<string[]> {
  if (specificDataset) {
    const edgesPath = join(datasetsPath, specificDataset, 'edges.json');
    if (!existsSync(edgesPath)) {
      throw new Error(`Dataset "${specificDataset}" not found or has no edges.json`);
    }
    return [specificDataset];
  }
  const entries = await readdir(datasetsPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .filter((e) => existsSync(join(datasetsPath, e.name, 'edges.json')))
    .map((e) => e.name);
}

/** One request with a timeout; returns the Response or throws. */
async function request(
  url: string,
  method: 'HEAD' | 'GET',
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Grade a single URL. HEAD first, falling back to GET when HEAD is rejected. */
async function checkUrl(url: string, timeout: number): Promise<Omit<LinkResult, 'edgeIds'>> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { url, status: 'dead', note: 'malformed URL' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { url, status: 'dead', note: `unsupported protocol ${parsed.protocol}` };
  }

  try {
    let res = await request(url, 'HEAD', timeout);
    // Many servers don't implement HEAD - retry with GET before judging.
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await request(url, 'GET', timeout);
    }
    if (res.ok || (res.status >= 300 && res.status < 400)) {
      return { url, status: 'ok', code: res.status };
    }
    if (res.status === 404 || res.status === 410) {
      return { url, status: 'dead', code: res.status };
    }
    // 401/403/429/5xx etc. - can't confirm dead (often bot protection).
    return { url, status: 'uncertain', code: res.status };
  } catch (err) {
    const msg = (err as Error).message || String(err);
    // DNS resolution failure is a strong dead signal; timeouts are not.
    if (/ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(msg)) {
      return { url, status: 'dead', note: 'DNS failure' };
    }
    return { url, status: 'uncertain', note: msg.slice(0, 80) };
  }
}

/** Run an async mapper over items with a bounded concurrency. */
async function pool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function run(): Promise<void> {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, run)
  );
  return results;
}

async function checkDataset(
  datasetsPath: string,
  datasetId: string,
  options: CLIOptions
): Promise<DatasetEvidenceSummary> {
  const edgesPath = join(datasetsPath, datasetId, 'edges.json');
  const edges = JSON.parse(await readFile(edgesPath, 'utf-8')) as GraphEdge[];

  // Edges with no evidence of any kind.
  const missingEvidence = edges
    .filter(
      (e) =>
        !(e.evidence && String(e.evidence).trim()) &&
        !e.evidenceUrl &&
        !e.evidenceNodeId
    )
    .map((e) => e.id);

  // Unique URLs -> the edges that cite them.
  const urlToEdges = new Map<string, string[]>();
  for (const e of edges) {
    if (!e.evidenceUrl) continue;
    const list = urlToEdges.get(e.evidenceUrl) ?? [];
    list.push(e.id);
    urlToEdges.set(e.evidenceUrl, list);
  }

  const urls = [...urlToEdges.keys()];
  const graded = await pool(urls, options.concurrency, (u) =>
    checkUrl(u, options.timeout)
  );
  const results: LinkResult[] = graded.map((g) => ({
    ...g,
    edgeIds: urlToEdges.get(g.url) ?? [],
  }));

  return {
    datasetId,
    edges: edges.length,
    urls: urls.length,
    ok: results.filter((r) => r.status === 'ok').length,
    dead: results.filter((r) => r.status === 'dead').length,
    uncertain: results.filter((r) => r.status === 'uncertain').length,
    missingEvidence,
    deadLinks: results.filter((r) => r.status === 'dead'),
    uncertainLinks: results.filter((r) => r.status === 'uncertain'),
  };
}

function printSummary(s: DatasetEvidenceSummary, options: CLIOptions): void {
  if (options.json) return;
  console.log(`\n${s.datasetId}`);

  if (!options.quiet) {
    for (const d of s.deadLinks) {
      console.log(
        `  ✗ DEAD ${d.code ?? d.note}: ${d.url} (${d.edgeIds.length} edge(s))`
      );
    }
    for (const u of s.uncertainLinks) {
      console.log(`  ? ${u.code ?? u.note}: ${u.url}`);
    }
    for (const id of s.missingEvidence) {
      console.log(`  ! no evidence: ${id}`);
    }
  }

  console.log(
    `  ${s.edges} edges, ${s.urls} urls | ok: ${s.ok}, dead: ${s.dead}, ` +
      `uncertain: ${s.uncertain}, missing-evidence: ${s.missingEvidence.length}`
  );
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const datasetsPath = resolve(process.cwd(), DATASETS_DIR);

  let datasets: string[];
  try {
    datasets = await getDatasetDirectories(datasetsPath, options.dataset);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }

  const summaries: DatasetEvidenceSummary[] = [];
  for (const datasetId of datasets) {
    const summary = await checkDataset(datasetsPath, datasetId, options);
    summaries.push(summary);
    printSummary(summary, options);
  }

  if (options.json) {
    console.log(
      JSON.stringify(
        summaries.map((s) => ({
          datasetId: s.datasetId,
          edges: s.edges,
          urls: s.urls,
          ok: s.ok,
          dead: s.dead,
          uncertain: s.uncertain,
          missingEvidence: s.missingEvidence.length,
          deadLinks: s.deadLinks.map((d) => ({ url: d.url, edgeIds: d.edgeIds })),
        })),
        null,
        2
      )
    );
  }

  const problems = summaries.reduce(
    (n, s) => n + s.dead + s.missingEvidence.length,
    0
  );
  if (problems > 0 && !options.json) {
    console.log(
      `\n${problems} confirmed problem(s): dead links or edges with no evidence.`
    );
  }
  process.exit(problems > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
