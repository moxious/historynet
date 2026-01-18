/**
 * Dataset and manifest type definitions for HistoryNet
 * Based on GRAPH_SCHEMA.md and PRD.md
 */

/**
 * Custom relationship type defined in a dataset manifest
 */
export interface CustomRelationshipType {
  /** The relationship type identifier */
  type: string;
  /** Description of what this relationship means */
  description: string;
  /** Whether the relationship is directional */
  directed: boolean;
}

/**
 * Dataset manifest containing metadata about a dataset
 */
export interface DatasetManifest {
  /** Unique identifier for the dataset */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description of the dataset contents */
  description: string;
  /** Last update date (ISO 8601) */
  lastUpdated: string;
  /** Version string */
  version?: string;
  /** Author or contributor information */
  author?: string;
  /** License information */
  license?: string;
  /** Whether this is the default dataset to load */
  defaultDataset?: boolean;
  /** Number of nodes in the dataset */
  nodeCount?: number;
  /** Number of edges in the dataset */
  edgeCount?: number;
  /** Custom relationship types used in this dataset */
  customRelationshipTypes?: CustomRelationshipType[];
}

/**
 * Summary of available datasets for the selector
 */
export interface DatasetSummary {
  /** Dataset ID */
  id: string;
  /** Display name */
  name: string;
  /** Brief description */
  description: string;
  /** Whether this is the default dataset */
  isDefault: boolean;
}

/**
 * Configuration for available datasets
 * This could be loaded from a config file or generated at build time
 */
export interface DatasetsConfig {
  /** List of available dataset IDs */
  datasets: string[];
  /** Default dataset ID to load */
  defaultDataset: string;
}
