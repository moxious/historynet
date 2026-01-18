/**
 * Hook for extracting route parameters from resource URLs
 * 
 * Supports two route patterns:
 * - Node: /:datasetId/node/:nodeId
 * - Edge: /:datasetId/from/:sourceId/to/:targetId
 */

import { useParams } from 'react-router-dom';
import { useMemo } from 'react';

interface NodeResourceParams {
  type: 'node';
  datasetId: string;
  nodeId: string;
}

interface EdgeResourceParams {
  type: 'edge';
  datasetId: string;
  sourceId: string;
  targetId: string;
}

interface InvalidResourceParams {
  type: 'invalid';
  error: string;
}

export type ResourceParams = NodeResourceParams | EdgeResourceParams | InvalidResourceParams;

/**
 * Extract and validate route parameters for resource pages
 */
export function useResourceParams(): ResourceParams {
  const params = useParams<{
    datasetId?: string;
    nodeId?: string;
    sourceId?: string;
    targetId?: string;
  }>();

  return useMemo(() => {
    const { datasetId, nodeId, sourceId, targetId } = params;

    // Validate dataset ID is present
    if (!datasetId) {
      return {
        type: 'invalid',
        error: 'Missing dataset ID',
      };
    }

    // Node route: /:datasetId/node/:nodeId
    if (nodeId) {
      return {
        type: 'node',
        datasetId,
        nodeId,
      };
    }

    // Edge route: /:datasetId/from/:sourceId/to/:targetId
    if (sourceId && targetId) {
      return {
        type: 'edge',
        datasetId,
        sourceId,
        targetId,
      };
    }

    // Invalid route configuration
    return {
      type: 'invalid',
      error: 'Invalid route parameters',
    };
  }, [params]);
}

/**
 * Build a stable URL path for a node resource (for use with HashRouter Link)
 * Returns path without the hash prefix - HashRouter adds that automatically
 */
export function buildNodeUrl(datasetId: string, nodeId: string): string {
  return `/${encodeURIComponent(datasetId)}/node/${encodeURIComponent(nodeId)}`;
}

/**
 * Build a stable URL path for an edge resource (for use with HashRouter Link)
 * Returns path without the hash prefix
 */
export function buildEdgeUrl(datasetId: string, sourceId: string, targetId: string): string {
  return `/${encodeURIComponent(datasetId)}/from/${encodeURIComponent(sourceId)}/to/${encodeURIComponent(targetId)}`;
}

/**
 * Build a graph view URL path with item selected (for use with HashRouter Link)
 * Returns path without the hash prefix
 */
export function buildGraphViewUrl(
  datasetId: string,
  itemType: 'node' | 'edge',
  itemId: string
): string {
  return `/?dataset=${encodeURIComponent(datasetId)}&selected=${encodeURIComponent(itemId)}&type=${itemType}`;
}

/**
 * Build a full shareable URL for a node (includes hash for clipboard/sharing)
 */
export function buildFullNodeUrl(datasetId: string, nodeId: string): string {
  return `${window.location.origin}${window.location.pathname}#/${encodeURIComponent(datasetId)}/node/${encodeURIComponent(nodeId)}`;
}

/**
 * Build a full shareable URL for an edge (includes hash for clipboard/sharing)
 */
export function buildFullEdgeUrl(datasetId: string, sourceId: string, targetId: string): string {
  return `${window.location.origin}${window.location.pathname}#/${encodeURIComponent(datasetId)}/from/${encodeURIComponent(sourceId)}/to/${encodeURIComponent(targetId)}`;
}
