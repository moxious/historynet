/**
 * Type definitions for graph equivalence testing
 * Used to validate that migration preserves graph structure
 */

import type { NodeType } from '../../src/types/node.js';

/**
 * Node metrics for counting and validation
 */
export interface NodeMetrics {
  /** Total number of nodes */
  totalNodes: number;
  /** Count of nodes by type */
  nodesByType: Record<NodeType, number>;
  /** Set of all node IDs for validation */
  nodeIds: Set<string>;
}

/**
 * Edge metrics for counting and validation
 */
export interface EdgeMetrics {
  /** Total number of edges */
  totalEdges: number;
  /** Count of edges by relationship type */
  edgesByRelationship: Record<string, number>;
  /** Set of all edge IDs for validation */
  edgeIds: Set<string>;
}

/**
 * Connected component information
 */
export interface ConnectedComponentsInfo {
  /** Total number of connected components */
  componentCount: number;
  /** Size of the largest component */
  largestComponentSize: number;
  /** Distribution of component sizes */
  componentSizeDistribution: number[];
}

/**
 * Node degree statistics
 */
export interface NodeDegreeStats {
  /** Minimum node degree */
  minDegree: number;
  /** Maximum node degree */
  maxDegree: number;
  /** Average node degree */
  avgDegree: number;
  /** Median node degree */
  medianDegree: number;
  /** Distribution of degrees (degree -> count) */
  degreeDistribution: Record<number, number>;
}

/**
 * Referential integrity issue
 */
export interface IntegrityIssue {
  /** Type of issue */
  type: 'broken_reference' | 'duplicate_id' | 'missing_field';
  /** Severity of issue */
  severity: 'error' | 'warning';
  /** Description of the issue */
  message: string;
  /** ID of the problematic item */
  id?: string;
  /** Additional context */
  context?: Record<string, unknown>;
}

/**
 * Referential integrity report
 */
export interface IntegrityReport {
  /** Whether integrity checks passed */
  valid: boolean;
  /** List of issues found */
  issues: IntegrityIssue[];
}

/**
 * Complete metrics for a dataset
 */
export interface DatasetMetrics {
  /** Dataset ID */
  datasetId: string;
  /** Format tested */
  format: 'current' | 'atomic';
  /** Node metrics */
  nodeMetrics: NodeMetrics;
  /** Edge metrics */
  edgeMetrics: EdgeMetrics;
  /** Connected components info */
  connectedComponents: ConnectedComponentsInfo;
  /** Node degree statistics */
  nodeDegreeStats: NodeDegreeStats;
  /** Integrity report */
  integrity: IntegrityReport;
}

/**
 * Comparison result between two metric sets
 */
export interface ComparisonResult {
  /** Whether the datasets are equivalent */
  equivalent: boolean;
  /** Differences found */
  differences: string[];
  /** Metrics from current format */
  currentMetrics: DatasetMetrics;
  /** Metrics from atomic format */
  atomicMetrics: DatasetMetrics;
}

/**
 * CLI options for the test tool
 */
export interface TestCLIOptions {
  /** Test all datasets */
  all: boolean;
  /** Specific dataset to test */
  dataset?: string;
  /** Format to test: current or atomic */
  format: 'current' | 'atomic';
  /** Compare current vs atomic */
  compare: boolean;
  /** Output as JSON */
  json: boolean;
  /** Quiet mode (minimal output) */
  quiet: boolean;
}

/**
 * Test result for all datasets
 */
export interface TestResult {
  /** Metrics for each dataset */
  datasets: DatasetMetrics[];
  /** Overall summary */
  summary: {
    totalDatasets: number;
    totalNodes: number;
    totalEdges: number;
    allValid: boolean;
  };
}
