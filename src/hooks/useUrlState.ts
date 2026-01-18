/**
 * Hook for synchronizing application state with URL parameters
 * Uses React Router's useSearchParams
 */

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState } from '@types';

/** URL parameter keys */
const URL_PARAMS = {
  DATASET: 'dataset',
  SELECTED: 'selected',
  SELECTED_TYPE: 'type',
  LAYOUT: 'layout',
  // Filter parameters
  DATE_START: 'dateStart',
  DATE_END: 'dateEnd',
  NAME_FILTER: 'name',
  RELATIONSHIP_FILTER: 'relationship',
} as const;

interface UseUrlStateReturn {
  /** Current dataset ID from URL */
  datasetId: string | null;
  /** Set dataset ID in URL */
  setDatasetId: (id: string) => void;
  /** Currently selected item ID from URL */
  selectedId: string | null;
  /** Type of selected item ('node' or 'edge') */
  selectedType: 'node' | 'edge' | null;
  /** Set selected item in URL */
  setSelected: (type: 'node' | 'edge', id: string) => void;
  /** Clear selection from URL */
  clearSelected: () => void;
  /** Current layout from URL */
  layout: string | null;
  /** Set layout in URL */
  setLayout: (layout: string) => void;
  /** Current filter state from URL */
  filters: FilterState;
  /** Update filters in URL */
  setFilters: (filters: Partial<FilterState>) => void;
  /** Clear all filters from URL */
  clearFilters: () => void;
  /** Get all URL parameters as an object */
  getAllParams: () => Record<string, string>;
  /** Clear all URL parameters */
  clearAll: () => void;
}

/**
 * Hook for managing URL state with React Router
 */
export function useUrlState(): UseUrlStateReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get dataset ID from URL
  const datasetId = searchParams.get(URL_PARAMS.DATASET);

  // Set dataset ID in URL
  const setDatasetId = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(URL_PARAMS.DATASET, id);
        return newParams;
      });
    },
    [setSearchParams]
  );

  // Get selected item from URL
  const selectedId = searchParams.get(URL_PARAMS.SELECTED);
  const selectedTypeRaw = searchParams.get(URL_PARAMS.SELECTED_TYPE);
  const selectedType =
    selectedTypeRaw === 'node' || selectedTypeRaw === 'edge' ? selectedTypeRaw : null;

  // Set selected item in URL
  const setSelected = useCallback(
    (type: 'node' | 'edge', id: string) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(URL_PARAMS.SELECTED, id);
        newParams.set(URL_PARAMS.SELECTED_TYPE, type);
        return newParams;
      });
    },
    [setSearchParams]
  );

  // Clear selection from URL
  const clearSelected = useCallback(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(URL_PARAMS.SELECTED);
      newParams.delete(URL_PARAMS.SELECTED_TYPE);
      return newParams;
    });
  }, [setSearchParams]);

  // Get layout from URL
  const layout = searchParams.get(URL_PARAMS.LAYOUT);

  // Set layout in URL
  const setLayout = useCallback(
    (newLayout: string) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(URL_PARAMS.LAYOUT, newLayout);
        return newParams;
      });
    },
    [setSearchParams]
  );

  // Get filters from URL
  const filters: FilterState = useMemo(() => {
    const dateStartStr = searchParams.get(URL_PARAMS.DATE_START);
    const dateEndStr = searchParams.get(URL_PARAMS.DATE_END);
    const nameFilter = searchParams.get(URL_PARAMS.NAME_FILTER) ?? '';
    const relationshipFilter = searchParams.get(URL_PARAMS.RELATIONSHIP_FILTER) ?? '';

    return {
      dateStart: dateStartStr ? parseInt(dateStartStr, 10) : null,
      dateEnd: dateEndStr ? parseInt(dateEndStr, 10) : null,
      nameFilter,
      relationshipFilter,
    };
  }, [searchParams]);

  // Set filters in URL
  const setFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        // Merge with existing filters
        const merged = { ...filters, ...newFilters };

        // Update or remove each filter parameter
        if (merged.dateStart !== null && !isNaN(merged.dateStart)) {
          newParams.set(URL_PARAMS.DATE_START, String(merged.dateStart));
        } else {
          newParams.delete(URL_PARAMS.DATE_START);
        }

        if (merged.dateEnd !== null && !isNaN(merged.dateEnd)) {
          newParams.set(URL_PARAMS.DATE_END, String(merged.dateEnd));
        } else {
          newParams.delete(URL_PARAMS.DATE_END);
        }

        if (merged.nameFilter.trim()) {
          newParams.set(URL_PARAMS.NAME_FILTER, merged.nameFilter);
        } else {
          newParams.delete(URL_PARAMS.NAME_FILTER);
        }

        if (merged.relationshipFilter.trim()) {
          newParams.set(URL_PARAMS.RELATIONSHIP_FILTER, merged.relationshipFilter);
        } else {
          newParams.delete(URL_PARAMS.RELATIONSHIP_FILTER);
        }

        return newParams;
      });
    },
    [setSearchParams, filters]
  );

  // Clear all filters from URL
  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(URL_PARAMS.DATE_START);
      newParams.delete(URL_PARAMS.DATE_END);
      newParams.delete(URL_PARAMS.NAME_FILTER);
      newParams.delete(URL_PARAMS.RELATIONSHIP_FILTER);
      return newParams;
    });
  }, [setSearchParams]);

  // Get all parameters as an object
  const getAllParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  // Clear all URL parameters
  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return useMemo(
    () => ({
      datasetId,
      setDatasetId,
      selectedId,
      selectedType,
      setSelected,
      clearSelected,
      layout,
      setLayout,
      filters,
      setFilters,
      clearFilters,
      getAllParams,
      clearAll,
    }),
    [
      datasetId,
      setDatasetId,
      selectedId,
      selectedType,
      setSelected,
      clearSelected,
      layout,
      setLayout,
      filters,
      setFilters,
      clearFilters,
      getAllParams,
      clearAll,
    ]
  );
}

/**
 * Build a shareable URL with the current state
 */
export function buildShareableUrl(params: {
  datasetId?: string;
  selectedType?: 'node' | 'edge';
  selectedId?: string;
  layout?: string;
  filters?: FilterState;
}): string {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams();

  if (params.datasetId) {
    searchParams.set(URL_PARAMS.DATASET, params.datasetId);
  }
  if (params.selectedType && params.selectedId) {
    searchParams.set(URL_PARAMS.SELECTED, params.selectedId);
    searchParams.set(URL_PARAMS.SELECTED_TYPE, params.selectedType);
  }
  if (params.layout) {
    searchParams.set(URL_PARAMS.LAYOUT, params.layout);
  }

  // Add filter parameters
  if (params.filters) {
    if (params.filters.dateStart !== null) {
      searchParams.set(URL_PARAMS.DATE_START, String(params.filters.dateStart));
    }
    if (params.filters.dateEnd !== null) {
      searchParams.set(URL_PARAMS.DATE_END, String(params.filters.dateEnd));
    }
    if (params.filters.nameFilter.trim()) {
      searchParams.set(URL_PARAMS.NAME_FILTER, params.filters.nameFilter);
    }
    if (params.filters.relationshipFilter.trim()) {
      searchParams.set(URL_PARAMS.RELATIONSHIP_FILTER, params.filters.relationshipFilter);
    }
  }

  url.search = searchParams.toString();
  return url.toString();
}
