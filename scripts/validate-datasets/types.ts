/**
 * Types and interfaces for dataset validation
 * Build-time only - not shipped to production bundle
 */

/**
 * Severity level for validation messages
 */
export type Severity = 'error' | 'warning';

/**
 * A single validation issue found during validation
 */
export interface ValidationIssue {
  /** The severity level */
  severity: Severity;
  /** The file where the issue was found */
  file: string;
  /** Human-readable description of the issue */
  message: string;
  /** Optional path within the JSON (e.g., "nodes[5].id") */
  path?: string;
  /** Optional line number if available */
  line?: number;
  /** Rule code that was violated (e.g., "MISSING_REQUIRED_FIELD") */
  code: ValidationCode;
}

/**
 * Validation codes for categorizing issues
 */
export type ValidationCode =
  // JSON syntax errors
  | 'JSON_PARSE_ERROR'
  | 'INVALID_ENCODING'
  // Manifest errors
  | 'MISSING_MANIFEST'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_FIELD_TYPE'
  | 'MANIFEST_ID_MISMATCH'
  // Node errors
  | 'MISSING_NODES_FILE'
  | 'INVALID_NODE_TYPE'
  | 'DUPLICATE_NODE_ID'
  | 'INVALID_DATE_FORMAT'
  | 'INVALID_URL_FORMAT'
  | 'NON_STANDARD_ID_FORMAT'
  // Edge errors
  | 'MISSING_EDGES_FILE'
  | 'DUPLICATE_EDGE_ID'
  | 'INVALID_RELATIONSHIP_TYPE'
  // Cross-reference errors
  | 'BROKEN_REFERENCE'
  | 'ORPHAN_NODE'
  | 'INVALID_EVIDENCE_NODE_ID'
  // Warnings
  | 'MISSING_RECOMMENDED_FIELD'
  | 'MISSING_EVIDENCE';

/**
 * Result of validating a single dataset
 */
export interface DatasetValidationResult {
  /** Dataset ID (directory name) */
  datasetId: string;
  /** Whether validation passed (no errors) */
  valid: boolean;
  /** All issues found */
  issues: ValidationIssue[];
  /** Count of nodes validated */
  nodeCount: number;
  /** Count of edges validated */
  edgeCount: number;
  /** Whether validation was aborted due to critical error */
  aborted: boolean;
}

/**
 * Overall validation result across all datasets
 */
export interface ValidationResult {
  /** Results for each dataset */
  datasets: DatasetValidationResult[];
  /** Total number of datasets checked */
  totalDatasets: number;
  /** Number of datasets that passed */
  passedDatasets: number;
  /** Number of datasets that failed */
  failedDatasets: number;
  /** Total errors across all datasets */
  totalErrors: number;
  /** Total warnings across all datasets */
  totalWarnings: number;
  /** Overall pass/fail */
  success: boolean;
}

/**
 * CLI options parsed from command line arguments
 */
export interface CLIOptions {
  /** Treat warnings as errors */
  strict: boolean;
  /** Only validate a specific dataset */
  dataset?: string;
  /** Only output errors and final summary */
  quiet: boolean;
  /** Output results as JSON */
  json: boolean;
}

/**
 * Manifest schema (matches src/types/dataset.ts but duplicated to avoid runtime imports)
 */
export interface DatasetManifest {
  id: string;
  name: string;
  description?: string;
  lastUpdated?: string;
  version?: string;
  author?: string;
  license?: string;
  defaultDataset?: boolean;
  nodeCount?: number;
  edgeCount?: number;
  customRelationshipTypes?: CustomRelationshipType[];
}

export interface CustomRelationshipType {
  type: string;
  description: string;
  directed: boolean;
}

/**
 * Node types (duplicated from src/types to keep validation standalone)
 */
export type NodeType = 'person' | 'object' | 'location' | 'entity';

export interface ExternalLink {
  label: string;
  url: string;
}

export interface GraphNode {
  id: string;
  type: NodeType;
  title: string;
  shortDescription?: string;
  dateStart?: string;
  dateEnd?: string;
  imageUrl?: string;
  externalLinks?: ExternalLink[];
  [key: string]: unknown;
}

/**
 * Edge schema (duplicated from src/types)
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  label?: string;
  dateStart?: string;
  dateEnd?: string;
  evidence?: string;
  evidenceNodeId?: string;
  evidenceUrl?: string;
  directed?: boolean;
  strength?: string;
  [key: string]: unknown;
}

/**
 * Standard relationship types for validation
 */
export const STANDARD_RELATIONSHIP_TYPES = [
  // Person ↔ Person
  'influenced',
  'influenced_by',
  'collaborated_with',
  'taught',
  'studied_under',
  'corresponded_with',
  'knows',
  'related_to',
  'opposed',
  'succeeded',
  // Person ↔ Object
  'authored',
  'translated',
  'edited',
  'referenced_in',
  'inspired_by',
  // Person ↔ Location
  'born_in',
  'died_in',
  'lived_in',
  'worked_at',
  'visited',
  // Person ↔ Entity
  'founded',
  'member_of',
  'led',
  'associated_with',
  // Object ↔ Object
  'references',
  'responds_to',
  'continuation_of',
] as const;

export type StandardRelationship = (typeof STANDARD_RELATIONSHIP_TYPES)[number];

/**
 * Valid node types
 */
export const VALID_NODE_TYPES: NodeType[] = [
  'person',
  'object',
  'location',
  'entity',
];
