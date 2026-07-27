/**
 * Types for the Wikidata ID verification / remediation tool.
 * Build-time only - not shipped to production bundle.
 */

export type NodeType = 'person' | 'object' | 'location' | 'entity';

export interface GraphNode {
  id: string;
  type: NodeType;
  title: string;
  wikipediaTitle?: string | null;
  wikidataId?: string | null;
  [key: string]: unknown;
}

/** A candidate entity considered during re-resolution. */
export interface Candidate {
  wikidataId: string;
  label: string;
  description?: string;
}

/** What happened to one node during verification / --fix. */
export interface NodeVerdict {
  nodeId: string;
  title: string;
  type: NodeType;
  status:
    | 'ok' // existing id verified - matches the node
    | 'no-id' // node had no wikidataId to check
    | 'unverifiable' // entity has no usable English name to compare
    | 'restored' // wrong id replaced with a confident re-resolved id
    | 'cleared' // wrong id removed; no confident replacement found
    | 'wrong'; // wrong id detected (report mode, not fixed)
  /** The (bad) id that was on the node, when status is wrong/cleared/restored. */
  previousId?: string;
  /** What the previous id actually resolved to (an unrelated entity's label). */
  resolvedTo?: string;
  /** The confidently re-resolved id, when status is 'restored'. */
  newId?: string;
  newWikipediaTitle?: string;
  /** Candidates recorded when a node is cleared for later disambiguation. */
  candidates?: Candidate[];
}

export interface CLIOptions {
  dataset?: string;
  /** Apply fixes (clear wrong ids, restore confident matches). Default: report. */
  fix: boolean;
  /** Also clear unverifiable ids that can't be re-resolved (default: leave). */
  clearUnverifiable: boolean;
  quiet: boolean;
  json: boolean;
}

export interface DatasetVerifySummary {
  datasetId: string;
  totalNodes: number;
  checked: number; // nodes that had an id to verify
  ok: number;
  wrong: number;
  restored: number;
  cleared: number;
  unverifiable: number;
  verdicts: NodeVerdict[];
}
