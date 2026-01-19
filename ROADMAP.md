# HistoryNet - Roadmap

This document outlines the milestone structure and future direction for HistoryNet. For detailed task tracking, see `PROGRESS.md`.

**Live Demo**: https://moxious.github.io/historynet/

---

## Milestone Overview

| # | Milestone | Status |
|---|-----------|--------|
| M1-M7 | MVP (Bootstrap through Deployment) | ✅ Complete |
| M8 | Timeline View | ✅ Complete |
| M9 | Application Verification | ✅ Complete |
| M10 | UX Improvements | ✅ Complete |
| M11 | Graph Interaction Polish | ✅ Complete |
| M12 | User Feedback | 🔲 Future |
| M13 | Scenius Rebrand & Theme System | ✅ Complete |
| M14 | Timeline Improvements | ✅ Complete |
| M15 | Stable Resource URLs | ✅ Complete |
| M16 | Network Verification | ✅ Complete |
| M17 | Dataset Search & Filter | 🔲 Future |
| M18 | Adapt for Mobile | ✅ Complete |
| M19 | Radial/Ego-Network View | ✅ Complete |
| M20 | SEO Improvements | 🔲 Future |
| M21 | Image Asset Management | 🔲 Future |

> **Note**: Independent milestones (those without dependencies on each other) may be executed out of order based on priority and availability. See the Milestone Dependencies section for details on which milestones can be parallelized.

---

## Completed Milestones (M1-M16)

The core application is complete, polished, and deployed. See `HISTORY.md` for detailed task lists and implementation notes.

**Core Features**:
- **Graph Visualization**: Force-directed D3 layout with zoom/pan, type-based node shapes, relationship-colored edges, tuned physics
- **Timeline Visualization**: Vertical timeline with date positioning, lifespan markers, automatic lane assignment
- **Infobox Panel**: Node/edge detail display with type-specific fields, images, internal links, evidence
- **Filtering**: Date range and text filters with URL sync, debounced inputs, collapsible panel
- **Search**: Instant highlighting with keyboard shortcut (Cmd/Ctrl+K)
- **Stable Resource URLs**: Permanent permalinks for nodes and edges (`/#/{dataset}/node/{id}`)
- **Dataset Validation**: Build-time CLI validation integrated into CI/CD

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

---

## Future: M12 - User Feedback

**Goal**: Allow users to submit feedback about graph data (missing nodes, incorrect information, suggested changes) without requiring a GitHub account. Feedback is captured as GitHub issues for dataset maintainers to review.

**Architecture**: Migrate from GitHub Pages to Vercel to enable serverless API functions.

**Key Deliverables**:
- Vercel deployment with GitHub integration
- `FeedbackForm` component (modal) with type selection, description, evidence fields
- `/api/submit-feedback` serverless endpoint with validation and rate limiting
- GitHub issue creation via API with structured formatting
- Security: input sanitization, honeypot field, rate limiting

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future: M17 - Dataset Search & Filter

**Goal**: Replace the dataset dropdown with a searchable combobox that filters datasets by name or description as the user types.

**Key Deliverables**:
- `SearchableDatasetSelector` component with text input + filtered dropdown
- Case-insensitive matching against `name` and `description` fields
- Keyboard navigation (arrow keys, Enter, Escape)
- ARIA combobox accessibility pattern
- Light/dark theme support

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future: M20 - SEO Improvements

**Goal**: Systematically improve search engine optimization and AI discoverability. Add OpenSearch, structured data (JSON-LD), enhanced meta tags, and crawler resources.

**Key Deliverables**:
- `public/opensearch.xml` for browser search integration
- Schema.org JSON-LD for Person, CreativeWork, Place, Organization nodes
- `SchemaOrg.tsx` component for dynamic structured data
- `public/robots.txt` and `public/sitemap.xml`
- Enhanced meta tags (robots, author, keywords, canonical URLs)
- AI-friendly metadata (Dublin Core, llms.txt)

**Status**: Not started. Full task breakdown in `PROGRESS.md`.

---

## Future: M21 - Image Asset Management

**Goal**: Fix broken image URLs in datasets by auditing, downloading, and hosting images in a stable location. Currently, many `imageUrl` fields link to Wikimedia Commons thumbnails that have been updated/renamed, returning 404 errors.

**Problem**: Wikipedia/Wikimedia images change frequently as editors update articles. URLs captured at dataset creation time become broken when images are replaced, renamed, or reorganized.

**Key Deliverables**:
- Audit script to identify all broken `imageUrl` links across datasets
- Download and organize valid images to a stable hosting location (local `public/images/` or cloud storage bucket TBD)
- Update all `imageUrl` fields in dataset JSON files to point to hosted images
- Document image attribution/licensing for Wikimedia-sourced images

**Architecture Decision (TBD)**: 
- **Option A**: Host in `public/images/{dataset}/{node-id}.jpg` (simple, versioned with code)
- **Option B**: Cloud storage bucket (S3, GCS, Cloudflare R2) with stable URLs

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
M1-M8 (MVP Complete) ✅
    │
    ▼
M9-M11, M13-M16, M18-M19 (All Polish Complete) ✅
    │
    ├──────────────────┬──────────────────┬──────────────────┬──────────────────┐
    ▼                  ▼                  ▼                  ▼                  ▼
   M12                M17                M20                M21           (Future)
   (User Feedback)   (Dataset Search)   (SEO)          (Images)
   [Vercel req'd]    [independent]      [independent]  [independent]
```

Note: Remaining milestones M12, M17, M20, and M21 can be worked on in parallel:
- **M12 (User Feedback)**: Requires Vercel migration for serverless functions.
- **M17 (Dataset Search)**: Becomes more valuable as more datasets are added.
- **M20 (SEO Improvements)**: Independent and can be started anytime.
- **M21 (Image Asset Management)**: Independent; fixes broken Wikimedia image URLs.

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
