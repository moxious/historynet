#!/usr/bin/env node
/**
 * New Dataset Scaffolder
 *
 * Emits the skeleton of a new dataset - manifest.json (from the
 * RESEARCHING_NETWORKS.md template) plus empty nodes.json / edges.json - so the
 * mechanical setup is a command, not hand-copying. Pure templating, no network.
 *
 * The only place a language model is needed in setup is deciding scope; pass
 * `--from-idea` to seed a scope stub the LLM then refines.
 *
 * Usage:
 *   npx tsx scripts/new-dataset/index.ts --id <slug> [options]
 *
 * Options:
 *   --id <slug>          Dataset id / directory name (required; kebab-case).
 *   --name <name>        Display name. Default: title-cased id.
 *   --description <text> Description. Default: derived from --from-idea or a stub.
 *   --from-idea <text>   Seed idea; writes a scope stub for the LLM to refine.
 *   --start-year <n>     scope.startYear.
 *   --end-year <n>       scope.endYear.
 *   --regions <csv>      scope.regions (comma-separated).
 *   --themes <csv>       scope.themes (comma-separated).
 *   --emoji <emoji>      bannerEmoji. Default: 📚🔍.
 *   --force              Overwrite an existing dataset directory.
 *   --help, -h           Show this help.
 */

import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const DATASETS_DIR = 'public/datasets';

interface CLIOptions {
  id?: string;
  name?: string;
  description?: string;
  fromIdea?: string;
  startYear?: number;
  endYear?: number;
  regions: string[];
  themes: string[];
  emoji: string;
  force: boolean;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = { regions: [], themes: [], emoji: '📚🔍', force: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = () => args[++i];
    switch (arg) {
      case '--id':
        options.id = next();
        break;
      case '--name':
        options.name = next();
        break;
      case '--description':
        options.description = next();
        break;
      case '--from-idea':
        options.fromIdea = next();
        break;
      case '--start-year':
        options.startYear = parseInt(next(), 10);
        break;
      case '--end-year':
        options.endYear = parseInt(next(), 10);
        break;
      case '--regions':
        options.regions = splitCsv(next());
        break;
      case '--themes':
        options.themes = splitCsv(next());
        break;
      case '--emoji':
        options.emoji = next();
        break;
      case '--force':
        options.force = true;
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

function splitCsv(v: string): string[] {
  return (v ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function showHelp(): void {
  console.log(`
New Dataset Scaffolder for Scenius

Creates public/datasets/<id>/ with a manifest skeleton and empty nodes/edges.

Usage:
  npx tsx scripts/new-dataset/index.ts --id <slug> [options]

Options:
  --id <slug>          Dataset id / directory name (required; kebab-case).
  --name <name>        Display name. Default: title-cased id.
  --description <text> Description. Default: derived from --from-idea or a stub.
  --from-idea <text>   Seed idea; writes a scope stub for the LLM to refine.
  --start-year <n>     scope.startYear.
  --end-year <n>       scope.endYear.
  --regions <csv>      scope.regions (comma-separated).
  --themes <csv>       scope.themes (comma-separated).
  --emoji <emoji>      bannerEmoji. Default: 📚🔍.
  --force              Overwrite an existing dataset directory.
  --help, -h           Show this help.

Examples:
  npx tsx scripts/new-dataset/index.ts --id vienna-circle \\
    --from-idea "logical positivism, Vienna, 1920s-30s" --start-year 1920 --end-year 1940
`);
}

/** kebab-case "vienna-circle" -> "Vienna Circle". */
function titleCase(id: string): string {
  return id
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

/** Today's date as YYYY-MM-DD (matches existing manifest lastUpdated format). */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildManifest(options: CLIOptions): Record<string, unknown> {
  const id = options.id as string;
  const name = options.name ?? titleCase(id);
  const description =
    options.description ??
    (options.fromIdea
      ? `${options.fromIdea}. (Scope stub — refine: who belongs, boundaries, and key figures.)`
      : `TODO: 1-2 paragraph description of the ${name} network and its significance.`);

  return {
    id,
    name,
    description,
    bannerImage: `img/banners/${id}.jpg`,
    bannerEmoji: options.emoji,
    lastUpdated: today(),
    version: '1.0.0',
    author: 'HistoryNet Contributors',
    license: 'CC-BY-4.0',
    defaultDataset: false,
    nodeCount: 0,
    edgeCount: 0,
    scope: {
      startYear: options.startYear ?? null,
      endYear: options.endYear ?? null,
      regions: options.regions,
      themes: options.themes,
      seedFigures: [],
      subgroups: [
        { id: 'core', name: 'Core Members', description: 'Central figures of the network' },
        { id: 'periphery', name: 'Associated Figures', description: 'Collaborators and correspondents' },
      ],
      exclusionNotes: '',
    },
    research: {
      status: 'in-progress',
      completedBatches: [],
      pendingBatches: ['core', 'periphery'],
      gaps: [],
      excludedFigures: [],
    },
    customRelationshipTypes: [],
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (!options.id) {
    console.error('Error: --id is required.');
    showHelp();
    process.exit(1);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(options.id)) {
    console.error(
      `Error: --id "${options.id}" must be kebab-case (lowercase letters, digits, single hyphens).`
    );
    process.exit(1);
  }

  const datasetsPath = resolve(process.cwd(), DATASETS_DIR);
  const dir = join(datasetsPath, options.id);

  if (existsSync(dir) && !options.force) {
    const entries = await readdir(dir).catch(() => []);
    if (entries.length > 0) {
      console.error(
        `Error: public/datasets/${options.id}/ already exists and is not empty. Use --force to overwrite.`
      );
      process.exit(1);
    }
  }

  await mkdir(dir, { recursive: true });
  const manifest = buildManifest(options);
  await writeFile(
    join(dir, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8'
  );
  await writeFile(join(dir, 'nodes.json'), '[]\n', 'utf-8');
  await writeFile(join(dir, 'edges.json'), '[]\n', 'utf-8');

  console.log(`Created public/datasets/${options.id}/`);
  console.log('  manifest.json  (scope skeleton — fill in scope + description)');
  console.log('  nodes.json     []');
  console.log('  edges.json     []');
  console.log('\nNext:');
  console.log('  1. Refine scope in manifest.json (regions, themes, seedFigures).');
  console.log('  2. Add nodes, then: npm run enrich -- --dataset ' + options.id);
  console.log('  3. Add edges + evidence, then: npm run check-evidence -- --dataset ' + options.id);
  console.log('  4. npm run sync-manifest -- --dataset ' + options.id);
  console.log('  5. npm run validate:datasets -- --dataset ' + options.id);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
