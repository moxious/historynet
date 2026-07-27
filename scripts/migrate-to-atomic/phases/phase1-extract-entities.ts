/**
 * Phase 1: Extract canonical entities from all datasets
 * MI-17 to MI-21b: Scan datasets, generate UUIDs, detect cross-dataset entities
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { GraphNode } from '../../../src/types/node.js';
import type {
  EntityRegistry,
  CanonicalEntity,
  EntityAppearance,
  CanonicalFields,
  CanonicalConflict,
} from '../types.js';
import { generateEntityUUID } from '../uuid-generator.js';

/**
 * Extract canonical fields from a graph node
 */
function extractCanonicalFields(node: GraphNode): CanonicalFields {
  return {
    wikidataId: node.wikidataId,
    wikipediaTitle: node.wikipediaTitle,
    title: node.title,
    dateStart: node.dateStart,
    dateEnd: node.dateEnd,
    alternateNames: 'alternateNames' in node ? node.alternateNames as string[] | undefined : undefined,
    birthPlace: 'birthPlace' in node ? node.birthPlace as string | undefined : undefined,
    deathPlace: 'deathPlace' in node ? node.deathPlace as string | undefined : undefined,
    nationality: 'nationality' in node ? node.nationality as string | undefined : undefined,
    occupations: 'occupations' in node ? node.occupations as string[] | undefined : undefined,
    externalLinks: node.externalLinks,
  };
}

/**
 * Detect conflicts between canonical data
 * Returns conflicts for fields that differ between appearances
 */
function detectCanonicalConflicts(
  entityId: string,
  wikidataId: string,
  existingCanonical: CanonicalFields,
  newCanonical: CanonicalFields,
  sourceDataset: string,
  newDataset: string
): CanonicalConflict[] {
  const conflicts: CanonicalConflict[] = [];

  // Check each canonical field for conflicts
  const fieldsToCheck: (keyof CanonicalFields)[] = [
    'title',
    'wikipediaTitle',
    'dateStart',
    'dateEnd',
    'alternateNames',
    'birthPlace',
    'deathPlace',
    'nationality',
    'occupations',
  ];

  for (const field of fieldsToCheck) {
    const existingValue = existingCanonical[field];
    const newValue = newCanonical[field];

    // Skip if both are undefined
    if (existingValue === undefined && newValue === undefined) {
      continue;
    }

    // Conflict if only one is defined
    if (existingValue === undefined || newValue === undefined) {
      if (existingValue !== newValue) {
        conflicts.push({
          entityId,
          wikidataId,
          field,
          canonicalValue: existingValue,
          conflictingValue: newValue,
          sourceDataset,
          conflictingDataset: newDataset,
        });
      }
      continue;
    }

    // Compare values (handle arrays specially)
    if (Array.isArray(existingValue) && Array.isArray(newValue)) {
      const existingSet = new Set(existingValue);
      const newSet = new Set(newValue);
      const same =
        existingSet.size === newSet.size &&
        [...existingSet].every((v) => newSet.has(v));

      if (!same) {
        conflicts.push({
          entityId,
          wikidataId,
          field,
          canonicalValue: existingValue,
          conflictingValue: newValue,
          sourceDataset,
          conflictingDataset: newDataset,
        });
      }
    } else if (existingValue !== newValue) {
      conflicts.push({
        entityId,
        wikidataId,
        field,
        canonicalValue: existingValue,
        conflictingValue: newValue,
        sourceDataset,
        conflictingDataset: newDataset,
      });
    }
  }

  return conflicts;
}

/**
 * Load nodes for a dataset
 */
async function loadDatasetNodes(
  projectRoot: string,
  datasetId: string
): Promise<GraphNode[]> {
  const nodesPath = join(
    projectRoot,
    'public',
    'datasets',
    datasetId,
    'nodes.json'
  );
  const nodesContent = await readFile(nodesPath, 'utf-8');
  return JSON.parse(nodesContent);
}

/**
 * Extract entities from all datasets
 *
 * Process:
 * 1. Scan datasets in alphabetical order (deterministic)
 * 2. For each node, generate entity UUID
 * 3. Check if entity already exists (via wikidataId lookup)
 * 4. If new: create canonical entity entry
 * 5. If existing: add appearance, detect conflicts
 */
export async function extractEntities(
  projectRoot: string,
  datasetIds: string[]
): Promise<{
  registry: EntityRegistry;
  conflicts: CanonicalConflict[];
}> {
  const registry: EntityRegistry = {
    entities: new Map(),
    byWikidataId: new Map(),
    byDatasetNode: new Map(),
  };

  const conflicts: CanonicalConflict[] = [];

  // Sort datasets alphabetically for deterministic processing
  const sortedDatasets = [...datasetIds].sort();

  for (const datasetId of sortedDatasets) {
    console.log(`Processing dataset: ${datasetId}`);

    // Load nodes for this dataset
    const nodes = await loadDatasetNodes(projectRoot, datasetId);

    for (const node of nodes) {
      // Generate entity UUID
      const entityId = generateEntityUUID(node, datasetId);

      // Create appearance record
      const appearance: EntityAppearance = {
        datasetId,
        originalNodeId: node.id,
        role: 'core', // Default role, can be adjusted later
      };

      // Check if entity already exists (via wikidataId)
      let existingEntityId: string | undefined;

      if (node.wikidataId) {
        existingEntityId = registry.byWikidataId.get(node.wikidataId);
      }

      if (existingEntityId) {
        // Entity already exists - add appearance and check for conflicts
        const existingEntity = registry.entities.get(existingEntityId);

        if (existingEntity) {
          existingEntity.appearances.push(appearance);

          // Detect canonical data conflicts
          const newCanonical = extractCanonicalFields(node);
          const entityConflicts = detectCanonicalConflicts(
            existingEntityId,
            node.wikidataId!,
            existingEntity.canonicalData,
            newCanonical,
            existingEntity.sourceDataset,
            datasetId
          );

          conflicts.push(...entityConflicts);
        }

        // Add dataset:nodeId mapping
        registry.byDatasetNode.set(`${datasetId}:${node.id}`, existingEntityId);
      } else {
        // New entity - create canonical entry
        const canonicalData = extractCanonicalFields(node);

        const canonicalEntity: CanonicalEntity = {
          id: entityId,
          type: node.type,
          sourceDataset: datasetId,
          sourceNodeId: node.id,
          canonicalData,
          appearances: [appearance],
        };

        // Add to registry
        registry.entities.set(entityId, canonicalEntity);

        if (node.wikidataId) {
          registry.byWikidataId.set(node.wikidataId, entityId);
        }

        registry.byDatasetNode.set(`${datasetId}:${node.id}`, entityId);
      }
    }

    console.log(`  Processed ${nodes.length} nodes`);
  }

  console.log(`\nExtraction complete:`);
  console.log(`  Total entities: ${registry.entities.size}`);
  console.log(`  Entities with wikidataId: ${registry.byWikidataId.size}`);
  console.log(`  Dataset-node mappings: ${registry.byDatasetNode.size}`);
  console.log(`  Canonical conflicts detected: ${conflicts.length}`);

  return { registry, conflicts };
}
