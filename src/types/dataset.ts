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
 * Dataset scope information
 */
export interface DatasetScope {
  /** Start year of the dataset's temporal coverage */
  startYear: number;
  /** End year of the dataset's temporal coverage */
  endYear: number;
  /** Geographic regions covered */
  regions?: string[];
  /** Themes covered in the dataset */
  themes?: string[];
  /** Seed figures that anchor the network */
  seedFigures?: string[];
  /** Subgroups within the network */
  subgroups?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  /** Notes on exclusions */
  exclusionNotes?: string;
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
  /** Emoji to display as banner on dataset overview page */
  bannerEmoji?: string;
  /** Path to banner image (relative to public/, e.g., "img/banners/enlightenment.jpg") */
  bannerImage?: string;
  /** Structured scope information */
  scope?: DatasetScope;
  /** Legacy temporal scope string (e.g., "2012-2025") */
  temporalScope?: string;
  /** Geographic scope description */
  geographicScope?: string;
  /** Additional notes about the dataset */
  notes?: string;
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
