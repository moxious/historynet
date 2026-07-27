/**
 * Core context object, types, and hooks for cross-scene discovery.
 *
 * Kept in a separate non-component module (not CrossSceneContext.tsx) so the
 * provider file only exports components, which keeps React Fast Refresh working.
 */

import { createContext, useContext } from 'react';
import type { GraphNode } from '@types';

/**
 * Entity appearance in a specific dataset
 */
export interface CrossSceneAppearance {
  datasetId: string;
  datasetName: string;
  nodeId: string;
  nodeTitle: string;
}

/**
 * Cross-scene data for a single entity
 */
export interface CrossSceneData {
  identity: {
    wikidataId?: string;
    wikipediaTitle?: string;
    canonicalTitle: string;
  };
  appearances: CrossSceneAppearance[];
  totalAppearances: number;
}

/**
 * Cache entry tracking loading state
 */
export interface CacheEntry {
  data: CrossSceneData | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Context value provided to consumers
 */
export interface CrossSceneContextValue {
  // Get cross-scene data for a node
  getCrossSceneData: (node: GraphNode) => CacheEntry;

  // Check if data is being fetched
  isLoadingAny: boolean;

  // Clear cache (useful when switching datasets)
  clearCache: () => void;

  // Prefetch data for multiple nodes
  prefetchNodes: (nodes: GraphNode[]) => Promise<void>;
}

export const CrossSceneContext = createContext<CrossSceneContextValue | null>(null);

/**
 * Hook to access cross-scene context
 * Must be used within a CrossSceneProvider
 */
export function useCrossSceneData(): CrossSceneContextValue {
  const context = useContext(CrossSceneContext);
  if (!context) {
    throw new Error('useCrossSceneData must be used within a CrossSceneProvider');
  }
  return context;
}

/**
 * Optional hook to access cross-scene context
 * Returns null if used outside a CrossSceneProvider
 */
export function useCrossSceneDataOptional(): CrossSceneContextValue | null {
  return useContext(CrossSceneContext);
}
