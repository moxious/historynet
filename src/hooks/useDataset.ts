/**
 * Hook for managing dataset selection and switching
 * 
 * Note: This hook is provided for backward compatibility but most code
 * should use the GraphContext's switchDataset function instead, which
 * properly navigates to the new dataset's URL path.
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGraphData } from './useGraphData';
import type { DatasetManifest, LoadingState, DataError } from '@types';
import { DEFAULT_DATASET_ID, isValidDatasetId, buildExploreUrl } from '@utils';

interface UseDatasetReturn {
  /** Currently loaded dataset ID */
  currentDatasetId: string | null;
  /** Current dataset manifest (null if not loaded) */
  manifest: DatasetManifest | null;
  /** Loading state */
  loadingState: LoadingState;
  /** Error information (if in error state) */
  error: DataError | null;
  /** Switch to a different dataset (navigates to new URL path) */
  switchDataset: (datasetId: string) => void;
  /** Reload the current dataset */
  reload: () => void;
}

/**
 * Hook for managing dataset selection with URL navigation
 */
export function useDataset(): UseDatasetReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const { dataset, loadingState, error, load } = useGraphData();

  // Extract dataset ID from URL path (source of truth)
  const effectiveDatasetId = useMemo(() => {
    const pathMatch = location.pathname.match(/^\/([^/]+)(?:\/|$)/);
    const id = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    return id && isValidDatasetId(id) ? id : DEFAULT_DATASET_ID;
  }, [location.pathname]);

  // Load dataset on mount and when URL changes
  useEffect(() => {
    if (effectiveDatasetId && isValidDatasetId(effectiveDatasetId)) {
      if (!dataset || dataset.manifest.id !== effectiveDatasetId) {
        load(effectiveDatasetId);
      }
    }
  }, [effectiveDatasetId, dataset, load]);

  // Switch to a different dataset by navigating to its explore path
  const switchDataset = useCallback(
    (newDatasetId: string) => {
      if (isValidDatasetId(newDatasetId)) {
        navigate(buildExploreUrl(newDatasetId));
      } else {
        console.error(`Cannot switch to invalid dataset: ${newDatasetId}`);
      }
    },
    [navigate]
  );

  // Reload the current dataset
  const reload = useCallback(() => {
    if (effectiveDatasetId) {
      load(effectiveDatasetId);
    }
  }, [effectiveDatasetId, load]);

  return useMemo(
    () => ({
      currentDatasetId: dataset?.manifest.id ?? null,
      manifest: dataset?.manifest ?? null,
      loadingState,
      error,
      switchDataset,
      reload,
    }),
    [dataset, loadingState, error, switchDataset, reload]
  );
}
