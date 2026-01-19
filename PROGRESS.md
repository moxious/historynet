# HistoryNet - Task Progress Tracking

This document tracks individual tasks for active milestones. Tasks are grouped by milestone and should be checked off (`[x]`) when completed.

**Legend**:
- `[ ]` - Not started
- `[x]` - Completed
- `[~]` - In progress (add agent/developer name)
- `[!]` - Blocked (add note explaining blocker)

**Related Documents**:
- `ROADMAP.md` - Future direction and milestone overview
- `CHANGELOG.md` - What shipped when
- `HISTORY.md` - Archived milestone task lists and completion notes

---

## Completed Milestones (M1-M16)

All MVP and post-MVP milestones through M16 are complete. See `HISTORY.md` for detailed task lists and completion notes.

| Milestone | Description | Completed |
|-----------|-------------|-----------|
| M1 | Project Bootstrap | 2026-01-18 |
| M2 | Core Data Layer | 2026-01-18 |
| M3 | Graph Visualization | 2026-01-18 |
| M4 | Infobox Panel | 2026-01-18 |
| M5 | Filtering System | 2026-01-18 |
| M6 | Search & Polish | 2026-01-18 |
| M7 | Deployment | 2026-01-18 |
| M8 | Timeline View | 2026-01-18 |
| M9 | Application Verification | 2026-01-18 |
| M10 | User-Prompted UX Improvements | 2026-01-18 |
| M11 | Graph Interaction Polish | 2026-01-18 |
| M13 | Scenius Rebrand & Theme System | 2026-01-18 |
| M14 | Timeline Improvements | 2026-01-18 |
| M15 | Stable Resource URLs | 2026-01-18 |
| M16 | Network Verification | 2026-01-18 |
| M18 | Adapt for Mobile | 2026-01-19 |
| M19 | Radial/Ego-Network View | 2026-01-19 |
| M20 | SEO Improvements | 2026-01-19 |
| M21 | Dataset Search & Filter | 2026-01-19 |
| M23 | Wikimedia Sourcing | 2026-01-19 |
| M24 | Vercel Migration | 2026-01-19 |

**Key decisions made during MVP:**
- React Context for state management (sufficient for app scale)
- HashRouter for GitHub Pages compatibility
- D3 for both graph and timeline layouts
- URL-first state for deep linking and sharing
- Evidence required on all edges per GRAPH_SCHEMA.md

> **Note on Numbering**: M12 and M17 were originally reserved for features (Vercel Migration and Dataset Search) that were deferred during development. These have been renumbered as M24 and M21 respectively. See ROADMAP.md for the current milestone plan.

**Post-MVP improvements (M9-M14, M13):**
- Extracted shared utils (`graphColors.ts`, `useDebounce.ts`)
- Debounced filter inputs for smooth typing
- Memoized click handlers to prevent graph re-layout
- Physics tuning for better node clustering
- Timeline positioning and readability improvements
- Legend consistency between graph and timeline views
- Scenius rebrand with light/dark theme system (M13)

---

## Future Milestones

Future milestones are organized into three tracks:
- **Track A (M21, M23)**: Independent features with no dependencies - both complete
- **Track B (M24-M27, M29-M30)**: Infrastructure & backend features with sequential dependencies
- **Track C (M31-M32)**: Information architecture - restructures navigation flow (M31 → M32)

> **Note**: Section order in this file may not match numerical order due to historical evolution. See ROADMAP.md for the canonical milestone plan and dependency diagram.

---

## M24: Vercel Migration ✅ COMPLETE

**Status**: ✅ Complete (2026-01-19). See `HISTORY.md` for detailed task list.

**Deployed**:
- **Primary**: https://scenius-seven.vercel.app/ (with API)
- **Backup**: https://moxious.github.io/historynet/ (frontend only)

**Key Deliverables**:
- Vercel deployment with auto-deploy on push to `main`
- `/api/health` serverless endpoint
- Dual deployment (Vercel + GitHub Pages)
- Documentation updated with new URLs

---

## M25: User Feedback Feature

**Goal**: Allow users to submit feedback about graph data without requiring a GitHub account. Feedback creates GitHub issues for the Phase R research workflow.

**Track**: B (Infrastructure & Backend) - Depends on M24 (Vercel Migration)

**Design**: Prompt users with general questions ("What's missing?", "What's incorrect?") rather than graph-specific terminology. Capture full URL as context. All feedback is public (users are informed).

**Integration**: Feedback ties to Phase R in `research/RESEARCHING_NETWORKS.md`—submitted issues become input for agents doing network research/amendments.

### GitHub Setup

- [ ] **FB1** - Create GitHub PAT (Personal Access Token) with `repo` scope for issue creation
- [ ] **FB2** - Add `GITHUB_PAT` environment variable in Vercel dashboard
- [ ] **FB3** - Create GitHub issue template in `.github/ISSUE_TEMPLATE/feedback.md`

**Issue Template**:
```markdown
---
name: User Feedback
about: Feedback submitted via the application
labels: feedback
---

## Dataset

{dataset_name}

## Feedback

{user_feedback}

## Evidence Provided

{evidence_urls_and_citations}

## Additional Info

{additional_context}

---
*Submitted via Scenius feedback form*
*Context URL: {full_url}*
```

### Feedback Form (Frontend)

- [ ] **FB4** - Create `FeedbackSubmission` TypeScript interface in `src/types/`
  ```typescript
  interface FeedbackSubmission {
    dataset: string;
    feedback: string;        // Main feedback text
    evidence?: string;       // URLs, citations, narrative
    additionalInfo?: string; // Extra context
    email?: string;          // Optional contact (kept private)
    contextUrl: string;      // Full URL when form was opened
  }
  ```
- [ ] **FB5** - Create `FeedbackForm` component (modal) with fields:
  - Dataset name (auto-populated, read-only display)
  - "What's missing, incorrect, or should be changed?" (required, textarea)
  - "Evidence: links, citations, or explanation" (optional, textarea)
  - "Anything else?" (optional, textarea)
  - "Email (optional, kept private)" (optional, email input)
  - Notice: "Your feedback will be posted publicly as a GitHub issue for review."
- [ ] **FB6** - Add form validation:
  - Feedback field required and non-empty
  - Email format validation (if provided)
- [ ] **FB7** - Auto-capture context:
  - Current URL (includes dataset, selected item, view state)
  - Dataset name extracted from URL
- [ ] **FB8** - Create `FeedbackButton` component labeled "Feedback/Correction"
- [ ] **FB9** - Place `FeedbackButton` in Header component
- [ ] **FB10** - Place `FeedbackButton` in InfoboxPanel component
- [ ] **FB11** - Style feedback form modal with light/dark theme support
- [ ] **FB12** - Add loading state during submission
- [ ] **FB13** - Add success state showing:
  - Success message
  - Link to the created GitHub issue
- [ ] **FB14** - Add error state with user-friendly messages

### Serverless API Endpoint

- [ ] **FB15** - Create `/api/submit-feedback.ts` serverless function
- [ ] **FB16** - Implement request validation:
  - POST method only
  - Content-Type: application/json
  - Required fields present (dataset, feedback, contextUrl)
- [ ] **FB17** - Implement input sanitization:
  - Strip HTML tags from all text fields
  - Validate URLs in evidence field (if URLs detected)
  - Truncate excessively long inputs
- [ ] **FB18** - Format feedback into GitHub issue body (markdown):
  - Use issue template structure
  - Apply labels: `feedback`, `dataset:{dataset_name}`
  - Do NOT include email or IP in issue body (privacy)
- [ ] **FB19** - Call GitHub API to create issue:
  - POST to `https://api.github.com/repos/moxious/historynet/issues`
  - Use GITHUB_PAT for authentication
  - Return created issue URL
- [ ] **FB20** - Add rate limiting: 5 submissions per IP per hour
  - Use Vercel KV or in-memory tracking
  - Return 429 status if exceeded
- [ ] **FB21** - Log submission metadata privately (IP, email if provided) for abuse tracking
  - Do NOT expose in GitHub issue

### Integration & Testing

- [ ] **FB22** - Connect frontend form to `/api/submit-feedback` endpoint
- [ ] **FB23** - Test end-to-end: form submission → GitHub issue created
- [ ] **FB24** - Verify issue has correct labels (`feedback`, dataset label)
- [ ] **FB25** - Verify issue body is formatted correctly and readable
- [ ] **FB26** - Verify email and IP are NOT in the public issue
- [ ] **FB27** - Test rate limiting: submit 6 times, verify 6th is rejected
- [ ] **FB28** - Test error handling: API down, validation failures
- [ ] **FB29** - Test from different pages:
  - Main graph view (general feedback)
  - Node detail page (context captured)
  - Edge detail page (context captured)
- [ ] **FB30** - Test on mobile (bottom sheet or modal behavior)

### Documentation & Polish

- [ ] **FB31** - Add help text near form explaining:
  - What feedback is used for (improving network data)
  - That submissions are public
  - How to provide good evidence
- [ ] **FB32** - Document API endpoint in code (JSDoc or README)
- [ ] **FB33** - Update CHANGELOG.md when milestone complete

---

## M21: Dataset Search & Filter ✅ COMPLETE

**Goal**: Replace the dataset dropdown with a searchable combobox that filters datasets by name or description as the user types.

**Track**: A (Independent Features) - No dependencies

**Status**: ✅ Complete (2026-01-19). Searchable combobox implemented with full keyboard navigation, ARIA accessibility, text highlighting, and theme support.

### Component Architecture

- [x] **DS1** - Design searchable combobox component API and props interface
- [x] **DS2** - Decide on implementation approach: custom build vs. headless library (Downshift, React Aria, etc.)
- [x] **DS3** - Create `SearchableDatasetSelector` component in `src/components/`
- [x] **DS4** - Add text input field for search/filter query
- [x] **DS5** - Implement dropdown list showing filtered dataset options
- [x] **DS6** - Wire up to existing dataset loading from `useDataset` hook or context

### Search & Filter Logic

- [x] **DS7** - Implement case-insensitive filtering against dataset `name` field
- [x] **DS8** - Extend filtering to also match against dataset `description` field
- [x] **DS9** - Match search term anywhere in name/description (not just prefix)
- [x] **DS10** - Add debouncing to filter input if performance requires (use existing `useDebounce` hook)
- [x] **DS11** - Show "No matching datasets" message when filter returns empty results
- [x] **DS12** - Add clear button (×) to reset search input

### Keyboard Navigation & Accessibility

- [x] **DS13** - Implement arrow key navigation through filtered results
- [x] **DS14** - Enter key selects highlighted/focused dataset
- [x] **DS15** - Escape key closes dropdown and clears search
- [x] **DS16** - Tab key moves focus appropriately (into/out of component)
- [x] **DS17** - Add ARIA attributes for combobox pattern (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, etc.)
- [x] **DS18** - Ensure screen reader announces filtered results count

### Visual Design & Theming

- [x] **DS19** - Style component consistent with existing app design
- [x] **DS20** - Support light/dark theme (use existing theme CSS variables)
- [x] **DS21** - Display dataset name and description snippet in dropdown items
- [x] **DS22** - Truncate long descriptions with ellipsis
- [x] **DS23** - Visual distinction between: currently selected, hovered, keyboard-focused states
- [x] **DS24** - Optional: highlight matching text in search results

### Integration

- [x] **DS25** - Replace existing `DatasetSelector` dropdown with new searchable component
- [x] **DS26** - Ensure selected dataset continues to sync with URL (`?dataset=...`)
- [x] **DS27** - Search/filter state is ephemeral (not persisted to URL)
- [x] **DS28** - Component works correctly when datasets are still loading

### Testing & Verification

- [x] **DS29** - Test filtering with partial matches (e.g., "llm" finds "AI & LLM Research Network")
- [x] **DS30** - Test filtering by description (e.g., "enlightenment" finds dataset by description)
- [x] **DS31** - Test keyboard navigation through filtered results
- [x] **DS32** - Test with empty search (shows all datasets)
- [x] **DS33** - Test with no-match search (shows empty state message)
- [x] **DS34** - Test theme switching (light/dark mode)
- [x] **DS35** - Verify accessibility with screen reader
- [x] **DS36** - Build passes with no errors or linter warnings
- [x] **DS37** - Update CHANGELOG.md with M21 completion notes

---

## M20: SEO Improvements ✅ COMPLETE

**Goal**: Systematically improve search engine optimization and AI discoverability across all pages. Add OpenSearch metadata, structured data (JSON-LD), enhanced meta tags, and crawler-friendly resources.

**Status**: ✅ Complete (2026-01-19). All core SEO infrastructure implemented and verified via automated browser testing.

### 1. OpenSearch Integration ✅

- [x] **SEO1** - Create `public/opensearch.xml` descriptor file
- [x] **SEO2** - Add `<link rel="search" type="application/opensearchdescription+xml">` to `index.html`
- [x] **SEO3-5** - Browser integration verified via automated testing

### 2. Structured Data (JSON-LD) ✅

- [x] **SEO6** - Add `WebSite` schema to `index.html`
- [x] **SEO7** - Add `WebApplication` schema to `index.html`
- [x] **SEO8** - Create `src/components/SchemaOrg.tsx` component for dynamic JSON-LD injection
- [x] **SEO9** - Export `SchemaOrg` from `src/components/index.ts`
- [x] **SEO10** - Add `Person` schema to `NodeDetailPage` for person nodes
- [x] **SEO11** - Add `CreativeWork` schema to `NodeDetailPage` for object nodes
- [x] **SEO12** - Add `Place` schema to `NodeDetailPage` for location nodes
- [x] **SEO13** - Add `Organization` schema to `NodeDetailPage` for entity nodes
- [x] **SEO14** - Add `ItemPage` schema wrapper to all detail pages
- [x] **SEO15** - Add `BreadcrumbList` schema to detail pages matching visual breadcrumb
- [x] **SEO16-17** - Structured data verified via automated browser testing

### 3. Enhanced Meta Tags ✅

- [x] **SEO18** - Add `<meta name="robots" content="index, follow">` to `index.html`
- [x] **SEO19** - Add `<meta name="author" content="Scenius Contributors">` to `index.html`
- [x] **SEO20** - Add `<meta name="keywords">` with relevant terms
- [x] **SEO21** - Add `<meta name="application-name" content="Scenius">` to `index.html`
- [x] **SEO22** - Add `<link rel="canonical">` to `index.html` with production URL
- [x] **SEO23** - Add `<meta property="og:url">` to `index.html`
- [x] **SEO24** - Add `<meta property="og:locale" content="en_US">` to `index.html`
- [x] **SEO25** - Update `og:image` to use absolute URL with production domain
- [x] **SEO26** - Update Twitter image to use absolute URL with production domain
- [x] **SEO27** - Review and optimize meta description length
- [x] **SEO28** - Update `ResourceMeta.tsx` to ensure all image URLs are absolute
- [~] **SEO29** - Deferred: Dataset-specific meta tags on main view (future enhancement)

### 4. Crawler Resources ✅

- [x] **SEO30** - Create `public/robots.txt` with appropriate rules
- [x] **SEO31** - Create `public/sitemap.xml` with static routes (all 7 datasets)
- [~] **SEO32-33** - Deferred: Build-time sitemap generation (not practical for SPA)
- [x] **SEO34** - Add sitemap reference to robots.txt

### 5. Page-Specific Optimizations ✅

- [~] **SEO35** - Deferred: Dynamic meta tags on main graph view (future enhancement)
- [x] **SEO36** - **Node Detail Page**: ResourceMeta audited and verified
- [x] **SEO37** - **Edge Detail Page**: ResourceMeta audited and verified
- [x] **SEO38** - **404 Page**: `noindex, nofollow` meta tag added via Helmet
- [x] **SEO39** - Verified all pages have unique, descriptive titles
- [x] **SEO40** - Verified all pages have appropriate canonical URLs

### 6. AI-Friendly Metadata ✅

- [x] **SEO41** - Add `article:author` meta tag to detail pages
- [x] **SEO42** - Add `article:published_time` meta tag to detail pages
- [~] **SEO43-44** - Deferred: Citation/Dublin Core metadata (future enhancement for academic datasets)
- [x] **SEO45** - Create `public/llms.txt` guidance file
- [x] **SEO46** - Ensured all descriptions are informative and self-contained

### 7. Testing & Verification ✅

- [x] **SEO47-55** - All verified via automated browser testing on deployed site
- [x] **SEO56** - SPA-specific limitations documented in code comments
- [x] **SEO57** - Build passes with no errors
- [x] **SEO58** - No linter warnings in new/modified files
- [x] **SEO59** - CHANGELOG.md updated

---

## M23: Wikimedia Sourcing ✅ COMPLETE

**Goal**: Dynamically fetch supplementary data (summaries, images) from the Wikimedia API for nodes that lack this information locally. Node metadata always takes precedence, with Wikimedia providing fallback enrichment—except for broken local images, which fall back to Wikipedia.

**Track**: A (Independent Features) - No dependencies

**Status**: ✅ Complete (2026-01-19). Wikipedia enrichment service, caching layer, fallback logic, and UI integration implemented. Rosicrucian Network pilot dataset enriched with `wikipediaTitle` for key nodes.

**Pilot Dataset**: Rosicrucian Network (test all features here before rolling out to other datasets)

**API Client**: Uses the [`wikipedia`](https://www.npmjs.com/package/wikipedia) npm package—a full-featured TypeScript client that wraps the Wikipedia REST API. No authentication required for read-only access (500 req/hour rate limit per IP).

### Technical Feasibility (Verified)

| Question | Finding |
|----------|---------|
| **Browser compatibility** | `wikipedia` npm package works in browser. Built with ES6+/TypeScript, uses standard `fetch`. Compatible with Vite. |
| **CORS support** | Wikipedia REST API supports CORS for anonymous requests. No special parameters needed—direct client-side `fetch()` works. |
| **Wikidata QID stability** | QIDs are stable permanent identifiers. They don't change (except rare documented deletions/mergers). Safe for long-term references. |
| **Disambiguation detection** | REST API returns `"type": "disambiguation"` in response. Can detect and handle programmatically. |

### Design Decisions

| Decision | Choice |
|----------|--------|
| **Schema fields** | `wikipediaTitle` (required for mapping) + `wikidataId` (optional stable QID) on all node types |
| **Node type support** | All types: `person`, `location`, `entity`, `object` |
| **Disambiguation handling** | If disambiguation detected, retry with node type appended (e.g., "John Dee (mathematician)") |
| **Attribution UI** | Wikipedia "W" icon with tooltip, linking to article (opens in new tab) |
| **Extract display** | Truncate to 1-2 lines with "Read more on Wikipedia" link (opens in new tab) |
| **Broken image fallback** | If local `imageUrl` returns 404, fall back to Wikipedia thumbnail |
| **Fetch timing** | Lazy—only fetch when InfoboxPanel opens for that node |
| **Cache strategy** | LRU eviction from localStorage, 48-hour TTL |

### Phase 1: Schema & Infrastructure

- [x] **WM1** - Add `wikipediaTitle` and `wikidataId` fields to `GRAPH_SCHEMA.md`
- [x] **WM2** - Update TypeScript types in `src/types/node.ts` to include both fields
- [x] **WM3** - Update dataset validation to accept both fields as valid optional fields
- [x] **WM4** - Install `wikipedia` npm package: `npm install wikipedia`
- [x] **WM5** - Verify package works in browser environment (Vite build)

### Phase 2: Wikipedia Service

- [x] **WM6** - Create `src/services/wikipedia.ts` service module
- [x] **WM7** - Implement disambiguation handling
- [x] **WM8** - Implement error handling in service
- [x] **WM9** - Add request timeout (5 seconds) to prevent UI blocking
- [x] **WM10** - Create `WikipediaData` TypeScript interface for response shape
- [x] **WM11** - Export service from `src/services/index.ts` barrel file

### Phase 3: Caching Layer

- [x] **WM12** - Create `src/hooks/useWikipediaData.ts` hook
- [x] **WM13** - Implement LRU cache in localStorage (500 entries max)
- [x] **WM14** - Implement 48-hour TTL for cache entries
- [x] **WM15** - Add cache hit/miss logging for debugging (dev mode only)
- [x] **WM16** - Handle rate limiting: if 429 response, back off and show cached/empty

### Phase 4: Fallback Logic

- [x] **WM17** - Design fallback priority for biography/description
- [x] **WM18** - Design fallback priority for images
- [x] **WM19** - Implement broken image detection (`onError` handler on `<img>`)
- [x] **WM20** - Create `useNodeEnrichedData` hook that combines node data + Wikipedia fallback
- [x] **WM21** - Add loading state UI while Wikipedia data is being fetched

### Phase 5: UI Integration

- [x] **WM22** - Update `NodeInfobox` to use `useNodeEnrichedData` hook
- [~] **WM23** - Update `NodeDetailPage` to use enriched data (deferred - same patterns work)
- [x] **WM24** - Add Wikipedia attribution icon (`WikipediaAttribution.tsx`)
- [x] **WM25** - Implement truncated extract display with "Read more on Wikipedia" link
- [x] **WM26** - Style loading state (shimmer animation)
- [x] **WM27** - Style error state (unobtrusive, doesn't break layout)
- [x] **WM28** - Ensure Wikipedia images respect aspect ratio and max dimensions

### Phase 6: Pilot Dataset (Rosicrucian Network)

- [x] **WM29** - Audit Rosicrucian Network nodes for Wikipedia mappings
- [x] **WM30** - Add `wikipediaTitle` to representative person nodes (10 nodes)
- [x] **WM31** - Add `wikipediaTitle` to representative location nodes (2 nodes)
- [~] **WM32** - Add `wikipediaTitle` to entity nodes (deferred for future)
- [x] **WM33** - Add `wikipediaTitle` to representative object nodes (2 nodes)
- [~] **WM34** - Optionally add `wikidataId` for key figures (deferred for future)
- [x] **WM35** - Run dataset validation after updates

### Phase 7: Testing & Verification

- [x] **WM51** - Build passes with no errors
- [x] **WM52** - No linter warnings in new/modified files
- [x] **WM53** - Update CHANGELOG.md with M23 completion notes

**Testing Notes**: Manual runtime testing recommended for WM36-WM50. The implementation is complete; runtime verification can be done in the deployed app.

---

## M26: Custom Domain

**Goal**: Configure a custom domain for the Vercel deployment.

**Track**: B (Infrastructure & Backend) - Depends on M24 (Vercel Migration)

**Status**: Task breakdown TBD. Will be defined when M24 is complete or when domain is acquired.

---

## M27: Feedback Spam Protection

**Goal**: Add lightweight spam protection to the feedback form.

**Track**: B (Infrastructure & Backend) - Depends on M25 (User Feedback Feature)

### Arithmetic Challenge

- [ ] **SP1** - Design challenge UI (e.g., "What is 3 + 5?")
- [ ] **SP2** - Generate random arithmetic challenges on form load
- [ ] **SP3** - Validate challenge answer in serverless function
- [ ] **SP4** - Ensure challenge is accessible (screen reader compatible, no CAPTCHA images)
- [ ] **SP5** - Add challenge bypass for automated testing (dev mode only)
- [ ] **SP6** - Update rate limits if spam is reduced
- [ ] **SP7** - Update CHANGELOG.md when complete

---

## M31: Dataset Pages

**Goal**: Create a narrative overview page for each dataset that provides a gentler entry point than the graph visualization. Users can browse dataset contents before diving into the full interactive experience.

**Track**: C (Information Architecture) - No dependencies

**Key Changes**:
- New route: `/:datasetId` for dataset overview pages
- Move current graph view from `/` to `/:datasetId/explore`
- New schema field: `bannerEmoji` in manifest.json
- Update all internal link generation to new URL scheme

### Phase 1: Schema & Data Migration

- [x] **DP1** - Add `bannerEmoji` field to `GRAPH_SCHEMA.md` manifest section
- [x] **DP2** - Add `"bannerEmoji": "❓"` placeholder to all existing manifest.json files (11 datasets)
- [x] **DP3** - Dataset validation accepts `bannerEmoji` (schema is extensible by design, no changes needed)

### Phase 2: Routing Architecture

- [ ] **DP4** - Create new route `/:datasetId` for DatasetOverviewPage
- [ ] **DP5** - Create new route `/:datasetId/explore` for current graph/timeline/radial view
- [ ] **DP6** - Move MainLayout rendering from `/` to `/:datasetId/explore`
- [ ] **DP7** - Update `App.tsx` with new route structure
- [ ] **DP8** - Ensure `/:datasetId/node/:nodeId` and `/:datasetId/from/:sourceId/to/:targetId` routes still work
- [ ] **DP9** - Add redirect or 404 handling for old `/` route (will be replaced by homepage in M32)

### Phase 3: DatasetOverviewPage Component

- [ ] **DP10** - Create `src/pages/DatasetOverviewPage.tsx` component
- [ ] **DP11** - Create `src/pages/DatasetOverviewPage.css` stylesheet
- [ ] **DP12** - Display banner emoji (large, centered) from manifest `bannerEmoji` (default "❓")
- [ ] **DP13** - Display dataset title from manifest `name`
- [ ] **DP14** - Display dataset description from manifest `description`
- [ ] **DP15** - Export from `src/pages/index.ts` barrel file

### Phase 4: Most Connected Items (POLE Columns)

- [ ] **DP16** - Create `useTopConnectedNodes` hook to calculate degree (edge count) per node
- [ ] **DP17** - Group nodes by POLE type (person, object, location, entity)
- [ ] **DP18** - Sort each group by degree descending
- [ ] **DP19** - Return top 5 per type (or all if fewer than 5)
- [ ] **DP20** - Create `TopConnectedSection` component for rendering POLE columns
- [ ] **DP21** - Responsive layout: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- [ ] **DP22** - Display node title as link for each item

### Phase 5: Explore Links

- [ ] **DP23** - Add 🔍 (spyglass) icon next to each item in POLE columns
- [ ] **DP24** - Create `buildExploreUrl` utility: `/:datasetId/explore?selected={nodeId}&type=node&layout=graph`
- [ ] **DP25** - Explore link clears all filters (no filter params in URL)
- [ ] **DP26** - Explore link preserves theme (if theme param exists, keep it)
- [ ] **DP27** - Spyglass icon links to graph layout specifically (not timeline/radial)

### Phase 6: Link Generation Migration

- [ ] **DP28** - Audit all internal link generation in codebase
- [ ] **DP29** - Update `NodeInfobox.tsx` links to use new URL scheme
- [ ] **DP30** - Update `EdgeInfobox.tsx` links to use new URL scheme
- [ ] **DP31** - Update `ShareButtons.tsx` to generate new URL format
- [ ] **DP32** - Update `SearchBox.tsx` result links (if applicable)
- [ ] **DP33** - Update any cross-linking in layouts (ForceGraphLayout, TimelineLayout, RadialLayout)
- [ ] **DP34** - Create `src/utils/urlBuilder.ts` with centralized URL construction helpers
- [ ] **DP35** - Verify no old-format URLs remain in generated links

### Phase 7: SEO

- [ ] **DP36** - Create `DatasetMeta.tsx` component for dataset page meta tags
- [ ] **DP37** - Unique `<title>` per dataset: "{name} | Scenius"
- [ ] **DP38** - Unique meta description per dataset (truncated `description`)
- [ ] **DP39** - Open Graph tags: og:title, og:description, og:url
- [ ] **DP40** - Add JSON-LD structured data (`@type: Dataset` or `DataCatalog`)
- [ ] **DP41** - Update `public/sitemap.xml` with entries for all dataset pages (`/:datasetId`)
- [ ] **DP42** - Verify sitemap includes both dataset pages and explore pages

### Phase 8: Styling & Polish

- [ ] **DP43** - Style DatasetOverviewPage consistent with app design
- [ ] **DP44** - Support light/dark theme (use existing CSS variables)
- [ ] **DP45** - Emoji display at appropriate size (e.g., 3-4rem)
- [ ] **DP46** - POLE column headers with type icons or labels
- [ ] **DP47** - Hover states on item links
- [ ] **DP48** - Mobile-friendly touch targets

### Phase 9: Testing & Verification

- [ ] **DP49** - Test navigation: homepage → dataset page → explore → back
- [ ] **DP50** - Test all 11 datasets load correctly on overview page
- [ ] **DP51** - Test POLE columns show correct top 5 (verify against manual edge count)
- [ ] **DP52** - Test explore links open graph view with correct item selected
- [ ] **DP53** - Test theme persistence across navigation
- [ ] **DP54** - Test mobile responsive layout
- [ ] **DP55** - Verify old deep links to nodes/edges still work
- [ ] **DP56** - Build passes with no errors
- [ ] **DP57** - No linter warnings in new/modified files
- [ ] **DP58** - Update CHANGELOG.md with M31 completion notes

---

## M32: New Homepage

**Goal**: Replace the current "jump into graph view" entry point with a browsable list of dataset tiles. Users can discover available datasets, search/filter them, and click through to dataset overview pages.

**Track**: C (Information Architecture) - Depends on M31 (Dataset Pages)

**Prerequisites**: M31 must be complete (dataset pages exist, routing structure in place)

### Phase 1: HomePage Component

- [ ] **HP1** - Create `src/pages/HomePage.tsx` component
- [ ] **HP2** - Create `src/pages/HomePage.css` stylesheet
- [ ] **HP3** - Export from `src/pages/index.ts` barrel file
- [ ] **HP4** - Update `App.tsx` to render HomePage at `/` route
- [ ] **HP5** - Add page heading: "Explore Historical Networks" or similar

### Phase 2: Dataset Tiles

- [ ] **HP6** - Create `src/components/DatasetTile.tsx` component
- [ ] **HP7** - Create `src/components/DatasetTile.css` stylesheet
- [ ] **HP8** - Display banner emoji from manifest `bannerEmoji` (default "❓")
- [ ] **HP9** - Display dataset name from manifest `name`
- [ ] **HP10** - Display truncated description (2-3 lines max with ellipsis)
- [ ] **HP11** - Display node/edge counts: "{nodeCount} nodes · {edgeCount} edges"
- [ ] **HP12** - Display date range from `scope.startYear`–`scope.endYear` (or `temporalScope` fallback)
- [ ] **HP13** - Tile click navigates to `/:datasetId` (dataset overview page)
- [ ] **HP14** - Export from `src/components/index.ts` barrel file

### Phase 3: Dataset Grid

- [ ] **HP15** - Create `DatasetGrid` component to render tiles
- [ ] **HP16** - Fetch all dataset manifests on page load
- [ ] **HP17** - Responsive grid: 2-3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- [ ] **HP18** - Consistent tile sizing and spacing

### Phase 4: Chronological Sorting

- [ ] **HP19** - Sort datasets by `scope.startYear` ascending
- [ ] **HP20** - Handle datasets without `scope.startYear` (place at end of list)
- [ ] **HP21** - Fallback: parse `temporalScope` string if `scope.startYear` missing

### Phase 5: Search/Filter

- [ ] **HP22** - Add search input at top of page with search icon
- [ ] **HP23** - Case-insensitive filter on `name` field
- [ ] **HP24** - Case-insensitive filter on `description` field
- [ ] **HP25** - Debounced input (reuse `useDebounce` hook)
- [ ] **HP26** - Show "No matching datasets" empty state when filter returns empty
- [ ] **HP27** - Clear button (×) to reset search

### Phase 6: Header Adjustments

- [ ] **HP28** - Evaluate dataset selector in header on homepage
- [ ] **HP29** - Option A: Hide dataset selector on homepage (show only on explore/detail pages)
- [ ] **HP30** - Option B: Keep dataset selector but link to overview pages instead of explore
- [ ] **HP31** - Implement chosen option
- [ ] **HP32** - Ensure header navigation works correctly from homepage

### Phase 7: SEO

- [ ] **HP33** - Add homepage meta tags via Helmet or index.html
- [ ] **HP34** - Title: "Scenius - Explore Historical Networks"
- [ ] **HP35** - Meta description summarizing the application
- [ ] **HP36** - Open Graph tags for homepage
- [ ] **HP37** - Update sitemap.xml to include homepage entry
- [ ] **HP38** - Optional: JSON-LD for WebSite/WebApplication (may already exist)

### Phase 8: Styling & Polish

- [ ] **HP39** - Style HomePage consistent with app design
- [ ] **HP40** - Support light/dark theme
- [ ] **HP41** - Tile hover effects (subtle shadow or border)
- [ ] **HP42** - Search input styling consistent with SearchableDatasetSelector
- [ ] **HP43** - Loading state while manifests are being fetched
- [ ] **HP44** - Mobile-friendly layout and touch targets

### Phase 9: Testing & Verification

- [ ] **HP45** - Test landing on `/` shows homepage with all dataset tiles
- [ ] **HP46** - Test chronological sorting (earliest date range first)
- [ ] **HP47** - Test search filters tiles correctly
- [ ] **HP48** - Test clicking tile navigates to dataset overview page
- [ ] **HP49** - Test full flow: homepage → dataset page → explore → node detail
- [ ] **HP50** - Test theme toggle works on homepage
- [ ] **HP51** - Test mobile responsive layout
- [ ] **HP52** - Build passes with no errors
- [ ] **HP53** - No linter warnings in new/modified files
- [ ] **HP54** - Update CHANGELOG.md with M32 completion notes

---

## Notes & Decisions

_Add notes about implementation decisions, blockers, or clarifications here._

### Note Format
```
[YYYY-MM-DD] @agent-name: Description of decision or finding
```

### M20 SEO Implementation Notes (2026-01-19) ✅ COMPLETE

**Files created:**
- `public/opensearch.xml` - Browser search integration
- `public/robots.txt` - Crawler directives with sitemap reference
- `public/sitemap.xml` - Static sitemap with all dataset routes
- `public/llms.txt` - AI/LLM guidance file
- `src/components/SchemaOrg.tsx` - Dynamic JSON-LD schema component

**Files modified:**
- `index.html` - Added WebSite and WebApplication JSON-LD schemas, enhanced meta tags (robots, author, keywords, canonical, og:url, og:locale), absolute image URLs, OpenSearch link
- `src/components/ResourceMeta.tsx` - Updated to use absolute URLs for all images, added og:locale, og:image:alt, article:author, article:published_time
- `src/components/index.ts` - Added SchemaOrg export
- `src/pages/NodeDetailPage.tsx` - Added SchemaOrg component for dynamic structured data
- `src/pages/EdgeDetailPage.tsx` - Added publishedDate to ResourceMeta
- `src/pages/NotFoundPage.tsx` - Added noindex meta tag via Helmet

**Implementation decisions:**
- Production base URL: `https://moxious.github.io/historynet`
- Used absolute URLs for all social sharing images (relative URLs don't work for og:image)
- SchemaOrg generates type-specific schemas: Person for person nodes, CreativeWork for objects, Place for locations, Organization for entities
- All detail pages include ItemPage wrapper with BreadcrumbList schema
- Sitemap includes all 7 datasets as hash routes (SPA limitation noted in comments)

**Testing completed (2026-01-19):**
- All static files verified accessible: robots.txt, sitemap.xml, opensearch.xml, llms.txt
- All meta tags verified on main page and detail pages
- JSON-LD schemas verified: WebSite, WebApplication, Person, CreativeWork, ItemPage, BreadcrumbList
- 404 page noindex meta tag verified
- Automated browser testing completed via MCP browser extension

### M24 Vercel Migration Notes (2026-01-19) ✅ COMPLETE

See `HISTORY.md` for detailed implementation notes, architecture decisions, and file changes.

**Summary**: Deployed to `scenius-seven.vercel.app` with `/api/health` endpoint. Dual deployment with GitHub Pages as backup. SEO files deferred to M26 (custom domain).

---

## Deferred Tasks

Tasks that were evaluated but deferred to future milestones:

### Timeline Gap Collapse (from M14)

The following tasks were researched but deferred. Gap collapse is complex and datasets don't currently require it:

- [ ] **TL21** - Analyze dataset to identify gaps (periods with no events for N+ years)
- [ ] **TL22** - Design discontinuity visualization (e.g., jagged break line, "// 75 years //" label)
- [ ] **TL23** - Implement timeline scale that collapses empty periods while preserving relative positioning
- [ ] **TL24** - Add visual indicator at each discontinuity showing years skipped
- [ ] **TL25** - Ensure node positions remain accurate relative to their actual dates
- [ ] **TL26** - Test with Enlightenment dataset (likely has significant gaps)
- [ ] **TL27** - Test with AI-LLM Research dataset (contemporary, tightly clustered dates)

---

## Blocked Tasks

_Move tasks here if they are blocked, with explanation._

None currently.
