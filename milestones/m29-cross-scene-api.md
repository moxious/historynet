# M29: Cross-Scene Node Index API

**Status**: ✅ Complete (2026-01-30)
**Track**: B (Infrastructure & Backend)
**Depends on**: M24 (Vercel Migration) ✅
**Blocks**: M30 (Cross-Scene UI) - M30 requires this API to be complete

## Integration Context

### Existing Codebase Structure

**API Routes** (`/api/`):
- Vercel serverless functions using `@vercel/node`
- Examples: `/api/submit-feedback.ts`, `/api/health.ts`, `/api/og.tsx`
- Pattern: Export default function with `VercelRequest` and `VercelResponse` types
- New endpoint will be: `/api/node-scenes.ts`

**Dataset Structure** (`public/datasets/`):
- 12 datasets total
- Each has: `manifest.json`, `nodes.json`, `edges.json`
- Nodes have optional fields: `wikidataId`, `wikipediaTitle`, `id` (nodeId)
- **Coverage**: 79% have `wikidataId`, 88% have `wikipediaTitle`, 11.5% have neither

**Build Process**:
- Build scripts in `scripts/` directory
- Scripts run during deployment (see `.github/workflows/` or `vercel.json`)
- Index should be generated pre-deployment and committed to git

**Cross-Dataset Coverage** (from COVERAGE_REPORT.md):
- 44 entities appear in multiple datasets
- Top entity: London (Q84) in 8 datasets
- 118 potential cross-dataset links
- Best coverage: scientific-revolution (100%), statistics-social-physics (98%)
- Worst coverage: renaissance-humanism (61%), speculative-freemasonry (63%)

### Testing Strategy

**Test with all 12 datasets**:
1. scientific-revolution (100% coverage) - best case
2. statistics-social-physics (98% coverage) - nearly complete
3. florentine-academy (92% coverage) - excellent
4. All other datasets (61-88% coverage) - realistic cases

**Focus test entities**:
- London (Q84) - appears in 8 datasets
- Paris (Q90) - appears in 7 datasets
- Isaac Newton (Q935) - person appearing in 3 datasets
- Entities without wikidataId - fallback to wikipediaTitle/nodeId

**Known limitations**:
- ~11.5% of nodes lack both wikidataId and wikipediaTitle
- These nodes will not appear in cross-dataset index
- This is acceptable for MVP (79% coverage is strong)

## Goal

Create a build-time index and serverless API endpoint that, given a node's identity, returns all datasets containing that entity along with navigation metadata.

**Problem**: As the number of datasets grows, users have no way to discover that a figure like Marsilio Ficino appears in multiple scenes (Florentine Academy, Christian Kabbalah, Renaissance Humanism). This milestone enables cross-scene discovery and navigation.

## Identity Matching Rules

Two nodes are considered the **same entity** if **ANY** of the following match:

| Field | Example | Notes |
|-------|---------|-------|
| `wikidataId` | `Q154781` | Most reliable, stable Wikidata QID |
| `wikipediaTitle` | `Marsilio_Ficino` | Case-sensitive, underscores for spaces |
| `nodeId` | `person-marsilio-ficino` | Exact string match across datasets |

**If none match, the nodes are different entities** — no cross-scene link is created.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Index timing | Build-time generation | Avoids runtime overhead, predictable performance |
| Index storage | Multiple lookup indexes | Supports matching on wikidataId, wikipediaTitle, or nodeId |
| Identity matching | ANY of three fields | Maximizes discovery; wikidataId preferred but not required |
| Build memory | Stream datasets one at a time | Scales to hundreds of datasets without memory issues |
| API batching | Support multiple identifiers per request | Avoids N+1 query problem for dataset pre-fetch |

## Index Structure

Three parallel indexes for fast lookup by any identifier:

```
public/cross-scene-index/
├── manifest.json           # Index metadata, dataset list
├── by-wikidata/
│   ├── Q0-Q99999.json     # Sharded by QID numeric range
│   └── Q100000-Q199999.json
├── by-wikipedia/
│   └── titles.json        # Keyed by normalized title
└── by-nodeid/
    └── nodeids.json       # Keyed by exact nodeId
```

**Why three indexes?** Different datasets have different identifier coverage. Some have `wikidataId`, some only `wikipediaTitle`, some only consistent `nodeId` patterns. Three indexes ensure maximum cross-scene discovery.

## API Design

**Endpoint**: `GET /api/node-scenes`

### Single Lookup

**Query Parameters** (at least one required):
- `?wikidataId=Q154781` — Lookup by Wikidata QID
- `?wikipediaTitle=Marsilio_Ficino` — Lookup by Wikipedia title
- `?nodeId=person-ficino` — Lookup by node ID

### Batch Lookup (for pre-fetching)

**Query Parameters**:
- `?wikidataIds=Q154781,Q937,Q5879` — Comma-separated Wikidata QIDs
- `?wikipediaTitles=Marsilio_Ficino,Voltaire` — Comma-separated titles
- `?nodeIds=person-ficino,person-voltaire` — Comma-separated node IDs

Batch parameters can be combined to look up mixed identifier types in one request.

### Response (Single Lookup)

```json
{
  "identity": {
    "wikidataId": "Q154781",
    "wikipediaTitle": "Marsilio_Ficino",
    "canonicalTitle": "Marsilio Ficino"
  },
  "appearances": [
    {
      "datasetId": "florentine-academy",
      "datasetName": "Florentine Academy",
      "nodeId": "person-marsilio-ficino",
      "nodeTitle": "Marsilio Ficino"
    },
    {
      "datasetId": "christian-kabbalah",
      "datasetName": "Christian Kabbalah",
      "nodeId": "person-ficino",
      "nodeTitle": "Marsilio Ficino"
    }
  ],
  "totalAppearances": 2
}
```

### Response (Batch Lookup)

```json
{
  "results": {
    "Q154781": {
      "identity": { ... },
      "appearances": [ ... ],
      "totalAppearances": 2
    },
    "Q937": {
      "identity": { ... },
      "appearances": [ ... ],
      "totalAppearances": 3
    }
  },
  "notFound": ["Q999999999"]
}
```

## Tasks

### Index Build Script

- [x] **CS1** - Create `scripts/build-cross-scene-index/` directory
- [x] **CS2** - Implement dataset streaming (one at a time)
- [x] **CS3** - Build entity registry: merge nodes matching on any identifier
- [x] **CS4** - Add npm script: `npm run build:cross-scene-index`

### Index Output

- [x] **CS5** - Create `public/cross-scene-index/` directory structure
- [x] **CS6** - Generate `manifest.json` with index metadata and dataset list
- [x] **CS7** - Generate `by-wikidata/` sharded index files (Q-prefix ranges)
- [x] **CS8** - Generate `by-wikipedia/titles.json` index
- [x] **CS9** - Generate `by-nodeid/nodeids.json` index

### Serverless Endpoint

- [x] **CS10** - Create `/api/node-scenes.ts` serverless function
- [x] **CS11** - Implement single-lookup: `?wikidataId=`, `?wikipediaTitle=`, `?nodeId=`
- [x] **CS12** - Implement batch-lookup: `?wikidataIds=`, `?wikipediaTitles=`, `?nodeIds=`
- [x] **CS13** - Load only relevant index files (shard selection)
- [x] **CS14** - Return appearances array (single) or results map (batch)
- [x] **CS15** - Handle not-found cases gracefully (empty appearances, not 404)

### CI Integration

- [x] **CS16** - Add index rebuild to deployment workflow
- [x] **CS17** - Validate index generation with all datasets
- [x] **CS18** - Ensure index is included in Vercel deployment

## Key Deliverables

1. **Index build script**: `scripts/build-cross-scene-index/`
2. **Index output**: `public/cross-scene-index/` with three lookup paths
3. **Serverless endpoint**: `/api/node-scenes` with single and batch modes
4. **CI integration**: Index rebuilt on every deployment

## Notes

- **M30 depends on this milestone** - Complete and deploy M29 before starting M30
- Batch API is critical for M30 performance — allows pre-fetching all nodes in a dataset with one request
- Index files are static JSON, loaded on-demand by the serverless function
- Sharding by wikidataId prefix keeps individual shard files small for fast loading
- ~21% of nodes lack identifiers - acceptable limitation for MVP

## Implementation Order

1. **CS1-CS9**: Build index (can be done locally, test output)
2. **CS10-CS15**: Build API endpoint (test with local index)
3. **CS16-CS18**: CI integration (ensures index rebuilds on deployment)

## Validation Checklist

Before marking milestone complete:
- [x] Index generated successfully for all 12 datasets
- [x] API returns correct results for London (Q84) - shows 8 datasets ✅
- [x] API returns correct results for Paris (Q90) - shows 7 datasets ✅
- [x] API returns correct results for Isaac Newton (Q935) - shows 3 datasets ✅
- [x] API handles missing wikidataId gracefully (returns empty appearances)
- [x] Batch API works with 10+ node IDs in single request
- [x] Index rebuilds automatically on deployment (vercel.json buildCommand)
- [x] API response time < 200ms for single lookup
- [x] API response time < 500ms for batch lookup (50 nodes)

## Implementation Details

**Completed**: 2026-01-30

**Files**:
- `/api/node-scenes.ts` - Serverless API endpoint (365 lines)
- `scripts/build-cross-scene-index/index.ts` - Index builder (331 lines)
- `public/cross-scene-index/` - Generated index files
- `vercel.json` - CI integration (line 4: `buildCommand`)

**Live API**: https://scenius-seven.vercel.app/api/node-scenes

**Example Queries**:
- London: `?wikidataId=Q84` → 8 datasets
- Isaac Newton: `?wikidataId=Q935` → 3 datasets
- Paris: `?wikidataId=Q90` → 7 datasets
