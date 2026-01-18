/**
 * Edge type definitions for HistoryNet
 * Based on GRAPH_SCHEMA.md
 */

/** Qualitative strength of a relationship */
export type RelationshipStrength = 'strong' | 'moderate' | 'weak' | 'speculative';

/**
 * Standard relationship types
 * The schema is extensible - additional types can be used
 */
export type StandardRelationship =
  // Person ↔ Person
  | 'influenced'
  | 'influenced_by'
  | 'collaborated_with'
  | 'taught'
  | 'studied_under'
  | 'corresponded_with'
  | 'knows'
  | 'related_to'
  | 'opposed'
  | 'succeeded'
  // Person ↔ Object
  | 'authored'
  | 'translated'
  | 'edited'
  | 'referenced_in'
  | 'inspired_by'
  // Person ↔ Location
  | 'born_in'
  | 'died_in'
  | 'lived_in'
  | 'worked_at'
  | 'visited'
  // Person ↔ Entity
  | 'founded'
  | 'member_of'
  | 'led'
  | 'associated_with'
  // Object ↔ Object
  | 'references'
  | 'responds_to'
  | 'continuation_of';

/**
 * Edge interface representing relationships between nodes
 */
export interface GraphEdge {
  /** Unique identifier for the edge */
  id: string;
  /** Node ID of the source/origin node */
  source: string;
  /** Node ID of the target/destination node */
  target: string;
  /** Type of relationship */
  relationship: StandardRelationship | string;
  /** Human-readable label for display (defaults to relationship type) */
  label?: string;
  /** When the relationship began */
  dateStart?: string;
  /** When the relationship ended */
  dateEnd?: string;
  /** Description of evidence for this relationship */
  evidence?: string;
  /** Reference to an object node that serves as evidence */
  evidenceNodeId?: string;
  /** URL to external evidence/source */
  evidenceUrl?: string;
  /** Whether the relationship is directional */
  directed?: boolean;
  /** Qualitative strength of the relationship */
  strength?: RelationshipStrength;
  /** Allow any additional custom properties */
  [key: string]: unknown;
}

/**
 * Check if an edge has evidence (at least one form)
 */
export function hasEvidence(edge: GraphEdge): boolean {
  return !!(edge.evidence || edge.evidenceNodeId || edge.evidenceUrl);
}

/**
 * Get the display label for an edge
 * Falls back to relationship type if no label provided
 */
export function getEdgeLabel(edge: GraphEdge): string {
  if (edge.label) {
    return edge.label;
  }
  // Convert relationship type to title case
  return edge.relationship
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
