/**
 * Registry builder - Creates entity files and type registries
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { NodeType } from '../../src/types/node.js';
import type {
  EntityRegistry,
  CanonicalEntity,
  TypeRegistry,
  RegistryEntry,
} from './types.js';

/**
 * Get plural form of entity type for directory names
 */
function getPluralType(type: NodeType): string {
  const plurals: Record<NodeType, string> = {
    person: 'persons',
    object: 'objects',
    location: 'locations',
    entity: 'entities',
  };
  return plurals[type];
}

/**
 * Write canonical entity files to entities/{type}/{uuid}.json
 */
export async function writeEntityFiles(
  projectRoot: string,
  registry: EntityRegistry,
  dryRun: boolean,
  outputDir: string
): Promise<void> {
  console.log('\n=== Writing entity files ===\n');

  const baseDir = dryRun ? outputDir : projectRoot;

  // Group entities by type
  const entitiesByType = new Map<NodeType, CanonicalEntity[]>();

  for (const entity of registry.entities.values()) {
    if (!entitiesByType.has(entity.type)) {
      entitiesByType.set(entity.type, []);
    }
    entitiesByType.get(entity.type)!.push(entity);
  }

  // Write entity files for each type
  for (const [type, entities] of entitiesByType.entries()) {
    const pluralType = getPluralType(type);
    const typeDir = join(baseDir, 'entities', pluralType);

    // Create directory
    await mkdir(typeDir, { recursive: true });

    console.log(`Writing ${entities.length} ${pluralType}...`);

    for (const entity of entities) {
      // Extract UUID from entity ID (e.g., hn-person-{uuid})
      const uuid = entity.id.split('-').slice(2).join('-');
      const filename = `hn-${type}-${uuid}.json`;
      const filepath = join(typeDir, filename);

      // Write entity file (only canonical data, not appearances)
      const entityFile = {
        id: entity.id,
        type: entity.type,
        ...entity.canonicalData,
      };

      await writeFile(filepath, JSON.stringify(entityFile, null, 2), 'utf-8');
    }

    console.log(`  Wrote ${entities.length} files to ${typeDir}`);
  }
}

/**
 * Build and write type-specific registry files
 */
export async function writeRegistryFiles(
  projectRoot: string,
  registry: EntityRegistry,
  dryRun: boolean,
  outputDir: string
): Promise<void> {
  console.log('\n=== Writing registry files ===\n');

  const baseDir = dryRun ? outputDir : projectRoot;

  // Group entities by type
  const entitiesByType = new Map<NodeType, CanonicalEntity[]>();

  for (const entity of registry.entities.values()) {
    if (!entitiesByType.has(entity.type)) {
      entitiesByType.set(entity.type, []);
    }
    entitiesByType.get(entity.type)!.push(entity);
  }

  // Write registry for each type
  for (const [type, entities] of entitiesByType.entries()) {
    const pluralType = getPluralType(type);
    const registryDir = join(baseDir, 'entities', pluralType);

    // Create registry entries
    const entries: RegistryEntry[] = entities.map((entity) => ({
      id: entity.id,
      wikidataId: entity.canonicalData.wikidataId,
      canonicalTitle: entity.canonicalData.title,
      appearances: entity.appearances.length,
      datasets: entity.appearances.map((a) => a.datasetId),
    }));

    // Sort by title for readability
    entries.sort((a, b) => a.canonicalTitle.localeCompare(b.canonicalTitle));

    const typeRegistry: TypeRegistry = {
      type,
      totalEntities: entities.length,
      entries,
    };

    const registryPath = join(registryDir, 'registry.json');
    await writeFile(
      registryPath,
      JSON.stringify(typeRegistry, null, 2),
      'utf-8'
    );

    console.log(`Wrote registry for ${pluralType}: ${entries.length} entries`);
  }
}
