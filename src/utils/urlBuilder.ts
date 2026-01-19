/**
 * Centralized URL construction utilities for M31 Dataset Pages
 * 
 * URL Scheme:
 * - /:datasetId - Dataset overview page
 * - /:datasetId/explore - Graph/timeline/radial exploration view
 * - /:datasetId/node/:nodeId - Node detail page
 * - /:datasetId/from/:sourceId/to/:targetId - Edge detail page
 */

/**
 * Build URL for dataset overview page
 * @param datasetId - Dataset identifier
 * @returns Path for use with HashRouter Link
 */
export function buildDatasetUrl(datasetId: string): string {
  return `/${encodeURIComponent(datasetId)}`;
}

/**
 * Build URL for explore view (graph/timeline/radial)
 * @param datasetId - Dataset identifier
 * @param options - Optional query parameters
 * @returns Path for use with HashRouter Link
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
 * @returns Path for use with HashRouter Link
 */
export function buildNodeUrl(datasetId: string, nodeId: string): string {
  return `/${encodeURIComponent(datasetId)}/node/${encodeURIComponent(nodeId)}`;
}

/**
 * Build URL for edge detail page
 * @param datasetId - Dataset identifier
 * @param sourceId - Source node identifier
 * @param targetId - Target node identifier
 * @returns Path for use with HashRouter Link
 */
export function buildEdgeUrl(
  datasetId: string,
  sourceId: string,
  targetId: string
): string {
  return `/${encodeURIComponent(datasetId)}/from/${encodeURIComponent(sourceId)}/to/${encodeURIComponent(targetId)}`;
}

/**
 * Build full shareable URL for dataset overview (includes hash for clipboard/sharing)
 * @param datasetId - Dataset identifier
 * @returns Full URL including origin and hash
 */
export function buildFullDatasetUrl(datasetId: string): string {
  return `${window.location.origin}${window.location.pathname}#/${encodeURIComponent(datasetId)}`;
}

/**
 * Build full shareable URL for explore view (includes hash for clipboard/sharing)
 * @param datasetId - Dataset identifier
 * @param options - Optional query parameters
 * @returns Full URL including origin and hash
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
  return `${window.location.origin}${window.location.pathname}#${path}`;
}

/**
 * Build full shareable URL for node (includes hash for clipboard/sharing)
 * @param datasetId - Dataset identifier
 * @param nodeId - Node identifier
 * @returns Full URL including origin and hash
 */
export function buildFullNodeUrl(datasetId: string, nodeId: string): string {
  return `${window.location.origin}${window.location.pathname}#/${encodeURIComponent(datasetId)}/node/${encodeURIComponent(nodeId)}`;
}

/**
 * Build full shareable URL for edge (includes hash for clipboard/sharing)
 * @param datasetId - Dataset identifier
 * @param sourceId - Source node identifier
 * @param targetId - Target node identifier
 * @returns Full URL including origin and hash
 */
export function buildFullEdgeUrl(
  datasetId: string,
  sourceId: string,
  targetId: string
): string {
  return `${window.location.origin}${window.location.pathname}#/${encodeURIComponent(datasetId)}/from/${encodeURIComponent(sourceId)}/to/${encodeURIComponent(targetId)}`;
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
