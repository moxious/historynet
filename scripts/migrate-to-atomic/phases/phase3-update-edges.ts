/**
 * Phase 3: Update edges.json to use new entity UUIDs
 * MI-26 to MI-28: Remap edge source/target from old nodeIds to new UUIDs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { GraphEdge } from '../../../src/types/edge.js';
import type { EntityRegistry } from '../types.js';

/**
 * Update edges for a single dataset
 */
async function updateDatasetEdges(
  projectRoot: string,
  datasetId: string,
  registry: EntityRegistry,
  dryRun: boolean,
  outputDir: string
): Promise<{ totalEdges: number; updatedEdges: number }> {
  // Load edges for this dataset
  const edgesPath = join(
    projectRoot,
    'public',
    'datasets',
    datasetId,
    'edges.json'
  );
  const edgesContent = await readFile(edgesPath, 'utf-8');
  const edges: GraphEdge[] = JSON.parse(edgesContent);

  let updatedCount = 0;

  // Update each edge
  for (const edge of edges) {
    // Look up entity UUIDs for source and target
    const sourceLookup = `${datasetId}:${edge.source}`;
    const targetLookup = `${datasetId}:${edge.target}`;

    const sourceEntityId = registry.byDatasetNode.get(sourceLookup);
    const targetEntityId = registry.byDatasetNode.get(targetLookup);

    if (!sourceEntityId) {
      throw new Error(
        `Source entity not found for edge ${edge.id}: ${sourceLookup}`
      );
    }

    if (!targetEntityId) {
      throw new Error(
        `Target entity not found for edge ${edge.id}: ${targetLookup}`
      );
    }

    // Update edge source and target
    edge.source = sourceEntityId;
    edge.target = targetEntityId;
    updatedCount++;
  }

  // Write updated edges.json
  const targetPath = dryRun
    ? join(outputDir, 'datasets', datasetId, 'edges.json')
    : join(projectRoot, 'public', 'datasets', datasetId, 'edges.json');

  // Ensure directory exists (for dry run)
  if (dryRun) {
    await mkdir(join(outputDir, 'datasets', datasetId), { recursive: true });
  }

  await writeFile(targetPath, JSON.stringify(edges, null, 2), 'utf-8');

  return {
    totalEdges: edges.length,
    updatedEdges: updatedCount,
  };
}

/**
 * Update edges for all datasets
 */
export async function updateEdges(
  projectRoot: string,
  datasetIds: string[],
  registry: EntityRegistry,
  dryRun: boolean,
  outputDir: string
): Promise<{ totalEdgesUpdated: number }> {
  console.log('\n=== Phase 3: Updating edges.json files ===\n');

  let totalEdgesUpdated = 0;

  for (const datasetId of datasetIds) {
    console.log(`Updating edges for ${datasetId}...`);

    const result = await updateDatasetEdges(
      projectRoot,
      datasetId,
      registry,
      dryRun,
      outputDir
    );

    console.log(`  Updated ${result.updatedEdges}/${result.totalEdges} edges`);
    totalEdgesUpdated += result.updatedEdges;
  }

  console.log(`\nTotal edges updated: ${totalEdgesUpdated}`);

  return { totalEdgesUpdated };
}
