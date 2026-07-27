/**
 * Edge metrics calculation functions
 * MI-03: Count total edges
 * MI-04: Count edges by relationship type
 * MI-10: Collect edge IDs for validation
 */

import type { GraphData } from '../../../src/types/graph.js';
import type { EdgeMetrics } from '../types.js';

/**
 * Calculate comprehensive edge metrics for a graph dataset
 */
export function getEdgeMetrics(data: GraphData): EdgeMetrics {
  const edgesByRelationship: Record<string, number> = {};
  const edgeIds = new Set<string>();

  // Iterate through all edges and collect metrics
  for (const edge of data.edges) {
    edgeIds.add(edge.id);

    // Count by relationship type
    if (!edgesByRelationship[edge.relationship]) {
      edgesByRelationship[edge.relationship] = 0;
    }
    edgesByRelationship[edge.relationship]++;
  }

  return {
    totalEdges: data.edges.length,
    edgesByRelationship,
    edgeIds,
  };
}

/**
 * Get a summary of edge metrics for display
 */
export function summarizeEdgeMetrics(metrics: EdgeMetrics): string {
  const { totalEdges, edgesByRelationship } = metrics;

  const parts = [`Total edges: ${totalEdges}`];

  // Sort relationship types alphabetically for consistent output
  const sortedRelationships = Object.keys(edgesByRelationship).sort();

  for (const rel of sortedRelationships) {
    parts.push(`  ${rel}: ${edgesByRelationship[rel]}`);
  }

  return parts.join('\n');
}

/**
 * Compare two edge metrics to check if they are equivalent
 */
export function compareEdgeMetrics(
  current: EdgeMetrics,
  atomic: EdgeMetrics
): { equivalent: boolean; differences: string[] } {
  const differences: string[] = [];

  // Check total edge count
  if (current.totalEdges !== atomic.totalEdges) {
    differences.push(
      `Total edges differ: current=${current.totalEdges}, atomic=${atomic.totalEdges}`
    );
  }

  // Check edge counts by relationship type
  const allRelationships = new Set([
    ...Object.keys(current.edgesByRelationship),
    ...Object.keys(atomic.edgesByRelationship),
  ]);

  for (const rel of allRelationships) {
    const currentCount = current.edgesByRelationship[rel] || 0;
    const atomicCount = atomic.edgesByRelationship[rel] || 0;

    if (currentCount !== atomicCount) {
      differences.push(
        `${rel} count differs: current=${currentCount}, atomic=${atomicCount}`
      );
    }
  }

  // Check edge ID count
  if (current.edgeIds.size !== atomic.edgeIds.size) {
    differences.push(
      `Edge ID count differs: current=${current.edgeIds.size}, atomic=${atomic.edgeIds.size}`
    );
  }

  return {
    equivalent: differences.length === 0,
    differences,
  };
}
