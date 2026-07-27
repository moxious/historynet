/**
 * Phase 2: Create members.json files for each dataset
 * MI-22 to MI-25: Generate member references with entity UUIDs and overrides
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { GraphNode } from '../../../src/types/node.js';
import type {
  EntityRegistry,
  MembersFile,
  MemberReference,
  OverrideFields,
  CanonicalFields,
} from '../types.js';

/**
 * Extract override fields from a node (fields that differ from canonical)
 */
function extractOverrideFields(
  node: GraphNode,
  canonicalData: CanonicalFields
): OverrideFields {
  const overrides: OverrideFields = {};

  // Check all non-canonical fields
  const allFields = Object.keys(node) as (keyof GraphNode)[];

  // Canonical field names to exclude
  const canonicalFieldNames = new Set([
    'id',
    'type',
    'wikidataId',
    'wikipediaTitle',
    'title',
    'dateStart',
    'dateEnd',
    'alternateNames',
    'birthPlace',
    'deathPlace',
    'nationality',
    'occupations',
    'externalLinks',
  ]);

  for (const field of allFields) {
    if (!canonicalFieldNames.has(field)) {
      const value = node[field];
      if (value !== undefined) {
        overrides[field] = value;
      }
    }
  }

  // Also check if canonical fields have dataset-specific overrides
  // (e.g., different shortDescription per dataset)
  if (node.shortDescription !== undefined) {
    overrides.shortDescription = node.shortDescription;
  }

  if (node.imageUrl !== undefined) {
    overrides.imageUrl = node.imageUrl;
  }

  // Only return overrides if there are any
  return Object.keys(overrides).length > 0 ? overrides : {};
}

/**
 * Create members.json for a dataset
 */
async function createMembersFile(
  projectRoot: string,
  datasetId: string,
  registry: EntityRegistry,
  dryRun: boolean,
  outputDir: string
): Promise<MemberReference[]> {
  // Load nodes for this dataset
  const nodesPath = join(
    projectRoot,
    'public',
    'datasets',
    datasetId,
    'nodes.json'
  );
  const nodesContent = await readFile(nodesPath, 'utf-8');
  const nodes: GraphNode[] = JSON.parse(nodesContent);

  const members: MemberReference[] = [];

  for (const node of nodes) {
    // Look up entity UUID
    const lookupKey = `${datasetId}:${node.id}`;
    const entityId = registry.byDatasetNode.get(lookupKey);

    if (!entityId) {
      throw new Error(
        `Entity not found in registry for ${lookupKey}. This should not happen.`
      );
    }

    // Get canonical data
    const entity = registry.entities.get(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found in registry`);
    }

    // Extract overrides
    const overrides = extractOverrideFields(node, entity.canonicalData);

    // Create member reference
    const member: MemberReference = {
      entityId,
      role: 'core', // Default role
    };

    if (Object.keys(overrides).length > 0) {
      member.overrides = overrides;
    }

    members.push(member);
  }

  // Write members.json
  const membersFile: MembersFile = { members };

  const targetPath = dryRun
    ? join(outputDir, 'datasets', datasetId, 'members.json')
    : join(projectRoot, 'public', 'datasets', datasetId, 'members.json');

  // Ensure directory exists (for dry run)
  if (dryRun) {
    await mkdir(join(outputDir, 'datasets', datasetId), { recursive: true });
  }

  await writeFile(targetPath, JSON.stringify(membersFile, null, 2), 'utf-8');

  return members;
}

/**
 * Create members.json files for all datasets
 */
export async function createMembers(
  projectRoot: string,
  datasetIds: string[],
  registry: EntityRegistry,
  dryRun: boolean,
  outputDir: string
): Promise<void> {
  console.log('\n=== Phase 2: Creating members.json files ===\n');

  for (const datasetId of datasetIds) {
    console.log(`Creating members.json for ${datasetId}...`);

    const members = await createMembersFile(
      projectRoot,
      datasetId,
      registry,
      dryRun,
      outputDir
    );

    console.log(`  Created ${members.length} member references`);

    // Count members with overrides
    const withOverrides = members.filter((m) => m.overrides).length;
    if (withOverrides > 0) {
      console.log(`  ${withOverrides} members have overrides`);
    }
  }

  console.log('\nMembers files created successfully');
}
