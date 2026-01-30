#!/usr/bin/env node
/**
 * Cross-Scene Index Builder
 *
 * Scans all datasets in public/datasets/ and builds lookup indexes
 * for cross-dataset entity discovery.
 *
 * Outputs three parallel indexes:
 * - by-wikidata/: Sharded by QID numeric range
 * - by-wikipedia/: Keyed by normalized Wikipedia title
 * - by-nodeid/: Keyed by exact node ID
 *
 * Usage: npm run build:cross-scene-index
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Node {
  id: string;
  type: string;
  title: string;
  wikidataId?: string;
  wikipediaTitle?: string;
}

interface Manifest {
  id: string;
  name: string;
  description: string;
}

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

type EntityIndex = Map<string, EntityRecord>;

// Define QID ranges for sharding (100k per shard)
const QID_SHARD_SIZE = 100000;

/**
 * Get all dataset directories
 */
function getDatasetDirs(datasetsPath: string): string[] {
  const entries = fs.readdirSync(datasetsPath, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => !name.startsWith('.'));
}

/**
 * Load a dataset's manifest
 */
function loadManifest(datasetPath: string): Manifest | null {
  const manifestPath = path.join(datasetPath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to load manifest for ${datasetPath}:`, error);
    return null;
  }
}

/**
 * Load a dataset's nodes
 */
function loadNodes(datasetPath: string): Node[] {
  const nodesPath = path.join(datasetPath, 'nodes.json');
  if (!fs.existsSync(nodesPath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(nodesPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to load nodes for ${datasetPath}:`, error);
    return [];
  }
}

/**
 * Build entity indexes from all datasets
 */
function buildIndexes(datasetsPath: string): {
  byWikidata: EntityIndex;
  byWikipedia: EntityIndex;
  byNodeId: EntityIndex;
  datasetList: Array<{ id: string; name: string }>;
} {
  const byWikidata: EntityIndex = new Map();
  const byWikipedia: EntityIndex = new Map();
  const byNodeId: EntityIndex = new Map();
  const datasetList: Array<{ id: string; name: string }> = [];

  const datasetDirs = getDatasetDirs(datasetsPath);

  console.log(`Found ${datasetDirs.length} datasets`);

  for (const datasetDir of datasetDirs) {
    const datasetPath = path.join(datasetsPath, datasetDir);
    const manifest = loadManifest(datasetPath);

    if (!manifest) {
      console.warn(`Skipping ${datasetDir}: no valid manifest`);
      continue;
    }

    datasetList.push({ id: manifest.id, name: manifest.name });
    console.log(`Processing ${manifest.name} (${manifest.id})...`);

    const nodes = loadNodes(datasetPath);
    let processedCount = 0;
    let skippedCount = 0;

    for (const node of nodes) {
      // Skip nodes without any identifiers
      if (!node.wikidataId && !node.wikipediaTitle && !node.id) {
        skippedCount++;
        continue;
      }

      const appearance: EntityAppearance = {
        datasetId: manifest.id,
        datasetName: manifest.name,
        nodeId: node.id,
        nodeTitle: node.title,
      };

      // Index by wikidataId
      if (node.wikidataId) {
        if (!byWikidata.has(node.wikidataId)) {
          byWikidata.set(node.wikidataId, {
            wikidataId: node.wikidataId,
            wikipediaTitle: node.wikipediaTitle,
            canonicalTitle: node.title,
            appearances: [],
          });
        }
        byWikidata.get(node.wikidataId)!.appearances.push(appearance);
      }

      // Index by wikipediaTitle
      if (node.wikipediaTitle) {
        if (!byWikipedia.has(node.wikipediaTitle)) {
          byWikipedia.set(node.wikipediaTitle, {
            wikidataId: node.wikidataId,
            wikipediaTitle: node.wikipediaTitle,
            canonicalTitle: node.title,
            appearances: [],
          });
        }
        byWikipedia.get(node.wikipediaTitle)!.appearances.push(appearance);
      }

      // Index by nodeId
      if (node.id) {
        if (!byNodeId.has(node.id)) {
          byNodeId.set(node.id, {
            wikidataId: node.wikidataId,
            wikipediaTitle: node.wikipediaTitle,
            canonicalTitle: node.title,
            appearances: [],
          });
        }
        byNodeId.get(node.id)!.appearances.push(appearance);
      }

      processedCount++;
    }

    console.log(`  ✓ Processed ${processedCount} nodes, skipped ${skippedCount}`);
  }

  console.log(`\nIndex summary:`);
  console.log(`  - Wikidata IDs: ${byWikidata.size}`);
  console.log(`  - Wikipedia titles: ${byWikipedia.size}`);
  console.log(`  - Node IDs: ${byNodeId.size}`);

  return { byWikidata, byWikipedia, byNodeId, datasetList };
}

/**
 * Get shard filename for a wikidata QID
 */
function getWikidataShardFilename(qid: string): string {
  const match = qid.match(/^Q(\d+)$/);
  if (!match) {
    return 'other.json';
  }

  const num = parseInt(match[1], 10);
  const shardStart = Math.floor(num / QID_SHARD_SIZE) * QID_SHARD_SIZE;
  const shardEnd = shardStart + QID_SHARD_SIZE - 1;

  return `Q${shardStart}-Q${shardEnd}.json`;
}

/**
 * Write indexes to disk
 */
function writeIndexes(
  outputPath: string,
  indexes: {
    byWikidata: EntityIndex;
    byWikipedia: EntityIndex;
    byNodeId: EntityIndex;
    datasetList: Array<{ id: string; name: string }>;
  }
): void {
  // Create output directory structure
  const dirs = [
    outputPath,
    path.join(outputPath, 'by-wikidata'),
    path.join(outputPath, 'by-wikipedia'),
    path.join(outputPath, 'by-nodeid'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Write manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    datasetCount: indexes.datasetList.length,
    datasets: indexes.datasetList,
    indexes: {
      wikidata: {
        totalEntities: indexes.byWikidata.size,
        shardCount: 0, // Will update after writing shards
      },
      wikipedia: {
        totalEntities: indexes.byWikipedia.size,
      },
      nodeid: {
        totalEntities: indexes.byNodeId.size,
      },
    },
  };

  // Write sharded wikidata index
  const wikidataShards = new Map<string, Record<string, EntityRecord>>();

  for (const [qid, record] of indexes.byWikidata.entries()) {
    const shardName = getWikidataShardFilename(qid);
    if (!wikidataShards.has(shardName)) {
      wikidataShards.set(shardName, {});
    }
    wikidataShards.get(shardName)![qid] = record;
  }

  console.log(`\nWriting ${wikidataShards.size} wikidata shards...`);
  for (const [shardName, shard] of wikidataShards.entries()) {
    const shardPath = path.join(outputPath, 'by-wikidata', shardName);
    fs.writeFileSync(shardPath, JSON.stringify(shard, null, 2));
    console.log(`  ✓ ${shardName}: ${Object.keys(shard).length} entries`);
  }

  manifest.indexes.wikidata.shardCount = wikidataShards.size;

  // Write wikipedia index
  const wikipediaIndex: Record<string, EntityRecord> = {};
  for (const [title, record] of indexes.byWikipedia.entries()) {
    wikipediaIndex[title] = record;
  }
  const wikipediaPath = path.join(outputPath, 'by-wikipedia', 'titles.json');
  fs.writeFileSync(wikipediaPath, JSON.stringify(wikipediaIndex, null, 2));
  console.log(`\nWrote wikipedia index: ${Object.keys(wikipediaIndex).length} entries`);

  // Write nodeid index
  const nodeidIndex: Record<string, EntityRecord> = {};
  for (const [nodeId, record] of indexes.byNodeId.entries()) {
    nodeidIndex[nodeId] = record;
  }
  const nodeidPath = path.join(outputPath, 'by-nodeid', 'nodeids.json');
  fs.writeFileSync(nodeidPath, JSON.stringify(nodeidIndex, null, 2));
  console.log(`Wrote nodeid index: ${Object.keys(nodeidIndex).length} entries`);

  // Write manifest
  const manifestPath = path.join(outputPath, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote manifest: ${manifestPath}`);

  console.log(`\n✅ Cross-scene index built successfully!`);
}

/**
 * Main entry point
 */
function main() {
  console.log('🔨 Building cross-scene index...\n');

  const projectRoot = path.resolve(__dirname, '../..');
  const datasetsPath = path.join(projectRoot, 'public', 'datasets');
  const outputPath = path.join(projectRoot, 'public', 'cross-scene-index');

  if (!fs.existsSync(datasetsPath)) {
    console.error(`❌ Datasets directory not found: ${datasetsPath}`);
    process.exit(1);
  }

  const indexes = buildIndexes(datasetsPath);
  writeIndexes(outputPath, indexes);
}

main();
