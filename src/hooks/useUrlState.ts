/**
 * Hook for synchronizing application state with URL parameters
 * Uses React Router's useSearchParams
 */

import { useCallback, useMemo, useRef } from 'react';
import { useSearchParams, type SetURLSearchParams } from 'react-router-dom';
import type { FilterState, NodeType } from '@types';

/** Valid node types for validation */
const VALID_NODE_TYPES: NodeType[] = ['person', 'object', 'location', 'entity'];

/**
 * Parse nodeTypes from URL string (comma-separated)
 * Returns null if empty/missing (meaning "all types")
 */
function parseNodeTypes(value: string | null): NodeType[] | null {
  if (!value || !value.trim()) return null;
  
  const types = value.split(',')
    .map(t => t.trim().toLowerCase())
    .filter((t): t is NodeType => VALID_NODE_TYPES.includes(t as NodeType));
  
  // If all types selected, return null (default state)
  if (types.length === VALID_NODE_TYPES.length) return null;
  
  return types.length > 0 ? types : null;
}

/**
 * Serialize nodeTypes to URL string (comma-separated)
 * Returns null if all types selected (to omit from URL)
 */
function serializeNodeTypes(types: NodeType[] | null): string | null {
  if (types === null) return null;
  if (types.length === 0) return null;
  if (types.length === VALID_NODE_TYPES.length) return null;
  return types.join(',');
}

/**
 * Parse relationshipTypes from URL string (comma-separated)
 * Returns null if empty/missing (meaning "all types")
 */
function parseRelationshipTypes(value: string | null): string[] | null {
  if (!value || !value.trim()) return null;
  
  const types = value.split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);
  
  return types.length > 0 ? types : null;
}

/**
 * Serialize relationshipTypes to URL string (comma-separated)
 * Returns null if all types selected (to omit from URL)
 * Note: Unlike nodeTypes, we can't detect "all selected" here since the
 * available types depend on the dataset. We rely on null being passed in.
 */
function serializeRelationshipTypes(types: string[] | null): string | null {
  if (types === null) return null;
  if (types.length === 0) return null;
  return types.join(',');
}

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
  RELATIONSHIP_TYPES: 'relationshipTypes',
  NODE_TYPES: 'nodeTypes',
} as const;

interface UseUrlStateReturn {
  /** Current dataset ID from URL */
  datasetId: string | null;
  /** Set dataset ID in URL */
  setDatasetId: (id: string) => void;
  /** Set dataset ID and clear selection in a single atomic URL update */
  setDatasetIdAndClearSelection: (id: string) => void;
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

  // REACT: Stabilize setSearchParams with a ref to prevent callback instability (R12)
  // React Router's setSearchParams can return a new reference when URL changes,
  // which causes all dependent callbacks to recreate and trigger unnecessary re-renders
  const setSearchParamsRef = useRef<SetURLSearchParams>(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  // Stable wrapper that never changes reference
  const stableSetSearchParams = useCallback<SetURLSearchParams>(
    (nextInit, navigateOpts) => {
      setSearchParamsRef.current(nextInit, navigateOpts);
    },
    []
  );

  // Get dataset ID from URL
  const datasetId = searchParams.get(URL_PARAMS.DATASET);

  // Set dataset ID in URL
  const setDatasetId = useCallback(
    (id: string) => {
      stableSetSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(URL_PARAMS.DATASET, id);
        return newParams;
      });
    },
    [stableSetSearchParams]
  );

  // Set dataset ID and clear selection in a single atomic URL update
  // This avoids race conditions when switching datasets
  const setDatasetIdAndClearSelection = useCallback(
    (id: string) => {
      stableSetSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(URL_PARAMS.DATASET, id);
        newParams.delete(URL_PARAMS.SELECTED);
        newParams.delete(URL_PARAMS.SELECTED_TYPE);
        return newParams;
      });
    },
    [stableSetSearchParams]
  );

  // Get selected item from URL
  const selectedId = searchParams.get(URL_PARAMS.SELECTED);
  const selectedTypeRaw = searchParams.get(URL_PARAMS.SELECTED_TYPE);
  const selectedType =
    selectedTypeRaw === 'node' || selectedTypeRaw === 'edge' ? selectedTypeRaw : null;

  // Set selected item in URL
  const setSelected = useCallback(
    (type: 'node' | 'edge', id: string) => {
      stableSetSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(URL_PARAMS.SELECTED, id);
        newParams.set(URL_PARAMS.SELECTED_TYPE, type);
        return newParams;
      });
    },
    [stableSetSearchParams]
  );

  // Clear selection from URL
  const clearSelected = useCallback(() => {
    stableSetSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(URL_PARAMS.SELECTED);
      newParams.delete(URL_PARAMS.SELECTED_TYPE);
      return newParams;
    });
  }, [stableSetSearchParams]);

  // Get layout from URL
  const layout = searchParams.get(URL_PARAMS.LAYOUT);

  // Set layout in URL
  const setLayout = useCallback(
    (newLayout: string) => {
      stableSetSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(URL_PARAMS.LAYOUT, newLayout);
        return newParams;
      });
    },
    [stableSetSearchParams]
  );

  // Get filters from URL
  // Extract individual values first, then memoize based on those values
  // This prevents filters object from changing when only selection params change
  const dateStartStr = searchParams.get(URL_PARAMS.DATE_START);
  const dateEndStr = searchParams.get(URL_PARAMS.DATE_END);
  const nameFilterStr = searchParams.get(URL_PARAMS.NAME_FILTER) ?? '';
  const relationshipTypesStr = searchParams.get(URL_PARAMS.RELATIONSHIP_TYPES);
  const nodeTypesStr = searchParams.get(URL_PARAMS.NODE_TYPES);

  const filters: FilterState = useMemo(() => {
    return {
      dateStart: dateStartStr ? parseInt(dateStartStr, 10) : null,
      dateEnd: dateEndStr ? parseInt(dateEndStr, 10) : null,
      nameFilter: nameFilterStr,
      relationshipTypes: parseRelationshipTypes(relationshipTypesStr),
      nodeTypes: parseNodeTypes(nodeTypesStr),
    };
  }, [dateStartStr, dateEndStr, nameFilterStr, relationshipTypesStr, nodeTypesStr]);

  // Set filters in URL
  const setFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      stableSetSearchParams((prev) => {
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

        // Handle relationshipTypes (null = all types, omit from URL)
        const relationshipTypesValue = serializeRelationshipTypes(merged.relationshipTypes);
        if (relationshipTypesValue) {
          newParams.set(URL_PARAMS.RELATIONSHIP_TYPES, relationshipTypesValue);
        } else {
          newParams.delete(URL_PARAMS.RELATIONSHIP_TYPES);
        }

        // Handle nodeTypes (null = all types, omit from URL)
        const nodeTypesValue = serializeNodeTypes(merged.nodeTypes);
        if (nodeTypesValue) {
          newParams.set(URL_PARAMS.NODE_TYPES, nodeTypesValue);
        } else {
          newParams.delete(URL_PARAMS.NODE_TYPES);
        }

        return newParams;
      });
    },
    [stableSetSearchParams, filters]
  );

  // Clear all filters from URL
  const clearFilters = useCallback(() => {
    stableSetSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(URL_PARAMS.DATE_START);
      newParams.delete(URL_PARAMS.DATE_END);
      newParams.delete(URL_PARAMS.NAME_FILTER);
      newParams.delete(URL_PARAMS.RELATIONSHIP_TYPES);
      newParams.delete(URL_PARAMS.NODE_TYPES);
      return newParams;
    });
  }, [stableSetSearchParams]);

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
    stableSetSearchParams(new URLSearchParams());
  }, [stableSetSearchParams]);

  return useMemo(
    () => ({
      datasetId,
      setDatasetId,
      setDatasetIdAndClearSelection,
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
      setDatasetIdAndClearSelection,
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
 * Note: Dataset ID is in the path, not query params, so datasetId param here
 * is only used to build the path if needed
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

  // Dataset ID is now in the path, not query params
  // If datasetId is provided, we could potentially modify the path,
  // but for now we just use the current path which contains the dataset
  
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
    // Add relationshipTypes if explicitly set (not null = all)
    const relationshipTypesValue = serializeRelationshipTypes(params.filters.relationshipTypes);
    if (relationshipTypesValue) {
      searchParams.set(URL_PARAMS.RELATIONSHIP_TYPES, relationshipTypesValue);
    }
    // Add nodeTypes if explicitly set (not null = all)
    const nodeTypesValue = serializeNodeTypes(params.filters.nodeTypes);
    if (nodeTypesValue) {
      searchParams.set(URL_PARAMS.NODE_TYPES, nodeTypesValue);
    }
  }

  url.search = searchParams.toString();
  return url.toString();
}
