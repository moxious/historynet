#!/usr/bin/env node
/**
 * Member Suggestion CLI (cross-dataset gap detection)
 *
 * Suggests people a dataset is probably missing, by mining the *other* datasets
 * for figures who belong to the target's era and are connected to its members
 * elsewhere. A format-agnostic down payment on M38 - no atomic entities needed;
 * cross-dataset identity comes from the (now largely correct) wikidataIds, with
 * a normalized-name fallback.
 *
 * Signals, strongest first:
 *   - linked-to-your-members: in some other network, the candidate has an edge
 *     to one or more people already in the target dataset.
 *   - cross-network presence: the candidate appears in multiple other datasets
 *     whose timeframe overlaps the target's.
 * Candidates are filtered to those whose lifespan overlaps the target's era.
 *
 * Usage:
 *   npx tsx scripts/suggest-members/index.ts --dataset <id> [--limit N] [--json]
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const DATASETS_DIR = 'public/datasets';

interface GraphNode {
  id: string;
  type: 'person' | 'object' | 'location' | 'entity';
  title: string;
  dateStart?: string;
  dateEnd?: string;
  wikidataId?: string | null;
}
interface GraphEdge {
  source: string;
  target: string;
}
interface Manifest {
  scope?: { startYear?: number | null; endYear?: number | null; themes?: string[] };
}

interface CLIOptions {
  dataset?: string;
  limit: number;
  json: boolean;
}

interface Suggestion {
  identity: string;
  title: string;
  dateStart?: string;
  dateEnd?: string;
  wikidataId?: string | null;
  appearsIn: string[];
  linkedMembers: string[];
  score: number;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = { limit: 20, json: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dataset':
        options.dataset = args[++i];
        break;
      case '--limit':
        options.limit = parseInt(args[++i], 10);
        break;
      case '--json':
        options.json = true;
        break;
      case '--help':
      case '-h':
        console.log(
          'Usage: npx tsx scripts/suggest-members/index.ts --dataset <id> [--limit N] [--json]'
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

function parseYear(date?: string): number | null {
  if (!date) return null;
  const m = /^-?\d+/.exec(date);
  return m ? parseInt(m[0], 10) : null;
}

function normName(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Stable cross-dataset identity: wikidataId if present, else the name. */
function identity(n: GraphNode): string {
  return n.wikidataId ? `wd:${n.wikidataId}` : `name:${normName(n.title)}`;
}

/** A person's [birth, death] span; death estimated at birth+80 if unknown. */
function lifespan(n: GraphNode): [number, number] | null {
  const birth = parseYear(n.dateStart);
  if (birth === null) return null;
  const death = parseYear(n.dateEnd) ?? birth + 80;
  return [birth, death];
}

function overlaps(span: [number, number] | null, era: [number, number] | null): boolean {
  if (!era) return true; // target has no era - don't filter temporally
  if (!span) return false; // candidate undated - can't place them
  return span[0] <= era[1] && span[1] >= era[0];
}

async function loadDataset(datasetsPath: string, id: string) {
  const dir = join(datasetsPath, id);
  const nodes = JSON.parse(await readFile(join(dir, 'nodes.json'), 'utf-8')) as GraphNode[];
  const edges = existsSync(join(dir, 'edges.json'))
    ? (JSON.parse(await readFile(join(dir, 'edges.json'), 'utf-8')) as GraphEdge[])
    : [];
  let manifest: Manifest = {};
  try {
    manifest = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf-8')) as Manifest;
  } catch {
    /* no manifest */
  }
  return { nodes, edges, manifest };
}

/** The target's era: manifest scope years, else the span of its dated persons. */
function datasetEra(nodes: GraphNode[], manifest: Manifest): [number, number] | null {
  const s = manifest.scope?.startYear;
  const e = manifest.scope?.endYear;
  if (typeof s === 'number' && typeof e === 'number') return [s, e];
  const years = nodes
    .filter((n) => n.type === 'person')
    .flatMap((n) => {
      const span = lifespan(n);
      return span ? [span[0], span[1]] : [];
    });
  if (years.length === 0) return null;
  return [Math.min(...years), Math.max(...years)];
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const datasetsPath = resolve(process.cwd(), DATASETS_DIR);

  if (!options.dataset) {
    console.error('Error: --dataset <id> is required.');
    process.exit(1);
  }
  if (!existsSync(join(datasetsPath, options.dataset, 'nodes.json'))) {
    console.error(`Error: dataset "${options.dataset}" not found.`);
    process.exit(1);
  }

  const target = await loadDataset(datasetsPath, options.dataset);
  const era = datasetEra(target.nodes, target.manifest);

  // Identity -> title for the target's current members (persons).
  const members = new Map<string, string>();
  for (const n of target.nodes) {
    if (n.type === 'person') members.set(identity(n), n.title);
  }

  interface Cand {
    title: string;
    dateStart?: string;
    dateEnd?: string;
    wikidataId?: string | null;
    datasets: Set<string>;
    links: Map<string, string>; // member identity -> member title
  }
  const candidates = new Map<string, Cand>();
  const getCand = (n: GraphNode): Cand => {
    const key = identity(n);
    let c = candidates.get(key);
    if (!c) {
      c = {
        title: n.title,
        dateStart: n.dateStart,
        dateEnd: n.dateEnd,
        wikidataId: n.wikidataId ?? undefined,
        datasets: new Set(),
        links: new Map(),
      };
      candidates.set(key, c);
    }
    return c;
  };

  const others = (await readdir(datasetsPath, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && e.name !== options.dataset)
    .filter((e) => existsSync(join(datasetsPath, e.name, 'nodes.json')))
    .map((e) => e.name);

  for (const other of others) {
    const { nodes, edges } = await loadDataset(datasetsPath, other);
    const byId = new Map(nodes.map((n) => [n.id, n]));

    // Presence: overlapping persons not already in the target.
    for (const n of nodes) {
      if (n.type !== 'person') continue;
      const key = identity(n);
      if (members.has(key)) continue;
      if (!overlaps(lifespan(n), era)) continue;
      getCand(n).datasets.add(other);
    }

    // Links: candidate <-> a current member, via an edge in this other network.
    for (const edge of edges) {
      const a = byId.get(edge.source);
      const b = byId.get(edge.target);
      if (!a || !b || a.type !== 'person' || b.type !== 'person') continue;
      for (const [x, y] of [
        [a, b],
        [b, a],
      ] as const) {
        const kx = identity(x);
        const ky = identity(y);
        if (members.has(ky) && !members.has(kx) && overlaps(lifespan(x), era)) {
          const c = getCand(x);
          c.datasets.add(other);
          c.links.set(ky, members.get(ky)!);
        }
      }
    }
  }

  // Rank: linked-to-members dominates; cross-network presence breaks ties.
  const suggestions: Suggestion[] = [];
  for (const [key, c] of candidates) {
    const linkedMembers = [...c.links.values()];
    const datasetCount = c.datasets.size;
    if (linkedMembers.length === 0 && datasetCount < 2) continue; // too weak
    suggestions.push({
      identity: key,
      title: c.title,
      dateStart: c.dateStart,
      dateEnd: c.dateEnd,
      wikidataId: c.wikidataId,
      appearsIn: [...c.datasets].sort(),
      linkedMembers,
      score: linkedMembers.length * 3 + datasetCount,
    });
  }
  suggestions.sort((a, b) => b.score - a.score || b.linkedMembers.length - a.linkedMembers.length);
  const top = suggestions.slice(0, options.limit);

  if (options.json) {
    console.log(JSON.stringify(top, null, 2));
    process.exit(0);
  }

  const eraStr = era ? `${era[0]}–${era[1]}` : 'undated';
  console.log(`\n# Suggested members for "${options.dataset}" (era ${eraStr})\n`);
  console.log(
    `${target.nodes.filter((n) => n.type === 'person').length} current people; ` +
      `${suggestions.length} candidates found, showing top ${top.length}.\n`
  );
  if (top.length === 0) {
    console.log('_No cross-dataset candidates surfaced._');
    process.exit(0);
  }
  for (const s of top) {
    const dates = s.dateStart ? ` (${s.dateStart}${s.dateEnd ? `–${s.dateEnd}` : ''})` : '';
    const wd = s.wikidataId ? ` [${s.wikidataId}]` : '';
    console.log(`- **${s.title}**${dates}${wd}`);
    console.log(`  - appears in: ${s.appearsIn.join(', ')}`);
    if (s.linkedMembers.length > 0) {
      const shown = s.linkedMembers.slice(0, 6).join(', ');
      const more = s.linkedMembers.length > 6 ? ` (+${s.linkedMembers.length - 6} more)` : '';
      console.log(`  - linked to your members: ${shown}${more}`);
    }
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
