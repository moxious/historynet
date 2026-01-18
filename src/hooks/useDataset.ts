/**
 * Hook for managing dataset selection and switching
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useGraphData } from './useGraphData';
import { useUrlState } from './useUrlState';
import type { DatasetManifest, LoadingState, DataError } from '@types';
import { DEFAULT_DATASET_ID, isValidDatasetId } from '@utils/dataLoader';

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
 */
export function useDataset(): UseDatasetReturn {
  const { dataset, loadingState, error, load } = useGraphData();
  const { datasetId: urlDatasetId, setDatasetId: setUrlDatasetId } = useUrlState();

  // Get the effective dataset ID (from URL or default)
  const effectiveDatasetId = urlDatasetId || DEFAULT_DATASET_ID;

  // Load dataset on mount and when URL changes
  useEffect(() => {
    // Only load if we have a valid dataset ID and haven't loaded yet
    if (effectiveDatasetId && isValidDatasetId(effectiveDatasetId)) {
      // Only load if we don't have a dataset or if it's different
      if (!dataset || dataset.manifest.id !== effectiveDatasetId) {
        load(effectiveDatasetId);
      }
    } else if (effectiveDatasetId && !isValidDatasetId(effectiveDatasetId)) {
      // Invalid dataset ID - load default instead
      console.warn(`Invalid dataset ID: ${effectiveDatasetId}, loading default`);
      setUrlDatasetId(DEFAULT_DATASET_ID);
    }
  }, [effectiveDatasetId, dataset, load, setUrlDatasetId]);

  // Switch to a different dataset
  const switchDataset = useCallback(
    (newDatasetId: string) => {
      if (isValidDatasetId(newDatasetId)) {
        setUrlDatasetId(newDatasetId);
      } else {
        console.error(`Cannot switch to invalid dataset: ${newDatasetId}`);
      }
    },
    [setUrlDatasetId]
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
