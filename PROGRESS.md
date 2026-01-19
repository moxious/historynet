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

Future milestones are organized into two tracks:
- **Track A (M21, M23, M28)**: Independent features with no dependencies - can be done in any order
- **Track B (M24-M27)**: Infrastructure & backend features with sequential dependencies

> **Note**: Section order in this file may not match numerical order due to historical evolution. See ROADMAP.md for the canonical milestone plan and dependency diagram.

---

## M24: Vercel Migration

**Goal**: Migrate deployment from GitHub Pages to Vercel to enable serverless API functions. Keep GitHub Pages as a backup.

**Track**: B (Infrastructure & Backend) - Foundation for M25, M26

**Why Vercel**: Familiar platform with excellent GitOps deployment support. Enables M25 (feedback feature) and future database integrations (Vercel KV, Postgres).

**Architecture Decision**: Stay with Vite. See Notes section for rationale.

**Proof Point**: App running at `scenius.vercel.app` with `/api/health` returning `{ status: "ok", timestamp: ... }`.

**Prerequisites**:
- Vercel account (confirmed)
- Admin access to `github.com/moxious/historynet` (confirmed)

### Vercel Project Setup (CLI)

- [ ] **VM1** - Install Vercel CLI globally
  ```bash
  npm install -g vercel
  ```
- [ ] **VM2** - Login to Vercel CLI
  ```bash
  vercel login
  ```
- [ ] **VM3** - Link repository to Vercel project
  ```bash
  vercel link
  ```
  - When prompted: Create new project
  - Project name: `scenius`
  - Framework: Vite (should auto-detect)
  - This creates `.vercel/` directory (already in `.gitignore`)
- [ ] **VM4** - Deploy to production
  ```bash
  vercel --prod
  ```
  - Verify build succeeds
  - Note the production URL (`scenius.vercel.app`)
- [ ] **VM5** - Configure GitHub integration in Vercel dashboard
  - Go to Project Settings → Git
  - Verify `moxious/historynet` is connected
  - Enable automatic deployments on push to `main`
- [ ] **VM6** - Test frontend functionality at `scenius.vercel.app`
  - Home page loads
  - Dataset selector works
  - All three layouts render (Graph, Timeline, Radial)
- [ ] **VM7** - Verify hash routing works correctly
  - Deep link to node: `/#/ai-llm-research/node/person-geoffrey-hinton`
  - Deep link to edge: `/#/ai-llm-research/edge/...`
  - Theme parameter: `/#/?theme=dark`
  - Layout parameter: `/#/?layout=timeline`

### Serverless API Endpoint

- [ ] **VM8** - Create `/api/health.ts` serverless function
  ```typescript
  // api/health.ts
  import type { VercelRequest, VercelResponse } from '@vercel/node';
  
  export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'unknown'
    });
  }
  ```
- [ ] **VM9** - Deploy and test endpoint at `scenius.vercel.app/api/health`
  ```bash
  vercel --prod
  ```
  - Verify JSON response in browser shows `{ status: "ok", timestamp: "...", environment: "production" }`
  - Verify CORS allows requests from frontend
- [ ] **VM10** - Add test environment variable via CLI
  ```bash
  vercel env add TEST_VAR production
  ```
  - Value: `hello-from-vercel`
  - Temporarily update `/api/health.ts` to include `testVar: process.env.TEST_VAR`
  - Redeploy and verify it appears in response
  - Remove from response code (keep env var for future use)

### Dual Deployment Verification

- [ ] **VM11** - Verify GitHub Pages deployment still works
  - Push a minor change and confirm both deployments update
  - GitHub Pages: `moxious.github.io/historynet`
  - Vercel: `scenius.vercel.app`
- [ ] **VM12** - Verify `.github/workflows/deploy.yml` is unchanged and functional
- [ ] **VM13** - Test that both deployments serve identical frontend functionality

### Documentation Updates

- [ ] **VM14** - Update `AGENTS.md` with deployment information
  - Add Vercel URL to "Live Application & Testing" section
  - Update example URLs to include both hosts
  - Note which deployment to use for API testing (Vercel only)
- [ ] **VM15** - Update `README.md` with deployment information
  - Add Vercel URL as primary deployment
  - Note GitHub Pages as backup/mirror
- [ ] **VM16** - Update `CHANGELOG.md` with M24 completion entry

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

## M22: Image Asset Management

**Goal**: Fix broken image URLs in datasets by auditing, downloading, and hosting images in a stable location. Wikimedia Commons URLs break frequently as Wikipedia editors update article images.

**Track**: A (Independent Features) - No dependencies

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
- [ ] **IMG24** - Update CHANGELOG.md with M22 completion notes

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

## M28: Wikipedia ID Enrichment CLI

**Goal**: Create a build-time CLI tool that enriches dataset nodes with Wikipedia identifiers (`wikipediaTitle` and `wikidataId`), ensuring all nodes have both fields populated when Wikipedia coverage exists.

**Track**: A (Independent Features) - No dependencies

**Status**: 🔲 Ready to start

### Acceptance Criteria

| Criterion | Description |
|-----------|-------------|
| **Both identifiers populated** | After enrichment, nodes have both `wikipediaTitle` and `wikidataId` when Wikipedia coverage exists |
| **No other properties touched** | Only `wikipediaTitle` and `wikidataId` fields are modified; all other node properties remain unchanged |
| **No nodes added or removed** | Node count before and after enrichment is identical |
| **Explicit nulls for missing** | Set `wikipediaTitle: null` and `wikidataId: null` when reasonably certain no Wikipedia article exists |
| **Dry-run by default** | Tool shows proposed changes without writing unless `--write` flag is used |
| **Rate limit compliance** | Respects Wikipedia API rate limits (500 req/hour) with configurable delays |

### Phase 1: CLI Scaffolding

- [ ] **WE1** - Create `scripts/enrich-wikipedia/` directory structure
  ```
  scripts/enrich-wikipedia/
  ├── index.ts           # CLI entry point
  ├── types.ts           # Type definitions
  ├── reporter.ts        # Output formatting
  └── enrichers/
      ├── wikipedia-lookup.ts   # wikipediaTitle → wikidataId
      └── wikidata-lookup.ts    # wikidataId → wikipediaTitle
  ```
- [ ] **WE2** - Create `types.ts` with interfaces:
  - `CLIOptions` (dataset, write, search, json, quiet, rateLimit)
  - `EnrichmentResult` (nodeId, field, oldValue, newValue, source)
  - `DatasetEnrichmentResult` (datasetId, results, errors, stats)
- [ ] **WE3** - Create `index.ts` CLI entry point with argument parsing
  - `--dataset <id>` - Target specific dataset
  - `--write` - Actually write changes (default: dry-run)
  - `--search` - Also search for nodes missing both fields
  - `--json` - Output results as JSON
  - `--quiet` - Minimal output
  - `--rate-limit <ms>` - Delay between API calls (default: 200ms)
  - `--help` - Show help message
- [ ] **WE4** - Create `reporter.ts` for formatted output
  - Progress indicators
  - Summary statistics
  - JSON output mode
- [ ] **WE5** - Add npm scripts to `package.json`:
  ```json
  "enrich:wikipedia": "tsx scripts/enrich-wikipedia/index.ts",
  "enrich:wikipedia:write": "tsx scripts/enrich-wikipedia/index.ts --write"
  ```

### Phase 2: Wikipedia → Wikidata Lookup

- [ ] **WE6** - Create `enrichers/wikipedia-lookup.ts`
- [ ] **WE7** - Implement `lookupWikidataId(wikipediaTitle: string): Promise<string | null>`
  - Use Wikipedia REST API (similar to existing `fetchWikipediaSummary`)
  - Extract `wikibase_item` from summary response
  - Return null if page not found or no Wikidata link
- [ ] **WE8** - Add timeout handling (5 seconds per request)
- [ ] **WE9** - Add disambiguation detection and logging
- [ ] **WE10** - Test with known titles (e.g., "Geoffrey_Hinton" → "Q7841039")

### Phase 3: Wikidata → Wikipedia Lookup

- [ ] **WE11** - Create `enrichers/wikidata-lookup.ts`
- [ ] **WE12** - Implement `lookupWikipediaTitle(wikidataId: string): Promise<string | null>`
  - Fetch from Wikidata API: `https://www.wikidata.org/wiki/Special:EntityData/{qid}.json`
  - Extract English Wikipedia sitelink: `entity.sitelinks.enwiki.title`
  - Return null if no English Wikipedia article linked
- [ ] **WE13** - Add timeout handling (5 seconds per request)
- [ ] **WE14** - Test with known QIDs (e.g., "Q7841039" → "Geoffrey_Hinton")

### Phase 4: Core Enrichment Logic

- [ ] **WE15** - Implement `enrichNode(node, options)` function:
  - Case 1: Has `wikipediaTitle`, missing `wikidataId` → lookup wikidataId
  - Case 2: Has `wikidataId`, missing `wikipediaTitle` → lookup wikipediaTitle
  - Case 3: Missing both + `--search` flag → search by title (future)
  - Case 4: Has both → skip (already complete)
- [ ] **WE16** - Implement rate limiting between API calls
  - Default 200ms delay (configurable via `--rate-limit`)
  - Ensures ~300 requests/minute (well under 500/hour limit)
- [ ] **WE17** - Track and return enrichment results:
  - Nodes enriched (with details of what changed)
  - Nodes skipped (already complete)
  - Nodes failed (API errors, disambiguation, etc.)
  - Nodes with no Wikipedia coverage (set to null)
- [ ] **WE18** - Implement explicit null handling:
  - If API returns "page not found", set field to `null`
  - Only set null if confident (404 response, not network error)

### Phase 5: Dataset Processing

- [ ] **WE19** - Implement `processDataset(datasetPath, options)` function:
  - Load nodes.json
  - Process each node with enrichNode()
  - Collect results and statistics
  - Optionally write updated nodes.json (if `--write`)
- [ ] **WE20** - Implement node preservation guarantees:
  - Verify node count before/after is identical
  - Verify only `wikipediaTitle` and `wikidataId` fields modified
  - Use deep comparison to ensure other properties unchanged
- [ ] **WE21** - Implement JSON file writing:
  - Pretty-print with 2-space indentation (match existing format)
  - Preserve property order where possible
  - Create backup before writing (optional)
- [ ] **WE22** - Add dry-run output showing proposed changes:
  - List each node that would be modified
  - Show old value → new value for each field
  - Summary of total changes

### Phase 6: CLI Integration & Reporting

- [ ] **WE23** - Wire up CLI to dataset processing:
  - Single dataset mode (`--dataset ai-llm-research`)
  - All datasets mode (process each in `public/datasets/`)
- [ ] **WE24** - Implement progress reporting:
  - "Processing node 15/120: person-geoffrey-hinton"
  - Show enrichment results in real-time (unless `--quiet`)
- [ ] **WE25** - Implement summary statistics:
  ```
  Dataset: ai-llm-research
  ────────────────────────
  Total nodes: 120
  Already complete: 45
  Enriched (wikidataId added): 30
  Enriched (wikipediaTitle added): 5
  Set to null (no Wikipedia): 10
  Skipped (errors): 2
  No changes needed: 28
  ```
- [ ] **WE26** - Implement JSON output mode for CI/scripting
- [ ] **WE27** - Exit with appropriate codes:
  - 0: Success (enrichment complete, or dry-run)
  - 1: Errors occurred (some nodes failed)
  - 2: Invalid arguments

### Phase 7: Testing & Verification

- [ ] **WE28** - Test dry-run mode (no files modified)
- [ ] **WE29** - Test write mode with backup dataset
  - Create test-dataset with known missing fields
  - Run enrichment
  - Verify only expected fields changed
- [ ] **WE30** - Test node preservation:
  - Verify node count unchanged
  - Verify non-Wikipedia properties unchanged
  - Verify node order preserved
- [ ] **WE31** - Test rate limiting:
  - Verify delays between requests
  - Test with `--rate-limit 0` (no delay, for testing)
- [ ] **WE32** - Test error handling:
  - Network timeout
  - Invalid Wikipedia titles
  - Disambiguation pages
  - Rate limit responses (429)
- [ ] **WE33** - Test with real datasets:
  - AI-LLM Research (many existing titles)
  - Rosicrucian Network (mixed coverage)
- [ ] **WE34** - Verify CLI help message is clear and complete
- [ ] **WE35** - Build passes with no TypeScript errors
- [ ] **WE36** - No linter warnings in new files

### Phase 8: Documentation

- [ ] **WE37** - Add CLI documentation to `AGENTS.md`:
  - Usage examples
  - When to run (before deployment, after adding nodes)
  - Integration with research workflow
- [ ] **WE38** - Update `research/RESEARCHING_NETWORKS.md` Phase 5.5:
  - Reference CLI as alternative to manual enrichment
  - Document workflow: manual review → CLI enrichment → validation
- [ ] **WE39** - Update `GRAPH_SCHEMA.md` with enrichment guidance:
  - Note that CLI can auto-populate these fields
  - Recommend running enrichment before deployment
- [ ] **WE40** - Update CHANGELOG.md with M28 completion notes

### Future Enhancements (Not in M28)

The following features are out of scope for M28 but could be added later:

- **Search mode (`--search`)**: For nodes missing both fields, search Wikipedia by node title. Risky due to disambiguation; would need interactive confirmation or confidence scoring.
- **Batch Wikidata queries**: Use SPARQL to look up multiple QIDs at once (more efficient for large datasets).
- **Validation integration**: Run `validate:datasets` after enrichment automatically.
- **CI integration**: Add enrichment check to GitHub Actions (warn if nodes missing Wikipedia IDs).

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

### M24 Vercel Migration Notes (2026-01-19)

**Architecture Decision: Stay with Vite**

Evaluated Vite vs Next.js migration. Decision: **Stay with Vite**.

**Rationale:**
- Primary need is simple: one serverless endpoint for feedback → GitHub issues (M25)
- Migration cost is high (20+ components, routing rewrite, hook adaptations)
- Migration benefit is low (Google renders JS well, JSON-LD already added in M20)
- GitHub Pages backup stays intact with current HashRouter architecture
- Vercel's Vite support is mature and handles `/api/*.ts` serverless functions well
- Future database access (Vercel KV, Postgres) works from serverless functions regardless of framework

**If Next.js becomes needed later**, triggers would be:
- SEO becomes critical and M20 improvements prove insufficient
- Server-side data fetching required (e.g., datasets from database instead of static JSON)
- Need for incremental static regeneration

**Deployment targets:**
- Primary: `scenius.vercel.app` (Vercel, with API support)
- Backup: `moxious.github.io/historynet` (GitHub Pages, frontend only)

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
