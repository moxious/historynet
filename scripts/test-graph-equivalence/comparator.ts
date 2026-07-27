/**
 * Comparison functions for validating graph equivalence
 * Compares metrics between current and atomic formats
 */

import type { DatasetMetrics, ComparisonResult } from './types.js';
import {
  compareNodeMetrics,
  summarizeNodeMetrics,
} from './metrics/node-metrics.js';
import {
  compareEdgeMetrics,
  summarizeEdgeMetrics,
} from './metrics/edge-metrics.js';
import {
  compareConnectedComponents,
  compareNodeDegreeStats,
  summarizeConnectedComponents,
  summarizeNodeDegreeStats,
} from './metrics/graph-metrics.js';
import { summarizeIntegrityReport } from './metrics/integrity-checks.js';

/**
 * Compare two dataset metrics to check for equivalence
 */
export function compareDatasetMetrics(
  current: DatasetMetrics,
  atomic: DatasetMetrics
): ComparisonResult {
  const differences: string[] = [];

  // Compare node metrics
  const nodeComparison = compareNodeMetrics(current.nodeMetrics, atomic.nodeMetrics);
  if (!nodeComparison.equivalent) {
    differences.push(...nodeComparison.differences.map((d) => `[NODES] ${d}`));
  }

  // Compare edge metrics
  const edgeComparison = compareEdgeMetrics(current.edgeMetrics, atomic.edgeMetrics);
  if (!edgeComparison.equivalent) {
    differences.push(...edgeComparison.differences.map((d) => `[EDGES] ${d}`));
  }

  // Compare connected components
  const componentComparison = compareConnectedComponents(
    current.connectedComponents,
    atomic.connectedComponents
  );
  if (!componentComparison.equivalent) {
    differences.push(
      ...componentComparison.differences.map((d) => `[COMPONENTS] ${d}`)
    );
  }

  // Compare node degree statistics
  const degreeComparison = compareNodeDegreeStats(
    current.nodeDegreeStats,
    atomic.nodeDegreeStats
  );
  if (!degreeComparison.equivalent) {
    differences.push(...degreeComparison.differences.map((d) => `[DEGREES] ${d}`));
  }

  // Check integrity status
  if (current.integrity.valid !== atomic.integrity.valid) {
    differences.push(
      `[INTEGRITY] Validity differs: current=${current.integrity.valid}, atomic=${atomic.integrity.valid}`
    );
  }

  return {
    equivalent: differences.length === 0,
    differences,
    currentMetrics: current,
    atomicMetrics: atomic,
  };
}

/**
 * Format a single dataset metrics for display
 */
export function formatDatasetMetrics(metrics: DatasetMetrics): string {
  const parts = [
    `\n=== ${metrics.datasetId} (${metrics.format} format) ===`,
    '',
    summarizeNodeMetrics(metrics.nodeMetrics),
    '',
    summarizeEdgeMetrics(metrics.edgeMetrics),
    '',
    summarizeConnectedComponents(metrics.connectedComponents),
    '',
    summarizeNodeDegreeStats(metrics.nodeDegreeStats),
    '',
    summarizeIntegrityReport(metrics.integrity),
  ];

  return parts.join('\n');
}

/**
 * Format a comparison result for display
 */
export function formatComparisonResult(result: ComparisonResult): string {
  const parts = [
    `\n=== Comparison: ${result.currentMetrics.datasetId} ===`,
    '',
  ];

  if (result.equivalent) {
    parts.push('✓ EQUIVALENT - All metrics match exactly');
  } else {
    parts.push(`✗ NOT EQUIVALENT - ${result.differences.length} differences found:`);
    parts.push('');
    for (const diff of result.differences) {
      parts.push(`  ${diff}`);
    }
  }

  return parts.join('\n');
}
