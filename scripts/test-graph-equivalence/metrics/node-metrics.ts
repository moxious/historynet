/**
 * Node metrics calculation functions
 * MI-01: Count total nodes
 * MI-02: Count nodes by type
 * MI-09: Collect node IDs for validation
 */

import type { GraphData } from '../../../src/types/graph.js';
import type { NodeType } from '../../../src/types/node.js';
import type { NodeMetrics } from '../types.js';

/**
 * Calculate comprehensive node metrics for a graph dataset
 */
export function getNodeMetrics(data: GraphData): NodeMetrics {
  const nodesByType: Record<NodeType, number> = {
    person: 0,
    object: 0,
    location: 0,
    entity: 0,
  };

  const nodeIds = new Set<string>();

  // Iterate through all nodes and collect metrics
  for (const node of data.nodes) {
    nodeIds.add(node.id);
    nodesByType[node.type]++;
  }

  return {
    totalNodes: data.nodes.length,
    nodesByType,
    nodeIds,
  };
}

/**
 * Get a summary of node metrics for display
 */
export function summarizeNodeMetrics(metrics: NodeMetrics): string {
  const { totalNodes, nodesByType } = metrics;

  const parts = [
    `Total nodes: ${totalNodes}`,
    `  Person: ${nodesByType.person}`,
    `  Object: ${nodesByType.object}`,
    `  Location: ${nodesByType.location}`,
    `  Entity: ${nodesByType.entity}`,
  ];

  return parts.join('\n');
}

/**
 * Compare two node metrics to check if they are equivalent
 */
export function compareNodeMetrics(
  current: NodeMetrics,
  atomic: NodeMetrics
): { equivalent: boolean; differences: string[] } {
  const differences: string[] = [];

  // Check total node count
  if (current.totalNodes !== atomic.totalNodes) {
    differences.push(
      `Total nodes differ: current=${current.totalNodes}, atomic=${atomic.totalNodes}`
    );
  }

  // Check node counts by type
  const types: NodeType[] = ['person', 'object', 'location', 'entity'];
  for (const type of types) {
    if (current.nodesByType[type] !== atomic.nodesByType[type]) {
      differences.push(
        `${type} count differs: current=${current.nodesByType[type]}, atomic=${atomic.nodesByType[type]}`
      );
    }
  }

  // Check node IDs match (same set of IDs, though IDs themselves may differ)
  // For atomic format, we expect different IDs, so we only check count
  if (current.nodeIds.size !== atomic.nodeIds.size) {
    differences.push(
      `Node ID count differs: current=${current.nodeIds.size}, atomic=${atomic.nodeIds.size}`
    );
  }

  return {
    equivalent: differences.length === 0,
    differences,
  };
}
