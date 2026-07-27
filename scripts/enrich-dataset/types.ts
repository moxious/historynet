/**
 * Types for the dataset enrichment tool.
 * Build-time only - not shipped to production bundle.
 */

/** Node types (duplicated from src/types to keep the script standalone) */
export type NodeType = 'person' | 'object' | 'location' | 'entity';

/**
 * A dataset node. Only the fields enrich cares about are typed explicitly;
 * everything else is preserved verbatim via the index signature.
 */
export interface GraphNode {
  id: string;
  type: NodeType;
  title: string;
  shortDescription?: string;
  dateStart?: string;
  dateEnd?: string;
  biography?: string;
  occupations?: string[];
  birthPlace?: string;
  nationality?: string;
  wikipediaTitle?: string;
  wikidataId?: string;
  [key: string]: unknown;
}

/** Fields enrich is allowed to fill. Never touches title/type/id/biography. */
export type EnrichableField =
  | 'wikidataId'
  | 'wikipediaTitle'
  | 'dateStart'
  | 'dateEnd'
  | 'shortDescription'
  | 'birthPlace'
  | 'nationality'
  | 'occupations';

export const ENRICHABLE_FIELDS: EnrichableField[] = [
  'wikidataId',
  'wikipediaTitle',
  'dateStart',
  'dateEnd',
  'shortDescription',
  'birthPlace',
  'nationality',
  'occupations',
];

/** Canonical data resolved from Wikidata/Wikipedia for a single entity. */
export interface ResolvedFacts {
  wikidataId?: string;
  wikipediaTitle?: string;
  dateStart?: string;
  dateEnd?: string;
  shortDescription?: string;
  birthPlace?: string;
  nationality?: string;
  occupations?: string[];
}

/** A candidate match returned by a Wikidata search (for ambiguity reports). */
export interface MatchCandidate {
  wikidataId: string;
  label: string;
  description?: string;
}

/** Outcome of attempting to enrich a single node. */
export interface NodeEnrichmentResult {
  nodeId: string;
  title: string;
  type: NodeType;
  /** How the node was matched to a Wikidata entity. */
  status:
    | 'enriched' // fields were filled (or would be, in dry-run)
    | 'complete' // already had every requested field, nothing to do
    | 'ambiguous' // multiple candidates - quarantined for human review
    | 'not-found' // no Wikidata match at all
    | 'type-mismatch' // best match's instance-of contradicts node.type
    | 'error'; // API/network failure
  /** Fields that were filled, with their resolved values. */
  filled: Partial<Record<EnrichableField, string | string[]>>;
  /** Candidates recorded when status is 'ambiguous'. */
  candidates?: MatchCandidate[];
  /** Human-readable note (e.g. reason for not-found / type-mismatch / error). */
  note?: string;
}

/** An entry written to <dataset>/enrich-ambiguous.json for later disambiguation. */
export interface AmbiguousEntry {
  nodeId: string;
  title: string;
  type: NodeType;
  reason: 'multiple-candidates' | 'type-mismatch' | 'not-found';
  note?: string;
  candidates: MatchCandidate[];
}

/** CLI options parsed from argv. */
export interface CLIOptions {
  /** Restrict to a single dataset (directory name). Otherwise all datasets. */
  dataset?: string;
  /** Report what would change without writing files. */
  dryRun: boolean;
  /** Only fill these fields (subset of ENRICHABLE_FIELDS). Default: all. */
  fields: EnrichableField[];
  /** Suppress per-node progress lines; show only the summary. */
  quiet: boolean;
  /** Output the run summary as JSON (for CI / tooling). */
  json: boolean;
}

/** Summary of an enrichment run over one dataset. */
export interface DatasetEnrichmentSummary {
  datasetId: string;
  totalNodes: number;
  enriched: number;
  complete: number;
  ambiguous: number;
  notFound: number;
  typeMismatch: number;
  errors: number;
  /** Total number of individual fields filled across all nodes. */
  fieldsFilled: number;
  results: NodeEnrichmentResult[];
}
