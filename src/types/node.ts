/**
 * Node type definitions for HistoryNet
 * Based on GRAPH_SCHEMA.md - POLE model (Persons, Objects, Locations, Entities)
 */

/** The four node types in the POLE model */
export type NodeType = 'person' | 'object' | 'location' | 'entity';

/** External link with label and URL */
export interface ExternalLink {
  label: string;
  url: string;
}

/**
 * Base node interface with fields common to all node types
 */
export interface BaseNode {
  /** Unique identifier (e.g., "person-aristotle", "loc-athens") */
  id: string;
  /** Node type: person, object, location, or entity */
  type: NodeType;
  /** Display name/title */
  title: string;
  /** Brief description (1-2 sentences) */
  shortDescription?: string;
  /** Start date of relevance (ISO 8601 or year) */
  dateStart?: string;
  /** End date of relevance (ISO 8601 or year) */
  dateEnd?: string;
  /** URL to an image representing the node */
  imageUrl?: string;
  /** Array of external resource links */
  externalLinks?: ExternalLink[];
  /** Allow any additional custom properties */
  [key: string]: unknown;
}

/**
 * Person node - represents historical individuals
 */
export interface PersonNode extends BaseNode {
  type: 'person';
  /** Alternate names, spellings, or pseudonyms */
  alternateNames?: string[];
  /** Place of birth (text or location node ID) */
  birthPlace?: string;
  /** Place of death (text or location node ID) */
  deathPlace?: string;
  /** Nationality or primary cultural affiliation */
  nationality?: string;
  /** Array of occupations/roles */
  occupations?: string[];
  /** Longer biographical text */
  biography?: string;
}

/**
 * Object node - represents created artifacts (books, manuscripts, etc.)
 */
export interface ObjectNode extends BaseNode {
  type: 'object';
  /** Type of object: "book", "manuscript", "letter", "artwork", etc. */
  objectType?: string;
  /** Array of creator node IDs or names */
  creators?: string[];
  /** When the object was created */
  dateCreated?: string;
  /** Primary language of the object */
  language?: string;
  /** Subject matter or topic */
  subject?: string;
}

/**
 * Location node - represents physical places
 */
export interface LocationNode extends BaseNode {
  type: 'location';
  /** Type: "city", "university", "salon", "academy", etc. */
  locationType?: string;
  /** Geographic coordinates */
  coordinates?: {
    lat: number;
    lng: number;
  };
  /** Country or region */
  country?: string;
  /** Reference to parent location node ID */
  parentLocation?: string;
}

/**
 * Entity node - represents organizations and movements
 */
export interface EntityNode extends BaseNode {
  type: 'entity';
  /** Type: "organization", "movement", "school_of_thought", etc. */
  entityType?: string;
  /** Array of founder node IDs */
  foundedBy?: string[];
  /** Reference to location node ID */
  headquarters?: string;
  /** Array of member node IDs */
  members?: string[];
}

/**
 * Union type of all node types
 */
export type GraphNode = PersonNode | ObjectNode | LocationNode | EntityNode;

/**
 * Type guard to check if a node is a PersonNode
 */
export function isPersonNode(node: GraphNode): node is PersonNode {
  return node.type === 'person';
}

/**
 * Type guard to check if a node is an ObjectNode
 */
export function isObjectNode(node: GraphNode): node is ObjectNode {
  return node.type === 'object';
}

/**
 * Type guard to check if a node is a LocationNode
 */
export function isLocationNode(node: GraphNode): node is LocationNode {
  return node.type === 'location';
}

/**
 * Type guard to check if a node is an EntityNode
 */
export function isEntityNode(node: GraphNode): node is EntityNode {
  return node.type === 'entity';
}
