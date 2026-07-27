/**
 * UUID generation for entity IDs
 * MI-19: Generate deterministic UUID v5 for entities
 * MI-21: UUID format: hn-{type}-{uuid}
 */

import { v5 as uuidv5, v5 as uuidV5DNS } from 'uuid';
import type { GraphNode } from '../../src/types/node.js';

/**
 * HistoryNet namespace for UUID v5 generation
 * Generated from "historynet.app" using DNS namespace
 */
export const HISTORYNET_NAMESPACE = uuidv5('historynet.app', uuidV5DNS.DNS);

/**
 * Generate entity UUID for a node
 *
 * Strategy:
 * - With wikidataId: UUID based on wikidataId (enables cross-dataset merging)
 * - Without wikidataId: UUID based on datasetId:nodeId (dataset-specific entity)
 *
 * @param node - The graph node to generate UUID for
 * @param datasetId - The dataset ID this node belongs to
 * @returns Entity UUID in format hn-{type}-{uuid}
 */
export function generateEntityUUID(node: GraphNode, datasetId: string): string {
  // Determine the seed for UUID generation
  const seed = node.wikidataId || `${datasetId}:${node.id}`;

  // Generate UUID v5 from seed
  const uuid = uuidv5(seed, HISTORYNET_NAMESPACE);

  // Format as hn-{type}-{uuid}
  return `hn-${node.type}-${uuid}`;
}

/**
 * Check if an entity UUID is valid
 * Must match format: hn-{type}-{uuid}
 */
export function isValidEntityUUID(entityId: string): boolean {
  const pattern = /^hn-(person|object|location|entity)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return pattern.test(entityId);
}

/**
 * Extract type from entity UUID
 */
export function getTypeFromEntityUUID(
  entityId: string
): 'person' | 'object' | 'location' | 'entity' | null {
  const match = entityId.match(/^hn-(person|object|location|entity)-/);
  if (!match) return null;
  return match[1] as 'person' | 'object' | 'location' | 'entity';
}

/**
 * Test UUID generation consistency
 * For debugging/validation purposes
 */
export function testUUIDGeneration(): void {
  // Test with wikidataId (should be consistent across datasets)
  const voltaire1 = {
    id: 'person-voltaire',
    type: 'person' as const,
    title: 'Voltaire',
    wikidataId: 'Q9338',
  };

  const voltaire2 = {
    id: 'voltaire',
    type: 'person' as const,
    title: 'François-Marie Arouet',
    wikidataId: 'Q9338',
  };

  const uuid1 = generateEntityUUID(voltaire1, 'enlightenment');
  const uuid2 = generateEntityUUID(voltaire2, 'florentine-academy');

  console.log('Test 1: Same wikidataId across datasets');
  console.log(`  UUID1: ${uuid1}`);
  console.log(`  UUID2: ${uuid2}`);
  console.log(`  Match: ${uuid1 === uuid2}`);

  // Test without wikidataId (should be dataset-specific)
  const unknownPerson1 = {
    id: 'person-unknown',
    type: 'person' as const,
    title: 'Unknown Person',
  };

  const unknownPerson2 = {
    id: 'person-unknown',
    type: 'person' as const,
    title: 'Unknown Person',
  };

  const uuid3 = generateEntityUUID(unknownPerson1, 'dataset-a');
  const uuid4 = generateEntityUUID(unknownPerson2, 'dataset-b');

  console.log('\nTest 2: Same nodeId without wikidataId across datasets');
  console.log(`  UUID3: ${uuid3}`);
  console.log(`  UUID4: ${uuid4}`);
  console.log(`  Match: ${uuid3 === uuid4}`);

  // Test UUID validation
  console.log('\nTest 3: UUID validation');
  console.log(`  ${uuid1} valid: ${isValidEntityUUID(uuid1)}`);
  console.log(`  "invalid-uuid" valid: ${isValidEntityUUID('invalid-uuid')}`);

  // Test type extraction
  console.log('\nTest 4: Type extraction');
  console.log(`  Type from ${uuid1}: ${getTypeFromEntityUUID(uuid1)}`);
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testUUIDGeneration();
}
