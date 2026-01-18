/**
 * Filter type definitions for HistoryNet
 */

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
}

/**
 * Default/empty filter state
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  dateStart: null,
  dateEnd: null,
  nameFilter: '',
  relationshipFilter: '',
};

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.dateStart !== null ||
    filters.dateEnd !== null ||
    filters.nameFilter.trim() !== '' ||
    filters.relationshipFilter.trim() !== ''
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
