#!/usr/bin/env node
/**
 * Dataset Enrichment CLI
 *
 * Fills *missing* mechanical node fields (Wikidata ID, Wikipedia title, dates,
 * birthplace, nationality, occupations, short description) by looking them up
 * in the Wikidata and Wikipedia APIs. This is the deterministic half of the
 * "idea -> dataset" pipeline - no language model required.
 *
 * Design:
 *   - Only-missing: existing curated values are never overwritten.
 *   - Never touches prose: title and biography are left to the LLM.
 *   - Quarantine ambiguous: nodes with multiple candidate QIDs (or a search
 *     match that fails a type check) are written to <dataset>/enrich-ambiguous.json
 *     for human/LLM disambiguation instead of being guessed.
 *
 * Usage:
 *   npx tsx scripts/enrich-dataset/index.ts [options]
 *
 * Options:
 *   --dataset <id>   Enrich only this dataset (directory name). Default: all.
 *   --fields <list>  Comma-separated subset of fields to fill. Default: all.
 *                    (wikidataId,wikipediaTitle,dateStart,dateEnd,
 *                     shortDescription,birthPlace,nationality,occupations)
 *   --dry-run        Report what would change; write nothing.
 *   --quiet          Only show the per-dataset summary.
 *   --json           Emit the run summary as JSON (implies --quiet).
 *   --help, -h       Show this help.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { enrichDataset } from './enricher.js';
import {
  ENRICHABLE_FIELDS,
  type AmbiguousEntry,
  type CLIOptions,
  type DatasetEnrichmentSummary,
  type EnrichableField,
  type GraphNode,
  type NodeEnrichmentResult,
} from './types.js';

const DATASETS_DIR = 'public/datasets';

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    dryRun: false,
    fields: [...ENRICHABLE_FIELDS],
    quiet: false,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;
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
      case '--fields': {
        const raw = args[++i] ?? '';
        const requested = raw
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean);
        const invalid = requested.filter(
          (f) => !ENRICHABLE_FIELDS.includes(f as EnrichableField)
        );
        if (invalid.length > 0) {
          console.error(`Unknown field(s): ${invalid.join(', ')}`);
          console.error(`Valid fields: ${ENRICHABLE_FIELDS.join(', ')}`);
          process.exit(1);
        }
        options.fields = requested as EnrichableField[];
        break;
      }
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
Dataset Enrichment CLI for Scenius

Fills missing mechanical fields from Wikidata/Wikipedia. Never overwrites
existing values or curated prose. Ambiguous matches are quarantined.

Usage:
  npx tsx scripts/enrich-dataset/index.ts [options]

Options:
  --dataset <id>   Enrich only this dataset (directory name). Default: all.
  --fields <list>  Comma-separated subset of fields to fill. Default: all.
  --dry-run        Report what would change; write nothing.
  --quiet          Only show the per-dataset summary.
  --json           Emit the run summary as JSON (implies --quiet).
  --help, -h       Show this help.

Fields: ${ENRICHABLE_FIELDS.join(', ')}

Examples:
  npx tsx scripts/enrich-dataset/index.ts --dataset enlightenment --dry-run
  npx tsx scripts/enrich-dataset/index.ts --dataset enlightenment --fields dateStart,dateEnd
  npx tsx scripts/enrich-dataset/index.ts --all
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
    .filter((entry) => existsSync(join(datasetsPath, entry.name, 'nodes.json')))
    .map((entry) => entry.name);
}

/** Build the quarantine file entries for a dataset's problem nodes. */
function collectAmbiguous(results: NodeEnrichmentResult[]): AmbiguousEntry[] {
  const entries: AmbiguousEntry[] = [];
  for (const r of results) {
    if (r.status === 'ambiguous') {
      entries.push({
        nodeId: r.nodeId,
        title: r.title,
        type: r.type,
        reason: 'multiple-candidates',
        note: r.note,
        candidates: r.candidates ?? [],
      });
    } else if (r.status === 'type-mismatch') {
      entries.push({
        nodeId: r.nodeId,
        title: r.title,
        type: r.type,
        reason: 'type-mismatch',
        note: r.note,
        candidates: r.candidates ?? [],
      });
    } else if (r.status === 'not-found') {
      entries.push({
        nodeId: r.nodeId,
        title: r.title,
        type: r.type,
        reason: 'not-found',
        note: r.note,
        candidates: r.candidates ?? [],
      });
    }
  }
  return entries;
}

function summarize(
  datasetId: string,
  totalNodes: number,
  results: NodeEnrichmentResult[]
): DatasetEnrichmentSummary {
  const count = (s: NodeEnrichmentResult['status']) =>
    results.filter((r) => r.status === s).length;
  const fieldsFilled = results.reduce(
    (sum, r) => sum + Object.keys(r.filled).length,
    0
  );
  return {
    datasetId,
    totalNodes,
    enriched: count('enriched'),
    complete: count('complete'),
    ambiguous: count('ambiguous'),
    notFound: count('not-found'),
    typeMismatch: count('type-mismatch'),
    errors: count('error'),
    fieldsFilled,
    results,
  };
}

function printSummary(
  summary: DatasetEnrichmentSummary,
  options: CLIOptions
): void {
  if (options.json) return;

  const mode = options.dryRun ? ' (dry-run)' : '';
  console.log(`\n${summary.datasetId}${mode}`);

  if (!options.quiet) {
    for (const r of summary.results) {
      if (r.status === 'enriched') {
        const fields = Object.entries(r.filled)
          .map(([k, v]) => `${k}=${Array.isArray(v) ? `[${v.length}]` : v}`)
          .join(', ');
        console.log(`  ✓ ${r.title}: ${fields}`);
      } else if (r.status === 'ambiguous') {
        console.log(
          `  ? ${r.title}: ${r.candidates?.length ?? 0} candidates (quarantined)`
        );
      } else if (r.status === 'type-mismatch') {
        console.log(`  ✗ ${r.title}: type mismatch (quarantined)`);
      } else if (r.status === 'not-found') {
        console.log(`  – ${r.title}: no match (quarantined)`);
      } else if (r.status === 'error') {
        console.log(`  ! ${r.title}: ${r.note}`);
      }
    }
  }

  console.log(
    `  ${summary.fieldsFilled} fields filled across ${summary.enriched} nodes | ` +
      `complete: ${summary.complete}, ambiguous: ${summary.ambiguous}, ` +
      `type-mismatch: ${summary.typeMismatch}, not-found: ${summary.notFound}, ` +
      `errors: ${summary.errors}`
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

  if (datasets.length === 0) {
    console.error('No datasets found to enrich');
    process.exit(1);
  }

  const summaries: DatasetEnrichmentSummary[] = [];

  for (const datasetId of datasets) {
    const nodesPath = join(datasetsPath, datasetId, 'nodes.json');
    const nodes = JSON.parse(await readFile(nodesPath, 'utf-8')) as GraphNode[];

    const results = await enrichDataset(nodes, options.fields, {
      dryRun: options.dryRun,
    });
    const summary = summarize(datasetId, nodes.length, results);
    summaries.push(summary);

    // Persist enriched nodes (unless dry-run and nothing changed).
    if (!options.dryRun && summary.fieldsFilled > 0) {
      await writeFile(nodesPath, JSON.stringify(nodes, null, 2) + '\n', 'utf-8');
    }

    // Write / clear the quarantine file for nodes needing human attention.
    const ambiguous = collectAmbiguous(results);
    const ambiguousPath = join(
      datasetsPath,
      datasetId,
      'enrich-ambiguous.json'
    );
    if (!options.dryRun) {
      if (ambiguous.length > 0) {
        await writeFile(
          ambiguousPath,
          JSON.stringify(ambiguous, null, 2) + '\n',
          'utf-8'
        );
      } else if (existsSync(ambiguousPath)) {
        // Nothing left to disambiguate - remove a stale quarantine file.
        await writeFile(ambiguousPath, '[]\n', 'utf-8');
      }
    }

    printSummary(summary, options);
  }

  if (options.json) {
    // Emit the counts only; the verbose per-node results stay out of JSON.
    const counts = summaries.map((s) => ({
      datasetId: s.datasetId,
      totalNodes: s.totalNodes,
      enriched: s.enriched,
      complete: s.complete,
      ambiguous: s.ambiguous,
      notFound: s.notFound,
      typeMismatch: s.typeMismatch,
      errors: s.errors,
      fieldsFilled: s.fieldsFilled,
    }));
    console.log(JSON.stringify(counts, null, 2));
  }

  const hadErrors = summaries.some((s) => s.errors > 0);
  process.exit(hadErrors ? 1 : 0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
