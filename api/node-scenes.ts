/**
 * Node Scenes API Endpoint
 *
 * Returns all datasets where a given entity appears, enabling cross-scene discovery.
 * Supports single and batch lookups by wikidataId, wikipediaTitle, or nodeId.
 *
 * @endpoint GET /api/node-scenes
 *
 * Single lookup query params (at least one required):
 * - ?wikidataId=Q154781
 * - ?wikipediaTitle=Marsilio_Ficino
 * - ?nodeId=person-ficino
 *
 * Batch lookup query params (comma-separated):
 * - ?wikidataIds=Q154781,Q937,Q5879
 * - ?wikipediaTitles=Marsilio_Ficino,Voltaire
 * - ?nodeIds=person-ficino,person-voltaire
 *
 * @returns Single lookup: { identity, appearances, totalAppearances }
 * @returns Batch lookup: { results: { [key]: {...} }, notFound: [...] }
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

interface EntityAppearance {
  datasetId: string;
  datasetName: string;
  nodeId: string;
  nodeTitle: string;
}

interface EntityRecord {
  wikidataId?: string;
  wikipediaTitle?: string;
  canonicalTitle: string;
  appearances: EntityAppearance[];
}

interface SingleLookupResponse {
  identity: {
    wikidataId?: string;
    wikipediaTitle?: string;
    canonicalTitle: string;
  };
  appearances: EntityAppearance[];
  totalAppearances: number;
}

interface BatchLookupResponse {
  results: Record<string, SingleLookupResponse>;
  notFound: string[];
}

/**
 * Set CORS headers for cross-origin requests
 */
function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Get the shard filename for a wikidata QID
 */
function getWikidataShardFilename(qid: string): string {
  const match = qid.match(/^Q(\d+)$/);
  if (!match) {
    return 'other.json';
  }

  const num = parseInt(match[1], 10);
  const shardStart = Math.floor(num / 100000) * 100000;
  const shardEnd = shardStart + 99999;

  return `Q${shardStart}-Q${shardEnd}.json`;
}

/**
 * Load a wikidata index shard
 */
function loadWikidataShard(
  indexPath: string,
  qid: string
): Record<string, EntityRecord> | null {
  const shardName = getWikidataShardFilename(qid);
  const shardPath = path.join(indexPath, 'by-wikidata', shardName);

  if (!fs.existsSync(shardPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(shardPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to load wikidata shard ${shardName}:`, error);
    return null;
  }
}

/**
 * Load the wikipedia index
 */
function loadWikipediaIndex(
  indexPath: string
): Record<string, EntityRecord> | null {
  const indexFilePath = path.join(indexPath, 'by-wikipedia', 'titles.json');

  if (!fs.existsSync(indexFilePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(indexFilePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load wikipedia index:', error);
    return null;
  }
}

/**
 * Load the nodeid index
 */
function loadNodeIdIndex(
  indexPath: string
): Record<string, EntityRecord> | null {
  const indexFilePath = path.join(indexPath, 'by-nodeid', 'nodeids.json');

  if (!fs.existsSync(indexFilePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(indexFilePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load nodeid index:', error);
    return null;
  }
}

/**
 * Lookup entity by wikidataId
 */
function lookupByWikidataId(
  indexPath: string,
  wikidataId: string
): EntityRecord | null {
  const shard = loadWikidataShard(indexPath, wikidataId);
  if (!shard) {
    return null;
  }

  return shard[wikidataId] || null;
}

/**
 * Lookup entity by wikipediaTitle
 */
function lookupByWikipediaTitle(
  indexPath: string,
  wikipediaTitle: string
): EntityRecord | null {
  const index = loadWikipediaIndex(indexPath);
  if (!index) {
    return null;
  }

  return index[wikipediaTitle] || null;
}

/**
 * Lookup entity by nodeId
 */
function lookupByNodeId(
  indexPath: string,
  nodeId: string
): EntityRecord | null {
  const index = loadNodeIdIndex(indexPath);
  if (!index) {
    return null;
  }

  return index[nodeId] || null;
}

/**
 * Convert entity record to response format
 */
function formatEntityResponse(record: EntityRecord): SingleLookupResponse {
  return {
    identity: {
      wikidataId: record.wikidataId,
      wikipediaTitle: record.wikipediaTitle,
      canonicalTitle: record.canonicalTitle,
    },
    appearances: record.appearances,
    totalAppearances: record.appearances.length,
  };
}

/**
 * Handle single lookup request
 */
function handleSingleLookup(
  indexPath: string,
  query: {
    wikidataId?: string;
    wikipediaTitle?: string;
    nodeId?: string;
  }
): SingleLookupResponse | null {
  // Try each identifier in order of preference
  if (query.wikidataId) {
    const record = lookupByWikidataId(indexPath, query.wikidataId);
    if (record) {
      return formatEntityResponse(record);
    }
  }

  if (query.wikipediaTitle) {
    const record = lookupByWikipediaTitle(indexPath, query.wikipediaTitle);
    if (record) {
      return formatEntityResponse(record);
    }
  }

  if (query.nodeId) {
    const record = lookupByNodeId(indexPath, query.nodeId);
    if (record) {
      return formatEntityResponse(record);
    }
  }

  // Return empty result instead of null for not found
  return {
    identity: {
      wikidataId: query.wikidataId,
      wikipediaTitle: query.wikipediaTitle,
      canonicalTitle: '',
    },
    appearances: [],
    totalAppearances: 0,
  };
}

/**
 * Handle batch lookup request
 */
function handleBatchLookup(
  indexPath: string,
  query: {
    wikidataIds?: string;
    wikipediaTitles?: string;
    nodeIds?: string;
  }
): BatchLookupResponse {
  const results: Record<string, SingleLookupResponse> = {};
  const notFound: string[] = [];

  // Process wikidataIds
  if (query.wikidataIds) {
    const ids = query.wikidataIds.split(',').map(id => id.trim());
    for (const id of ids) {
      const result = handleSingleLookup(indexPath, { wikidataId: id });
      if (result && result.totalAppearances > 0) {
        results[id] = result;
      } else {
        notFound.push(id);
      }
    }
  }

  // Process wikipediaTitles
  if (query.wikipediaTitles) {
    const titles = query.wikipediaTitles.split(',').map(t => t.trim());
    for (const title of titles) {
      const result = handleSingleLookup(indexPath, { wikipediaTitle: title });
      if (result && result.totalAppearances > 0) {
        results[title] = result;
      } else {
        notFound.push(title);
      }
    }
  }

  // Process nodeIds
  if (query.nodeIds) {
    const ids = query.nodeIds.split(',').map(id => id.trim());
    for (const id of ids) {
      const result = handleSingleLookup(indexPath, { nodeId: id });
      if (result && result.totalAppearances > 0) {
        results[id] = result;
      } else {
        notFound.push(id);
      }
    }
  }

  return { results, notFound };
}

/**
 * Main handler
 */
export default function handler(
  req: VercelRequest,
  res: VercelResponse
): VercelResponse | void {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const indexPath = path.join(process.cwd(), 'public', 'cross-scene-index');

  // Check if index exists
  if (!fs.existsSync(indexPath)) {
    return res.status(503).json({
      error: 'Cross-scene index not available',
      message: 'Index has not been generated yet',
    });
  }

  const query = req.query as {
    wikidataId?: string;
    wikipediaTitle?: string;
    nodeId?: string;
    wikidataIds?: string;
    wikipediaTitles?: string;
    nodeIds?: string;
  };

  // Determine if this is a batch or single lookup
  const isBatch =
    query.wikidataIds || query.wikipediaTitles || query.nodeIds;

  if (isBatch) {
    // Handle batch lookup
    const result = handleBatchLookup(indexPath, query);
    return res.status(200).json(result);
  } else {
    // Handle single lookup
    if (!query.wikidataId && !query.wikipediaTitle && !query.nodeId) {
      return res.status(400).json({
        error: 'Missing identifier',
        message: 'Provide at least one of: wikidataId, wikipediaTitle, nodeId',
      });
    }

    const result = handleSingleLookup(indexPath, query);
    return res.status(200).json(result);
  }
}
