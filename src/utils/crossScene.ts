/**
 * Cross-scene (cross-dataset) navigation utilities
 *
 * These utilities help with navigating between the same entity
 * across different datasets, handling URL construction and
 * state management for cross-scene discovery.
 */

import { buildNodeUrl, buildExploreUrl } from './urlBuilder';
import type { CrossSceneAppearance } from '@contexts/CrossSceneContext';

/**
 * Build a URL for navigating to a node in another dataset
 *
 * This is the primary navigation target for cross-scene links.
 * Always navigates to the node detail page (stable permalink).
 *
 * @param targetDatasetId - The dataset to navigate to
 * @param targetNodeId - The node ID in that dataset
 * @returns URL path for React Router Link
 *
 * @example
 * const url = buildCrossSceneNodeUrl('cybernetics', 'person-hinton');
 * // Returns: '/cybernetics/node/person-hinton'
 */
export function buildCrossSceneNodeUrl(
  targetDatasetId: string,
  targetNodeId: string
): string {
  return buildNodeUrl(targetDatasetId, targetNodeId);
}

/**
 * Build a URL for cross-scene navigation with specific layout
 *
 * Use this when you want to preserve or set a specific layout
 * for the cross-scene navigation (e.g., force-graph, timeline, radial).
 *
 * IMPORTANT: This function intentionally omits filters and search terms.
 * Cross-scene navigation always starts with a clean slate, only preserving layout.
 *
 * @param targetDatasetId - The dataset to navigate to
 * @param targetNodeId - The node ID in that dataset
 * @param layout - Optional layout to use (e.g., 'force-graph', 'timeline', 'radial')
 * @returns URL path for React Router Link
 *
 * @example
 * const url = buildCrossSceneExploreUrl('cybernetics', 'person-hinton', 'timeline');
 * // Returns: '/cybernetics/explore?selected=person-hinton&type=node&layout=timeline'
 * // Note: No filters or search terms - intentionally cleared
 */
export function buildCrossSceneExploreUrl(
  targetDatasetId: string,
  targetNodeId: string,
  layout?: 'graph' | 'timeline' | 'radial'
): string {
  return buildExploreUrl(targetDatasetId, {
    selected: targetNodeId,
    type: 'node',
    layout,
  });
}

/**
 * Build URL from a CrossSceneAppearance object
 *
 * Convenience function for directly converting an appearance
 * object to a navigation URL.
 *
 * @param appearance - The cross-scene appearance object
 * @returns URL path for React Router Link
 *
 * @example
 * const appearance = { datasetId: 'cybernetics', nodeId: 'person-hinton', ... };
 * const url = buildUrlFromAppearance(appearance);
 */
export function buildUrlFromAppearance(
  appearance: CrossSceneAppearance
): string {
  return buildCrossSceneNodeUrl(appearance.datasetId, appearance.nodeId);
}

/**
 * Extract the "other networks" count for display
 *
 * Given a list of appearances (excluding current dataset),
 * returns the count in a format suitable for UI display.
 *
 * @param appearances - List of appearances (already filtered to exclude current)
 * @returns Count of other networks
 *
 * @example
 * const count = getOtherNetworksCount(appearances);
 * // Use in UI: "Appears in ${count} other networks"
 */
export function getOtherNetworksCount(
  appearances: CrossSceneAppearance[]
): number {
  return appearances.length;
}

/**
 * Format the networks count for display text
 *
 * @param count - Number of other networks
 * @returns Formatted text (e.g., "2 other networks", "1 other network")
 *
 * @example
 * formatNetworksCount(2) // "2 other networks"
 * formatNetworksCount(1) // "1 other network"
 */
export function formatNetworksCount(count: number): string {
  if (count === 1) {
    return '1 other network';
  }
  return `${count} other networks`;
}

/**
 * Format the multi-scene tooltip text
 *
 * Creates the tooltip text shown when hovering over a multi-scene node
 * in the graph visualization.
 *
 * @param nodeTitle - The title of the node
 * @param totalDatasets - Total number of datasets (including current)
 * @returns Formatted tooltip text
 *
 * @example
 * formatMultiSceneTooltip("Geoffrey Hinton", 3)
 * // Returns: "Geoffrey Hinton · In 3 networks"
 */
export function formatMultiSceneTooltip(
  nodeTitle: string,
  totalDatasets: number
): string {
  return `${nodeTitle} · In ${totalDatasets} networks`;
}
