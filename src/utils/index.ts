/**
 * Central export point for all utilities
 */

export {
  loadManifest,
  loadNodes,
  loadEdges,
  loadGraphData,
  loadDataset,
  validateEdgeReferences,
  DatasetLoadError,
  AVAILABLE_DATASETS,
  DEFAULT_DATASET_ID,
  isValidDatasetId,
} from './dataLoader';

export {
  parseYear,
  nodeMatchesDateRange,
  edgeMatchesDateRange,
  nodeMatchesNameFilter,
  nodeMatchesTypeFilter,
  edgeMatchesRelationshipFilter,
  filterGraphData,
  getFilterStats,
  getGraphDateRange,
  getNodeTypeCounts,
  getRelationshipTypeCounts,
} from './filterGraph';

export { getNodeColor, getEdgeColor, getNodeTypeEmoji } from './graphColors';

export {
  detectSegments,
  findDensestSegment,
  createSegmentedScale,
  createPerYearHeightMap,
  getTickGranularity,
  generateTicks,
  dateToDecimalYear,
  type TimelineSegment,
  type SegmentedScale,
  type SegmentConfig,
  type YearHeightMap,
  type YearHeightConfig,
  type TickGranularity,
  type TickInfo,
} from './timelineSegments';

export { sanitizeUrl, isValidImageUrl } from './urlSanitizer';

export {
  buildDatasetUrl,
  buildExploreUrl,
  buildNodeUrl as buildNodePath,
  buildEdgeUrl as buildEdgePath,
  buildFullDatasetUrl,
  buildFullExploreUrl,
  buildFullNodeUrl,
  buildFullEdgeUrl,
  buildGraphViewUrl,
} from './urlBuilder';
