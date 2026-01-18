/**
 * React Context for sharing graph state across components
 */

import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef, type ReactNode } from 'react';
import { useGraphData } from '@hooks/useGraphData';
import { useSelectedItem, getSelectedItem } from '@hooks/useSelectedItem';
import { useUrlState } from '@hooks/useUrlState';
import type { LayoutType } from '@hooks/useLayout';
import type {
  Dataset,
  GraphData,
  GraphNode,
  GraphEdge,
  Selection,
  LoadingState,
  DataError,
  FilterState,
  FilterStats,
  NodeType,
} from '@types';
import { DEFAULT_DATASET_ID, isValidDatasetId, filterGraphData, getFilterStats, getGraphDateRange, getNodeTypeCounts } from '@utils';

interface GraphContextValue {
  // Dataset state
  dataset: Dataset | null;
  graphData: GraphData | null;
  filteredData: GraphData | null;
  currentDatasetId: string | null;
  loadingState: LoadingState;
  error: DataError | null;

  // Selection state
  selection: Selection | null;
  selectedItem: GraphNode | GraphEdge | undefined;
  selectNode: (id: string) => void;
  selectEdge: (id: string) => void;
  clearSelection: () => void;
  isNodeSelected: (id: string) => boolean;
  isEdgeSelected: (id: string) => boolean;

  // Data access
  getNode: (id: string) => GraphNode | undefined;
  getEdge: (id: string) => GraphEdge | undefined;
  getEdgesForNode: (nodeId: string) => GraphEdge[];

  // Dataset switching
  switchDataset: (datasetId: string) => void;
  reloadDataset: () => void;

  // Filter state
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  filterStats: FilterStats | null;
  dateRange: { minYear: number | null; maxYear: number | null } | null;
  nodeTypeCounts: Record<NodeType, number> | null;
  hasActiveFilters: boolean;

  // Search state
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchMatchCount: number;

  // Layout state
  currentLayout: LayoutType;
  setCurrentLayout: (layout: LayoutType) => void;
}

const GraphContext = createContext<GraphContextValue | null>(null);

interface GraphProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages and shares graph state
 */
export function GraphProvider({ children }: GraphProviderProps) {
  const {
    dataset,
    graphData,
    loadingState,
    error,
    load,
    getNode,
    getEdge,
    getEdgesForNode,
  } = useGraphData();

  const {
    selection,
    selectNode: selectNodeBase,
    selectEdge: selectEdgeBase,
    clearSelection: clearSelectionBase,
    isNodeSelected,
    isEdgeSelected,
  } = useSelectedItem();

  const {
    datasetId: urlDatasetId,
    setDatasetId: setUrlDatasetId,
    setDatasetIdAndClearSelection,
    setSelected: setUrlSelected,
    clearSelected: clearUrlSelected,
    selectedId: urlSelectedId,
    selectedType: urlSelectedType,
    filters,
    setFilters,
    clearFilters,
    layout: urlLayout,
    setLayout: setUrlLayout,
  } = useUrlState();

  // Layout state - initialized from URL or defaults to 'force-graph'
  const currentLayout: LayoutType = (urlLayout as LayoutType) || 'force-graph';

  // Set layout and sync to URL
  const setCurrentLayout = useCallback(
    (layout: LayoutType) => {
      setUrlLayout(layout);
    },
    [setUrlLayout]
  );

  // Determine effective dataset ID
  const effectiveDatasetId = urlDatasetId || DEFAULT_DATASET_ID;

  // Load dataset on mount and when URL changes
  useEffect(() => {
    if (effectiveDatasetId && isValidDatasetId(effectiveDatasetId)) {
      if (!dataset || dataset.manifest.id !== effectiveDatasetId) {
        load(effectiveDatasetId);
      }
    } else if (effectiveDatasetId && !isValidDatasetId(effectiveDatasetId)) {
      console.warn(`Invalid dataset ID: ${effectiveDatasetId}, loading default`);
      setUrlDatasetId(DEFAULT_DATASET_ID);
    }
  }, [effectiveDatasetId, dataset, load, setUrlDatasetId]);

  // Sync URL selection to local selection state
  useEffect(() => {
    if (urlSelectedId && urlSelectedType && graphData) {
      if (urlSelectedType === 'node') {
        const node = getNode(urlSelectedId);
        if (node) {
          selectNodeBase(urlSelectedId);
        }
      } else {
        const edge = getEdge(urlSelectedId);
        if (edge) {
          selectEdgeBase(urlSelectedId);
        }
      }
    }
  }, [urlSelectedId, urlSelectedType, graphData, getNode, getEdge, selectNodeBase, selectEdgeBase]);

  // Wrapped selection functions that also update URL
  // REACT: memoized to prevent graph re-layout on selection change (R12)
  const selectNode = useCallback(
    (id: string) => {
      selectNodeBase(id);
      setUrlSelected('node', id);
    },
    [selectNodeBase, setUrlSelected]
  );

  const selectEdge = useCallback(
    (id: string) => {
      selectEdgeBase(id);
      setUrlSelected('edge', id);
    },
    [selectEdgeBase, setUrlSelected]
  );

  const clearSelection = useCallback(() => {
    clearSelectionBase();
    clearUrlSelected();
  }, [clearSelectionBase, clearUrlSelected]);

  // DEBUG: Track if selectNode/selectEdge references are stable
  const prevSelectFnsRef = useRef<{ selectNode: typeof selectNode; selectEdge: typeof selectEdge; selectNodeBase: typeof selectNodeBase; setUrlSelected: typeof setUrlSelected } | null>(null);
  useEffect(() => {
    if (prevSelectFnsRef.current) {
      const changes: string[] = [];
      if (prevSelectFnsRef.current.selectNode !== selectNode) changes.push('selectNode');
      if (prevSelectFnsRef.current.selectEdge !== selectEdge) changes.push('selectEdge');
      if (prevSelectFnsRef.current.selectNodeBase !== selectNodeBase) changes.push('selectNodeBase');
      if (prevSelectFnsRef.current.setUrlSelected !== setUrlSelected) changes.push('setUrlSelected');
      if (changes.length > 0) {
        console.log('[GraphContext] Selection function references changed:', changes);
      }
    }
    prevSelectFnsRef.current = { selectNode, selectEdge, selectNodeBase, setUrlSelected };
  }, [selectNode, selectEdge, selectNodeBase, setUrlSelected]);

  // Get the selected item (node or edge object)
  const selectedItem =
    graphData && selection
      ? getSelectedItem(selection, graphData.nodes, graphData.edges)
      : undefined;

  // Switch dataset (also updates URL)
  // Uses atomic URL update to avoid race condition between setDatasetId and clearSelection
  // REACT: memoized for stable reference (R12)
  const switchDataset = useCallback(
    (newDatasetId: string) => {
      if (isValidDatasetId(newDatasetId)) {
        setDatasetIdAndClearSelection(newDatasetId); // Single atomic URL update
        clearSelectionBase(); // Clear local state only (URL already cleared above)
      } else {
        console.error(`Cannot switch to invalid dataset: ${newDatasetId}`);
      }
    },
    [setDatasetIdAndClearSelection, clearSelectionBase]
  );

  // Reload current dataset
  // REACT: memoized for stable reference (R12)
  const reloadDataset = useCallback(() => {
    if (effectiveDatasetId) {
      load(effectiveDatasetId);
    }
  }, [effectiveDatasetId, load]);

  // Calculate filtered data based on current filters
  const filteredData = useMemo(() => {
    if (!graphData) return null;
    return filterGraphData(graphData, filters);
  }, [graphData, filters]);

  // Calculate filter stats
  const filterStats = useMemo(() => {
    if (!graphData || !filteredData) return null;
    return getFilterStats(graphData, filteredData);
  }, [graphData, filteredData]);

  // Calculate date range for the data
  const dateRange = useMemo(() => {
    if (!graphData) return null;
    return getGraphDateRange(graphData);
  }, [graphData]);

  // Calculate node type counts from unfiltered data
  const nodeTypeCounts = useMemo(() => {
    if (!graphData) return null;
    return getNodeTypeCounts(graphData);
  }, [graphData]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.dateStart !== null ||
      filters.dateEnd !== null ||
      filters.nameFilter.trim() !== '' ||
      filters.relationshipFilter.trim() !== '' ||
      filters.nodeTypes !== null // explicit type selection = active filter
    );
  }, [filters]);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate search match count
  const searchMatchCount = useMemo(() => {
    if (!searchTerm.trim() || !filteredData) return 0;
    const term = searchTerm.toLowerCase();
    return filteredData.nodes.filter((n) => n.title.toLowerCase().includes(term)).length;
  }, [searchTerm, filteredData]);

  const value: GraphContextValue = {
    dataset,
    graphData,
    filteredData,
    currentDatasetId: dataset?.manifest.id ?? null,
    loadingState,
    error,
    selection,
    selectedItem,
    selectNode,
    selectEdge,
    clearSelection,
    isNodeSelected,
    isEdgeSelected,
    getNode,
    getEdge,
    getEdgesForNode,
    switchDataset,
    reloadDataset,
    filters,
    setFilters,
    clearFilters,
    filterStats,
    dateRange,
    nodeTypeCounts,
    hasActiveFilters,
    searchTerm,
    setSearchTerm,
    searchMatchCount,
    currentLayout,
    setCurrentLayout,
  };

  return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>;
}

/**
 * Hook to access graph context
 * Must be used within a GraphProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useGraph(): GraphContextValue {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}
