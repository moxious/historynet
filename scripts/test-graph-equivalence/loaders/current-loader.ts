/**
 * Loader for current dataset format (nodes.json + edges.json)
 * Used to establish baseline metrics before migration
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { GraphData } from '../../../src/types/graph.js';
import type { GraphNode } from '../../../src/types/node.js';
import type { GraphEdge } from '../../../src/types/edge.js';

/**
 * Load graph data in current format from disk
 * @param projectRoot - Root directory of the project
 * @param datasetId - ID of the dataset to load
 * @returns GraphData with nodes and edges
 */
export async function loadCurrentFormat(
  projectRoot: string,
  datasetId: string
): Promise<GraphData> {
  const datasetPath = join(projectRoot, 'public', 'datasets', datasetId);

  // Load nodes.json
  const nodesPath = join(datasetPath, 'nodes.json');
  let nodes: GraphNode[];
  try {
    const nodesContent = await readFile(nodesPath, 'utf-8');
    nodes = JSON.parse(nodesContent);
  } catch (error) {
    throw new Error(
      `Failed to load nodes.json for ${datasetId}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Validate nodes is an array
  if (!Array.isArray(nodes)) {
    throw new Error(`Invalid nodes.json for ${datasetId}: expected array`);
  }

  // Load edges.json
  const edgesPath = join(datasetPath, 'edges.json');
  let edges: GraphEdge[];
  try {
    const edgesContent = await readFile(edgesPath, 'utf-8');
    edges = JSON.parse(edgesContent);
  } catch (error) {
    throw new Error(
      `Failed to load edges.json for ${datasetId}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Validate edges is an array
  if (!Array.isArray(edges)) {
    throw new Error(`Invalid edges.json for ${datasetId}: expected array`);
  }

  return { nodes, edges };
}
