/**
 * Data loading utilities for HistoryNet datasets
 */

import type { DatasetManifest, GraphNode, GraphEdge, GraphData, Dataset } from '@types';

/**
 * Get the base path for datasets
 * Uses Vite's BASE_URL to handle deployment to subdirectories (e.g., GitHub Pages)
 * - Local dev: BASE_URL = '/' → datasets at '/datasets/...'
 * - GitHub Pages: BASE_URL = '/historynet/' → datasets at '/historynet/datasets/...'
 */
function getDatasetsBasePath(): string {
  const base = import.meta.env.BASE_URL || '/';
  // Ensure base ends with / and combine with 'datasets'
  return `${base.endsWith('/') ? base : base + '/'}datasets`;
}

/**
 * Error thrown when dataset loading fails
 */
export class DatasetLoadError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'DatasetLoadError';
  }
}

/**
 * Fetch JSON data with error handling
 * REACT: Accepts optional AbortSignal for request cancellation (R4/R7)
 */
async function fetchJson<T>(url: string, description: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new DatasetLoadError(
        `Failed to load ${description}: HTTP ${response.status}`,
        'HTTP_ERROR'
      );
    }

    return await response.json();
  } catch (error) {
    // Re-throw abort errors as-is so they can be handled specifically
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    if (error instanceof DatasetLoadError) {
      throw error;
    }

    throw new DatasetLoadError(
      `Failed to load ${description}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'FETCH_ERROR',
      error
    );
  }
}

/**
 * Build the URL path to a dataset file
 */
function getDatasetPath(datasetId: string, filename: string): string {
  return `${getDatasetsBasePath()}/${datasetId}/${filename}`;
}

/**
 * Load the manifest for a dataset
 * REACT: Accepts optional AbortSignal for request cancellation (R4/R7)
 */
export async function loadManifest(datasetId: string, signal?: AbortSignal): Promise<DatasetManifest> {
  const url = getDatasetPath(datasetId, 'manifest.json');
  const manifest = await fetchJson<DatasetManifest>(url, `manifest for ${datasetId}`, signal);

  // Validate required fields
  if (!manifest.id || !manifest.name || !manifest.description || !manifest.lastUpdated) {
    throw new DatasetLoadError(
      `Invalid manifest for ${datasetId}: missing required fields`,
      'INVALID_MANIFEST'
    );
  }

  return manifest;
}

/**
 * Load nodes for a dataset
 * REACT: Accepts optional AbortSignal for request cancellation (R4/R7)
 */
export async function loadNodes(datasetId: string, signal?: AbortSignal): Promise<GraphNode[]> {
  const url = getDatasetPath(datasetId, 'nodes.json');
  const nodes = await fetchJson<GraphNode[]>(url, `nodes for ${datasetId}`, signal);

  // Validate that we got an array
  if (!Array.isArray(nodes)) {
    throw new DatasetLoadError(`Invalid nodes for ${datasetId}: expected array`, 'INVALID_NODES');
  }

  // Validate each node has required fields
  for (const node of nodes) {
    if (!node.id || !node.type || !node.title) {
      throw new DatasetLoadError(
        `Invalid node in ${datasetId}: missing required fields (id, type, or title)`,
        'INVALID_NODE'
      );
    }
  }

  return nodes;
}

/**
 * Load edges for a dataset
 * REACT: Accepts optional AbortSignal for request cancellation (R4/R7)
 */
export async function loadEdges(datasetId: string, signal?: AbortSignal): Promise<GraphEdge[]> {
  const url = getDatasetPath(datasetId, 'edges.json');
  const edges = await fetchJson<GraphEdge[]>(url, `edges for ${datasetId}`, signal);

  // Validate that we got an array
  if (!Array.isArray(edges)) {
    throw new DatasetLoadError(`Invalid edges for ${datasetId}: expected array`, 'INVALID_EDGES');
  }

  // Validate each edge has required fields
  for (const edge of edges) {
    if (!edge.id || !edge.source || !edge.target || !edge.relationship) {
      throw new DatasetLoadError(
        `Invalid edge in ${datasetId}: missing required fields (id, source, target, or relationship)`,
        'INVALID_EDGE'
      );
    }
  }

  return edges;
}

/**
 * Load graph data (nodes and edges) for a dataset
 * REACT: Accepts optional AbortSignal for request cancellation (R4/R7)
 */
export async function loadGraphData(datasetId: string, signal?: AbortSignal): Promise<GraphData> {
  // Load nodes and edges in parallel
  const [nodes, edges] = await Promise.all([
    loadNodes(datasetId, signal),
    loadEdges(datasetId, signal),
  ]);

  return { nodes, edges };
}

/**
 * Load a complete dataset (manifest + data)
 * REACT: Accepts optional AbortSignal for request cancellation (R4/R7)
 */
export async function loadDataset(datasetId: string, signal?: AbortSignal): Promise<Dataset> {
  // Load manifest first to validate the dataset exists
  const manifest = await loadManifest(datasetId, signal);

  // Then load graph data
  const data = await loadGraphData(datasetId, signal);

  return { manifest, data };
}

/**
 * Validate that all edge references point to existing nodes
 */
export function validateEdgeReferences(
  data: GraphData
): { valid: boolean; errors: string[] } {
  const nodeIds = new Set(data.nodes.map((node) => node.id));
  const errors: string[] = [];

  for (const edge of data.edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge ${edge.id}: source node "${edge.source}" not found`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge ${edge.id}: target node "${edge.target}" not found`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * List of known/available dataset IDs
 * In a real application, this might be loaded from a config file
 */
export const AVAILABLE_DATASETS = ['disney-characters', 'rosicrucian-network', 'enlightenment', 'ai-llm-research', 'ambient-music', 'cybernetics-information-theory', 'protestant-reformation'];

/**
 * Default dataset ID to load when none is specified
 */
export const DEFAULT_DATASET_ID = 'disney-characters';

/**
 * Check if a dataset ID is valid/available
 */
export function isValidDatasetId(datasetId: string): boolean {
  return AVAILABLE_DATASETS.includes(datasetId);
}
