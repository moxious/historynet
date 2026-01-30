/**
 * Hook for accessing cross-scene (cross-dataset) appearances for a node
 *
 * This hook provides a simple interface for components to check if a node
 * appears in multiple datasets and get the list of appearances.
 *
 * Returns:
 * - appearances: List of datasets where this entity appears
 * - isMultiScene: True if entity appears in 2+ datasets (including current)
 * - isLoading: True while data is being fetched
 * - error: Error object if fetch failed
 *
 * For nodes without identifiers (wikidataId, wikipediaTitle, nodeId),
 * returns empty appearances immediately without making API calls.
 */

import { useMemo } from 'react';
import type { GraphNode } from '@types';
import {
  useCrossSceneData,
  type CrossSceneAppearance,
} from '@contexts/CrossSceneContext';

export interface CrossSceneAppearancesResult {
  /**
   * List of datasets where this entity appears
   * Excludes the current dataset
   */
  appearances: CrossSceneAppearance[];

  /**
   * True if this entity appears in 2+ datasets (including current)
   * Use this for visual indicators on graph nodes
   */
  isMultiScene: boolean;

  /**
   * True while cross-scene data is being fetched
   */
  isLoading: boolean;

  /**
   * Error object if fetch failed, null otherwise
   */
  error: Error | null;

  /**
   * Total number of datasets (including current)
   */
  totalDatasets: number;
}

/**
 * Hook to get cross-scene appearances for a node
 *
 * @param node - The graph node to check for cross-scene appearances
 * @param currentDatasetId - Optional current dataset ID to exclude from results
 * @returns Cross-scene appearance data
 *
 * @example
 * const { isMultiScene, appearances, isLoading } = useCrossSceneAppearances(node, 'scientific-revolution');
 *
 * if (isMultiScene && !isLoading) {
 *   // Show visual indicator on node
 *   // Show "In N networks" in tooltip
 * }
 */
export function useCrossSceneAppearances(
  node: GraphNode | undefined | null,
  currentDatasetId?: string | null
): CrossSceneAppearancesResult {
  const { getCrossSceneData } = useCrossSceneData();

  const result = useMemo(() => {
    // No node provided
    if (!node) {
      return {
        appearances: [],
        isMultiScene: false,
        isLoading: false,
        error: null,
        totalDatasets: 0,
      };
    }

    // Get cached data from context
    const cacheEntry = getCrossSceneData(node);

    // Still loading
    if (cacheEntry.isLoading) {
      return {
        appearances: [],
        isMultiScene: false,
        isLoading: true,
        error: null,
        totalDatasets: 0,
      };
    }

    // Error occurred
    if (cacheEntry.error) {
      return {
        appearances: [],
        isMultiScene: false,
        isLoading: false,
        error: cacheEntry.error,
        totalDatasets: 0,
      };
    }

    // No data (node has no identifiers or not found)
    if (!cacheEntry.data) {
      return {
        appearances: [],
        isMultiScene: false,
        isLoading: false,
        error: null,
        totalDatasets: 0,
      };
    }

    const { appearances: allAppearances, totalAppearances } = cacheEntry.data;

    // Filter out current dataset from appearances list
    const otherAppearances = currentDatasetId
      ? allAppearances.filter((app) => app.datasetId !== currentDatasetId)
      : allAppearances;

    // Entity is multi-scene if it appears in 2+ datasets total
    // (This is true even if we're showing N-1 "other" datasets)
    const isMultiScene = totalAppearances >= 2;

    return {
      appearances: otherAppearances,
      isMultiScene,
      isLoading: false,
      error: null,
      totalDatasets: totalAppearances,
    };
  }, [node, currentDatasetId, getCrossSceneData]);

  return result;
}
