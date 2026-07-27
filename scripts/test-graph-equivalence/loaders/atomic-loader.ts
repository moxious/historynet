/**
 * Loader for atomic dataset format (entities/ + members.json + edges.json)
 * MI-33: Assemble graph from atomic architecture
 *
 * This will be implemented in Phase 3 after the migration script is complete.
 * For now, it throws an error indicating the format is not yet available.
 */

import type { GraphData } from '../../../src/types/graph.js';

/**
 * Load graph data in atomic format from disk
 * @param projectRoot - Root directory of the project
 * @param datasetId - ID of the dataset to load
 * @returns GraphData with nodes and edges assembled from atomic entities
 */
export async function loadAtomicFormat(
  projectRoot: string,
  datasetId: string
): Promise<GraphData> {
  // TODO: Implement in Phase 3
  // Steps:
  // 1. Load members.json from public/datasets/{datasetId}/
  // 2. For each member, load canonical entity from entities/{type}/{uuid}.json
  // 3. Apply overrides from members.json to canonical data
  // 4. Build nodes array
  // 5. Load edges.json (already uses entity UUIDs)
  // 6. Return GraphData

  throw new Error(
    `Atomic format loader not yet implemented. Dataset: ${datasetId}, ProjectRoot: ${projectRoot}. This will be completed in Phase 3 after migration infrastructure is built.`
  );
}
