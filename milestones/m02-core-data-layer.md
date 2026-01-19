# M2: Core Data Layer

**Status**: ✅ Complete (2026-01-18)
**Track**: MVP (Core Application)
**Depends on**: M1 (Project Bootstrap)

## Goal

Create TypeScript types matching the GRAPH_SCHEMA.md specification, implement data loading utilities, and set up state management with URL sync for dataset selection.

## Tasks

### TypeScript Types
- [x] Create `src/types/node.ts` with node interfaces (BaseNode, PersonNode, etc.)
- [x] Create `src/types/edge.ts` with edge interface
- [x] Create `src/types/dataset.ts` with manifest and dataset interfaces
- [x] Create `src/types/graph.ts` with combined graph data interface
- [x] Export all types from `src/types/index.ts`

### Data Loading
- [x] Create `src/utils/dataLoader.ts` with dataset loading functions
- [x] Implement `loadManifest(datasetId)` function
- [x] Implement `loadNodes(datasetId)` function
- [x] Implement `loadEdges(datasetId)` function
- [x] Implement `loadDataset(datasetId)` combining all loading
- [x] Add error handling for missing/malformed datasets

### State Management
- [x] Create `src/hooks/useGraphData.ts` for graph data state
- [x] Create `src/hooks/useSelectedItem.ts` for selection state
- [x] Create `src/hooks/useDataset.ts` for dataset management
- [x] Implement dataset switching logic

### URL State
- [x] Set up React Router for URL management
- [x] Create `src/hooks/useUrlState.ts` for URL parameter sync
- [x] Implement dataset ID in URL parameters
- [x] Implement URL reading on initial load

## Completion Notes

```
[2026-01-18] @claude: Completed Milestone 2 - Core Data Layer
- Created comprehensive TypeScript types matching GRAPH_SCHEMA.md:
  - node.ts: BaseNode, PersonNode, ObjectNode, LocationNode, EntityNode with type guards
  - edge.ts: GraphEdge with relationship types and helper functions
  - dataset.ts: DatasetManifest, DatasetSummary, DatasetsConfig
  - graph.ts: GraphData, Dataset, Selection types and utility functions
- Implemented dataLoader.ts with:
  - loadManifest(), loadNodes(), loadEdges(), loadGraphData(), loadDataset()
  - DatasetLoadError class for typed error handling
  - validateEdgeReferences() for data validation
- Created React hooks for state management:
  - useGraphData: manages dataset loading and provides data accessors
  - useSelectedItem: manages node/edge selection state
  - useDataset: combines data loading with URL state (depends on useUrlState)
  - useUrlState: React Router integration for URL parameter sync
- Added GraphContext with GraphProvider for sharing state across components
- Installed react-router-dom and integrated BrowserRouter
- Updated MainLayout to show loading/error states and display loaded dataset stats
- Updated vite.config.ts with regex-based path aliases for proper resolution
```
