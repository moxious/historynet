/**
 * Centralized URL construction utilities for M31 Dataset Pages
 * Updated for M33 BrowserRouter migration (no hash)
 * 
 * URL Scheme:
 * - /:datasetId - Dataset overview page
 * - /:datasetId/explore - Graph/timeline/radial exploration view
 * - /:datasetId/node/:nodeId - Node detail page
 * - /:datasetId/from/:sourceId/to/:targetId - Edge detail page
 */

/** Production base URL for absolute URLs */
const PRODUCTION_BASE_URL = 'https://scenius-seven.vercel.app';

/**
 * Build URL for dataset overview page
 * @param datasetId - Dataset identifier
 * @returns Path for use with BrowserRouter Link
 */
export function buildDatasetUrl(datasetId: string): string {
  return `/${encodeURIComponent(datasetId)}`;
}

/**
 * Build URL for explore view (graph/timeline/radial)
 * @param datasetId - Dataset identifier
 * @param options - Optional query parameters
 * @returns Path for use with BrowserRouter Link
 */
export function buildExploreUrl(
  datasetId: string,
  options?: {
    selected?: string;
    type?: 'node' | 'edge';
    layout?: 'graph' | 'timeline' | 'radial';
    theme?: string;
  }
): string {
  const base = `/${encodeURIComponent(datasetId)}/explore`;
  
  if (!options) {
    return base;
  }
  
  const params = new URLSearchParams();
  
  if (options.selected) {
    params.set('selected', options.selected);
  }
  if (options.type) {
    params.set('type', options.type);
  }
  if (options.layout) {
    params.set('layout', options.layout);
  }
  if (options.theme) {
    params.set('theme', options.theme);
  }
  
  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}

/**
 * Build URL for node detail page
 * @param datasetId - Dataset identifier
 * @param nodeId - Node identifier
 * @returns Path for use with BrowserRouter Link
 */
export function buildNodeUrl(datasetId: string, nodeId: string): string {
  return `/${encodeURIComponent(datasetId)}/node/${encodeURIComponent(nodeId)}`;
}

/**
 * Build URL for edge detail page
 * @param datasetId - Dataset identifier
 * @param sourceId - Source node identifier
 * @param targetId - Target node identifier
 * @returns Path for use with BrowserRouter Link
 */
export function buildEdgeUrl(
  datasetId: string,
  sourceId: string,
  targetId: string
): string {
  return `/${encodeURIComponent(datasetId)}/from/${encodeURIComponent(sourceId)}/to/${encodeURIComponent(targetId)}`;
}

/**
 * Get the base URL for full shareable URLs
 * In production, uses the production domain for consistent sharing
 * In development, uses current origin
 */
function getBaseUrl(): string {
  // In production (or when sharing), use the canonical production URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin;
  }
  // In development, still use production URL for consistent testing
  return PRODUCTION_BASE_URL;
}

/**
 * Build full shareable URL for dataset overview
 * @param datasetId - Dataset identifier
 * @returns Full absolute URL (no hash)
 */
export function buildFullDatasetUrl(datasetId: string): string {
  return `${getBaseUrl()}/${encodeURIComponent(datasetId)}`;
}

/**
 * Build full shareable URL for explore view
 * @param datasetId - Dataset identifier
 * @param options - Optional query parameters
 * @returns Full absolute URL (no hash)
 */
export function buildFullExploreUrl(
  datasetId: string,
  options?: {
    selected?: string;
    type?: 'node' | 'edge';
    layout?: 'graph' | 'timeline' | 'radial';
    theme?: string;
  }
): string {
  const path = buildExploreUrl(datasetId, options);
  return `${getBaseUrl()}${path}`;
}

/**
 * Build full shareable URL for node
 * @param datasetId - Dataset identifier
 * @param nodeId - Node identifier
 * @returns Full absolute URL (no hash)
 */
export function buildFullNodeUrl(datasetId: string, nodeId: string): string {
  return `${getBaseUrl()}/${encodeURIComponent(datasetId)}/node/${encodeURIComponent(nodeId)}`;
}

/**
 * Build full shareable URL for edge
 * @param datasetId - Dataset identifier
 * @param sourceId - Source node identifier
 * @param targetId - Target node identifier
 * @returns Full absolute URL (no hash)
 */
export function buildFullEdgeUrl(
  datasetId: string,
  sourceId: string,
  targetId: string
): string {
  return `${getBaseUrl()}/${encodeURIComponent(datasetId)}/from/${encodeURIComponent(sourceId)}/to/${encodeURIComponent(targetId)}`;
}

/**
 * Build graph view URL for backward compatibility
 * @deprecated Use buildExploreUrl instead
 */
export function buildGraphViewUrl(
  datasetId: string,
  itemType: 'node' | 'edge',
  itemId: string
): string {
  return buildExploreUrl(datasetId, { selected: itemId, type: itemType, layout: 'graph' });
}
