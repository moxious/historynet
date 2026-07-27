#!/usr/bin/env node
/**
 * Date-aware Wikidata ID Resolver
 *
 * Assigns wikidataIds to nodes that currently have none (typically nodes an
 * earlier `verify-ids --fix` cleared because a plain name search returned
 * several candidates and it refused to guess). This resolver adds the missing
 * disambiguator: DATES. A person node dated 1885 unambiguously matches the
 * candidate born ~1885; a candidate whose dates conflict is rejected outright.
 *
 * It auto-assigns ONLY high-confidence matches:
 *   - name matches (type-appropriate) AND type is plausible (persons must be Q5)
 *   - AND either the node's date corroborates the candidate, OR there is exactly
 *     one non-conflicting candidate.
 * Anything ambiguous or date-conflicting is left null and reported.
 *
 * Usage:
 *   npx tsx scripts/resolve-ids/index.ts --dataset <id> [--dry-run]
 *
 * Options:
 *   --dataset <id>   Only this dataset (directory name). Default: all.
 *   --dry-run        Report proposed assignments; write nothing.
 *   --quiet          Only show the per-dataset summary.
 *   --json           Emit the summary as JSON (implies --quiet).
 *   --help, -h       Show this help.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import {
  Q_HUMAN,
  searchEntities,
  getEntities,
  entityNames,
  entityLabel,
  entitySitelinkTitle,
  isInstanceOf,
  claimYear,
  dateProps,
  type WikidataEntity,
} from '../enrich-dataset/wikidata.js';
import { personMatches, genericMatches } from '../verify-ids/matcher.js';
import { applyIdEdits, type IdEdit } from '../verify-ids/rewrite.js';

interface GraphNode {
  id: string;
  type: 'person' | 'object' | 'location' | 'entity';
  title: string;
  alternateNames?: string[];
  dateStart?: string;
  dateEnd?: string;
  wikidataId?: string | null;
  [key: string]: unknown;
}

interface CLIOptions {
  dataset?: string;
  dryRun: boolean;
  quiet: boolean;
  json: boolean;
}

interface Assignment {
  nodeId: string;
  title: string;
  type: GraphNode['type'];
  wikidataId: string;
  label: string;
  wikipediaTitle?: string;
  dateCorroborated: boolean;
}

interface DatasetResolveSummary {
  datasetId: string;
  nullNodes: number;
  assigned: number;
  dateCorroborated: number;
  unresolved: number;
  assignments: Assignment[];
}

const DATASETS_DIR = 'public/datasets';

/** Wikimedia meta-page "instance of" types that are never a real subject. */
const JUNK_TYPES = [
  'Q4167410', // Wikimedia disambiguation page
  'Q4167836', // Wikimedia category
  'Q13406463', // Wikimedia list article
  'Q11266439', // Wikimedia template
];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Parse a leading (possibly negative) year from a date string. */
function year(date?: string): number | null {
  if (!date) return null;
  const m = /^-?\d+/.exec(date);
  return m ? parseInt(m[0], 10) : null;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = { dryRun: false, quiet: false, json: false };
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
Date-aware Wikidata ID Resolver for Scenius

Assigns ids to null-id nodes using name + type + date corroboration. Only
high-confidence matches are written; ambiguous/conflicting ones stay null.

Usage:
  npx tsx scripts/resolve-ids/index.ts --dataset <id> [--dry-run]

Options:
  --dataset <id>   Only this dataset. Default: all.
  --dry-run        Report proposed assignments; write nothing.
  --quiet          Only show the per-dataset summary.
  --json           Emit the summary as JSON (implies --quiet).
  --help, -h       Show this help.
`);
}

async function getDatasetDirectories(
  datasetsPath: string,
  specificDataset?: string
): Promise<string[]> {
  if (specificDataset) {
    const manifestPath = join(datasetsPath, specificDataset, 'manifest.json');
    if (!existsSync(manifestPath)) {
      throw new Error(`Dataset "${specificDataset}" not found`);
    }
    return [specificDataset];
  }
  const entries = await readdir(datasetsPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .filter((e) => existsSync(join(datasetsPath, e.name, 'nodes.json')))
    .map((e) => e.name);
}

/** Does the candidate's name match the node (title or an alternate name)? */
function nameMatches(node: GraphNode, names: string[]): boolean {
  const titles = [node.title, ...(node.alternateNames ?? [])];
  const check = node.type === 'person' ? personMatches : genericMatches;
  return titles.some((t) => check(t, names));
}

/**
 * Compare a node's date to a candidate entity's date.
 * Returns 'match' (within 2 years), 'conflict' (>5 years off), or 'none'.
 */
function dateAgreement(
  node: GraphNode,
  entity: WikidataEntity
): 'match' | 'conflict' | 'none' {
  const nodeStart = year(node.dateStart);
  if (nodeStart === null) return 'none';
  const eStart = year(claimYear(entity, dateProps(node.type).start));
  if (eStart === null) return 'none';
  const diff = Math.abs(nodeStart - eStart);
  if (diff <= 2) return 'match';
  if (diff > 5) return 'conflict';
  return 'none';
}

/**
 * Resolve one null-id node. Returns an assignment or null.
 *
 * Candidates must pass name + type checks and must not date-conflict. Among
 * survivors we assign when: a single survivor exists, OR exactly one survivor
 * is date-corroborated (preferred even if others survive).
 */
async function resolveNode(node: GraphNode): Promise<Assignment | null> {
  const queries = [node.title, ...(node.alternateNames ?? [])];
  const seen = new Set<string>();
  const rawIds: string[] = [];
  for (const q of queries.slice(0, 2)) {
    const results = await searchEntities(q, 7);
    for (const r of results) {
      if (!seen.has(r.wikidataId)) {
        seen.add(r.wikidataId);
        rawIds.push(r.wikidataId);
      }
    }
  }
  if (rawIds.length === 0) return null;

  const entities = await getEntities(rawIds);

  interface Survivor {
    id: string;
    entity: WikidataEntity;
    corroborated: boolean;
  }
  const survivors: Survivor[] = [];
  for (const id of rawIds) {
    const entity = entities.get(id);
    if (!entity) continue;
    // Never accept Wikimedia meta-pages (disambiguation, category, list) - they
    // share a name with the real subject but aren't it.
    if (JUNK_TYPES.some((t) => isInstanceOf(entity, t))) continue;
    if (node.type === 'person' && !isInstanceOf(entity, Q_HUMAN)) continue;
    if (!nameMatches(node, entityNames(entity))) continue;
    const agree = dateAgreement(node, entity);
    if (agree === 'conflict') continue; // dates rule it out
    survivors.push({ id, entity, corroborated: agree === 'match' });
  }

  if (survivors.length === 0) return null;

  const corroborated = survivors.filter((s) => s.corroborated);
  let chosen: Survivor | undefined;
  if (corroborated.length === 1) {
    chosen = corroborated[0]; // dates uniquely disambiguate - strongest signal
  } else if (corroborated.length === 0 && survivors.length === 1) {
    chosen = survivors[0]; // single non-conflicting match, no date to confirm
  }
  if (!chosen) return null; // ambiguous - leave for manual review

  const sitelink = entitySitelinkTitle(chosen.entity);
  return {
    nodeId: node.id,
    title: node.title,
    type: node.type,
    wikidataId: chosen.id,
    label: entityLabel(chosen.entity) ?? '(no label)',
    wikipediaTitle: sitelink ? sitelink.replace(/ /g, '_') : undefined,
    dateCorroborated: chosen.corroborated,
  };
}

async function resolveDataset(
  datasetsPath: string,
  datasetId: string,
  options: CLIOptions
): Promise<DatasetResolveSummary> {
  const nodesPath = join(datasetsPath, datasetId, 'nodes.json');
  const originalText = await readFile(nodesPath, 'utf-8');
  const nodes = JSON.parse(originalText) as GraphNode[];
  const nullNodes = nodes.filter((n) => !n.wikidataId);

  const assignments: Assignment[] = [];
  for (const node of nullNodes) {
    const assignment = await resolveNode(node);
    await sleep(150); // pace the API
    if (assignment) assignments.push(assignment);
  }

  if (!options.dryRun && assignments.length > 0) {
    const edits = new Map<string, IdEdit>();
    for (const a of assignments) {
      edits.set(a.nodeId, {
        wikidataId: a.wikidataId,
        wikipediaTitle: a.wikipediaTitle ?? null,
      });
    }
    await writeFile(nodesPath, applyIdEdits(originalText, edits), 'utf-8');
  }

  return {
    datasetId,
    nullNodes: nullNodes.length,
    assigned: assignments.length,
    dateCorroborated: assignments.filter((a) => a.dateCorroborated).length,
    unresolved: nullNodes.length - assignments.length,
    assignments,
  };
}

function printSummary(s: DatasetResolveSummary, options: CLIOptions): void {
  if (options.json) return;
  console.log(`\n${s.datasetId}${options.dryRun ? ' (dry-run)' : ''}`);
  if (!options.quiet) {
    for (const a of s.assignments) {
      const mark = a.dateCorroborated ? '✓' : '~';
      console.log(`  ${mark} ${a.title} → ${a.wikidataId} "${a.label}"`);
    }
  }
  console.log(
    `  ${s.assigned}/${s.nullNodes} assigned (${s.dateCorroborated} date-corroborated), ${s.unresolved} left null`
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

  const summaries: DatasetResolveSummary[] = [];
  for (const datasetId of datasets) {
    const summary = await resolveDataset(datasetsPath, datasetId, options);
    summaries.push(summary);
    printSummary(summary, options);
  }

  if (options.json) {
    console.log(
      JSON.stringify(
        summaries.map((s) => ({
          datasetId: s.datasetId,
          nullNodes: s.nullNodes,
          assigned: s.assigned,
          dateCorroborated: s.dateCorroborated,
          unresolved: s.unresolved,
        })),
        null,
        2
      )
    );
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
