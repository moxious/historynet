#!/usr/bin/env node
/**
 * Atomic Entity Migration CLI
 * Migrates datasets from current format (nodes.json/edges.json) to atomic format
 *
 * Usage:
 *   npx tsx scripts/migrate-to-atomic/index.ts [options]
 *
 * Options:
 *   --dry-run          Output to migration-output/ instead of overwriting files
 *   --dataset <id>     Migrate only a specific dataset (for testing)
 *   --quiet            Minimal output
 *   --help             Show help message
 */

import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { MigrationCLIOptions } from './types.js';
import { extractEntities } from './phases/phase1-extract-entities.js';
import { createMembers } from './phases/phase2-create-members.js';
import { updateEdges } from './phases/phase3-update-edges.js';
import { generateReport } from './phases/phase4-generate-report.js';
import { writeEntityFiles, writeRegistryFiles } from './registry-builder.js';

const DATASETS_DIR = 'public/datasets';
const DEFAULT_OUTPUT_DIR = 'migration-output';

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): MigrationCLIOptions {
  const options: MigrationCLIOptions = {
    dryRun: false,
    quiet: false,
    outputDir: DEFAULT_OUTPUT_DIR,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--dataset':
        options.dataset = args[++i];
        break;
      case '--quiet':
        options.quiet = true;
        break;
      case '--output-dir':
        options.outputDir = args[++i];
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

/**
 * Show help message
 */
function showHelp(): void {
  console.log(`
Atomic Entity Migration CLI

Migrates datasets from current format to atomic entity architecture.

Usage:
  npx tsx scripts/migrate-to-atomic/index.ts [options]

Options:
  --dry-run          Output to migration-output/ instead of overwriting files
  --dataset <id>     Migrate only a specific dataset (for testing)
  --output-dir <dir> Custom output directory for dry-run (default: migration-output)
  --quiet            Minimal output
  --help, -h         Show this help message

Examples:
  # Dry run on single dataset
  npx tsx scripts/migrate-to-atomic/index.ts --dataset enlightenment --dry-run

  # Dry run on all datasets
  npx tsx scripts/migrate-to-atomic/index.ts --dry-run

  # Actual migration (overwrites files)
  npx tsx scripts/migrate-to-atomic/index.ts

Warning: Running without --dry-run will overwrite dataset files!
`);
}

/**
 * Get list of dataset directories
 */
async function getDatasetDirectories(
  datasetsPath: string,
  specificDataset?: string
): Promise<string[]> {
  if (specificDataset) {
    return [specificDataset];
  }

  // Get all directories in datasets folder
  const entries = await readdir(datasetsPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .filter((name) => name !== 'COVERAGE_REPORT.md');
}

/**
 * Main migration function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  console.log('='.repeat(60));
  console.log('ATOMIC ENTITY MIGRATION');
  console.log('='.repeat(60));
  console.log();

  if (options.dryRun) {
    console.log('DRY RUN MODE: Output will be written to:', options.outputDir);
  } else {
    console.log('⚠️  WARNING: This will overwrite dataset files!');
    console.log('   Use --dry-run to test first');
  }

  console.log();

  // Resolve project root
  const cwd = process.cwd();
  const projectRoot = resolve(cwd);
  const datasetsPath = join(projectRoot, DATASETS_DIR);

  // Get datasets to migrate
  let datasets: string[];
  try {
    datasets = await getDatasetDirectories(datasetsPath, options.dataset);
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }

  if (datasets.length === 0) {
    console.error('No datasets found to migrate');
    process.exit(1);
  }

  console.log(`Migrating ${datasets.length} dataset(s):`);
  for (const dataset of datasets) {
    console.log(`  - ${dataset}`);
  }
  console.log();

  try {
    // Phase 1: Extract entities
    console.log('=== Phase 1: Extract canonical entities ===\n');
    const { registry, conflicts } = await extractEntities(projectRoot, datasets);

    // Write entity files and registries
    await writeEntityFiles(projectRoot, registry, options.dryRun, options.outputDir);
    await writeRegistryFiles(projectRoot, registry, options.dryRun, options.outputDir);

    // Phase 2: Create members.json files
    await createMembers(
      projectRoot,
      datasets,
      registry,
      options.dryRun,
      options.outputDir
    );

    // Phase 3: Update edges
    const { totalEdgesUpdated } = await updateEdges(
      projectRoot,
      datasets,
      registry,
      options.dryRun,
      options.outputDir
    );

    // Phase 4: Generate report
    await generateReport(
      projectRoot,
      datasets,
      registry,
      conflicts,
      totalEdgesUpdated,
      options.dryRun,
      options.outputDir
    );

    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION COMPLETE');
    console.log('='.repeat(60));

    if (options.dryRun) {
      console.log(`\nOutput written to: ${options.outputDir}/`);
      console.log('Review the output and run without --dry-run to apply changes');
    } else {
      console.log('\n✓ Dataset files have been updated');
      console.log('✓ Entity files created in entities/');
      console.log('✓ Migration report saved to migration-report.json');
      console.log('\nNext steps:');
      console.log('1. Review migration-report.json and conflicts.txt');
      console.log('2. Run test:compare to verify equivalence');
      console.log('3. Test the application with atomic data loader');
    }

    process.exit(0);
  } catch (error) {
    console.error('\nMigration failed:', (error as Error).message);
    console.error((error as Error).stack);
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error('Unexpected error:', error.message);
  process.exit(1);
});
