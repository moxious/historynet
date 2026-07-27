/**
 * Type definitions for atomic entity migration
 */

import type { GraphNode } from '../../src/types/node.js';
import type { NodeType } from '../../src/types/node.js';

/**
 * Canonical fields that are shared across all appearances of an entity
 * These come from the first dataset appearance and are stored in entities/{type}/{uuid}.json
 */
export type CanonicalFields = Pick<
  GraphNode,
  | 'wikidataId'
  | 'wikipediaTitle'
  | 'title'
  | 'dateStart'
  | 'dateEnd'
  | 'alternateNames'
  | 'birthPlace'
  | 'deathPlace'
  | 'nationality'
  | 'occupations'
  | 'externalLinks'
>;

/**
 * Override fields that can differ per dataset
 * These are stored in members.json for each dataset
 */
export type OverrideFields = Partial<
  Omit<GraphNode, 'id' | 'type' | keyof CanonicalFields>
>;

/**
 * Appearance of an entity in a dataset
 */
export interface EntityAppearance {
  /** Dataset ID where this entity appears */
  datasetId: string;
  /** Original node ID in that dataset */
  originalNodeId: string;
  /** Role in the dataset */
  role: 'core' | 'supporting' | 'peripheral';
  /** Any overrides specific to this appearance */
  overrides?: OverrideFields;
}

/**
 * Canonical entity definition
 * Stored in entities/{type}/{uuid}.json
 */
export interface CanonicalEntity {
  /** Entity UUID (e.g., hn-person-{uuid}) */
  id: string;
  /** Entity type */
  type: NodeType;
  /** First dataset that defined this entity */
  sourceDataset: string;
  /** Original node ID in source dataset */
  sourceNodeId: string;
  /** Canonical data (from first appearance) */
  canonicalData: CanonicalFields;
  /** All appearances of this entity across datasets */
  appearances: EntityAppearance[];
}

/**
 * Entity registry for tracking all entities during migration
 */
export interface EntityRegistry {
  /** All entities by their UUID */
  entities: Map<string, CanonicalEntity>;
  /** Lookup by wikidataId */
  byWikidataId: Map<string, string>; // wikidataId → entityId
  /** Lookup by dataset:nodeId */
  byDatasetNode: Map<string, string>; // "datasetId:nodeId" → entityId
}

/**
 * Member reference in a dataset's members.json
 */
export interface MemberReference {
  /** Entity UUID */
  entityId: string;
  /** Role in this dataset */
  role: 'core' | 'supporting' | 'peripheral';
  /** Dataset-specific overrides */
  overrides?: OverrideFields;
}

/**
 * Members file structure for each dataset
 */
export interface MembersFile {
  /** Members of this dataset */
  members: MemberReference[];
}

/**
 * Registry entry for a type-specific registry file
 */
export interface RegistryEntry {
  /** Entity UUID */
  id: string;
  /** Wikidata ID if available */
  wikidataId?: string;
  /** Canonical title */
  canonicalTitle: string;
  /** Number of datasets this entity appears in */
  appearances: number;
  /** Dataset IDs where this entity appears */
  datasets: string[];
}

/**
 * Type-specific registry file (e.g., persons/registry.json)
 */
export interface TypeRegistry {
  /** Type of entities in this registry */
  type: NodeType;
  /** Total number of entities */
  totalEntities: number;
  /** Entities in this type */
  entries: RegistryEntry[];
}

/**
 * Canonical data conflict
 */
export interface CanonicalConflict {
  /** Entity UUID */
  entityId: string;
  /** Wikidata ID that caused the conflict */
  wikidataId: string;
  /** Field that has conflicting values */
  field: string;
  /** Canonical value (from first dataset) */
  canonicalValue: unknown;
  /** Conflicting value (from later dataset) */
  conflictingValue: unknown;
  /** Source dataset (provides canonical) */
  sourceDataset: string;
  /** Conflicting dataset */
  conflictingDataset: string;
}

/**
 * Migration statistics and report
 */
export interface MigrationReport {
  /** Timestamp of migration */
  timestamp: string;
  /** Total entities extracted */
  totalEntities: number;
  /** Entities by type */
  entitiesByType: Record<NodeType, number>;
  /** Cross-dataset entities (appear in multiple datasets) */
  crossDatasetEntities: number;
  /** Dataset-specific entities (no wikidataId) */
  datasetSpecificEntities: number;
  /** Total canonical data conflicts detected */
  totalConflicts: number;
  /** Conflicts by field */
  conflictsByField: Record<string, number>;
  /** Detailed conflicts for review */
  conflicts: CanonicalConflict[];
  /** UUID mapping (old nodeId → new entityId) by dataset */
  uuidMappings: Record<string, Record<string, string>>;
  /** Datasets processed */
  datasetsProcessed: string[];
  /** Total edges updated */
  totalEdgesUpdated: number;
}

/**
 * CLI options for migration script
 */
export interface MigrationCLIOptions {
  /** Dry run (output to migration-output/ instead of overwriting) */
  dryRun: boolean;
  /** Specific dataset to migrate (for testing) */
  dataset?: string;
  /** Quiet mode (minimal output) */
  quiet: boolean;
  /** Output directory for dry run */
  outputDir: string;
}
