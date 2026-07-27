/**
 * URL-building helpers for ResourceMeta.
 *
 * Kept in a separate module (not ResourceMeta.tsx) so the component file only
 * exports components, which keeps React Fast Refresh working.
 */

export const PRODUCTION_BASE_URL = 'https://scenius-seven.vercel.app';

/**
 * Build dynamic OG image URL for a dataset
 */
export function buildDatasetOgImageUrl(datasetId: string): string {
  // SECURITY: constructed URL with URL API (F3)
  const url = new URL('/api/og', PRODUCTION_BASE_URL);
  url.searchParams.set('dataset', datasetId);
  return url.toString();
}

/**
 * Build dynamic OG image URL for a node
 */
export function buildNodeOgImageUrl(datasetId: string, nodeId: string): string {
  // SECURITY: constructed URL with URL API (F3)
  const url = new URL('/api/og', PRODUCTION_BASE_URL);
  url.searchParams.set('dataset', datasetId);
  url.searchParams.set('node', nodeId);
  return url.toString();
}

/**
 * Build dynamic OG image URL for an edge
 */
export function buildEdgeOgImageUrl(datasetId: string, sourceId: string, targetId: string): string {
  // SECURITY: constructed URL with URL API (F3)
  const url = new URL('/api/og', PRODUCTION_BASE_URL);
  url.searchParams.set('dataset', datasetId);
  url.searchParams.set('sourceId', sourceId);
  url.searchParams.set('targetId', targetId);
  return url.toString();
}
