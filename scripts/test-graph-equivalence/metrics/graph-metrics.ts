/**
 * Graph-level metrics calculation functions
 * MI-05: Count connected components
 * MI-06: Find largest component size
 * MI-07: Calculate node degree statistics
 */

import type { GraphData } from '../../../src/types/graph.js';
import type { ConnectedComponentsInfo, NodeDegreeStats } from '../types.js';

/**
 * Find connected components using Union-Find algorithm
 * MI-05: Count connected components
 * MI-06: Find largest component size
 */
export function getConnectedComponents(data: GraphData): ConnectedComponentsInfo {
  // Build adjacency list (undirected graph)
  const adjacency = new Map<string, Set<string>>();

  for (const node of data.nodes) {
    adjacency.set(node.id, new Set());
  }

  for (const edge of data.edges) {
    adjacency.get(edge.source)?.add(edge.target);
    adjacency.get(edge.target)?.add(edge.source);
  }

  // Find connected components using DFS
  const visited = new Set<string>();
  const components: number[] = [];

  const dfs = (nodeId: string, component: Set<string>): void => {
    visited.add(nodeId);
    component.add(nodeId);

    const neighbors = adjacency.get(nodeId);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, component);
        }
      }
    }
  };

  // Find all connected components
  for (const node of data.nodes) {
    if (!visited.has(node.id)) {
      const component = new Set<string>();
      dfs(node.id, component);
      components.push(component.size);
    }
  }

  // Sort components by size (descending)
  components.sort((a, b) => b - a);

  return {
    componentCount: components.length,
    largestComponentSize: components.length > 0 ? components[0] : 0,
    componentSizeDistribution: components,
  };
}

/**
 * Calculate node degree statistics
 * MI-07: Node degree distribution and statistics
 */
export function getNodeDegreeStats(data: GraphData): NodeDegreeStats {
  // Calculate degree for each node
  const degrees = new Map<string, number>();

  // Initialize all nodes with degree 0
  for (const node of data.nodes) {
    degrees.set(node.id, 0);
  }

  // Count edges for each node
  for (const edge of data.edges) {
    degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1);
    degrees.set(edge.target, (degrees.get(edge.target) || 0) + 1);
  }

  // Collect degree values
  const degreeValues = Array.from(degrees.values());

  // Build degree distribution
  const degreeDistribution: Record<number, number> = {};
  for (const degree of degreeValues) {
    degreeDistribution[degree] = (degreeDistribution[degree] || 0) + 1;
  }

  // Calculate statistics
  const minDegree = degreeValues.length > 0 ? Math.min(...degreeValues) : 0;
  const maxDegree = degreeValues.length > 0 ? Math.max(...degreeValues) : 0;
  const avgDegree =
    degreeValues.length > 0
      ? degreeValues.reduce((sum, d) => sum + d, 0) / degreeValues.length
      : 0;

  // Calculate median
  const sortedDegrees = degreeValues.sort((a, b) => a - b);
  const medianDegree =
    sortedDegrees.length > 0
      ? sortedDegrees.length % 2 === 0
        ? (sortedDegrees[sortedDegrees.length / 2 - 1] +
            sortedDegrees[sortedDegrees.length / 2]) /
          2
        : sortedDegrees[Math.floor(sortedDegrees.length / 2)]
      : 0;

  return {
    minDegree,
    maxDegree,
    avgDegree: parseFloat(avgDegree.toFixed(2)),
    medianDegree,
    degreeDistribution,
  };
}

/**
 * Summarize connected components for display
 */
export function summarizeConnectedComponents(info: ConnectedComponentsInfo): string {
  const parts = [
    `Connected components: ${info.componentCount}`,
    `Largest component: ${info.largestComponentSize} nodes`,
  ];

  // Show distribution summary (top 5 components)
  if (info.componentSizeDistribution.length > 1) {
    const top5 = info.componentSizeDistribution.slice(0, 5);
    parts.push(`Component sizes (top 5): ${top5.join(', ')}`);
  }

  return parts.join('\n');
}

/**
 * Summarize node degree statistics for display
 */
export function summarizeNodeDegreeStats(stats: NodeDegreeStats): string {
  const parts = [
    `Node degrees: min=${stats.minDegree}, max=${stats.maxDegree}, avg=${stats.avgDegree}, median=${stats.medianDegree}`,
  ];

  // Show degree distribution summary
  const degreeKeys = Object.keys(stats.degreeDistribution)
    .map(Number)
    .sort((a, b) => a - b);

  if (degreeKeys.length <= 10) {
    parts.push(`Degree distribution: ${degreeKeys.map((d) => `${d}:${stats.degreeDistribution[d]}`).join(', ')}`);
  } else {
    const sample = degreeKeys.slice(0, 5);
    parts.push(`Degree distribution (sample): ${sample.map((d) => `${d}:${stats.degreeDistribution[d]}`).join(', ')}...`);
  }

  return parts.join('\n');
}

/**
 * Compare connected components info
 */
export function compareConnectedComponents(
  current: ConnectedComponentsInfo,
  atomic: ConnectedComponentsInfo
): { equivalent: boolean; differences: string[] } {
  const differences: string[] = [];

  if (current.componentCount !== atomic.componentCount) {
    differences.push(
      `Component count differs: current=${current.componentCount}, atomic=${atomic.componentCount}`
    );
  }

  if (current.largestComponentSize !== atomic.largestComponentSize) {
    differences.push(
      `Largest component size differs: current=${current.largestComponentSize}, atomic=${atomic.largestComponentSize}`
    );
  }

  return {
    equivalent: differences.length === 0,
    differences,
  };
}

/**
 * Compare node degree statistics
 */
export function compareNodeDegreeStats(
  current: NodeDegreeStats,
  atomic: NodeDegreeStats
): { equivalent: boolean; differences: string[] } {
  const differences: string[] = [];

  if (current.minDegree !== atomic.minDegree) {
    differences.push(
      `Min degree differs: current=${current.minDegree}, atomic=${atomic.minDegree}`
    );
  }

  if (current.maxDegree !== atomic.maxDegree) {
    differences.push(
      `Max degree differs: current=${current.maxDegree}, atomic=${atomic.maxDegree}`
    );
  }

  if (current.avgDegree !== atomic.avgDegree) {
    differences.push(
      `Avg degree differs: current=${current.avgDegree}, atomic=${atomic.avgDegree}`
    );
  }

  if (current.medianDegree !== atomic.medianDegree) {
    differences.push(
      `Median degree differs: current=${current.medianDegree}, atomic=${atomic.medianDegree}`
    );
  }

  return {
    equivalent: differences.length === 0,
    differences,
  };
}
