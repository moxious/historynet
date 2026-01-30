/**
 * React Context for managing cross-scene (cross-dataset) entity discovery
 *
 * This context fetches data from the /api/node-scenes endpoint to identify
 * which entities appear in multiple datasets, enabling serendipitous discovery.
 *
 * Key features:
 * - Non-blocking: fetches data after initial dataset render
 * - Session caching: avoids redundant API calls
 * - Batch API calls: efficient lookup for entire dataset
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
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
 * API response format for batch lookups
 */
interface BatchLookupResponse {
  results: Record<string, CrossSceneData>;
  notFound: string[];
}

/**
 * Cache entry tracking loading state
 */
interface CacheEntry {
  data: CrossSceneData | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Context value provided to consumers
 */
interface CrossSceneContextValue {
  // Get cross-scene data for a node
  getCrossSceneData: (node: GraphNode) => CacheEntry;

  // Check if data is being fetched
  isLoadingAny: boolean;

  // Clear cache (useful when switching datasets)
  clearCache: () => void;

  // Prefetch data for multiple nodes
  prefetchNodes: (nodes: GraphNode[]) => Promise<void>;
}

const CrossSceneContext = createContext<CrossSceneContextValue | null>(null);

interface CrossSceneProviderProps {
  children: ReactNode;
  currentDatasetId?: string | null;
  nodes?: GraphNode[];
}

/**
 * Provider component that manages cross-scene data fetching and caching
 */
export function CrossSceneProvider({
  children,
  currentDatasetId,
  nodes = [],
}: CrossSceneProviderProps) {
  // Cache: key = identifier (wikidataId, wikipediaTitle, or nodeId), value = CacheEntry
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const [isLoadingAny, setIsLoadingAny] = useState(false);

  /**
   * Extract the best identifier from a node for API lookup
   */
  const getNodeIdentifier = useCallback((node: GraphNode): string | null => {
    // Prefer wikidataId (most stable), then wikipediaTitle, then nodeId
    if (node.wikidataId) return `wikidata:${node.wikidataId}`;
    if (node.wikipediaTitle) return `wikipedia:${node.wikipediaTitle}`;
    if (node.id) return `nodeid:${node.id}`;
    return null;
  }, []);

  /**
   * Get cross-scene data for a single node from cache
   */
  const getCrossSceneData = useCallback(
    (node: GraphNode): CacheEntry => {
      const identifier = getNodeIdentifier(node);

      if (!identifier) {
        // Node has no identifiers - return empty result immediately
        return {
          data: {
            identity: { canonicalTitle: node.title },
            appearances: [],
            totalAppearances: 0,
          },
          isLoading: false,
          error: null,
        };
      }

      const cached = cache.get(identifier);
      if (cached) {
        return cached;
      }

      // Not in cache yet - return loading state
      return {
        data: null,
        isLoading: true,
        error: null,
      };
    },
    [cache, getNodeIdentifier]
  );

  /**
   * Fetch cross-scene data for a batch of nodes
   */
  const prefetchNodes = useCallback(
    async (nodesToFetch: GraphNode[]): Promise<void> => {
      if (nodesToFetch.length === 0) return;

      // Group nodes by identifier type
      const wikidataIds: string[] = [];
      const wikipediaTitles: string[] = [];
      const nodeIds: string[] = [];
      const identifierToNodes = new Map<string, GraphNode>();

      for (const node of nodesToFetch) {
        const identifier = getNodeIdentifier(node);
        if (!identifier) continue;

        // Skip if already in cache
        if (cache.has(identifier)) continue;

        // Mark as loading
        setCache((prev) => {
          const next = new Map(prev);
          next.set(identifier, {
            data: null,
            isLoading: true,
            error: null,
          });
          return next;
        });

        identifierToNodes.set(identifier, node);

        // Add to appropriate list
        if (node.wikidataId) {
          wikidataIds.push(node.wikidataId);
        } else if (node.wikipediaTitle) {
          wikipediaTitles.push(node.wikipediaTitle);
        } else if (node.id) {
          nodeIds.push(node.id);
        }
      }

      // If nothing to fetch, return early
      if (
        wikidataIds.length === 0 &&
        wikipediaTitles.length === 0 &&
        nodeIds.length === 0
      ) {
        return;
      }

      setIsLoadingAny(true);

      try {
        // Build query params
        const params = new URLSearchParams();
        if (wikidataIds.length > 0) {
          params.append('wikidataIds', wikidataIds.join(','));
        }
        if (wikipediaTitles.length > 0) {
          params.append('wikipediaTitles', wikipediaTitles.join(','));
        }
        if (nodeIds.length > 0) {
          params.append('nodeIds', nodeIds.join(','));
        }

        // Fetch from API (use production endpoint in development if local API not available)
        const apiUrl = import.meta.env.DEV && window.location.hostname === 'localhost'
          ? `https://scenius-seven.vercel.app/api/node-scenes?${params.toString()}`
          : `/api/node-scenes?${params.toString()}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data: BatchLookupResponse = await response.json();

        // Update cache with results
        setCache((prev) => {
          const next = new Map(prev);

          // Process successful results
          for (const [key, result] of Object.entries(data.results)) {
            // Map API key back to our identifier format
            let identifier: string | null = null;
            if (wikidataIds.includes(key)) {
              identifier = `wikidata:${key}`;
            } else if (wikipediaTitles.includes(key)) {
              identifier = `wikipedia:${key}`;
            } else if (nodeIds.includes(key)) {
              identifier = `nodeid:${key}`;
            }

            if (identifier) {
              next.set(identifier, {
                data: result,
                isLoading: false,
                error: null,
              });
            }
          }

          // Process not found results (empty appearances)
          for (const key of data.notFound) {
            let identifier: string | null = null;
            if (wikidataIds.includes(key)) {
              identifier = `wikidata:${key}`;
            } else if (wikipediaTitles.includes(key)) {
              identifier = `wikipedia:${key}`;
            } else if (nodeIds.includes(key)) {
              identifier = `nodeid:${key}`;
            }

            if (identifier) {
              const node = identifierToNodes.get(identifier);
              next.set(identifier, {
                data: {
                  identity: {
                    wikidataId: key.startsWith('Q') ? key : undefined,
                    wikipediaTitle: !key.startsWith('Q') ? key : undefined,
                    canonicalTitle: node?.title || key,
                  },
                  appearances: [],
                  totalAppearances: 0,
                },
                isLoading: false,
                error: null,
              });
            }
          }

          return next;
        });
      } catch (error) {
        console.error('[CrossSceneContext] Failed to fetch cross-scene data:', error);

        // Mark all as error
        setCache((prev) => {
          const next = new Map(prev);
          for (const identifier of identifierToNodes.keys()) {
            next.set(identifier, {
              data: null,
              isLoading: false,
              error: error instanceof Error ? error : new Error('Unknown error'),
            });
          }
          return next;
        });
      } finally {
        setIsLoadingAny(false);
      }
    },
    [cache, getNodeIdentifier]
  );

  /**
   * Clear the cache (e.g., when switching datasets)
   */
  const clearCache = useCallback(() => {
    setCache(new Map());
    setIsLoadingAny(false);
  }, []);

  /**
   * Auto-prefetch data when nodes become available
   */
  useEffect(() => {
    if (nodes.length > 0) {
      // Prefetch in background (non-blocking)
      prefetchNodes(nodes).catch((error) => {
        console.error('[CrossSceneContext] Prefetch failed:', error);
      });
    }
  }, [nodes, prefetchNodes]);

  /**
   * Clear cache when dataset changes
   */
  useEffect(() => {
    clearCache();
  }, [currentDatasetId, clearCache]);

  const value: CrossSceneContextValue = useMemo(
    () => ({
      getCrossSceneData,
      isLoadingAny,
      clearCache,
      prefetchNodes,
    }),
    [getCrossSceneData, isLoadingAny, clearCache, prefetchNodes]
  );

  return (
    <CrossSceneContext.Provider value={value}>
      {children}
    </CrossSceneContext.Provider>
  );
}

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
