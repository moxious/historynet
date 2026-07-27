#!/usr/bin/env node
/**
 * Cross-Dataset Entity Consistency Report
 *
 * Because datasets aren't atomic yet, the same real-world entity (keyed by
 * wikidataId) exists as independent node copies in each dataset that includes
 * it. Those copies drift: London is dated 47 in one dataset and 1490 in another.
 * This tool surfaces that drift.
 *
 * It groups every node with a wikidataId across all datasets and reports:
 *   - CONFLICTS: copies with *differing* non-empty canonical values (a real
 *     data error - the same entity can't have two birth years).
 *   - INCOMPLETE: a canonical field filled in some copies, empty in others
 *     (redundant enrichment the atomic model would do once).
 *   - INTRA-DATASET DUPLICATES: one wikidataId used by >1 node in a single
 *     dataset (an outright duplicate to merge).
 *
 * Contextual fields (biography, shortDescription, description) are expected to
 * differ per network and are NOT flagged - in the atomic model those become
 * per-dataset overrides.
 *
 * This is a down payment on the atomic architecture (M34-M37): it quantifies the
 * reuse/consistency problem and is the substrate for migration equivalence
 * checks. Report-only; exits non-zero when conflicts or intra-dataset
 * duplicates exist (usable as a health signal).
 *
 * Usage:
 *   npx tsx scripts/cross-dataset/index.ts [--conflicts-only] [--json]
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const DATASETS_DIR = 'public/datasets';

/** Canonical fields that should be identical across copies of one entity. */
const CANONICAL_FIELDS = [
  'type',
  'wikipediaTitle',
  'dateStart',
  'dateEnd',
  'birthPlace',
  'nationality',
] as const;

interface GraphNode {
  id: string;
  type: string;
  title: string;
  wikidataId?: string | null;
  [key: string]: unknown;
}

interface Copy {
  dataset: string;
  nodeId: string;
  title: string;
  node: GraphNode;
}

interface FieldConflict {
  field: string;
  values: Array<{ value: string; datasets: string[] }>;
}

interface EntityReport {
  wikidataId: string;
  titles: string[];
  datasets: string[];
  copyCount: number;
  intraDatasetDup: boolean;
  conflicts: FieldConflict[];
  precisionFields: string[];
  incompleteFields: string[];
}

interface CLIOptions {
  conflictsOnly: boolean;
  json: boolean;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = { conflictsOnly: false, json: false };
  for (const arg of args) {
    switch (arg) {
      case '--conflicts-only':
        options.conflictsOnly = true;
        break;
      case '--json':
        options.json = true;
        break;
      case '--help':
      case '-h':
        console.log(
          'Usage: npx tsx scripts/cross-dataset/index.ts [--conflicts-only] [--json]\n\n' +
            'Reports entities shared across datasets and flags divergent canonical\n' +
            'fields and intra-dataset duplicates. Contextual fields (biography,\n' +
            'descriptions) are ignored. Report-only.'
        );
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
    }
  }
  return options;
}

/** Normalize a value for comparison. Dates compare by year; strings by trim. */
function normValue(field: string, raw: unknown): string {
  if (raw === undefined || raw === null) return '';
  const s = String(raw).trim();
  if (field === 'dateStart' || field === 'dateEnd') {
    const m = /^-?\d+/.exec(s);
    return m ? m[0] : s;
  }
  return s;
}

async function loadAll(datasetsPath: string): Promise<Map<string, Copy[]>> {
  const dirs = (await readdir(datasetsPath, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .filter((e) => existsSync(join(datasetsPath, e.name, 'nodes.json')))
    .map((e) => e.name);

  const byWd = new Map<string, Copy[]>();
  for (const dataset of dirs) {
    const nodes = JSON.parse(
      await readFile(join(datasetsPath, dataset, 'nodes.json'), 'utf-8')
    ) as GraphNode[];
    for (const node of nodes) {
      if (!node.wikidataId) continue;
      const list = byWd.get(node.wikidataId) ?? [];
      list.push({ dataset, nodeId: node.id, title: node.title, node });
      byWd.set(node.wikidataId, list);
    }
  }
  return byWd;
}

/** Build a report for one entity's copies, or null if it's a lone unique node. */
function analyzeEntity(wikidataId: string, copies: Copy[]): EntityReport | null {
  const datasets = copies.map((c) => c.dataset);
  const uniqueDatasets = [...new Set(datasets)];
  const intraDatasetDup = datasets.length !== uniqueDatasets.length;

  // Only entities that are shared or intra-duplicated are interesting.
  if (copies.length < 2) return null;

  const conflicts: FieldConflict[] = [];
  const precisionFields: string[] = [];
  const incompleteFields: string[] = [];

  for (const field of CANONICAL_FIELDS) {
    // Group datasets by this field's normalized value.
    const byValue = new Map<string, string[]>();
    let emptyCount = 0;
    for (const c of copies) {
      const v = normValue(field, c.node[field]);
      if (v === '') {
        emptyCount++;
        continue;
      }
      const list = byValue.get(v) ?? [];
      list.push(c.dataset);
      byValue.set(v, list);
    }

    if (byValue.size > 1) {
      const values = [...byValue.keys()];
      // Precision difference (not a contradiction): every value is a
      // case-insensitive substring of the longest, e.g. "Scania" vs
      // "Scania, Denmark". Only applies to free-text string fields.
      const isStringField = field !== 'type' && field !== 'dateStart' && field !== 'dateEnd';
      const longest = values.reduce((a, b) => (b.length > a.length ? b : a));
      const isPrecision =
        isStringField &&
        values.every((v) => longest.toLowerCase().includes(v.toLowerCase()));
      if (isPrecision) {
        precisionFields.push(field);
      } else {
        conflicts.push({
          field,
          values: [...byValue.entries()].map(([value, ds]) => ({ value, datasets: ds })),
        });
      }
    } else if (byValue.size === 1 && emptyCount > 0) {
      incompleteFields.push(field);
    }
  }

  return {
    wikidataId,
    titles: [...new Set(copies.map((c) => c.title))],
    datasets: uniqueDatasets.sort(),
    copyCount: copies.length,
    intraDatasetDup,
    conflicts,
    precisionFields,
    incompleteFields,
  };
}

function printReport(reports: EntityReport[], options: CLIOptions): void {
  const conflicted = reports.filter((r) => r.conflicts.length > 0);
  const intraDup = reports.filter((r) => r.intraDatasetDup);
  const incomplete = reports.filter(
    (r) => r.conflicts.length === 0 && r.incompleteFields.length > 0
  );

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          sharedEntities: reports.length,
          withConflicts: conflicted.length,
          intraDatasetDuplicates: intraDup.length,
          withIncompleteFields: incomplete.length,
          conflicts: conflicted,
          intraDatasetDupEntities: intraDup,
        },
        null,
        2
      )
    );
    return;
  }

  console.log('\n# Cross-Dataset Entity Consistency Report\n');
  console.log(`Entities shared across datasets (or duplicated within one): ${reports.length}`);
  console.log(`  ⚠ with canonical-field CONFLICTS: ${conflicted.length}`);
  console.log(`  ⧉ intra-dataset duplicates:        ${intraDup.length}`);
  console.log(`  ○ with incomplete (fillable) fields: ${incomplete.length}`);

  if (conflicted.length > 0) {
    console.log('\n## ⚠ Canonical-field conflicts (same entity, contradictory values)\n');
    for (const r of conflicted.sort((a, b) => b.conflicts.length - a.conflicts.length)) {
      console.log(`- **${r.titles.join(' / ')}** [${r.wikidataId}] — ${r.datasets.length} datasets`);
      for (const c of r.conflicts) {
        const vals = c.values
          .map((v) => `"${v.value}" (${v.datasets.join(', ')})`)
          .join(' vs ');
        console.log(`  - ${c.field}: ${vals}`);
      }
    }
  }

  if (intraDup.length > 0) {
    console.log('\n## ⧉ Intra-dataset duplicates (one entity, multiple nodes in a dataset)\n');
    for (const r of intraDup) {
      console.log(`- **${r.titles.join(' / ')}** [${r.wikidataId}] — copies: ${r.datasets.join(', ')}`);
    }
  }

  if (!options.conflictsOnly) {
    const cleanShared = reports.filter(
      (r) => r.conflicts.length === 0 && !r.intraDatasetDup
    );
    console.log(
      `\n## Shared entities, no conflict (${cleanShared.length}) — canonical-reuse candidates\n`
    );
    console.log(
      '_These are cleanly shared across datasets; under the atomic model each would be one\n' +
        'canonical record enriched once, with per-dataset contextual overrides._\n'
    );
    for (const r of cleanShared.sort((a, b) => b.datasets.length - a.datasets.length).slice(0, 30)) {
      const inc = r.incompleteFields.length ? ` (incomplete: ${r.incompleteFields.join(', ')})` : '';
      console.log(`- ${r.titles.join(' / ')} [${r.wikidataId}] × ${r.datasets.length}: ${r.datasets.join(', ')}${inc}`);
    }
    if (cleanShared.length > 30) console.log(`  … and ${cleanShared.length - 30} more`);
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const datasetsPath = resolve(process.cwd(), DATASETS_DIR);

  const byWd = await loadAll(datasetsPath);
  const reports: EntityReport[] = [];
  for (const [wikidataId, copies] of byWd) {
    const report = analyzeEntity(wikidataId, copies);
    if (report) reports.push(report);
  }

  printReport(reports, options);

  const problems =
    reports.filter((r) => r.conflicts.length > 0).length +
    reports.filter((r) => r.intraDatasetDup).length;
  process.exit(problems > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
