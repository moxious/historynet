/**
 * Reporting and output formatting utilities
 */

import type { TestResult, DatasetMetrics, TestCLIOptions } from './types.js';
import { formatDatasetMetrics } from './comparator.js';

/**
 * Report test results based on CLI options
 */
export function reportTestResults(result: TestResult, options: TestCLIOptions): void {
  if (options.json) {
    // JSON output
    console.log(JSON.stringify(result, null, 2));
  } else {
    // Human-readable output
    if (!options.quiet) {
      // Show individual dataset metrics
      for (const datasetMetrics of result.datasets) {
        console.log(formatDatasetMetrics(datasetMetrics));
      }
    }

    // Always show summary
    console.log('\n=== Summary ===');
    console.log(`Total datasets: ${result.summary.totalDatasets}`);
    console.log(`Total nodes: ${result.summary.totalNodes}`);
    console.log(`Total edges: ${result.summary.totalEdges}`);
    console.log(`All valid: ${result.summary.allValid ? 'YES' : 'NO'}`);

    if (!result.summary.allValid) {
      console.log('\nSome datasets have integrity issues. See details above.');
    }
  }
}

/**
 * Log a progress message (respects quiet mode)
 */
export function logProgress(message: string, options: TestCLIOptions): void {
  if (!options.quiet && !options.json) {
    console.log(message);
  }
}

/**
 * Log an error message (always shown)
 */
export function logError(message: string): void {
  console.error(`ERROR: ${message}`);
}

/**
 * Convert a DatasetMetrics object to a JSON-serializable format
 * (converts Sets to Arrays)
 */
export function serializeDatasetMetrics(metrics: DatasetMetrics): Record<string, unknown> {
  return {
    datasetId: metrics.datasetId,
    format: metrics.format,
    nodeMetrics: {
      totalNodes: metrics.nodeMetrics.totalNodes,
      nodesByType: metrics.nodeMetrics.nodesByType,
      nodeIds: Array.from(metrics.nodeMetrics.nodeIds),
    },
    edgeMetrics: {
      totalEdges: metrics.edgeMetrics.totalEdges,
      edgesByRelationship: metrics.edgeMetrics.edgesByRelationship,
      edgeIds: Array.from(metrics.edgeMetrics.edgeIds),
    },
    connectedComponents: metrics.connectedComponents,
    nodeDegreeStats: metrics.nodeDegreeStats,
    integrity: metrics.integrity,
  };
}

/**
 * Convert TestResult to JSON-serializable format
 */
export function serializeTestResult(result: TestResult): Record<string, unknown> {
  return {
    datasets: result.datasets.map(serializeDatasetMetrics),
    summary: result.summary,
  };
}
