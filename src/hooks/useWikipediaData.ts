/**
 * useWikipediaData Hook
 *
 * Fetches and caches Wikipedia data for nodes with wikipediaTitle.
 * Implements LRU cache in localStorage with 48-hour TTL.
 *
 * Features:
 * - Lazy fetch: only fetches when wikipediaTitle is present
 * - LRU eviction with configurable max entries (default 500)
 * - 48-hour TTL for cache entries
 * - Rate limit awareness (backs off on 429)
 * - Dev mode logging for cache hits/misses
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchWikipediaSummary, type WikipediaData, type NodeTypeHint } from '@services';

// Cache configuration
const CACHE_KEY = 'scenius-wikipedia-cache';
const CACHE_VERSION = 1;
const MAX_CACHE_ENTRIES = 500;
const TTL_MS = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

// In-flight request tracking to prevent duplicate fetches
const inFlightRequests = new Map<string, Promise<WikipediaData | null>>();

/**
 * Cache entry structure
 */
interface CacheEntry {
  /** The cached data (null means "not found" was cached) */
  data: WikipediaData | null;
  /** Timestamp when this entry was stored */
  timestamp: number;
  /** Last access time for LRU */
  lastAccess: number;
}

/**
 * Cache structure stored in localStorage
 */
interface WikipediaCache {
  version: number;
  entries: Record<string, CacheEntry>;
}

/**
 * Normalize title for cache key
 */
function normalizeKey(title: string): string {
  return title.toLowerCase().trim();
}

/**
 * Get cache from localStorage
 */
function getCache(): WikipediaCache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return { version: CACHE_VERSION, entries: {} };
    }
    const cache = JSON.parse(raw) as WikipediaCache;
    // Reset cache if version mismatch
    if (cache.version !== CACHE_VERSION) {
      return { version: CACHE_VERSION, entries: {} };
    }
    return cache;
  } catch {
    return { version: CACHE_VERSION, entries: {} };
  }
}

/**
 * Save cache to localStorage
 */
function saveCache(cache: WikipediaCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    // Storage full or not available - silently fail
    if (process.env.NODE_ENV === 'development') {
      console.warn('[WikipediaCache] Failed to save cache:', error);
    }
  }
}

/**
 * Check if a cache entry is expired
 */
function isExpired(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp > TTL_MS;
}

/**
 * Evict oldest entries to make room (LRU eviction)
 */
function evictOldest(cache: WikipediaCache, countToEvict: number): void {
  const entries = Object.entries(cache.entries);
  // Sort by lastAccess ascending (oldest first)
  entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);

  // Remove the oldest entries
  for (let i = 0; i < countToEvict && i < entries.length; i++) {
    delete cache.entries[entries[i][0]];
  }
}

/**
 * Get entry from cache (returns null if not found or expired)
 */
function getCacheEntry(title: string): WikipediaData | null | undefined {
  const cache = getCache();
  const key = normalizeKey(title);
  const entry = cache.entries[key];

  if (!entry) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[WikipediaCache] MISS: "${title}"`);
    }
    return undefined; // Not in cache
  }

  if (isExpired(entry)) {
    // Entry expired - remove it
    delete cache.entries[key];
    saveCache(cache);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[WikipediaCache] EXPIRED: "${title}"`);
    }
    return undefined;
  }

  // Update last access time
  entry.lastAccess = Date.now();
  saveCache(cache);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[WikipediaCache] HIT: "${title}"`);
  }

  return entry.data; // Could be null (cached "not found")
}

/**
 * Set entry in cache
 */
function setCacheEntry(title: string, data: WikipediaData | null): void {
  const cache = getCache();
  const key = normalizeKey(title);

  // Check if we need to evict
  const entryCount = Object.keys(cache.entries).length;
  if (entryCount >= MAX_CACHE_ENTRIES && !cache.entries[key]) {
    // Evict 10% of entries
    const toEvict = Math.ceil(MAX_CACHE_ENTRIES * 0.1);
    evictOldest(cache, toEvict);
  }

  // Store the entry
  cache.entries[key] = {
    data,
    timestamp: Date.now(),
    lastAccess: Date.now(),
  };

  saveCache(cache);
}

/**
 * Fetch Wikipedia data with in-flight deduplication
 * If a request is already in progress for the same title, returns that promise
 */
function fetchWithDedup(
  title: string,
  nodeType?: NodeTypeHint
): Promise<WikipediaData | null> {
  const key = normalizeKey(title);

  // Reuse existing in-flight request
  const existing = inFlightRequests.get(key);
  if (existing) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[WikipediaCache] DEDUP: "${title}" (awaiting existing request)`);
    }
    return existing;
  }

  // Create new request with cleanup
  const request = fetchWikipediaSummary(title, nodeType)
    .then((result) => {
      setCacheEntry(title, result);
      return result;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });

  inFlightRequests.set(key, request);
  return request;
}

/**
 * Hook return type
 */
export interface UseWikipediaDataResult {
  /** Wikipedia data if available */
  data: WikipediaData | null;
  /** Whether data is currently being fetched */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
}

/**
 * Props for the hook
 */
export interface UseWikipediaDataProps {
  /** Wikipedia page title (e.g., "Geoffrey_Hinton") */
  wikipediaTitle?: string;
  /** Node type for disambiguation hints */
  nodeType?: NodeTypeHint;
  /** Whether to skip fetching (e.g., if local data is sufficient) */
  skip?: boolean;
}

/**
 * Custom hook to fetch Wikipedia data with caching
 *
 * @example
 * const { data, loading, error } = useWikipediaData({
 *   wikipediaTitle: node.wikipediaTitle,
 *   nodeType: node.type,
 * });
 */
export function useWikipediaData({
  wikipediaTitle,
  nodeType,
  skip = false,
}: UseWikipediaDataProps): UseWikipediaDataResult {
  const [data, setData] = useState<WikipediaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Don't fetch if no title, skipped, or already loading
    if (!wikipediaTitle || skip) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first
    const cached = getCacheEntry(wikipediaTitle);
    if (cached !== undefined) {
      // Cache hit (could be null for "not found")
      setData(cached);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch from Wikipedia API
    setLoading(true);
    setError(null);

    try {
      const result = await fetchWithDedup(wikipediaTitle, nodeType);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Wikipedia data';
      setError(errorMessage);
      // Don't cache errors (might be temporary)
    } finally {
      setLoading(false);
    }
  }, [wikipediaTitle, nodeType, skip]);

  // Fetch on mount or when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
}

/**
 * Clear the entire Wikipedia cache (useful for testing)
 */
export function clearWikipediaCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Get cache statistics (useful for debugging)
 */
export function getWikipediaCacheStats(): {
  entryCount: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
} {
  const cache = getCache();
  const entries = Object.values(cache.entries);

  if (entries.length === 0) {
    return { entryCount: 0, oldestEntry: null, newestEntry: null };
  }

  const timestamps = entries.map((e) => e.timestamp);
  return {
    entryCount: entries.length,
    oldestEntry: new Date(Math.min(...timestamps)),
    newestEntry: new Date(Math.max(...timestamps)),
  };
}

export default useWikipediaData;
