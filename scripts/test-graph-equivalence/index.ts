#!/usr/bin/env node
/**
 * Graph Equivalence Testing CLI
 * Tests that graph metrics are preserved during migration from current to atomic format
 *
 * Usage:
 *   npx tsx scripts/test-graph-equivalence/index.ts [options]
 *
 * Options:
 *   --all              Test all datasets
 *   --dataset <id>     Test specific dataset
 *   --format <format>  Test format: current (default) or atomic
 *   --compare          Compare current vs atomic formats
 *   --json             Output results as JSON
 *   --quiet            Minimal output (summary only)
 *   --help             Show help message
 */

import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { TestCLIOptions, DatasetMetrics, TestResult } from './types.js';
import { loadCurrentFormat } from './loaders/current-loader.js';
import { loadAtomicFormat } from './loaders/atomic-loader.js';
import { getNodeMetrics } from './metrics/node-metrics.js';
import { getEdgeMetrics } from './metrics/edge-metrics.js';
import {
  getConnectedComponents,
  getNodeDegreeStats,
} from './metrics/graph-metrics.js';
import { runAllIntegrityChecks } from './metrics/integrity-checks.js';
import {
  reportTestResults,
  logProgress,
  logError,
  serializeTestResult,
} from './reporter.js';
import {
  compareDatasetMetrics,
  formatComparisonResult,
} from './comparator.js';

const DATASETS_DIR = 'public/datasets';

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): TestCLIOptions {
  const options: TestCLIOptions = {
    all: false,
    format: 'current',
    compare: false,
    json: false,
    quiet: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--all':
        options.all = true;
        break;
      case '--dataset':
        options.dataset = args[++i];
        break;
      case '--format':
        const format = args[++i];
        if (format !== 'current' && format !== 'atomic') {
          logError(`Invalid format: ${format}. Must be 'current' or 'atomic'`);
          process.exit(1);
        }
        options.format = format;
        break;
      case '--compare':
        options.compare = true;
        break;
      case '--json':
        options.json = true;
        break;
      case '--quiet':
        options.quiet = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          logError(`Unknown option: ${arg}`);
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
Graph Equivalence Testing CLI

Tests that graph structure and metrics are preserved during migration.

Usage:
  npx tsx scripts/test-graph-equivalence/index.ts [options]

Options:
  --all              Test all datasets
  --dataset <id>     Test specific dataset (e.g., --dataset enlightenment)
  --format <format>  Test format: current (default) or atomic
  --compare          Compare current vs atomic formats (requires atomic migration)
  --json             Output results as JSON
  --quiet            Minimal output (summary only)
  --help, -h         Show this help message

Examples:
  # Test single dataset (current format)
  npx tsx scripts/test-graph-equivalence/index.ts --dataset enlightenment

  # Test all datasets
  npx tsx scripts/test-graph-equivalence/index.ts --all

  # Test atomic format (after migration)
  npx tsx scripts/test-graph-equivalence/index.ts --dataset enlightenment --format atomic

  # Compare current vs atomic
  npx tsx scripts/test-graph-equivalence/index.ts --dataset enlightenment --compare

  # Capture baseline (JSON output)
  npx tsx scripts/test-graph-equivalence/index.ts --all --format current --json > pre-migration-baseline.json
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
    .filter((name) => name !== 'COVERAGE_REPORT.md'); // Exclude non-dataset files
}

/**
 * Calculate metrics for a dataset
 */
async function calculateDatasetMetrics(
  projectRoot: string,
  datasetId: string,
  format: 'current' | 'atomic'
): Promise<DatasetMetrics> {
  // Load graph data
  const data =
    format === 'current'
      ? await loadCurrentFormat(projectRoot, datasetId)
      : await loadAtomicFormat(projectRoot, datasetId);

  // Calculate all metrics
  const nodeMetrics = getNodeMetrics(data);
  const edgeMetrics = getEdgeMetrics(data);
  const connectedComponents = getConnectedComponents(data);
  const nodeDegreeStats = getNodeDegreeStats(data);
  const integrity = runAllIntegrityChecks(data);

  return {
    datasetId,
    format,
    nodeMetrics,
    edgeMetrics,
    connectedComponents,
    nodeDegreeStats,
    integrity,
  };
}

/**
 * Main test function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  // Validate options
  if (!options.all && !options.dataset) {
    logError('Must specify either --all or --dataset <id>');
    showHelp();
    process.exit(1);
  }

  // Resolve project root
  const cwd = process.cwd();
  const projectRoot = resolve(cwd);
  const datasetsPath = join(projectRoot, DATASETS_DIR);

  // Get datasets to test
  let datasets: string[];
  try {
    datasets = await getDatasetDirectories(datasetsPath, options.dataset);
  } catch (error) {
    logError((error as Error).message);
    process.exit(1);
  }

  if (datasets.length === 0) {
    logError('No datasets found to test');
    process.exit(1);
  }

  logProgress(`Testing ${datasets.length} dataset(s)...`, options);

  // Compare mode: test both formats and compare
  if (options.compare) {
    logProgress('Running in comparison mode...', options);

    for (const datasetId of datasets) {
      try {
        logProgress(`\nComparing ${datasetId}...`, options);

        // Calculate metrics for both formats
        const currentMetrics = await calculateDatasetMetrics(
          projectRoot,
          datasetId,
          'current'
        );
        const atomicMetrics = await calculateDatasetMetrics(
          projectRoot,
          datasetId,
          'atomic'
        );

        // Compare
        const comparison = compareDatasetMetrics(currentMetrics, atomicMetrics);

        if (options.json) {
          console.log(JSON.stringify(comparison, null, 2));
        } else {
          console.log(formatComparisonResult(comparison));
        }

        if (!comparison.equivalent) {
          process.exit(1);
        }
      } catch (error) {
        logError(`Failed to compare ${datasetId}: ${(error as Error).message}`);
        process.exit(1);
      }
    }

    logProgress('\n✓ All comparisons passed', options);
    return;
  }

  // Single format mode: test specified format
  const results: DatasetMetrics[] = [];
  let allValid = true;

  for (const datasetId of datasets) {
    try {
      logProgress(`Testing ${datasetId} (${options.format} format)...`, options);

      const metrics = await calculateDatasetMetrics(
        projectRoot,
        datasetId,
        options.format
      );

      results.push(metrics);

      if (!metrics.integrity.valid) {
        allValid = false;
      }
    } catch (error) {
      logError(`Failed to test ${datasetId}: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  // Build summary
  const totalNodes = results.reduce((sum, r) => sum + r.nodeMetrics.totalNodes, 0);
  const totalEdges = results.reduce((sum, r) => sum + r.edgeMetrics.totalEdges, 0);

  const result: TestResult = {
    datasets: results,
    summary: {
      totalDatasets: results.length,
      totalNodes,
      totalEdges,
      allValid,
    },
  };

  // Report results
  if (options.json) {
    console.log(JSON.stringify(serializeTestResult(result), null, 2));
  } else {
    reportTestResults(result, options);
  }

  // Exit with appropriate code
  process.exit(allValid ? 0 : 1);
}

// Run main function
main().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});
