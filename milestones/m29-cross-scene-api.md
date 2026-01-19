# M29: Cross-Scene Node Index API

**Status**: 🔲 Future
**Track**: B (Infrastructure & Backend)
**Depends on**: M24 (Vercel Migration) ✅

## Goal

Create a build-time index and serverless API endpoint that, given a node's identity (via `wikidataId` or `wikipediaTitle`), returns all datasets containing that entity along with navigation metadata.

**Problem**: As the number of datasets grows, users have no way to discover that a figure like Marsilio Ficino appears in multiple scenes (Florentine Academy, Christian Kabbalah, Renaissance Humanism). This milestone enables cross-scene discovery and navigation.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Index timing | Build-time generation | Avoids runtime overhead, predictable performance |
| Index storage | Sharded by `wikidataId` prefix | Keeps per-query memory low, scales to many datasets |
| Join key | `wikidataId` (primary), `wikipediaTitle` (fallback) | Wikidata QIDs are stable identifiers |
| Build memory | Stream datasets one at a time | Scales to hundreds of datasets without memory issues |

## Why Sharding?

With a "database" of potentially hundreds of JSON dataset files, we must avoid:
- Loading all datasets into memory to build an index
- Loading the entire index into memory to answer one query

**Sharded approach**: Index files are split by wikidataId range (e.g., `Q0-Q99999.json`, `Q100000-Q199999.json`). A query for `Q154781` loads only the relevant shard.

## API Design

**Endpoint**: `GET /api/node-scenes`

**Query Parameters** (at least one required):
- `?wikidataId=Q154781` — Primary lookup
- `?wikipediaTitle=Marsilio_Ficino` — Fallback lookup
- `?nodeId=person-ficino&dataset=florentine-academy` — Resolve from specific node

**Response**:
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

## Tasks

### Index Build Script

- [ ] **CS1** - Create `scripts/build-cross-scene-index/` directory
- [ ] **CS2** - Implement dataset streaming (one at a time)
- [ ] **CS3** - Generate sharded index files by wikidataId prefix
- [ ] **CS4** - Add npm script: `npm run build:cross-scene-index`

### Index Output

- [ ] **CS5** - Create `public/cross-scene-index/` directory
- [ ] **CS6** - Generate `manifest.json` with shard list and metadata
- [ ] **CS7** - Generate `Q{start}-Q{end}.json` sharded index files

### Serverless Endpoint

- [ ] **CS8** - Create `/api/node-scenes.ts` serverless function
- [ ] **CS9** - Accept `?wikidataId=`, `?wikipediaTitle=`, or `?nodeId=&dataset=`
- [ ] **CS10** - Load only the relevant shard
- [ ] **CS11** - Return appearances array

### CI Integration

- [ ] **CS12** - Add index rebuild to deployment workflow
- [ ] **CS13** - Test index generation with all datasets

### Fallback Lookup

- [ ] **CS14** - Implement `?wikipediaTitle=` search for matching title
- [ ] **CS15** - Handle case when no matches found

## Key Deliverables

1. **Index build script**: `scripts/build-cross-scene-index/`
2. **Index output**: `public/cross-scene-index/`
3. **Serverless endpoint**: `/api/node-scenes`
4. **CI integration**: Index rebuilt on every deployment
