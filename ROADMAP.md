# HistoryNet - Roadmap

This document outlines the milestone structure and future direction for HistoryNet. For detailed task tracking, see `PROGRESS.md`.

**Live Demo**: https://scenius-seven.vercel.app/

---

## Milestone Overview

| # | Milestone | Status |
|---|-----------|--------|
| M1-M20 | Core Application (See Completed Milestones) | ✅ Complete |
| M21 | Dataset Search & Filter | ✅ Complete |
| M23 | Wikimedia Sourcing | ✅ Complete |
| M24 | Vercel Migration | ✅ Complete |
| M25 | User Feedback Feature | 🔲 Future (depends on M24) |
| M26 | Custom Domain | 🔲 Future (depends on M24) |
| M27 | Feedback Spam Protection | 🔲 Future (depends on M25) |
| M29 | Cross-Scene Node Index API | 🔲 Future (depends on M24) |
| M30 | Cross-Scene Navigation UI | 🔲 Future (depends on M29) |
| M31 | Dataset Pages | 🔲 Future |
| M32 | New Homepage | 🔲 Future (depends on M31) |

**Three Parallel Tracks:**

| Track | Milestones | Prerequisites |
|-------|------------|---------------|
| **A: Independent Features** | M21, M23 | None - can start immediately |
| **B: Infrastructure & Backend** | M24 → M25 → M27, M24 → M26, M24 → M29 → M30 | M24 is foundation for rest |
| **C: Information Architecture** | M31 → M32 | None - can start immediately |

> **Note**: Track A milestones are complete. Track B milestones have sequential dependencies starting from M24. Track C milestones restructure the app's navigation flow and can be developed independently of Track B.

---

## Completed Milestones (M1-M20)

The core application is complete, polished, and deployed. See `HISTORY.md` for detailed task lists and implementation notes.

**Core Features**:
- **Graph Visualization**: Force-directed D3 layout with zoom/pan, type-based node shapes, relationship-colored edges, tuned physics
- **Timeline Visualization**: Vertical timeline with date positioning, lifespan markers, automatic lane assignment
- **Radial View**: Ego-network layout centered on selected node with ring of connections
- **Infobox Panel**: Node/edge detail display with type-specific fields, images, internal links, evidence
- **Filtering**: Date range and text filters with URL sync, debounced inputs, collapsible panel
- **Search**: Instant highlighting with keyboard shortcut (Cmd/Ctrl+K)
- **Stable Resource URLs**: Permanent permalinks for nodes and edges (`/#/{dataset}/node/{id}`)
- **Dataset Validation**: Build-time CLI validation integrated into CI/CD
- **Mobile Support**: Responsive header, hamburger menu, bottom sheet for infobox
- **SEO**: OpenSearch, JSON-LD schemas, sitemap, robots.txt, llms.txt

**Shipped Datasets**: AI-LLM Research (default), Rosicrucian Network, Enlightenment, Ambient Music, Cybernetics, Protestant Reformation, Renaissance Humanism

### Milestone Summaries

| Milestone | Summary |
|-----------|---------|
| M1-M8 | MVP: Project setup, data layer, graph/timeline visualization, infobox, filtering, search, deployment |
| M9 | Application verification with code review |
| M10 | UX improvements: debounced inputs, collapsible panels, natural language edge descriptions |
| M11 | Graph interaction polish: memoized handlers, physics tuning, zoom/pan hint |
| M13 | Scenius rebrand with light/dark theme system |
| M14 | Timeline improvements: margins, year labels, initial zoom, legend consistency |
| M15 | Stable resource URLs: permalinks for nodes/edges, share buttons, SEO meta tags |
| M16 | Network verification: build-time dataset validation CLI (`npm run validate:datasets`) |
| M18 | Mobile adaptation: responsive header, hamburger menu, bottom sheet, touch targets |
| M19 | Radial/ego-network view: center node with connections in ring, click-to-navigate |
| M20 | SEO improvements: OpenSearch, JSON-LD schemas, enhanced meta tags, robots.txt, sitemap.xml, llms.txt |

> **Note**: M12 and M17 were originally reserved for features that have been renumbered. See Future Milestones below.

---

## M21 - Dataset Search & Filter ✅ COMPLETE

**Goal**: Replace the dataset dropdown with a searchable combobox that filters datasets by name or description as the user types.

**Track**: A (Independent Features) - No dependencies

**Status**: ✅ Complete (2026-01-19)

**Delivered**:
- `SearchableDatasetSelector` component with text input + filtered dropdown
- Case-insensitive matching against `name` and `description` fields
- Text highlighting of matching terms in search results
- Keyboard navigation (arrow keys, Enter, Escape, Home, End)
- Full ARIA combobox accessibility pattern with screen reader announcements
- Light/dark theme support
- Clear button to reset search
- Loading and empty state handling

See `PROGRESS.md` for detailed task completion and `CHANGELOG.md` for feature summary.

---

## M23 - Wikimedia Sourcing ✅ COMPLETE

**Goal**: Dynamically fetch supplementary data (summaries, images) from the Wikimedia API for nodes that lack this information locally. Node metadata always takes precedence, with Wikimedia providing fallback enrichment—except for broken local images, which fall back to Wikipedia.

**Track**: A (Independent Features) - No dependencies

**Status**: ✅ Complete (2026-01-19)

**Pilot Dataset**: Rosicrucian Network (test all features here before rolling out to other datasets)

**Problem**: Maintaining biographical text and images for hundreds of nodes is labor-intensive and prone to staleness. Wikipedia already has well-maintained content for most historical figures and locations.

### Technical Feasibility (Researched)

| Question | Finding |
|----------|---------|
| **Browser compatibility** | `wikipedia` npm package works in browser. Built with ES6+/TypeScript, uses standard `fetch`. Compatible with Vite. |
| **CORS support** | Wikipedia REST API supports CORS for anonymous requests. No special parameters needed—direct client-side `fetch()` works. |
| **Wikidata QID stability** | QIDs are stable permanent identifiers. They don't change (except rare documented deletions/mergers). Safe for long-term references. |
| **Disambiguation detection** | REST API returns `"type": "disambiguation"` in response. Can detect and handle programmatically. |

### Design Decisions

| Decision | Choice |
|----------|--------|
| **Schema fields** | Add `wikipediaTitle` (required for mapping) and `wikidataId` (optional stable QID like `Q9312`) to all node types |
| **Node type support** | All types: `person`, `location`, `entity`, `object` |
| **Disambiguation handling** | If disambiguation page detected, retry with node type appended (e.g., "John Dee (mathematician)") |
| **Attribution UI** | Wikipedia "W" icon with tooltip, linking to article (opens in new tab) |
| **Extract display** | Truncate to 1-2 lines with "Read more on Wikipedia" link (opens in new tab) |
| **Broken image fallback** | If local `imageUrl` returns 404, fall back to Wikipedia thumbnail |
| **Fetch timing** | Lazy—only fetch when InfoboxPanel opens for that node |
| **Cache strategy** | LRU eviction from localStorage, 48-hour TTL |

### Approach

- Use the `wikipedia` npm package (TypeScript, uses Wikipedia REST API, no authentication required)
- Add `wikipediaTitle` field to nodes for explicit mapping (required for Wikipedia sourcing to work)
- Add optional `wikidataId` field for stable Wikidata QID references
- Fallback behavior: 
  1. Node's own `biography`/`imageUrl` (if present and valid)
  2. Wikipedia API fetch (if `wikipediaTitle` provided)
  3. Graceful empty state
- Exception: Broken local images (404) fall back to Wikipedia even if `imageUrl` was set
- Cache API responses with LRU eviction and 48-hour TTL

**Key Deliverables**:
- Wikipedia service module using the `wikipedia` npm package
- `useWikipediaData` hook for fetching/caching summaries and images
- `wikipediaTitle` and `wikidataId` fields added to node schema (all types)
- Fallback logic in InfoboxPanel with broken image detection
- Caching layer with LRU eviction in localStorage (48-hour TTL)
- Wikipedia attribution icon linking to source article
- Truncated extracts with "Read more" links
- Rate limiting awareness (500 req/hour per IP for anonymous access)
- Error handling for missing pages, disambiguation, network failures, rate limits

**Rate Limits**: Wikipedia REST API allows 500 requests/hour per IP without authentication. Since this is a client-side app, each user has their own limit. Caching makes this ample for normal browsing.

**Relationship to M22**: This milestone may eliminate the need for M22 (Image Asset Management). If dynamic Wikimedia fetching proves reliable, M22 can be skipped. M22 remains available as a fallback if we need permanent local hosting for images not available via Wikimedia.

**Delivered**:
- Wikipedia service module using the `wikipedia` npm package
- `useWikipediaData` hook for fetching/caching summaries and images
- `useNodeEnrichedData` hook combining local + Wikipedia data
- `wikipediaTitle` and `wikidataId` fields added to node schema (all types)
- Fallback logic in NodeInfobox with broken image detection
- Caching layer with LRU eviction in localStorage (48-hour TTL)
- Wikipedia attribution icon linking to source article
- Truncated extracts with "Read more" links
- Pilot: Rosicrucian Network enriched with `wikipediaTitle` for 10+ nodes

See `PROGRESS.md` for detailed task completion and `CHANGELOG.md` for feature summary.

---

## Future: M24 - Vercel Migration

**Goal**: Migrate deployment from GitHub Pages to Vercel to enable serverless API functions. Keep GitHub Pages as a backup deployment.

**Track**: B (Infrastructure & Backend) - Foundation for M25, M26

**Why Vercel**: Familiar platform with excellent GitOps deployment support, seamless serverless functions, and future access to managed databases (Vercel KV, Postgres) if needed.

**Architecture Decision**: Stay with Vite. Next.js migration was evaluated but rejected—the primary need (serverless endpoints for M25 feedback feature) is well-supported by Vite + Vercel, and migration cost outweighs benefits. See `PROGRESS.md` notes for full rationale.

**Key Deliverables**:
- Vercel project (`scenius.vercel.app`) linked to GitHub repository
- Vite build working on Vercel with automatic deployments on push
- Simple backend endpoint (`/api/health`) to verify serverless functions work
- Environment variable configuration verified
- GitHub Pages deployment retained as backup (dual deployment)
- Documentation updated with both deployment URLs

**Proof Point**: App running at `scenius-seven.vercel.app` with `/api/health` returning JSON response.

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future: M25 - User Feedback Feature

**Goal**: Allow users to submit feedback about graph data (missing info, corrections, suggestions) without requiring a GitHub account. Feedback is captured as GitHub issues, enabling the Phase R research workflow (see `research/RESEARCHING_NETWORKS.md`).

**Track**: B (Infrastructure & Backend) - Depends on M24 (Vercel Migration)

**Design Principles**:
- Prompt users with general questions: "What's missing?", "What's incorrect?", "What should be added?"
- Capture full URL as context (indicates dataset, selected item, visualization state)
- Single evidence field for URLs, citations, and narrative (read by humans/LLMs, not highly structured)
- All feedback creates public GitHub issues (users are informed of this)
- Ties directly to Phase R research workflow—feedback becomes input for agent research

**Key Deliverables**:
- `FeedbackButton` component in both Header and InfoboxPanel, labeled "Feedback/Correction"
- `FeedbackForm` modal with prompts for what's missing/incorrect, evidence field, optional email
- `/api/submit-feedback` serverless endpoint with validation
- GitHub issue creation with structured template and labels (`feedback`, `dataset:{name}`)
- Success state showing link to created issue
- Rate limiting (5 per IP per hour)

**Privacy**: User IP addresses and emails are kept private (not included in public GitHub issues).

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future: M26 - Custom Domain

**Goal**: Configure a custom domain (e.g., `scenius.app`) for the Vercel deployment.

**Track**: B (Infrastructure & Backend) - Depends on M24 (Vercel Migration)

**Key Deliverables**:
- Domain registration (if not already owned)
- DNS configuration for Vercel
- SSL certificate setup (automatic via Vercel)
- Update all hardcoded URLs in codebase (meta tags, sitemap, etc.)
- Redirect configuration from old URLs

**Status**: Not started. Task breakdown TBD.

---

## Future: M27 - Feedback Spam Protection

**Goal**: Add lightweight spam protection to the feedback form to reduce low-quality submissions.

**Track**: B (Infrastructure & Backend) - Depends on M25 (User Feedback Feature)

**Key Deliverables**:
- Simple arithmetic challenge (e.g., "What is 3 + 5?")
- Challenge generation and validation in serverless function
- Accessible implementation (screen reader compatible)
- Rate limit adjustment if spam is reduced

**Status**: Not started. Task breakdown TBD.

---

## Future: M29 - Cross-Scene Node Index API

**Goal**: Create a build-time index and serverless API endpoint that, given a node's identity (via `wikidataId` or `wikipediaTitle`), returns all datasets containing that entity along with navigation metadata.

**Track**: B (Infrastructure & Backend) - Depends on M24 (Vercel Migration)

**Problem**: As the number of datasets grows, users have no way to discover that a figure like Marsilio Ficino appears in multiple scenes (Florentine Academy, Christian Kabbalah, Renaissance Humanism). This milestone enables cross-scene discovery and navigation.

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Index timing | Build-time generation | Avoids runtime overhead, predictable performance |
| Index storage | Sharded by `wikidataId` prefix | Keeps per-query memory low, scales to many datasets |
| Join key | `wikidataId` (primary), `wikipediaTitle` (fallback) | Wikidata QIDs are stable identifiers |
| Build memory | Stream datasets one at a time | Scales to hundreds of datasets without memory issues |

### Why Sharding?

With a "database" of potentially hundreds of JSON dataset files, we must avoid:
- Loading all datasets into memory to build an index
- Loading the entire index into memory to answer one query

**Sharded approach**: Index files are split by wikidataId range (e.g., `Q0-Q99999.json`, `Q100000-Q199999.json`). A query for `Q154781` loads only the relevant shard.

### API Design

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

### Key Deliverables

1. **Index build script**: `scripts/build-cross-scene-index/`
   - Streams through datasets one at a time (memory efficient)
   - Generates sharded index files by wikidataId prefix
   - npm script: `npm run build:cross-scene-index`

2. **Index output**: `public/cross-scene-index/`
   - `manifest.json` — shard list and metadata
   - `Q{start}-Q{end}.json` — sharded index files

3. **Serverless endpoint**: `/api/node-scenes`
   - Accepts `?wikidataId=`, `?wikipediaTitle=`, or `?nodeId=&dataset=`
   - Loads only the relevant shard
   - Returns appearances array

4. **CI integration**: Index rebuilt on every deployment

5. **Fallback lookup**: If `?wikipediaTitle=` provided, search for matching title

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future: M30 - Cross-Scene Navigation UI

**Goal**: Surface cross-scene relationships in the user interface, enabling discovery and navigation between scenes where the same entity appears.

**Track**: B (Infrastructure & Backend) - Depends on M29 (Cross-Scene API)

**Problem**: Even with the API from M29, users have no visual indication that a node appears in multiple scenes, and no way to navigate between them.

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Filter behavior | Clear all filters on cross-scene navigation | Filters are dataset-specific |
| Visual indicator | Extra ring around multi-scene nodes | Subtle, uses existing color scheme |
| Conflicting data | Defer to target dataset | Consistency, simplicity |
| "Explore connections" | Out of scope | MVP focus |

### UI Components

**1. Infobox "Related Scenes" Section**

When viewing a node that appears in multiple datasets:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Also appears in:

  Florentine Academy      →
  Christian Kabbalah      →
  Renaissance Humanism    →
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Each item is a link that navigates to that node in the other dataset, preserving the user's current layout preference but clearing filters.

**2. Graph Node Indicator**

Nodes that appear in multiple scenes have a visual indicator:
- Extra outer ring around the node shape
- Same color as the node's type color
- Tooltip on hover: "Appears in N scenes"

### Cross-Scene Link Construction

Links preserve user preferences while navigating:

```
Current URL:
  /#/?dataset=ai-llm-research&selected=person-hinton&type=node&layout=radial

Cross-scene link:
  /#/?dataset=cybernetics&selected=person-hinton-cyb&type=node&layout=radial
       ↑ Different dataset    ↑ Different nodeId           ↑ Same layout
```

**Preserved**: layout, theme  
**Cleared**: all filters (they're dataset-specific)

### Key Deliverables

1. **`useCrossSceneAppearances` hook**
   - Fetches from `/api/node-scenes` when node has `wikidataId`
   - Caches results to avoid redundant fetches
   - Returns `{ appearances, isLoading, isMultiScene }`

2. **`CrossSceneLinks` component**
   - Renders "Also appears in:" section in infobox
   - Only shows when `appearances.length > 1`
   - Excludes current dataset from list

3. **Link construction utility**: `buildCrossSceneUrl(targetDatasetId, nodeId, currentLayout)`

4. **Multi-scene node indicator in graph**
   - Additional outer ring on nodes with multiple appearances
   - Same color as node's type color
   - Implementation in `ForceGraphLayout.tsx` and `RadialLayout.tsx`

5. **Infobox integration**
   - Add `CrossSceneLinks` section to `NodeInfobox.tsx`
   - Position after main content, before external links

6. **Loading/empty states**: Graceful handling when node has no cross-scene appearances

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future: M31 - Dataset Pages

**Goal**: Create a static overview page for each dataset that provides a narrative introduction before users dive into the graph visualization. This creates a gentler onramp into the complexity of the network data.

**Track**: C (Information Architecture) - No dependencies

**Problem**: Currently, users must jump immediately into the deep end of visualizing complex graph data. There's no simple way to share or preview what a dataset contains without loading the full interactive visualization.

### URL Structure Change

This milestone introduces a new routing architecture:

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | List of all datasets (implemented in M32) |
| `/:datasetId` | **Dataset Overview** | New narrative page for each dataset |
| `/:datasetId/explore` | Graph/Timeline/Radial | Current main visualization (moved from `/`) |
| `/:datasetId/node/:nodeId` | Node Detail | Unchanged |
| `/:datasetId/from/:sourceId/to/:targetId` | Edge Detail | Unchanged |

### Schema Change

Add `bannerEmoji` field to manifest schema:

```json
{
  "bannerEmoji": "🔬🧬🤖"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bannerEmoji` | string | ⚪ Optional | 1-3 emoji representing the dataset's theme. Default: "❓" |

**Migration**: All existing datasets will need `bannerEmoji` added. Use "❓" as placeholder until curated.

### Page Structure

**DatasetOverviewPage** layout:

```
┌─────────────────────────────────────────────────┐
│  🔬🧬🤖  AI & LLM Research Network              │
│                                                 │
│  The key researchers, organizations, and works  │
│  of the modern AI/LLM revolution (2012-present) │
│  ...                                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │ Persons │ │ Objects │ │Locations│ │Entities││
│  │         │ │         │ │         │ │        ││
│  │ Hinton 🔍│ │ GPT-4 🔍│ │ SF  🔍 │ │OpenAI🔍││
│  │ LeCun  🔍│ │ BERT  🔍│ │ London🔍│ │Google🔍││
│  │ Bengio 🔍│ │ ...   🔍│ │ ...  🔍 │ │ ...  🔍││
│  │ ...     │ │         │ │         │ │        ││
│  └─────────┘ └─────────┘ └─────────┘ └────────┘│
│                                                 │
│  Responsive: 4 cols → 2 cols → 1 col on mobile │
└─────────────────────────────────────────────────┘
```

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Banner visual | 1-3 emoji (`bannerEmoji`) | Lightweight, no image hosting needed, visually distinctive |
| Description source | Manifest `description` field | Already exists, can be edited as needed |
| Item ranking | Simple degree count | Most connected = most central to the network |
| Items per type | Top 5 (or all if fewer) | Enough to be representative without overwhelming |
| Connection count | Don't display | Keep the list clean and simple |
| Explore icon | 🔍 (spyglass) | Opens graph view with that item selected |
| Explore behavior | Graph layout, clear filters, preserve theme | Consistent starting point for exploration |

### Key Deliverables

1. **Schema update**: Add `bannerEmoji` to `GRAPH_SCHEMA.md` manifest section

2. **Dataset migration**: Add `"bannerEmoji": "❓"` to all existing manifest.json files

3. **Routing changes**:
   - Move current `/` graph view to `/:datasetId/explore`
   - Add `/:datasetId` route for DatasetOverviewPage
   - Update all internal link generation throughout codebase

4. **DatasetOverviewPage component** (`src/pages/DatasetOverviewPage.tsx`):
   - Banner emoji display (large, centered)
   - Dataset title from manifest `name`
   - Description from manifest `description`
   - POLE columns with top 5 most connected items per type

5. **Most connected items logic**:
   - Calculate degree (edge count) for each node
   - Group by POLE type
   - Sort by degree descending
   - Take top 5 (or all if fewer than 5)

6. **Item links with explore icon**:
   - Each item shows title + 🔍 icon
   - Click navigates to `/:datasetId/explore?selected={nodeId}&type=node&layout=graph`
   - Clears any filters, preserves theme

7. **SEO**:
   - Unique `<title>` and meta description per dataset
   - JSON-LD structured data (`@type: Dataset`)
   - Sitemap entries for all dataset pages

8. **Responsive design**:
   - 4 columns on desktop
   - 2 columns on tablet
   - 1 column (stacked) on mobile

9. **Link generation migration**:
   - Audit all places that generate URLs
   - Update to new `/:datasetId/explore` scheme
   - No backward compatibility needed for old URLs

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future: M32 - New Homepage

**Goal**: Replace the current "jump into graph view" entry point with a browsable list of dataset tiles. Users can see all available datasets, search/filter them, and click through to dataset overview pages.

**Track**: C (Information Architecture) - Depends on M31 (Dataset Pages)

**Problem**: The current app requires users to immediately engage with complex graph visualizations. New users have no way to browse what's available or understand what each dataset contains before committing to explore it.

### User Flow

```
Landing (/)           Dataset Overview        Graph Exploration
┌─────────────┐      ┌─────────────────┐     ┌─────────────────┐
│             │      │                 │     │                 │
│  [Search]   │      │  🔬🧬🤖         │     │   ┌───┐         │
│             │      │  AI & LLM       │     │  ┌┴───┴┐        │
│ ┌─────────┐ │      │  Research       │     │  │     │────┐   │
│ │ 🔬 AI   │─┼─────▶│                 │────▶│  └─────┘    │   │
│ │ Research│ │      │  Top People:    │     │      ◇──────┘   │
│ └─────────┘ │      │  • Hinton 🔍    │     │                 │
│ ┌─────────┐ │      │  • LeCun 🔍     │     │  [Filters]      │
│ │ 🌹 Rosi-│ │      │  ...            │     │  [Layout]       │
│ │ crucian │ │      └─────────────────┘     └─────────────────┘
│ └─────────┘ │
│    ...      │
└─────────────┘
```

### Page Structure

**HomePage** layout:

```
┌─────────────────────────────────────────────────┐
│  Scenius                              [Theme]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Explore Historical Networks                    │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🔍 Search datasets...                    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌───────────────────┐ ┌───────────────────┐   │
│  │ 🏛️📜✨              │ │ 🌹⚗️🔮              │   │
│  │ Florentine Academy │ │ Rosicrucian       │   │
│  │ The Platonic Acad- │ │ Intellectual net- │   │
│  │ emy of Florence... │ │ work of the...    │   │
│  │                    │ │                    │   │
│  │ 50 nodes · 102 edges│ │ 112 nodes · 229..│   │
│  │ 1433–1535          │ │ 1493–1700         │   │
│  └───────────────────┘ └───────────────────┘   │
│                                                 │
│  ┌───────────────────┐ ┌───────────────────┐   │
│  │ ...               │ │ ...               │   │
│  └───────────────────┘ └───────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tile content | Emoji, name, description (truncated), counts, date range | Enough info to decide whether to explore |
| Sorting | Chronological by `scope.startYear` | Natural historical ordering |
| Search | Filter by name or description | Reuses pattern from M21 dataset search |
| Click behavior | Navigate to `/:datasetId` (dataset overview) | Follow the narrative path |

### Key Deliverables

1. **HomePage component** (`src/pages/HomePage.tsx`):
   - Page title/heading
   - Search input for filtering datasets
   - Grid of dataset tiles

2. **DatasetTile component** (`src/components/DatasetTile.tsx`):
   - Banner emoji (from `bannerEmoji`, default "❓")
   - Dataset name (from `name`)
   - Truncated description (2-3 lines max)
   - Node/edge counts (from `nodeCount`, `edgeCount`)
   - Date range (from `scope.startYear`–`scope.endYear` or `temporalScope`)
   - Click → navigate to `/:datasetId`

3. **Search functionality**:
   - Text input with search icon
   - Case-insensitive filter on `name` and `description`
   - Debounced input (reuse pattern from M21)
   - Show "No matching datasets" empty state

4. **Chronological sorting**:
   - Sort by `scope.startYear` ascending
   - Datasets without scope fall to end of list
   - Handle missing/null gracefully

5. **Routing update**:
   - `/` now renders HomePage (not graph view)
   - Remove automatic dataset loading on `/`

6. **Responsive design**:
   - 2-3 columns on desktop
   - 2 columns on tablet
   - 1 column on mobile

7. **SEO**:
   - Homepage meta tags (title: "Scenius - Explore Historical Networks")
   - JSON-LD for the site/organization
   - Sitemap entry for homepage

8. **Header updates**:
   - Dataset selector in header may need adjustment or removal on homepage
   - Consider: show selector only on explore/detail pages

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future Ideas (Not Yet Planned)

These are potential features that may become milestones:

| Feature | Description |
|---------|-------------|
| Export | SVG/PNG export of visualizations, data export |
| Graph Analytics | Centrality metrics, path finding, community detection |
| Comparative View | Overlay multiple datasets |
| Embed Mode | Embeddable visualizations for blogs/papers |
| Bibliography Export | Citation generation from evidence data |
| Semantic Search | Natural language queries ("philosophers who influenced Kant") |

> **Note**: "Dataset Validation CLI" was promoted to **M16 - Network Verification**.

---

## Milestone Dependencies

```
M1-M20 (Core Application Complete) ✅
    │
    ├───────────────────────────────────────────┬──────────────────────────┐
    │                                           │                          │
    │  TRACK A: Independent Features            │  TRACK B: Infrastructure │  TRACK C: Info Architecture
    │  (Complete)                               │  (Sequential)            │  (Sequential)
    │                                           │                          │
    ├──────────────┬────────────────┐           │                          │
    ▼              ▼                │           ▼                          ▼
   M21            M23               │          M24                        M31
   (Dataset      (Wikimedia        │         (Vercel)                   (Dataset
   Search) ✅    Sourcing) ✅      │            │                        Pages)
                                   │            ├──────────┬──────────┐    │
                                   │            ▼          ▼          ▼    ▼
                                   │           M25        M26        M29  M32
                                   │        (Feedback) (Domain)   (Cross-(Homepage)
                                   │            │                  Scene
                                   │            ▼                  API)
                                   │           M27                   │
                                   │        (Spam Prot.)             ▼
                                   │                                M30
                                   │                             (Cross-
                                   │                             Scene UI)
```

**Track A - Independent Features** (complete):
- **M21 (Dataset Search)**: ✅ Complete. Searchable combobox for faster dataset discovery.
- **M23 (Wikimedia Sourcing)**: ✅ Complete. Dynamic runtime enrichment from Wikipedia API.

**Track B - Infrastructure & Backend** (sequential):
- **M24 (Vercel Migration)**: Foundation for serverless functions. Enables M25, M26, M29.
- **M25 (User Feedback)**: Requires M24. Serverless endpoint creates GitHub issues.
- **M26 (Custom Domain)**: Requires M24. DNS configured on Vercel.
- **M27 (Spam Protection)**: Requires M25. Enhancement to feedback form.
- **M29 (Cross-Scene API)**: Requires M24. Build-time index and serverless endpoint for cross-scene discovery.
- **M30 (Cross-Scene UI)**: Requires M29. Infobox links and graph visual indicators for multi-scene nodes.

**Track C - Information Architecture** (sequential):
- **M31 (Dataset Pages)**: No dependencies. Introduces `/:datasetId` routes, moves graph view to `/:datasetId/explore`, creates narrative dataset overview pages.
- **M32 (New Homepage)**: Requires M31. Takes over `/` route with browsable dataset tiles, search, chronological sorting.

---

## Adding New Milestones

When planning a new milestone:

1. Add a section to this document with Goal and Deliverables
2. Decompose into tasks in `PROGRESS.md`
3. Update the Milestone Overview table
4. Record completion in `CHANGELOG.md` when done

---

## Success Criteria Reference

### MVP (M1-M8) was complete when:
- [x] Application loads Disney dataset by default
- [x] Force-directed graph renders all nodes and edges
- [x] Clicking nodes/edges shows details in infobox
- [x] Filters narrow the visible graph
- [x] URL captures complete application state
- [x] Shared URLs restore exact application state
- [x] Application is live on GitHub Pages
- [x] Timeline view renders nodes by date
- [x] User can switch between graph and timeline
- [x] Layout selection persists in URL

### Post-MVP Polish (M9-M11, M14) was complete when:
- [x] All features verified working (V1-V10 checklist)
- [x] Code review findings documented and addressed
- [x] Debounced inputs prevent UI jitter
- [x] Graph doesn't re-layout on node/edge clicks
- [x] Zoom/pan discoverability hint added
- [x] Timeline doesn't overlap filter panel
- [x] Timeline labels readable at default zoom
- [x] Legend consistent between graph and timeline

See `HISTORY.md` for detailed completion criteria for each milestone.
