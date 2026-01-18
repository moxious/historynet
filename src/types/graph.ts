/**
 * Combined graph data type definitions for HistoryNet
 */

import type { GraphNode } from './node';
import type { GraphEdge } from './edge';
import type { DatasetManifest } from './dataset';

/**
 * Complete graph data loaded from a dataset
 */
export interface GraphData {
  /** All nodes in the graph */
  nodes: GraphNode[];
  /** All edges in the graph */
  edges: GraphEdge[];
}

/**
 * Complete dataset with manifest and graph data
 */
export interface Dataset {
  /** Dataset metadata */
  manifest: DatasetManifest;
  /** Graph data (nodes and edges) */
  data: GraphData;
}

/**
 * Selection state - either a node or an edge is selected
 */
export type SelectionType = 'node' | 'edge';

/**
 * Represents the currently selected item in the graph
 */
export interface Selection {
  /** Type of selection */
  type: SelectionType;
  /** ID of the selected item */
  id: string;
}

/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Error information for failed operations
 */
export interface DataError {
  /** Error message */
  message: string;
  /** Error code (if applicable) */
  code?: string;
  /** Original error (for debugging) */
  originalError?: unknown;
}

/**
 * Graph state including loading and error states
 */
export interface GraphState {
  /** Current dataset (null if not loaded) */
  dataset: Dataset | null;
  /** Current loading state */
  loadingState: LoadingState;
  /** Error information (if in error state) */
  error: DataError | null;
  /** Currently selected item */
  selection: Selection | null;
}

/**
 * Lookup node by ID from graph data
 */
export function findNodeById(data: GraphData, id: string): GraphNode | undefined {
  return data.nodes.find((node) => node.id === id);
}

/**
 * Lookup edge by ID from graph data
 */
export function findEdgeById(data: GraphData, id: string): GraphEdge | undefined {
  return data.edges.find((edge) => edge.id === id);
}

/**
 * Find all edges connected to a node
 */
export function findEdgesForNode(data: GraphData, nodeId: string): GraphEdge[] {
  return data.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
}

/**
 * Find all nodes connected to a given node via edges
 */
export function findConnectedNodes(data: GraphData, nodeId: string): GraphNode[] {
  const connectedEdges = findEdgesForNode(data, nodeId);
  const connectedIds = new Set<string>();

  connectedEdges.forEach((edge) => {
    if (edge.source === nodeId) {
      connectedIds.add(edge.target);
    } else {
      connectedIds.add(edge.source);
    }
  });

  return data.nodes.filter((node) => connectedIds.has(node.id));
}

/**
 * Get basic statistics about the graph
 */
export function getGraphStats(data: GraphData): {
  nodeCount: number;
  edgeCount: number;
  nodesByType: Record<string, number>;
  relationshipTypes: string[];
} {
  const nodesByType: Record<string, number> = {};
  const relationshipTypesSet = new Set<string>();

  data.nodes.forEach((node) => {
    nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
  });

  data.edges.forEach((edge) => {
    relationshipTypesSet.add(edge.relationship);
  });

  return {
    nodeCount: data.nodes.length,
    edgeCount: data.edges.length,
    nodesByType,
    relationshipTypes: Array.from(relationshipTypesSet).sort(),
  };
}
