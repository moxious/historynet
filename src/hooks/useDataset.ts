/**
 * Hook for managing dataset selection and switching
 *
 * @deprecated This hook is deprecated in favor of using useGraph() from GraphContext.
 * The GraphContext now reads dataset ID directly from the URL path and provides
 * switchDataset() which uses path-based navigation.
 *
 * This hook is kept for backward compatibility but should not be used in new code.
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGraphData } from './useGraphData';
import type { DatasetManifest, LoadingState, DataError } from '@types';
import { DEFAULT_DATASET_ID, isValidDatasetId } from '@utils/dataLoader';
import { buildExploreUrl } from '@utils/urlBuilder';

interface UseDatasetReturn {
  /** Currently loaded dataset ID */
  currentDatasetId: string | null;
  /** Current dataset manifest (null if not loaded) */
  manifest: DatasetManifest | null;
  /** Loading state */
  loadingState: LoadingState;
  /** Error information (if in error state) */
  error: DataError | null;
  /** Switch to a different dataset */
  switchDataset: (datasetId: string) => void;
  /** Reload the current dataset */
  reload: () => void;
}

/**
 * Hook for managing dataset selection with URL synchronization
 * @deprecated Use useGraph() from GraphContext instead
 */
export function useDataset(): UseDatasetReturn {
  const location = useLocation();
  const navigate = useNavigate();
  const { dataset, loadingState, error, load } = useGraphData();

  // Parse dataset ID from path (e.g., /christian-kabbalah/explore -> christian-kabbalah)
  const pathDatasetId = useMemo(() => {
    const match = location.pathname.match(/^\/([^\/]+)/);
    return match ? match[1] : null;
  }, [location.pathname]);

  // Get the effective dataset ID (from path or default)
  const effectiveDatasetId = pathDatasetId || DEFAULT_DATASET_ID;

  // Load dataset on mount and when URL changes
  useEffect(() => {
    // Only load if we have a valid dataset ID and haven't loaded yet
    if (effectiveDatasetId && isValidDatasetId(effectiveDatasetId)) {
      // Only load if we don't have a dataset or if it's different
      if (!dataset || dataset.manifest.id !== effectiveDatasetId) {
        load(effectiveDatasetId);
      }
    } else if (effectiveDatasetId && !isValidDatasetId(effectiveDatasetId)) {
      // Invalid dataset ID - handled by route-level validation
      console.warn(`Invalid dataset ID: ${effectiveDatasetId}`);
    }
  }, [effectiveDatasetId, dataset, load]);

  // Switch to a different dataset
  const switchDataset = useCallback(
    (newDatasetId: string) => {
      if (isValidDatasetId(newDatasetId)) {
        // Navigate to the new dataset's explore page
        const exploreUrl = buildExploreUrl(newDatasetId);
        navigate(exploreUrl);
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
