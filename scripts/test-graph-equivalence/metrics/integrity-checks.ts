/**
 * Integrity check functions
 * MI-08: Validate referential integrity (edges reference existing nodes)
 * MI-11: Check for duplicate IDs
 * MI-12: Check required fields
 */

import type { GraphData } from '../../../src/types/graph.js';
import type { IntegrityReport, IntegrityIssue } from '../types.js';

/**
 * Validate referential integrity - all edges must reference existing nodes
 * MI-08: Referential integrity validation
 */
export function validateReferentialIntegrity(data: GraphData): IntegrityReport {
  const issues: IntegrityIssue[] = [];
  const nodeIds = new Set(data.nodes.map((n) => n.id));

  for (const edge of data.edges) {
    if (!nodeIds.has(edge.source)) {
      issues.push({
        type: 'broken_reference',
        severity: 'error',
        message: `Edge ${edge.id} references non-existent source node: ${edge.source}`,
        id: edge.id,
        context: { source: edge.source },
      });
    }

    if (!nodeIds.has(edge.target)) {
      issues.push({
        type: 'broken_reference',
        severity: 'error',
        message: `Edge ${edge.id} references non-existent target node: ${edge.target}`,
        id: edge.id,
        context: { target: edge.target },
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Check for duplicate node and edge IDs
 * MI-11: Duplicate ID detection
 */
export function checkDuplicateIds(data: GraphData): IntegrityReport {
  const issues: IntegrityIssue[] = [];

  // Check for duplicate node IDs
  const nodeIdCounts = new Map<string, number>();
  for (const node of data.nodes) {
    nodeIdCounts.set(node.id, (nodeIdCounts.get(node.id) || 0) + 1);
  }

  for (const [id, count] of nodeIdCounts.entries()) {
    if (count > 1) {
      issues.push({
        type: 'duplicate_id',
        severity: 'error',
        message: `Duplicate node ID found: ${id} (appears ${count} times)`,
        id,
        context: { count },
      });
    }
  }

  // Check for duplicate edge IDs
  const edgeIdCounts = new Map<string, number>();
  for (const edge of data.edges) {
    edgeIdCounts.set(edge.id, (edgeIdCounts.get(edge.id) || 0) + 1);
  }

  for (const [id, count] of edgeIdCounts.entries()) {
    if (count > 1) {
      issues.push({
        type: 'duplicate_id',
        severity: 'error',
        message: `Duplicate edge ID found: ${id} (appears ${count} times)`,
        id,
        context: { count },
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Check that all nodes and edges have required fields
 * MI-12: Required field validation
 */
export function checkRequiredFields(data: GraphData): IntegrityReport {
  const issues: IntegrityIssue[] = [];

  // Check required node fields
  for (const node of data.nodes) {
    if (!node.id) {
      issues.push({
        type: 'missing_field',
        severity: 'error',
        message: `Node missing required field: id`,
        context: { node: node.title || 'unknown' },
      });
    }

    if (!node.type) {
      issues.push({
        type: 'missing_field',
        severity: 'error',
        message: `Node ${node.id} missing required field: type`,
        id: node.id,
      });
    }

    if (!node.title) {
      issues.push({
        type: 'missing_field',
        severity: 'error',
        message: `Node ${node.id} missing required field: title`,
        id: node.id,
      });
    }
  }

  // Check required edge fields
  for (const edge of data.edges) {
    if (!edge.id) {
      issues.push({
        type: 'missing_field',
        severity: 'error',
        message: `Edge missing required field: id`,
        context: { source: edge.source, target: edge.target },
      });
    }

    if (!edge.source) {
      issues.push({
        type: 'missing_field',
        severity: 'error',
        message: `Edge ${edge.id} missing required field: source`,
        id: edge.id,
      });
    }

    if (!edge.target) {
      issues.push({
        type: 'missing_field',
        severity: 'error',
        message: `Edge ${edge.id} missing required field: target`,
        id: edge.id,
      });
    }

    if (!edge.relationship) {
      issues.push({
        type: 'missing_field',
        severity: 'error',
        message: `Edge ${edge.id} missing required field: relationship`,
        id: edge.id,
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Run all integrity checks and combine results
 */
export function runAllIntegrityChecks(data: GraphData): IntegrityReport {
  const reports = [
    validateReferentialIntegrity(data),
    checkDuplicateIds(data),
    checkRequiredFields(data),
  ];

  const allIssues = reports.flatMap((r) => r.issues);

  return {
    valid: allIssues.length === 0,
    issues: allIssues,
  };
}

/**
 * Summarize integrity report for display
 */
export function summarizeIntegrityReport(report: IntegrityReport): string {
  if (report.valid) {
    return 'Integrity: PASS (no issues found)';
  }

  const errors = report.issues.filter((i) => i.severity === 'error');
  const warnings = report.issues.filter((i) => i.severity === 'warning');

  const parts = [`Integrity: FAIL (${errors.length} errors, ${warnings.length} warnings)`];

  // Show first few issues
  const sample = report.issues.slice(0, 5);
  for (const issue of sample) {
    parts.push(`  [${issue.severity.toUpperCase()}] ${issue.message}`);
  }

  if (report.issues.length > 5) {
    parts.push(`  ... and ${report.issues.length - 5} more issues`);
  }

  return parts.join('\n');
}
