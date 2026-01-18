/**
 * Hook for managing graph filter state
 * Syncs with URL parameters via useUrlState
 */

import { useCallback, useMemo } from 'react';
import type { FilterState, FilterStats, GraphData } from '@types';
import { hasActiveFilters as checkHasActiveFilters } from '@types';
import { filterGraphData, getFilterStats, getGraphDateRange } from '@utils';
import { useUrlState } from './useUrlState';

interface UseFiltersReturn {
  /** Current filter state */
  filters: FilterState;
  /** Whether any filters are active */
  hasActiveFilters: boolean;
  /** Set the "no earlier than" date filter */
  setDateStart: (year: number | null) => void;
  /** Set the "no later than" date filter */
  setDateEnd: (year: number | null) => void;
  /** Set the name filter */
  setNameFilter: (filter: string) => void;
  /** Set the relationship filter */
  setRelationshipFilter: (filter: string) => void;
  /** Update multiple filters at once */
  setFilters: (filters: Partial<FilterState>) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Apply filters to graph data and return filtered data */
  applyFilters: (data: GraphData) => GraphData;
  /** Get filter statistics for a given data set */
  getStats: (originalData: GraphData, filteredData: GraphData) => FilterStats;
  /** Get the date range available in the data */
  getDateRange: (data: GraphData) => { minYear: number | null; maxYear: number | null };
}

/**
 * Hook for managing filter state with URL synchronization
 */
export function useFilters(): UseFiltersReturn {
  const { filters, setFilters: setUrlFilters, clearFilters: clearUrlFilters } = useUrlState();

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => checkHasActiveFilters(filters), [filters]);

  // Individual filter setters
  const setDateStart = useCallback(
    (year: number | null) => {
      setUrlFilters({ dateStart: year });
    },
    [setUrlFilters]
  );

  const setDateEnd = useCallback(
    (year: number | null) => {
      setUrlFilters({ dateEnd: year });
    },
    [setUrlFilters]
  );

  const setNameFilter = useCallback(
    (filter: string) => {
      setUrlFilters({ nameFilter: filter });
    },
    [setUrlFilters]
  );

  const setRelationshipFilter = useCallback(
    (filter: string) => {
      setUrlFilters({ relationshipFilter: filter });
    },
    [setUrlFilters]
  );

  // Apply filters to data
  const applyFilters = useCallback(
    (data: GraphData): GraphData => {
      return filterGraphData(data, filters);
    },
    [filters]
  );

  // Get filter statistics
  const getStats = useCallback(
    (originalData: GraphData, filteredData: GraphData): FilterStats => {
      return getFilterStats(originalData, filteredData);
    },
    []
  );

  // Get date range from data
  const getDateRange = useCallback(
    (data: GraphData): { minYear: number | null; maxYear: number | null } => {
      return getGraphDateRange(data);
    },
    []
  );

  return useMemo(
    () => ({
      filters,
      hasActiveFilters,
      setDateStart,
      setDateEnd,
      setNameFilter,
      setRelationshipFilter,
      setFilters: setUrlFilters,
      clearFilters: clearUrlFilters,
      applyFilters,
      getStats,
      getDateRange,
    }),
    [
      filters,
      hasActiveFilters,
      setDateStart,
      setDateEnd,
      setNameFilter,
      setRelationshipFilter,
      setUrlFilters,
      clearUrlFilters,
      applyFilters,
      getStats,
      getDateRange,
    ]
  );
}
