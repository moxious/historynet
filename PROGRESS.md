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

**Key decisions made during MVP:**
- React Context for state management (sufficient for app scale)
- HashRouter for GitHub Pages compatibility
- D3 for both graph and timeline layouts
- URL-first state for deep linking and sharing
- Evidence required on all edges per GRAPH_SCHEMA.md

**Post-MVP improvements (M9-M14, M13):**
- Extracted shared utils (`graphColors.ts`, `useDebounce.ts`)
- Debounced filter inputs for smooth typing
- Memoized click handlers to prevent graph re-layout
- Physics tuning for better node clustering
- Timeline positioning and readability improvements
- Legend consistency between graph and timeline views
- Scenius rebrand with light/dark theme system (M13)

---

## M12: User Feedback

**Goal**: Enable users to submit feedback about graph data without requiring a GitHub account. Migrate to Vercel for serverless function support.

**Note**: Since M15 (Stable Resource URLs) is complete, integrate feedback forms into the stable resource pages. Each node/edge detail page becomes a natural place for item-specific feedback. Add tasks to place FeedbackButton on NodeDetailPage and EdgeDetailPage.

### Platform Migration (Vercel)

- [ ] **FB1** - Create Vercel project and link to GitHub repository
- [ ] **FB2** - Configure Vercel build settings for Vite (framework preset)
- [ ] **FB3** - Create GitHub bot account or PAT for issue creation
- [ ] **FB4** - Add `GITHUB_PAT` environment variable in Vercel dashboard
- [ ] **FB5** - Test deployment on Vercel (frontend only, before API)
- [ ] **FB6** - Update AGENTS.md and README.md with new Vercel deployment URL
- [ ] **FB7** - Decide: keep GitHub Pages redirect or remove entirely
- [ ] **FB8** - Remove or repurpose `.github/workflows/deploy.yml`

### Feedback Form (Frontend)

- [ ] **FB9** - Create `FeedbackSubmission` TypeScript interface in `src/types/`
- [ ] **FB10** - Create `FeedbackForm` component with form fields:
  - Feedback type dropdown (missing node, missing edge, incorrect data, remove item, general)
  - Title (required)
  - Description (required, textarea)
  - Suggested change (optional, textarea)
  - Evidence URLs (optional, multi-line input)
  - Evidence text/citations (optional, textarea)
  - Contact email (optional)
- [ ] **FB11** - Add form validation (required fields, email format, URL format)
- [ ] **FB12** - Auto-populate context fields (dataset, selected node/edge, current URL)
- [ ] **FB13** - Create `FeedbackButton` component to trigger form (placed in Header or InfoboxPanel)
- [ ] **FB14** - Style feedback form modal/panel with CSS
- [ ] **FB15** - Add loading state during submission
- [ ] **FB16** - Add success state showing created issue URL
- [ ] **FB17** - Add error state with user-friendly messages

### Serverless API Endpoint

- [ ] **FB18** - Create `api/submit-feedback.ts` serverless function
- [ ] **FB19** - Implement request validation (method, content-type, required fields)
- [ ] **FB20** - Implement input sanitization (strip HTML, validate URLs)
- [ ] **FB21** - Format feedback into GitHub issue body (markdown)
- [ ] **FB22** - Call GitHub API to create issue with appropriate labels
- [ ] **FB23** - Return issue URL on success, error details on failure
- [ ] **FB24** - Add rate limiting (e.g., 5 submissions per IP per hour)
- [ ] **FB25** - Add honeypot field for basic bot detection

### Integration & Testing

- [ ] **FB26** - Connect frontend form to API endpoint
- [ ] **FB27** - Test end-to-end: form submission → GitHub issue created
- [ ] **FB28** - Test error handling: API down, rate limited, validation failures
- [ ] **FB29** - Test with different feedback types and datasets
- [ ] **FB30** - Verify issue formatting is readable and useful for maintainers

### Documentation & Polish

- [ ] **FB31** - Add user-facing help text explaining what feedback is used for
- [ ] **FB32** - Document API endpoint in codebase (inline comments or separate doc)
- [ ] **FB33** - Update ROADMAP.md Live Demo URL if domain changes
- [ ] **FB34** - Add entry to CHANGELOG.md when milestone complete

---

---

## M17: Dataset Search & Filter

**Goal**: Replace the dataset dropdown with a searchable combobox that filters datasets by name or description as the user types.

### Component Architecture

- [ ] **DS1** - Design searchable combobox component API and props interface
- [ ] **DS2** - Decide on implementation approach: custom build vs. headless library (Downshift, React Aria, etc.)
- [ ] **DS3** - Create `SearchableDatasetSelector` component in `src/components/`
- [ ] **DS4** - Add text input field for search/filter query
- [ ] **DS5** - Implement dropdown list showing filtered dataset options
- [ ] **DS6** - Wire up to existing dataset loading from `useDataset` hook or context

### Search & Filter Logic

- [ ] **DS7** - Implement case-insensitive filtering against dataset `name` field
- [ ] **DS8** - Extend filtering to also match against dataset `description` field
- [ ] **DS9** - Match search term anywhere in name/description (not just prefix)
- [ ] **DS10** - Add debouncing to filter input if performance requires (use existing `useDebounce` hook)
- [ ] **DS11** - Show "No matching datasets" message when filter returns empty results
- [ ] **DS12** - Add clear button (×) to reset search input

### Keyboard Navigation & Accessibility

- [ ] **DS13** - Implement arrow key navigation through filtered results
- [ ] **DS14** - Enter key selects highlighted/focused dataset
- [ ] **DS15** - Escape key closes dropdown and clears search
- [ ] **DS16** - Tab key moves focus appropriately (into/out of component)
- [ ] **DS17** - Add ARIA attributes for combobox pattern (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, etc.)
- [ ] **DS18** - Ensure screen reader announces filtered results count

### Visual Design & Theming

- [ ] **DS19** - Style component consistent with existing app design
- [ ] **DS20** - Support light/dark theme (use existing theme CSS variables)
- [ ] **DS21** - Display dataset name and description snippet in dropdown items
- [ ] **DS22** - Truncate long descriptions with ellipsis
- [ ] **DS23** - Visual distinction between: currently selected, hovered, keyboard-focused states
- [ ] **DS24** - Optional: highlight matching text in search results

### Integration

- [ ] **DS25** - Replace existing `DatasetSelector` dropdown with new searchable component
- [ ] **DS26** - Ensure selected dataset continues to sync with URL (`?dataset=...`)
- [ ] **DS27** - Search/filter state is ephemeral (not persisted to URL)
- [ ] **DS28** - Component works correctly when datasets are still loading

### Testing & Verification

- [ ] **DS29** - Test filtering with partial matches (e.g., "llm" finds "AI & LLM Research Network")
- [ ] **DS30** - Test filtering by description (e.g., "enlightenment" finds dataset by description)
- [ ] **DS31** - Test keyboard navigation through filtered results
- [ ] **DS32** - Test with empty search (shows all datasets)
- [ ] **DS33** - Test with no-match search (shows empty state message)
- [ ] **DS34** - Test theme switching (light/dark mode)
- [ ] **DS35** - Verify accessibility with screen reader
- [ ] **DS36** - Build passes with no errors or linter warnings
- [ ] **DS37** - Update CHANGELOG.md with M17 completion notes

---

## M20: SEO Improvements

**Goal**: Systematically improve search engine optimization and AI discoverability across all pages. Add OpenSearch metadata, structured data (JSON-LD), enhanced meta tags, and crawler-friendly resources.

**Current State**: The app has basic Open Graph and Twitter Card meta tags in `index.html`, and uses `react-helmet-async` via `ResourceMeta.tsx` for dynamic meta tags on detail pages. This milestone fills in the gaps.

### 1. OpenSearch Integration

**Intent**: Allow browsers to add Scenius as a search provider, enabling users to search datasets directly from the browser's address bar.

- [x] **SEO1** - Create `public/opensearch.xml` descriptor file
  - Include short name, description, search URL template
  - Point to `/?search={searchTerms}` or appropriate search route
- [x] **SEO2** - Add `<link rel="search" type="application/opensearchdescription+xml">` to `index.html`
- [ ] **SEO3** - Test browser integration in Chrome (Settings > Search engines)
- [ ] **SEO4** - Test browser integration in Firefox
- [ ] **SEO5** - Test browser integration in Safari

### 2. Structured Data (JSON-LD)

**Intent**: Add Schema.org structured data to help search engines and AI understand content type and relationships.

- [x] **SEO6** - Add `WebSite` schema to `index.html`
  - Include name, url, description, potentialAction (SearchAction)
- [x] **SEO7** - Add `WebApplication` schema to `index.html`
  - Include name, description, applicationCategory, operatingSystem
- [x] **SEO8** - Create `src/components/SchemaOrg.tsx` component for dynamic JSON-LD injection
  - Accept schema type and data as props
  - Render `<script type="application/ld+json">` via Helmet
- [x] **SEO9** - Export `SchemaOrg` from `src/components/index.ts`
- [x] **SEO10** - Add `Person` schema to `NodeDetailPage` for person nodes
  - Include name, description, birthDate, deathDate, nationality, image, sameAs (external links)
- [x] **SEO11** - Add `CreativeWork` schema to `NodeDetailPage` for object nodes
  - Include name, description, dateCreated, creator, inLanguage
- [x] **SEO12** - Add `Place` schema to `NodeDetailPage` for location nodes
  - Include name, description, geo (coordinates), containedInPlace
- [x] **SEO13** - Add `Organization` schema to `NodeDetailPage` for entity nodes
  - Include name, description, foundingDate, founder, location
- [x] **SEO14** - Add `ItemPage` schema wrapper to all detail pages
  - Include mainEntity reference to the specific node schema
- [x] **SEO15** - Add `BreadcrumbList` schema to detail pages matching visual breadcrumb
  - Include itemListElement with position, name, item (URL)
- [ ] **SEO16** - Test structured data with Google Rich Results Test tool
- [ ] **SEO17** - Test structured data with Schema.org validator

### 3. Enhanced Meta Tags

**Intent**: Improve existing meta tags and add missing recommended tags.

- [x] **SEO18** - Add `<meta name="robots" content="index, follow">` to `index.html`
- [x] **SEO19** - Add `<meta name="author" content="Scenius Contributors">` to `index.html`
- [x] **SEO20** - Add `<meta name="keywords">` with relevant terms (historical networks, visualization, etc.)
- [x] **SEO21** - Add `<meta name="application-name" content="Scenius">` to `index.html`
- [x] **SEO22** - Add `<link rel="canonical">` to `index.html` with production URL
- [x] **SEO23** - Add `<meta property="og:url">` to `index.html` (currently missing)
- [x] **SEO24** - Add `<meta property="og:locale" content="en_US">` to `index.html`
- [x] **SEO25** - Update `og:image` to use absolute URL with production domain
- [x] **SEO26** - Update Twitter image to use absolute URL with production domain
- [x] **SEO27** - Review and optimize meta description length (150-160 chars ideal)
- [x] **SEO28** - Update `ResourceMeta.tsx` to ensure all image URLs are absolute
- [ ] **SEO29** - Add dataset-specific description to main graph view when dataset is loaded
  - Create component or hook to update meta tags based on selected dataset

### 4. Crawler Resources

**Intent**: Add standard files that help search engine crawlers discover and index content.

- [x] **SEO30** - Create `public/robots.txt` with appropriate rules
  - Allow all crawlers
  - Reference sitemap location
- [x] **SEO31** - Create `public/sitemap.xml` with static routes
  - Include home page, any other static routes
- [ ] **SEO32** - Evaluate: Add build-time script to generate sitemap entries for dataset nodes
  - Read all datasets, generate URLs for each node detail page
  - Consider if practical given SPA nature
- [ ] **SEO33** - If SEO32 is implemented: Update `package.json` with sitemap generation script
- [x] **SEO34** - Add sitemap reference to robots.txt

### 5. Page-Specific Optimizations

**Intent**: Review each page type and ensure comprehensive SEO coverage.

- [ ] **SEO35** - **Main Graph View** (`/`): Add dynamic meta tags when dataset is selected
  - Title: "{Dataset Name} | Scenius"
  - Description: Dataset description from manifest
- [x] **SEO36** - **Node Detail Page**: Audit `ResourceMeta` usage
  - Ensure all relevant node fields are used in meta tags
  - Verify image URLs work for social preview
- [x] **SEO37** - **Edge Detail Page**: Audit `ResourceMeta` usage
  - Ensure relationship description is in meta description
  - Verify source/target node titles are in title
- [x] **SEO38** - **404 Page**: Add `<meta name="robots" content="noindex">` via Helmet
- [x] **SEO39** - Verify all pages have unique, descriptive titles
- [x] **SEO40** - Verify all pages have appropriate canonical URLs

### 6. AI-Friendly Metadata

**Intent**: Add metadata specifically helpful for AI systems and LLMs that may crawl or reference the site.

- [x] **SEO41** - Add `article:author` meta tag to detail pages
- [x] **SEO42** - Add `article:published_time` meta tag to detail pages (use dateStart if available)
- [ ] **SEO43** - Evaluate: Add `citation_*` meta tags for academic/research datasets
  - `citation_title`, `citation_author`, `citation_publication_date`
  - May only apply to certain datasets
- [ ] **SEO44** - Evaluate: Add Dublin Core (`dc:*`) metadata for scholarly content
  - `dc.title`, `dc.creator`, `dc.date`, `dc.description`
- [x] **SEO45** - Evaluate: Create `public/llms.txt` or `public/ai.txt` guidance file
  - Describe what the app does, how AI should interpret content
  - Reference: llmstxt.org specification if applicable
- [x] **SEO46** - Ensure all descriptions are informative and self-contained
  - Review auto-generated descriptions in ResourceMeta
  - Add fallbacks for nodes without shortDescription

### 7. Testing & Verification

- [ ] **SEO47** - Test meta tags with Facebook Sharing Debugger
- [ ] **SEO48** - Test meta tags with Twitter Card Validator
- [ ] **SEO49** - Test meta tags with LinkedIn Post Inspector
- [ ] **SEO50** - Verify OpenSearch appears in browser search settings
- [ ] **SEO51** - Verify robots.txt is accessible at production URL
- [ ] **SEO52** - Verify sitemap.xml is accessible and valid
- [ ] **SEO53** - Run Lighthouse SEO audit on main pages
- [ ] **SEO54** - Run Lighthouse SEO audit on node detail page
- [ ] **SEO55** - Run Lighthouse SEO audit on edge detail page
- [x] **SEO56** - Document any SPA-specific limitations in code comments
- [x] **SEO57** - Build passes with no errors
- [x] **SEO58** - No linter warnings in new/modified files
- [ ] **SEO59** - Update CHANGELOG.md with M20 completion notes

---

## M21: Image Asset Management

**Goal**: Fix broken image URLs in datasets by auditing, downloading, and hosting images in a stable location. Wikimedia Commons URLs break frequently as Wikipedia editors update article images.

**Background**: Many `imageUrl` fields in datasets (especially AI-LLM Research) link to Wikimedia Commons thumbnails that now return HTTP 404. This is because Wikipedia images are updated/renamed over time, breaking the original URLs.

### Phase 1: Audit & Research

- [ ] **IMG1** - Create audit script to check all `imageUrl` fields across all datasets
  - Read all `nodes.json` files
  - Extract all `imageUrl` values
  - Test each URL with HTTP HEAD request
  - Report: working (200), broken (404/other), missing (no imageUrl)
- [ ] **IMG2** - Run audit and document results in `research/image-audit/` folder
  - Create `audit-results.md` with counts per dataset
  - List all broken URLs with node IDs
- [ ] **IMG3** - For broken Wikimedia URLs, research current image URLs from Wikipedia
  - Check if same person/object has a new image on Wikipedia
  - Document new source URLs alongside old broken URLs
- [ ] **IMG4** - Identify nodes that should have images but don't have `imageUrl` field
  - Focus on major figures (persons with many connections)
- [ ] **IMG5** - Document licensing requirements for Wikimedia images
  - Most are CC-BY-SA or public domain
  - Note attribution requirements

### Phase 2: Image Hosting Setup

- [ ] **IMG6** - Decision: Choose hosting approach (document choice in this file)
  - Option A: `public/images/{dataset}/{node-id}.{ext}` (local, versioned with code)
  - Option B: Cloud storage bucket (S3, GCS, Cloudflare R2) with stable URLs
  - Option C: User-designated storage location (TBD)
- [ ] **IMG7** - Create directory structure for hosted images
  - If local: `public/images/ai-llm-research/`, `public/images/rosicrucian-network/`, etc.
  - If cloud: configure bucket with CORS for browser access
- [ ] **IMG8** - Document image naming convention
  - Recommendation: `{node-id}.jpg` (e.g., `person-geoffrey-hinton.jpg`)
  - Handle multiple formats: jpg, png, webp
- [ ] **IMG9** - Create script to download images from source URLs
  - Input: CSV/JSON of node-id → source-url mappings
  - Output: Downloaded images with correct names in target directory
  - Handle errors gracefully (skip failures, log issues)
- [ ] **IMG10** - If using cloud storage: configure and document upload process

### Phase 3: Download & Organize Images

- [ ] **IMG11** - Download images for AI-LLM Research dataset
  - Use researched URLs from IMG3
  - Verify downloaded images are valid (not error pages)
- [ ] **IMG12** - Download images for Rosicrucian Network dataset (if applicable)
- [ ] **IMG13** - Download images for Enlightenment dataset (if applicable)
- [ ] **IMG14** - Download images for other datasets as needed
- [ ] **IMG15** - Create `ATTRIBUTION.md` in images directory
  - Document source URL, license, and attribution for each image
  - Required for Wikimedia CC-BY-SA compliance

### Phase 4: Update Dataset Links

- [ ] **IMG16** - Create script to update `imageUrl` fields in dataset JSON files
  - Input: dataset name, base URL for hosted images
  - Output: Updated `nodes.json` with new `imageUrl` values
- [ ] **IMG17** - Update AI-LLM Research dataset `imageUrl` fields
- [ ] **IMG18** - Update other datasets as needed
- [ ] **IMG19** - Run dataset validation (`npm run validate:datasets`) to verify URLs are valid format
- [ ] **IMG20** - Manual verification: load app and check images display in infobox

### Phase 5: Documentation & Cleanup

- [ ] **IMG21** - Update `GRAPH_SCHEMA.md` with guidance on `imageUrl` best practices
  - Recommend hosted images over external URLs
  - Document supported image formats
- [ ] **IMG22** - Add image hosting documentation to `AGENTS.md` or README
  - How to add images for new nodes
  - Naming conventions
  - Attribution requirements
- [ ] **IMG23** - Remove or archive `research/image-audit/` working files
- [ ] **IMG24** - Update CHANGELOG.md with M21 completion notes

---

## M22: Sourcing from Wikimedia

**Goal**: Dynamically fetch supplementary data (summaries, images) from the Wikimedia API for nodes that lack this information locally. Node metadata always takes precedence, with Wikimedia providing fallback enrichment.

**API Client**: Use the [`wikipedia`](https://www.npmjs.com/package/wikipedia) npm package—a full-featured TypeScript client that wraps the Wikipedia REST API. No authentication required for read-only access (500 req/hour rate limit per IP).

### Phase 1: Schema & Infrastructure

- [ ] **WM1** - Add `wikipediaTitle` optional field to `GRAPH_SCHEMA.md`
  - Document as mapping hint for Wikipedia page title
  - Example: `"wikipediaTitle": "Geoffrey_Hinton"` for explicit mapping
  - If absent, fall back to node `title` for lookup
- [ ] **WM2** - Update TypeScript types in `src/types/` to include `wikipediaTitle` field on nodes
- [ ] **WM3** - Update dataset validation to accept `wikipediaTitle` as valid optional field
- [ ] **WM4** - Install `wikipedia` npm package: `npm install wikipedia`
- [ ] **WM5** - Verify package works in browser environment (Vite build)
  - Some npm packages are Node-only; test basic fetch in dev

### Phase 2: Wikipedia Service

- [ ] **WM6** - Create `src/services/wikipedia.ts` service module
  - Wrap the `wikipedia` package with app-specific interface
  - Export `fetchWikipediaSummary(title: string)` function
  - Return type: `{ extract: string; thumbnail?: { source: string; width: number; height: number } }`
- [ ] **WM7** - Implement error handling in service
  - Handle page-not-found (return null, don't throw)
  - Handle network errors gracefully
  - Handle disambiguation pages (return null or first result)
- [ ] **WM8** - Add request timeout (5 seconds) to prevent UI blocking
- [ ] **WM9** - Create `WikipediaData` TypeScript interface for response shape
- [ ] **WM10** - Export service from `src/services/index.ts` barrel file

### Phase 3: Caching Layer

- [ ] **WM11** - Create `src/hooks/useWikipediaData.ts` hook
  - Input: node (with optional `wikipediaTitle` and `title`)
  - Output: `{ data: WikipediaData | null; loading: boolean; error: string | null }`
- [ ] **WM12** - Implement in-memory cache (Map or object)
  - Key: Wikipedia title (normalized)
  - Value: API response or null (for 404s)
  - TTL: session-based (no expiry during session)
- [ ] **WM13** - Implement localStorage persistence for cache
  - Store cache on unmount or periodically
  - Restore cache on mount
  - Include timestamp for optional expiry (24 hours suggested)
- [ ] **WM14** - Add cache hit/miss logging for debugging (dev mode only)
- [ ] **WM15** - Handle rate limiting: if 429 response, back off and show cached/empty

### Phase 4: Fallback Logic

- [ ] **WM16** - Design fallback priority for biography/description:
  1. Node's `biography` field (if present and non-empty)
  2. Node's `shortDescription` field (if present and non-empty)
  3. Wikipedia `extract` (fetched via API)
  4. Empty state with "No description available"
- [ ] **WM17** - Design fallback priority for images:
  1. Node's `imageUrl` field (if present and valid)
  2. Wikipedia `thumbnail.source` (fetched via API)
  3. Placeholder or no image
- [ ] **WM18** - Create `useNodeEnrichedData` hook that combines node data + Wikipedia fallback
  - Returns unified shape regardless of source
  - Indicates source of each field for transparency (optional)
- [ ] **WM19** - Add loading state UI while Wikipedia data is being fetched

### Phase 5: UI Integration

- [ ] **WM20** - Update `InfoboxPanel` to use `useNodeEnrichedData` hook
  - Replace direct node field access with enriched data
  - Show loading spinner/skeleton while fetching
- [ ] **WM21** - Update `NodeDetailPage` to use enriched data
  - Same fallback logic as InfoboxPanel
- [ ] **WM22** - Add visual indicator when data is sourced from Wikipedia
  - Small "via Wikipedia" text or icon near enriched content
  - Links to Wikipedia article
- [ ] **WM23** - Style loading state (skeleton or subtle spinner)
- [ ] **WM24** - Style error state (unobtrusive, doesn't break layout)
- [ ] **WM25** - Ensure Wikipedia images respect aspect ratio and max dimensions

### Phase 6: Dataset Enhancement (Optional)

- [ ] **WM26** - Add `wikipediaTitle` to AI-LLM Research dataset nodes
  - Focus on persons and major entities
  - Use Wikipedia page title (underscores, exact casing)
- [ ] **WM27** - Add `wikipediaTitle` to Rosicrucian Network dataset nodes
- [ ] **WM28** - Add `wikipediaTitle` to other datasets as time permits
- [ ] **WM29** - Document `wikipediaTitle` mapping in dataset README or manifest

### Phase 7: Testing & Verification

- [ ] **WM30** - Test with node that has full local data (Wikipedia should not be called)
- [ ] **WM31** - Test with node missing biography (Wikipedia summary should appear)
- [ ] **WM32** - Test with node missing imageUrl (Wikipedia thumbnail should appear)
- [ ] **WM33** - Test with node that has no Wikipedia article (graceful fallback)
- [ ] **WM34** - Test with network offline (cached data or graceful empty state)
- [ ] **WM35** - Test cache persistence (reload page, data should load from cache)
- [ ] **WM36** - Test rate limiting behavior (mock 429 response)
- [ ] **WM37** - Verify no console errors in production build
- [ ] **WM38** - Lighthouse performance audit (Wikipedia fetching shouldn't block render)
- [ ] **WM39** - Build passes with no errors
- [ ] **WM40** - No linter warnings in new/modified files
- [ ] **WM41** - Update CHANGELOG.md with M22 completion notes

---

## Notes & Decisions

_Add notes about implementation decisions, blockers, or clarifications here._

### Note Format
```
[YYYY-MM-DD] @agent-name: Description of decision or finding
```

### M20 SEO Implementation Notes (2026-01-19)

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

**Remaining manual testing tasks:**
- SEO3-5: Test OpenSearch in browsers after deployment
- SEO16-17: Test structured data with Google/Schema.org validators
- SEO47-55: Social debuggers, browser tests, Lighthouse audits (require deployment)

> **Historical notes**: Detailed implementation notes for completed milestones (M1-M14) have been archived to `HISTORY.md`.

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
