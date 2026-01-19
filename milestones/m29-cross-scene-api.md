# M29: Cross-Scene Node Index API

**Status**: 🔲 Future
**Track**: B (Infrastructure & Backend)
**Depends on**: M24 (Vercel Migration) ✅

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

- [ ] **CS1** - Create `scripts/build-cross-scene-index/` directory
- [ ] **CS2** - Implement dataset streaming (one at a time)
- [ ] **CS3** - Build entity registry: merge nodes matching on any identifier
- [ ] **CS4** - Add npm script: `npm run build:cross-scene-index`

### Index Output

- [ ] **CS5** - Create `public/cross-scene-index/` directory structure
- [ ] **CS6** - Generate `manifest.json` with index metadata and dataset list
- [ ] **CS7** - Generate `by-wikidata/` sharded index files (Q-prefix ranges)
- [ ] **CS8** - Generate `by-wikipedia/titles.json` index
- [ ] **CS9** - Generate `by-nodeid/nodeids.json` index

### Serverless Endpoint

- [ ] **CS10** - Create `/api/node-scenes.ts` serverless function
- [ ] **CS11** - Implement single-lookup: `?wikidataId=`, `?wikipediaTitle=`, `?nodeId=`
- [ ] **CS12** - Implement batch-lookup: `?wikidataIds=`, `?wikipediaTitles=`, `?nodeIds=`
- [ ] **CS13** - Load only relevant index files (shard selection)
- [ ] **CS14** - Return appearances array (single) or results map (batch)
- [ ] **CS15** - Handle not-found cases gracefully (empty appearances, not 404)

### CI Integration

- [ ] **CS16** - Add index rebuild to deployment workflow
- [ ] **CS17** - Validate index generation with all datasets
- [ ] **CS18** - Ensure index is included in Vercel deployment

## Key Deliverables

1. **Index build script**: `scripts/build-cross-scene-index/`
2. **Index output**: `public/cross-scene-index/` with three lookup paths
3. **Serverless endpoint**: `/api/node-scenes` with single and batch modes
4. **CI integration**: Index rebuilt on every deployment

## Notes

- Batch API is critical for M30 performance — allows pre-fetching all nodes in a dataset with one request
- Index files are static JSON, loaded on-demand by the serverless function
- Sharding by wikidataId prefix keeps individual shard files small for fast loading
