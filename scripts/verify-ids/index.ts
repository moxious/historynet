#!/usr/bin/env node
/**
 * Wikidata ID Verification & Remediation CLI
 *
 * Audits every node's existing `wikidataId` against the actual Wikidata entity
 * and reports which ones point at an unrelated entity (corrupt/stale ids). With
 * --fix it remediates them:
 *   - Re-resolves the correct entity from the node title via Wikidata search,
 *     accepting ONLY a single confident, type-verified match.
 *   - Clears (nulls) the wikidataId + wikipediaTitle of anything it cannot
 *     confidently re-resolve, and records candidates in a quarantine file.
 *
 * A wrong id (a Wikipedia link to the wrong person) is worse than no id, so
 * clearing is always safe; restoration is deliberately conservative to avoid
 * swapping one wrong id for another.
 *
 * Usage:
 *   npx tsx scripts/verify-ids/index.ts [options]
 *
 * Options:
 *   --dataset <id>   Only this dataset (directory name). Default: all.
 *   --fix            Apply remediation (clear wrong ids, restore confident).
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
  entityDescription,
  entitySitelinkTitle,
  isInstanceOf,
} from '../enrich-dataset/wikidata.js';
import { nodeMatches } from './matcher.js';
import { applyIdEdits, type IdEdit } from './rewrite.js';
import type {
  Candidate,
  CLIOptions,
  DatasetVerifySummary,
  GraphNode,
  NodeVerdict,
} from './types.js';

const DATASETS_DIR = 'public/datasets';

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    fix: false,
    clearUnverifiable: false,
    quiet: false,
    json: false,
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--fix':
        options.fix = true;
        break;
      case '--clear-unverifiable':
        options.clearUnverifiable = true;
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
Wikidata ID Verification & Remediation CLI for Scenius

Audits existing wikidataIds; with --fix, clears wrong ones and restores
confident re-resolved matches. Unresolved nodes go to verify-ids-quarantine.json.

Usage:
  npx tsx scripts/verify-ids/index.ts [options]

Options:
  --dataset <id>   Only this dataset (directory name). Default: all.
  --fix            Apply remediation. Default: report only.
  --clear-unverifiable   With --fix: also clear ids that have no English label
                   and no confident re-resolution (default: leave them as-is).
  --quiet          Only show the per-dataset summary.
  --json           Emit the summary as JSON (implies --quiet).
  --help, -h       Show this help.

Examples:
  npx tsx scripts/verify-ids/index.ts --dataset ai-llm-research
  npx tsx scripts/verify-ids/index.ts --dataset ai-llm-research --fix
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

/**
 * Re-resolve a node to a confident Wikidata id, or null. Searches by title,
 * fetches each candidate, and accepts only when exactly one candidate is
 * type-verified (persons must be an instance of human, and names must match).
 */
async function reresolve(
  node: GraphNode
): Promise<{ id: string; wikipediaTitle?: string } | { candidates: Candidate[] }> {
  const raw = await searchEntities(node.title, 7);
  if (raw.length === 0) return { candidates: [] };

  const entities = await getEntities(raw.map((c) => c.wikidataId));

  const confident = raw.filter((c) => {
    const entity = entities.get(c.wikidataId);
    if (!entity) return false;
    if (node.type === 'person' && !isInstanceOf(entity, Q_HUMAN)) return false;
    return nodeMatches(node.type, node.title, entityNames(entity));
  });

  if (confident.length === 1) {
    const entity = entities.get(confident[0].wikidataId)!;
    const sitelink = entitySitelinkTitle(entity);
    return {
      id: confident[0].wikidataId,
      wikipediaTitle: sitelink ? sitelink.replace(/ /g, '_') : undefined,
    };
  }

  // Not confident - surface the top few candidates for human/LLM review.
  const candidates: Candidate[] = raw.slice(0, 5).map((c) => {
    const entity = entities.get(c.wikidataId);
    return {
      wikidataId: c.wikidataId,
      label: entity ? entityLabel(entity) ?? c.label : c.label,
      description: entity ? entityDescription(entity) : c.description,
    };
  });
  return { candidates };
}

async function verifyDataset(
  datasetsPath: string,
  datasetId: string,
  options: CLIOptions
): Promise<DatasetVerifySummary> {
  const nodesPath = join(datasetsPath, datasetId, 'nodes.json');
  const originalText = await readFile(nodesPath, 'utf-8');
  const nodes = JSON.parse(originalText) as GraphNode[];

  const withId = nodes.filter((n) => n.wikidataId);
  const entities = await getEntities(withId.map((n) => n.wikidataId as string));

  const verdicts: NodeVerdict[] = [];
  const wrongNodes: GraphNode[] = [];
  const unverifiableNodes: GraphNode[] = [];

  for (const node of nodes) {
    const base = { nodeId: node.id, title: node.title, type: node.type };
    if (!node.wikidataId) {
      verdicts.push({ ...base, status: 'no-id' });
      continue;
    }
    const entity = entities.get(node.wikidataId);
    const markWrong = (resolvedTo: string) => {
      verdicts.push({ ...base, status: 'wrong', previousId: node.wikidataId, resolvedTo });
      wrongNodes.push(node);
    };

    // A person node whose entity isn't a human is wrong regardless of naming -
    // catches junk ids pointing at libraries, buildings, etc. that happen to
    // have no English label for the name check to compare against.
    if (node.type === 'person' && entity && !isInstanceOf(entity, Q_HUMAN)) {
      markWrong(entityLabel(entity) ?? '(non-human entity)');
      continue;
    }

    const names = entity ? entityNames(entity) : [];
    if (names.length === 0) {
      // No English name to compare against - defer to re-resolution in --fix.
      verdicts.push({ ...base, status: 'unverifiable', previousId: node.wikidataId });
      unverifiableNodes.push(node);
      continue;
    }
    if (nodeMatches(node.type, node.title, names)) {
      verdicts.push({ ...base, status: 'ok', previousId: node.wikidataId });
    } else {
      markWrong(entityLabel(entity!) ?? '(no label)');
    }
  }

  // Report mode: stop here.
  if (!options.fix) {
    return summarize(datasetId, nodes.length, withId.length, verdicts);
  }

  // Fix mode: re-resolve or clear each wrong node.
  const edits = new Map<string, IdEdit>();
  const quarantine: Array<Record<string, unknown>> = [];

  for (const node of wrongNodes) {
    const verdict = verdicts.find((v) => v.nodeId === node.id)!;
    const result = await reresolve(node);
    await sleep(150); // be gentle with the API

    if ('id' in result) {
      edits.set(node.id, {
        wikidataId: result.id,
        wikipediaTitle: result.wikipediaTitle ?? null,
      });
      verdict.status = 'restored';
      verdict.newId = result.id;
      verdict.newWikipediaTitle = result.wikipediaTitle;
    } else {
      edits.set(node.id, { wikidataId: null, wikipediaTitle: null });
      verdict.status = 'cleared';
      verdict.candidates = result.candidates;
      quarantine.push({
        nodeId: node.id,
        title: node.title,
        type: node.type,
        previousId: verdict.previousId,
        previousResolvedTo: verdict.resolvedTo,
        candidates: result.candidates,
      });
    }
  }

  // Unverifiable nodes: try to re-resolve them too (recovers e.g. "GPT-4"
  // whose junk id had no English label). Restore on a confident match;
  // otherwise LEAVE the id as-is (unproven, don't clear) and flag for review.
  for (const node of unverifiableNodes) {
    const verdict = verdicts.find((v) => v.nodeId === node.id)!;
    const result = await reresolve(node);
    await sleep(150);

    if ('id' in result) {
      edits.set(node.id, {
        wikidataId: result.id,
        wikipediaTitle: result.wikipediaTitle ?? null,
      });
      verdict.status = 'restored';
      verdict.newId = result.id;
      verdict.newWikipediaTitle = result.wikipediaTitle;
    } else if (options.clearUnverifiable) {
      // An id with no English presence, on an English-topic node, that we
      // couldn't re-resolve: treat as junk and clear it.
      edits.set(node.id, { wikidataId: null, wikipediaTitle: null });
      verdict.status = 'cleared';
      verdict.candidates = result.candidates;
      quarantine.push({
        nodeId: node.id,
        title: node.title,
        type: node.type,
        previousId: verdict.previousId,
        previousResolvedTo: '(no English label)',
        candidates: result.candidates,
      });
    } else {
      quarantine.push({
        nodeId: node.id,
        title: node.title,
        type: node.type,
        previousId: verdict.previousId,
        reason: 'unverifiable (no English label; no confident match) - left as-is, review',
        candidates: result.candidates,
      });
    }
  }

  await writeFile(nodesPath, applyIdEdits(originalText, edits), 'utf-8');

  const quarantinePath = join(datasetsPath, datasetId, 'verify-ids-quarantine.json');
  await writeFile(quarantinePath, JSON.stringify(quarantine, null, 2) + '\n', 'utf-8');

  return summarize(datasetId, nodes.length, withId.length, verdicts);
}

function summarize(
  datasetId: string,
  totalNodes: number,
  checked: number,
  verdicts: NodeVerdict[]
): DatasetVerifySummary {
  const count = (s: NodeVerdict['status']) =>
    verdicts.filter((v) => v.status === s).length;
  return {
    datasetId,
    totalNodes,
    checked,
    ok: count('ok'),
    wrong: count('wrong'),
    restored: count('restored'),
    cleared: count('cleared'),
    unverifiable: count('unverifiable'),
    verdicts,
  };
}

function printSummary(s: DatasetVerifySummary, options: CLIOptions): void {
  if (options.json) return;
  console.log(`\n${s.datasetId}${options.fix ? ' (fix)' : ''}`);

  if (!options.quiet) {
    for (const v of s.verdicts) {
      if (v.status === 'wrong') {
        console.log(`  ✗ ${v.title}: ${v.previousId} → "${v.resolvedTo}"`);
      } else if (v.status === 'restored') {
        console.log(`  ✓ ${v.title}: ${v.previousId} → ${v.newId} (restored)`);
      } else if (v.status === 'cleared') {
        console.log(
          `  – ${v.title}: cleared ${v.previousId} (${v.candidates?.length ?? 0} candidates)`
        );
      }
    }
  }

  if (options.fix) {
    console.log(
      `  ${s.checked} ids checked | ok: ${s.ok}, restored: ${s.restored}, ` +
        `cleared: ${s.cleared}, unverifiable: ${s.unverifiable}`
    );
  } else {
    console.log(
      `  ${s.checked} ids checked | ok: ${s.ok}, WRONG: ${s.wrong}, ` +
        `unverifiable: ${s.unverifiable}`
    );
  }
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

  const summaries: DatasetVerifySummary[] = [];
  for (const datasetId of datasets) {
    const summary = await verifyDataset(datasetsPath, datasetId, options);
    summaries.push(summary);
    printSummary(summary, options);
  }

  if (options.json) {
    console.log(
      JSON.stringify(
        summaries.map((s) => ({
          datasetId: s.datasetId,
          checked: s.checked,
          ok: s.ok,
          wrong: s.wrong,
          restored: s.restored,
          cleared: s.cleared,
          unverifiable: s.unverifiable,
        })),
        null,
        2
      )
    );
  }

  // In report mode, a non-zero "wrong" count is a signal (exit 1 for CI use).
  const wrong = summaries.reduce((n, s) => n + s.wrong, 0);
  process.exit(!options.fix && wrong > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
