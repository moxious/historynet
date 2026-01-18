/**
 * Filter type definitions for HistoryNet
 */

import type { NodeType } from './node';

/**
 * State representing all active filters
 */
export interface FilterState {
  /** Minimum year (no nodes/edges earlier than this) */
  dateStart: number | null;
  /** Maximum year (no nodes/edges later than this) */
  dateEnd: number | null;
  /** Text filter for node titles (case-insensitive substring match) */
  nameFilter: string;
  /** Text filter for edge relationships (case-insensitive substring match) */
  relationshipFilter: string;
  /** Selected node types to display (null = all types selected) */
  nodeTypes: NodeType[] | null;
}

/**
 * Default/empty filter state
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  dateStart: null,
  dateEnd: null,
  nameFilter: '',
  relationshipFilter: '',
  nodeTypes: null, // null means "all types selected"
};

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.dateStart !== null ||
    filters.dateEnd !== null ||
    filters.nameFilter.trim() !== '' ||
    filters.relationshipFilter.trim() !== '' ||
    filters.nodeTypes !== null // explicit type selection = active filter
  );
}

/**
 * Statistics about filtering results
 */
export interface FilterStats {
  /** Total nodes before filtering */
  totalNodes: number;
  /** Nodes after filtering */
  filteredNodes: number;
  /** Total edges before filtering */
  totalEdges: number;
  /** Edges after filtering */
  filteredEdges: number;
}
