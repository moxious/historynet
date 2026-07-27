#!/usr/bin/env node
/**
 * Manifest Sync CLI
 *
 * Recomputes each dataset manifest's `nodeCount` and `edgeCount` from the
 * actual nodes.json / edges.json, and bumps `lastUpdated` when those counts
 * change. Replaces the manual `jq` recipes in RESEARCHING_NETWORKS.md.
 *
 * Two modes:
 *   - write (default): fix any out-of-sync manifests in place.
 *   - --check (CI): report mismatches and exit non-zero, writing nothing.
 *
 * Usage:
 *   npx tsx scripts/sync-manifest/index.ts [options]
 *
 * Options:
 *   --dataset <id>   Only this dataset (directory name). Default: all.
 *   --check          Report drift and exit 1 if any; do not write. (CI mode)
 *   --quiet          Only output the final summary.
 *   --help, -h       Show this help.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const DATASETS_DIR = 'public/datasets';

interface CLIOptions {
  dataset?: string;
  check: boolean;
  quiet: boolean;
}

interface Manifest {
  id?: string;
  nodeCount?: number;
  edgeCount?: number;
  lastUpdated?: string;
  [key: string]: unknown;
}

interface DatasetSyncResult {
  datasetId: string;
  nodeCount: number;
  edgeCount: number;
  oldNodeCount?: number;
  oldEdgeCount?: number;
  /** True when the manifest counts differed from the actual data. */
  drifted: boolean;
  /** True when the manifest file was rewritten (write mode + drift). */
  written: boolean;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = { check: false, quiet: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--check':
        options.check = true;
        break;
      case '--quiet':
        options.quiet = true;
        break;
      case '--dataset':
        options.dataset = args[++i];
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
Manifest Sync CLI for Scenius

Recomputes nodeCount/edgeCount from the data and bumps lastUpdated on change.

Usage:
  npx tsx scripts/sync-manifest/index.ts [options]

Options:
  --dataset <id>   Only this dataset (directory name). Default: all.
  --check          Report drift and exit 1 if any; write nothing. (CI mode)
  --quiet          Only output the final summary.
  --help, -h       Show this help.

Examples:
  npx tsx scripts/sync-manifest/index.ts
  npx tsx scripts/sync-manifest/index.ts --dataset enlightenment
  npx tsx scripts/sync-manifest/index.ts --check
`);
}

async function getDatasetDirectories(
  datasetsPath: string,
  specificDataset?: string
): Promise<string[]> {
  if (specificDataset) {
    const manifestPath = join(datasetsPath, specificDataset, 'manifest.json');
    if (!existsSync(manifestPath)) {
      throw new Error(
        `Dataset "${specificDataset}" not found or missing manifest.json`
      );
    }
    return [specificDataset];
  }
  const entries = await readdir(datasetsPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) =>
      existsSync(join(datasetsPath, entry.name, 'manifest.json'))
    )
    .map((entry) => entry.name);
}

/** Current date as YYYY-MM-DD, matching existing manifest lastUpdated format. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function countArray(path: string): Promise<number> {
  const data = JSON.parse(await readFile(path, 'utf-8'));
  if (!Array.isArray(data)) {
    throw new Error(`${path} is not a JSON array`);
  }
  return data.length;
}

async function syncDataset(
  datasetsPath: string,
  datasetId: string,
  options: CLIOptions
): Promise<DatasetSyncResult> {
  const dir = join(datasetsPath, datasetId);
  const manifestPath = join(dir, 'manifest.json');

  const manifest = JSON.parse(await readFile(manifestPath, 'utf-8')) as Manifest;
  const nodeCount = await countArray(join(dir, 'nodes.json'));
  const edgeCount = await countArray(join(dir, 'edges.json'));

  const drifted =
    manifest.nodeCount !== nodeCount || manifest.edgeCount !== edgeCount;

  const result: DatasetSyncResult = {
    datasetId,
    nodeCount,
    edgeCount,
    oldNodeCount: manifest.nodeCount,
    oldEdgeCount: manifest.edgeCount,
    drifted,
    written: false,
  };

  if (drifted && !options.check) {
    manifest.nodeCount = nodeCount;
    manifest.edgeCount = edgeCount;
    manifest.lastUpdated = today();
    await writeFile(
      manifestPath,
      JSON.stringify(manifest, null, 2) + '\n',
      'utf-8'
    );
    result.written = true;
  }

  return result;
}

function printResult(r: DatasetSyncResult, options: CLIOptions): void {
  if (options.quiet) return;
  if (!r.drifted) {
    console.log(`  ✓ ${r.datasetId}: in sync (${r.nodeCount}n / ${r.edgeCount}e)`);
    return;
  }
  const arrow = (oldVal: number | undefined, next: number) =>
    oldVal === next ? String(next) : `${oldVal ?? '—'}→${next}`;
  const change = `nodes ${arrow(r.oldNodeCount, r.nodeCount)}, edges ${arrow(
    r.oldEdgeCount,
    r.edgeCount
  )}`;
  const verb = options.check ? 'DRIFT' : r.written ? 'fixed' : 'drift';
  console.log(`  ${options.check ? '✗' : '↻'} ${r.datasetId}: ${verb} (${change})`);
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

  if (datasets.length === 0) {
    console.error('No datasets found');
    process.exit(1);
  }

  const results: DatasetSyncResult[] = [];
  for (const datasetId of datasets) {
    results.push(await syncDataset(datasetsPath, datasetId, options));
    printResult(results[results.length - 1], options);
  }

  const drifted = results.filter((r) => r.drifted).length;
  const written = results.filter((r) => r.written).length;

  if (options.check) {
    if (drifted > 0) {
      console.error(
        `\n${drifted}/${results.length} manifest(s) out of sync. ` +
          `Run: npm run sync-manifest`
      );
      process.exit(1);
    }
    console.log(`\nAll ${results.length} manifest(s) in sync.`);
  } else {
    console.log(
      `\n${written} manifest(s) updated, ${results.length - drifted} already in sync.`
    );
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
