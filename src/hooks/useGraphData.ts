/**
 * Hook for managing graph data state
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import type {
  GraphData,
  Dataset,
  LoadingState,
  DataError,
  GraphNode,
  GraphEdge,
} from '@types';
import {
  loadDataset,
  DatasetLoadError,
  validateEdgeReferences,
} from '@utils/dataLoader';

interface UseGraphDataReturn {
  /** Current dataset (null if not loaded) */
  dataset: Dataset | null;
  /** Current graph data (convenience accessor) */
  graphData: GraphData | null;
  /** Current loading state */
  loadingState: LoadingState;
  /** Error information (if in error state) */
  error: DataError | null;
  /** Load a dataset by ID */
  load: (datasetId: string) => Promise<void>;
  /** Clear the current dataset */
  clear: () => void;
  /** Get a node by ID */
  getNode: (id: string) => GraphNode | undefined;
  /** Get an edge by ID */
  getEdge: (id: string) => GraphEdge | undefined;
  /** Get edges connected to a node */
  getEdgesForNode: (nodeId: string) => GraphEdge[];
}

/**
 * Hook for loading and managing graph data
 */
export function useGraphData(): UseGraphDataReturn {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<DataError | null>(null);

  // REACT: Track AbortController to cancel previous requests (R7)
  const abortControllerRef = useRef<AbortController | null>(null);

  // Convenience accessor for graph data
  const graphData = dataset?.data ?? null;

  // Load a dataset
  const load = useCallback(async (datasetId: string) => {
    // REACT: Abort previous request to prevent race condition (R7)
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoadingState('loading');
    setError(null);

    try {
      const loadedDataset = await loadDataset(datasetId, controller.signal);

      // Validate edge references
      const validation = validateEdgeReferences(loadedDataset.data);
      if (!validation.valid) {
        console.warn('Dataset has invalid edge references:', validation.errors);
      }

      setDataset(loadedDataset);
      setLoadingState('success');
    } catch (err) {
      // REACT: Ignore abort errors - these are expected when switching datasets rapidly (R4)
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const dataError: DataError =
        err instanceof DatasetLoadError
          ? {
              message: err.message,
              code: err.code,
              originalError: err.originalError,
            }
          : {
              message: err instanceof Error ? err.message : 'Unknown error',
              originalError: err,
            };

      setError(dataError);
      setLoadingState('error');
      setDataset(null);
    }
  }, []);

  // Clear the current dataset
  const clear = useCallback(() => {
    setDataset(null);
    setLoadingState('idle');
    setError(null);
  }, []);

  // Get a node by ID
  const getNode = useCallback(
    (id: string): GraphNode | undefined => {
      return graphData?.nodes.find((node) => node.id === id);
    },
    [graphData]
  );

  // Get an edge by ID
  const getEdge = useCallback(
    (id: string): GraphEdge | undefined => {
      return graphData?.edges.find((edge) => edge.id === id);
    },
    [graphData]
  );

  // Get edges connected to a node
  const getEdgesForNode = useCallback(
    (nodeId: string): GraphEdge[] => {
      if (!graphData) return [];
      return graphData.edges.filter(
        (edge) => edge.source === nodeId || edge.target === nodeId
      );
    },
    [graphData]
  );

  return useMemo(
    () => ({
      dataset,
      graphData,
      loadingState,
      error,
      load,
      clear,
      getNode,
      getEdge,
      getEdgesForNode,
    }),
    [dataset, graphData, loadingState, error, load, clear, getNode, getEdge, getEdgesForNode]
  );
}
