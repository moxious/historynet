# HistoryNet - Roadmap

This document outlines the milestone structure and future direction for HistoryNet. For detailed task tracking, see `PROGRESS.md`.

**Live Demo**: https://moxious.github.io/historynet/

---

## Milestone Overview

| # | Milestone | Status |
|---|-----------|--------|
| M1-M20 | Core Application (See Completed Milestones) | ✅ Complete |
| M21 | Dataset Search & Filter | ✅ Complete |
| M23 | Wikimedia Sourcing | ✅ Complete |
| M28 | Wikipedia ID Enrichment CLI | 🔲 Ready |
| M24 | Vercel Migration | 🔲 Future |
| M25 | User Feedback Feature | 🔲 Future (depends on M24) |
| M26 | Custom Domain | 🔲 Future (depends on M24) |
| M27 | Feedback Spam Protection | 🔲 Future (depends on M25) |
| M22 | Image Asset Management | 🔲 Optional (deferred) |

**Two Parallel Tracks:**

| Track | Milestones | Prerequisites |
|-------|------------|---------------|
| **A: Independent Features** | M21, M23, M28, M22 (optional) | None - can start immediately |
| **B: Infrastructure & Backend** | M24 → M25 → M27, M24 → M26 | M24 is foundation for rest |

> **Note**: Track A milestones have no dependencies and can be executed in any order. M28 builds on M23's Wikipedia service but operates as a standalone CLI. M22 is optional—M23 (Wikimedia Sourcing) may eliminate the need for local image hosting. Track B milestones have dependencies as shown.

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

## M28 - Wikipedia ID Enrichment CLI

**Goal**: Create a build-time CLI tool that enriches dataset nodes with Wikipedia identifiers (`wikipediaTitle` and `wikidataId`), ensuring all nodes have both fields populated when Wikipedia coverage exists.

**Track**: A (Independent Features) - No dependencies (leverages M23 Wikipedia service patterns)

**Status**: 🔲 Ready to start

**Problem**: Dataset nodes have inconsistent Wikipedia coverage:
- Some nodes have both `wikipediaTitle` and `wikidataId` (ideal)
- Some nodes have only `wikipediaTitle` (missing stable QID)
- Some nodes have only `wikidataId` (missing title for enrichment)
- Some nodes have neither field (unenriched)

Manually auditing and enriching hundreds of nodes is tedious and error-prone. A CLI tool can automate this process.

### Acceptance Criteria

| Criterion | Description |
|-----------|-------------|
| **Both identifiers populated** | After enrichment, nodes have both `wikipediaTitle` and `wikidataId` when Wikipedia coverage exists |
| **No other properties touched** | Only `wikipediaTitle` and `wikidataId` fields are modified; all other node properties remain unchanged |
| **No nodes added or removed** | Node count before and after enrichment is identical |
| **Explicit nulls for missing** | Set `wikipediaTitle: null` and `wikidataId: null` when reasonably certain no Wikipedia article exists |
| **Dry-run by default** | Tool shows proposed changes without writing unless `--write` flag is used |
| **Rate limit compliance** | Respects Wikipedia API rate limits (500 req/hour) with configurable delays |

### Technical Approach

| Scenario | Lookup Method |
|----------|---------------|
| Has `wikipediaTitle`, missing `wikidataId` | Fetch Wikipedia summary → extract `wikibase_item` from response |
| Has `wikidataId`, missing `wikipediaTitle` | Fetch from Wikidata API → extract English Wikipedia sitelink |
| Missing both | Optional: search by node `title` (requires `--search` flag due to disambiguation risks) |

**Key Deliverables**:
- CLI tool at `scripts/enrich-wikipedia/` following existing `validate-datasets` patterns
- npm script `enrich:wikipedia` for easy invocation
- Dry-run mode (default) showing proposed changes
- Write mode (`--write`) to update `nodes.json` files
- Rate limiting with configurable delay between API calls
- JSON output mode for scripting/CI integration
- Per-dataset targeting (`--dataset <id>`)

**Relationship to M23**: This milestone complements M23 (Wikimedia Sourcing). M23 provides runtime enrichment in the browser; M28 provides build-time enrichment to ensure datasets have complete Wikipedia mappings before deployment.

See `PROGRESS.md` for detailed task breakdown.

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

**Proof Point**: App running at `scenius.vercel.app` with `/api/health` returning JSON response.

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

## Optional: M22 - Image Asset Management

**Goal**: Fix broken image URLs in datasets by auditing, downloading, and hosting images in a stable location. Currently, many `imageUrl` fields link to Wikimedia Commons thumbnails that have been updated/renamed, returning 404 errors.

**Track**: A (Independent Features) - No dependencies

**Why Optional**: M23 (Wikimedia Sourcing) dynamically fetches images from Wikipedia, which may eliminate the need for local image hosting. If Wikimedia Sourcing proves reliable, this milestone can be skipped entirely.

**Problem**: Wikipedia/Wikimedia images change frequently as editors update articles. URLs captured at dataset creation time become broken when images are replaced, renamed, or reorganized.

**Key Deliverables**:
- Audit script to identify all broken `imageUrl` links across datasets
- Download and organize valid images to a stable hosting location (local `public/images/` or cloud storage bucket TBD)
- Update all `imageUrl` fields in dataset JSON files to point to hosted images
- Document image attribution/licensing for Wikimedia-sourced images

**Architecture Decision (TBD)**: 
- **Option A**: Host in `public/images/{dataset}/{node-id}.jpg` (simple, versioned with code)
- **Option B**: Cloud storage bucket (S3, GCS, Cloudflare R2) with stable URLs

**Status**: Deferred. M23 (Wikimedia Sourcing) may obviate this milestone. Full task breakdown in `PROGRESS.md` if needed.

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
    ├───────────────────────────────────────────────────────────────────┐
    │                                                                   │
    │  TRACK A: Independent Features                                    │  TRACK B: Infrastructure
    │  (No dependencies, can parallelize)                               │  (Sequential dependencies)
    │                                                                   │
    ├──────────────┬────────────────┬───────────────┐                   │
    ▼              ▼                ▼               │                   ▼
   M21            M23              M28              │                  M24
   (Dataset      (Wikimedia       (Wiki ID         │                 (Vercel)
   Search) ✅    Sourcing) ✅     Enrich CLI)      │                   │
                                                   │                   ├──────────────┐
                                   M22             │                   ▼              ▼
                                  (Image           │                  M25            M26
                                  Mgmt)            │               (Feedback)    (Domain)
                                 [OPTIONAL]        │                   │
                                                   │                   ▼
                                                   │                  M27
                                                   │               (Spam Prot.)
                                                   │
```

**Track A - Independent Features** (can execute in any order):
- **M21 (Dataset Search)**: ✅ Complete. Searchable combobox for faster dataset discovery.
- **M23 (Wikimedia Sourcing)**: ✅ Complete. Dynamic runtime enrichment from Wikipedia API.
- **M28 (Wikipedia ID Enrichment CLI)**: Build-time CLI to ensure all nodes have both `wikipediaTitle` and `wikidataId`.
- **M22 (Image Asset Management)**: Optional. Hosts images locally—may be unnecessary if M23 works well.

> **M23 & M28 Relationship**: M23 provides runtime enrichment in the browser. M28 complements this by ensuring datasets have complete Wikipedia mappings at build time, reducing runtime API calls and ensuring `wikidataId` stability.

> **M22 & M23 Relationship**: M23 (Wikimedia Sourcing) dynamically fetches images and may eliminate the need for M22. M22 remains as an optional fallback if we need permanent local hosting for images not available via Wikimedia.

**Track B - Infrastructure & Backend** (sequential):
- **M24 (Vercel Migration)**: Foundation for serverless functions. Enables M25, M26.
- **M25 (User Feedback)**: Requires M24. Serverless endpoint creates GitHub issues.
- **M26 (Custom Domain)**: Requires M24. DNS configured on Vercel.
- **M27 (Spam Protection)**: Requires M25. Enhancement to feedback form.

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
