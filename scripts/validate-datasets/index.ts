#!/usr/bin/env node
/**
 * Dataset Validation CLI
 * Build-time validation tool for HistoryNet/Scenius datasets
 *
 * Usage:
 *   npx tsx scripts/validate-datasets/index.ts [options]
 *
 * Options:
 *   --strict      Treat warnings as errors
 *   --dataset <id> Validate only a specific dataset
 *   --quiet       Only output errors and final summary
 *   --json        Output results as JSON
 *   --help        Show help message
 */

import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type {
  CLIOptions,
  ValidationResult,
  DatasetValidationResult,
  ValidationIssue,
  DatasetManifest,
} from './types.js';
import { parseJsonFile, fileExists } from './validators/json-syntax.js';
import { validateManifest, getCustomRelationshipTypes } from './validators/manifest.js';
import { validateNodes } from './validators/nodes.js';
import { validateEdges } from './validators/edges.js';
import { validateCrossReferences } from './validators/cross-references.js';
import { reportResults, logProgress, logError } from './reporter.js';

// Datasets directory relative to project root
const DATASETS_DIR = 'public/datasets';

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    strict: false,
    quiet: false,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--strict':
        options.strict = true;
        break;
      case '--quiet':
        options.quiet = true;
        break;
      case '--json':
        options.json = true;
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
Dataset Validation CLI for Scenius

Usage:
  npx tsx scripts/validate-datasets/index.ts [options]

Options:
  --strict         Treat warnings as errors (validation fails if any warnings)
  --dataset <id>   Validate only a specific dataset (by directory name)
  --quiet          Only output errors and final summary
  --json           Output results as JSON (for CI parsing)
  --help, -h       Show this help message

Examples:
  npx tsx scripts/validate-datasets/index.ts
  npx tsx scripts/validate-datasets/index.ts --strict
  npx tsx scripts/validate-datasets/index.ts --dataset disney-characters
  npx tsx scripts/validate-datasets/index.ts --json --quiet
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
    // Validate specific dataset exists
    const datasetPath = join(datasetsPath, specificDataset);
    if (!(await fileExists(join(datasetPath, 'manifest.json')))) {
      throw new Error(`Dataset "${specificDataset}" not found or missing manifest.json`);
    }
    return [specificDataset];
  }

  // Get all directories in datasets folder
  const entries = await readdir(datasetsPath, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

/**
 * Validate a single dataset
 */
async function validateDataset(
  datasetsPath: string,
  datasetId: string,
  options: CLIOptions
): Promise<DatasetValidationResult> {
  const datasetPath = join(datasetsPath, datasetId);
  const issues: ValidationIssue[] = [];
  let nodeCount = 0;
  let edgeCount = 0;
  let aborted = false;

  logProgress(`Validating ${datasetId}...`, options);

  // 1. Validate manifest.json
  const manifestPath = join(datasetPath, 'manifest.json');
  const manifestResult = await parseJsonFile<DatasetManifest>(
    manifestPath,
    'manifest.json'
  );
  issues.push(...manifestResult.issues);

  if (!manifestResult.success) {
    // Can't continue without valid manifest
    return {
      datasetId,
      valid: false,
      issues,
      nodeCount: 0,
      edgeCount: 0,
      aborted: true,
    };
  }

  // Validate manifest schema
  const manifestIssues = validateManifest(
    manifestResult.data,
    'manifest.json',
    datasetId
  );
  issues.push(...manifestIssues);

  // Get custom relationship types for edge validation
  const customRelationshipTypes = manifestResult.data
    ? getCustomRelationshipTypes(manifestResult.data as DatasetManifest)
    : [];

  // Check for critical manifest errors before continuing
  const hasCriticalManifestError = manifestIssues.some(
    (i) =>
      i.severity === 'error' &&
      (i.code === 'MISSING_REQUIRED_FIELD' || i.code === 'MANIFEST_ID_MISMATCH')
  );
  if (hasCriticalManifestError) {
    aborted = true;
  }

  // 2. Validate nodes.json
  const nodesPath = join(datasetPath, 'nodes.json');
  if (!(await fileExists(nodesPath))) {
    issues.push({
      severity: 'error',
      file: 'nodes.json',
      message: 'File not found: nodes.json',
      code: 'MISSING_NODES_FILE',
    });
    aborted = true;
  } else if (!aborted) {
    const nodesResult = await parseJsonFile(nodesPath, 'nodes.json');
    issues.push(...nodesResult.issues);

    if (nodesResult.success) {
      const {
        issues: nodeIssues,
        nodeIds,
        nodeCount: count,
      } = validateNodes(nodesResult.data, 'nodes.json');
      issues.push(...nodeIssues);
      nodeCount = count;

      // 3. Validate edges.json
      const edgesPath = join(datasetPath, 'edges.json');
      if (!(await fileExists(edgesPath))) {
        issues.push({
          severity: 'error',
          file: 'edges.json',
          message: 'File not found: edges.json',
          code: 'MISSING_EDGES_FILE',
        });
      } else {
        const edgesResult = await parseJsonFile(edgesPath, 'edges.json');
        issues.push(...edgesResult.issues);

        if (edgesResult.success) {
          const {
            issues: edgeIssues,
            edgeCount: count,
            edgeSources,
            edgeTargets,
            evidenceNodeIds,
          } = validateEdges(edgesResult.data, 'edges.json', customRelationshipTypes);
          issues.push(...edgeIssues);
          edgeCount = count;

          // 4. Cross-reference validation
          const crossRefIssues = validateCrossReferences(
            nodeIds,
            edgeSources,
            edgeTargets,
            evidenceNodeIds,
            'cross-references'
          );
          issues.push(...crossRefIssues);
        }
      }
    } else {
      aborted = true;
    }
  }

  // Determine if validation passed
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  // In strict mode, warnings are also failures
  const valid = options.strict
    ? errors.length === 0 && warnings.length === 0
    : errors.length === 0;

  return {
    datasetId,
    valid,
    issues,
    nodeCount,
    edgeCount,
    aborted,
  };
}

/**
 * Main validation function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  // Resolve datasets path from current working directory
  const cwd = process.cwd();
  const datasetsPath = resolve(cwd, DATASETS_DIR);

  // Get dataset directories to validate
  let datasets: string[];
  try {
    datasets = await getDatasetDirectories(datasetsPath, options.dataset);
  } catch (error) {
    logError((error as Error).message);
    process.exit(1);
  }

  if (datasets.length === 0) {
    logError('No datasets found to validate');
    process.exit(1);
  }

  // Validate each dataset
  const results: DatasetValidationResult[] = [];
  for (const datasetId of datasets) {
    const result = await validateDataset(datasetsPath, datasetId, options);
    results.push(result);
  }

  // Calculate summary
  const passedDatasets = results.filter((r) => r.valid).length;
  const failedDatasets = results.filter((r) => !r.valid).length;
  const totalErrors = results.reduce(
    (sum, r) => sum + r.issues.filter((i) => i.severity === 'error').length,
    0
  );
  const totalWarnings = results.reduce(
    (sum, r) => sum + r.issues.filter((i) => i.severity === 'warning').length,
    0
  );

  const validationResult: ValidationResult = {
    datasets: results,
    totalDatasets: results.length,
    passedDatasets,
    failedDatasets,
    totalErrors,
    totalWarnings,
    success: failedDatasets === 0,
  };

  // Report results
  reportResults(validationResult, options);

  // Exit with appropriate code
  process.exit(validationResult.success ? 0 : 1);
}

// Run main function
main().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});
