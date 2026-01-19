/**
 * Graph filtering utility functions
 */

import type { GraphData, GraphNode, GraphEdge, NodeType } from '@types';
import type { FilterState, FilterStats } from '../types/filters';

/**
 * Parse a year from a date string
 * Supports ISO 8601 format (YYYY-MM-DD) or year-only strings (YYYY)
 * Returns null if the date cannot be parsed
 */
export function parseYear(dateString: string | undefined): number | null {
  if (!dateString) return null;

  // Try to extract year from the beginning of the string
  const yearMatch = dateString.match(/^-?\d+/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    if (!isNaN(year)) {
      return year;
    }
  }

  return null;
}

/**
 * Check if a node's date range overlaps with the filter range
 * A node matches if any part of its existence overlaps with the filter range
 * Nodes without dates are always included (unless specifically filtered)
 */
export function nodeMatchesDateRange(
  node: GraphNode,
  filterStart: number | null,
  filterEnd: number | null
): boolean {
  // If no date filters, everything matches
  if (filterStart === null && filterEnd === null) {
    return true;
  }

  const nodeStart = parseYear(node.dateStart);
  const nodeEnd = parseYear(node.dateEnd);

  // If node has no dates, include it (don't filter out undated items)
  if (nodeStart === null && nodeEnd === null) {
    return true;
  }

  // If filtering by "no earlier than" (filterStart)
  // The node's end date (or start if no end) should be >= filterStart
  if (filterStart !== null) {
    const nodeLatest = nodeEnd ?? nodeStart;
    if (nodeLatest !== null && nodeLatest < filterStart) {
      return false;
    }
  }

  // If filtering by "no later than" (filterEnd)
  // The node's start date (or end if no start) should be <= filterEnd
  if (filterEnd !== null) {
    const nodeEarliest = nodeStart ?? nodeEnd;
    if (nodeEarliest !== null && nodeEarliest > filterEnd) {
      return false;
    }
  }

  return true;
}

/**
 * Check if an edge's date range overlaps with the filter range
 * Similar logic to node date matching
 */
export function edgeMatchesDateRange(
  edge: GraphEdge,
  filterStart: number | null,
  filterEnd: number | null
): boolean {
  // If no date filters, everything matches
  if (filterStart === null && filterEnd === null) {
    return true;
  }

  const edgeStart = parseYear(edge.dateStart);
  const edgeEnd = parseYear(edge.dateEnd);

  // If edge has no dates, include it
  if (edgeStart === null && edgeEnd === null) {
    return true;
  }

  // If filtering by "no earlier than" (filterStart)
  if (filterStart !== null) {
    const edgeLatest = edgeEnd ?? edgeStart;
    if (edgeLatest !== null && edgeLatest < filterStart) {
      return false;
    }
  }

  // If filtering by "no later than" (filterEnd)
  if (filterEnd !== null) {
    const edgeEarliest = edgeStart ?? edgeEnd;
    if (edgeEarliest !== null && edgeEarliest > filterEnd) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a node's title matches the name filter
 * Case-insensitive substring match
 */
export function nodeMatchesNameFilter(node: GraphNode, filter: string): boolean {
  if (!filter.trim()) {
    return true;
  }
  return node.title.toLowerCase().includes(filter.toLowerCase().trim());
}

/**
 * Check if a node's type matches the allowed types filter
 * null = all types allowed
 */
export function nodeMatchesTypeFilter(
  node: GraphNode,
  allowedTypes: NodeType[] | null
): boolean {
  if (allowedTypes === null) return true; // null = all types allowed
  return allowedTypes.includes(node.type);
}

/**
 * Check if an edge's relationship matches the allowed relationship types filter
 * null = all types allowed
 */
export function edgeMatchesRelationshipFilter(
  edge: GraphEdge,
  allowedTypes: string[] | null
): boolean {
  if (allowedTypes === null) return true; // null = all types allowed
  return allowedTypes.includes(edge.relationship);
}

/**
 * Filter graph data based on filter state
 * Returns a new GraphData object with filtered nodes and edges
 *
 * Filtering rules:
 * 1. Nodes are filtered by type, date range, and name filter
 * 2. Edges are filtered by date range and relationship types filter
 * 3. Edges connected to filtered-out nodes are also removed
 */
export function filterGraphData(data: GraphData, filters: FilterState): GraphData {
  const { dateStart, dateEnd, nameFilter, relationshipTypes, nodeTypes } = filters;

  // Step 1: Filter nodes (type filter applied first)
  const filteredNodes = data.nodes.filter((node) => {
    return (
      nodeMatchesTypeFilter(node, nodeTypes) &&
      nodeMatchesDateRange(node, dateStart, dateEnd) &&
      nodeMatchesNameFilter(node, nameFilter)
    );
  });

  // Create a Set of filtered node IDs for quick lookup
  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

  // Step 2: Filter edges
  // - Must match date range filter
  // - Must match relationship types filter
  // - Both source and target nodes must still be in the filtered set
  const filteredEdges = data.edges.filter((edge) => {
    // Check if both connected nodes are still in the graph
    if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) {
      return false;
    }

    return (
      edgeMatchesDateRange(edge, dateStart, dateEnd) &&
      edgeMatchesRelationshipFilter(edge, relationshipTypes)
    );
  });

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

/**
 * Get filter statistics comparing original and filtered data
 */
export function getFilterStats(originalData: GraphData, filteredData: GraphData): FilterStats {
  return {
    totalNodes: originalData.nodes.length,
    filteredNodes: filteredData.nodes.length,
    totalEdges: originalData.edges.length,
    filteredEdges: filteredData.edges.length,
  };
}

/**
 * Get the date range of all nodes in the graph
 * Useful for showing available date range in UI
 */
export function getGraphDateRange(data: GraphData): {
  minYear: number | null;
  maxYear: number | null;
} {
  let minYear: number | null = null;
  let maxYear: number | null = null;

  for (const node of data.nodes) {
    const startYear = parseYear(node.dateStart);
    const endYear = parseYear(node.dateEnd);

    if (startYear !== null) {
      if (minYear === null || startYear < minYear) {
        minYear = startYear;
      }
      if (maxYear === null || startYear > maxYear) {
        maxYear = startYear;
      }
    }

    if (endYear !== null) {
      if (minYear === null || endYear < minYear) {
        minYear = endYear;
      }
      if (maxYear === null || endYear > maxYear) {
        maxYear = endYear;
      }
    }
  }

  return { minYear, maxYear };
}

/**
 * Get counts of nodes by type from unfiltered graph data
 * Used to show type counts in the filter UI
 */
export function getNodeTypeCounts(data: GraphData): Record<NodeType, number> {
  const counts: Record<NodeType, number> = {
    person: 0,
    object: 0,
    location: 0,
    entity: 0,
  };
  
  for (const node of data.nodes) {
    counts[node.type]++;
  }
  
  return counts;
}

/**
 * Get counts of edges by relationship type from unfiltered graph data
 * Used to show relationship type counts in the filter UI
 */
export function getRelationshipTypeCounts(data: GraphData): Record<string, number> {
  const counts: Record<string, number> = {};
  
  for (const edge of data.edges) {
    counts[edge.relationship] = (counts[edge.relationship] ?? 0) + 1;
  }
  
  return counts;
}
