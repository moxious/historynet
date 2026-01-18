/**
 * Cross-reference validation
 * Validates referential integrity between nodes and edges
 */

import type { ValidationIssue } from '../types.js';

/**
 * Validate cross-references between nodes and edges
 */
export function validateCrossReferences(
  nodeIds: Set<string>,
  edgeSources: string[],
  edgeTargets: string[],
  evidenceNodeIds: string[],
  fileName: string,
  checkOrphans: boolean = false
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Track which nodes are referenced by edges
  const referencedNodes = new Set<string>();

  // Validate all edge sources exist in nodes
  for (let i = 0; i < edgeSources.length; i++) {
    const source = edgeSources[i];
    if (!nodeIds.has(source)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Edge references non-existent source node: "${source}"`,
        path: `edges[${i}].source`,
        code: 'BROKEN_REFERENCE',
      });
    } else {
      referencedNodes.add(source);
    }
  }

  // Validate all edge targets exist in nodes
  for (let i = 0; i < edgeTargets.length; i++) {
    const target = edgeTargets[i];
    if (!nodeIds.has(target)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Edge references non-existent target node: "${target}"`,
        path: `edges[${i}].target`,
        code: 'BROKEN_REFERENCE',
      });
    } else {
      referencedNodes.add(target);
    }
  }

  // Validate all evidenceNodeIds exist in nodes
  for (let i = 0; i < evidenceNodeIds.length; i++) {
    const evidenceId = evidenceNodeIds[i];
    if (evidenceId && !nodeIds.has(evidenceId)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Edge references non-existent evidence node: "${evidenceId}"`,
        path: `edges[${i}].evidenceNodeId`,
        code: 'INVALID_EVIDENCE_NODE_ID',
      });
    }
  }

  // Check for orphan nodes (nodes with no edges)
  if (checkOrphans) {
    for (const nodeId of nodeIds) {
      if (!referencedNodes.has(nodeId)) {
        issues.push({
          severity: 'warning',
          file: 'nodes.json',
          message: `Orphan node has no edges: "${nodeId}"`,
          code: 'ORPHAN_NODE',
        });
      }
    }
  }

  return issues;
}
