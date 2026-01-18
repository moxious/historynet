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

## Completed Milestones (M1-M14, M13)

All MVP and post-MVP milestones through M14, plus M13, are complete. See `HISTORY.md` for detailed task lists and completion notes.

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

**Note**: If M15 (Stable Resource URLs) is completed before this milestone, integrate feedback forms into the stable resource pages. Each node/edge detail page becomes a natural place for item-specific feedback. Add tasks to place FeedbackButton on NodeDetailPage and EdgeDetailPage.

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

## M15: Stable Resource URLs

**Goal**: Give every node and edge a permanent, shareable URL (permalink) that loads a standalone detail page. Enable external citation, bookmarking, and lay the foundation for per-item user feedback.

**URL Structure**:
- Nodes: `/#/{dataset-id}/node/{node-id}`
- Edges: `/#/{dataset-id}/from/{source-id}/to/{target-id}` (shows all edges between pair)

### Routing Architecture

- [ ] **SR1** - Design route structure and document URL patterns in codebase
- [ ] **SR2** - Add new routes to React Router configuration in `main.tsx` or `App.tsx`
  - `/:datasetId/node/:nodeId` - Node detail page
  - `/:datasetId/from/:sourceId/to/:targetId` - Edge detail page (between node pair)
- [ ] **SR3** - Create route parameter extraction hook `useResourceParams` in `src/hooks/`
- [ ] **SR4** - Ensure routes work with HashRouter (required for GitHub Pages)
- [ ] **SR5** - Handle invalid routes gracefully (404-style page or redirect to main view)
- [ ] **SR6** - Test: direct URL access loads correct resource page

### Node Detail Page

- [ ] **SR7** - Create `NodeDetailPage` component in `src/components/` or `src/pages/`
- [ ] **SR8** - Load dataset and find node by ID from route params
- [ ] **SR9** - Display node information using same fields as `NodeInfobox`:
  - Title, type badge, dates (lifespan for persons)
  - Image (if available)
  - Short description and biography
  - Alternate names, occupations, nationality (for persons)
  - External links
  - Any custom/extended properties
- [ ] **SR10** - Style page consistently with main application
- [ ] **SR11** - Add "View in Graph" button linking to `/#/?dataset={id}&selected={nodeId}&type=node`
- [ ] **SR12** - Add breadcrumb navigation: `{Dataset Name} > {Node Type} > {Node Title}`
- [ ] **SR13** - Handle loading state while dataset fetches
- [ ] **SR14** - Handle error state if node ID not found in dataset

### Edge Detail Page

- [ ] **SR15** - Create `EdgeDetailPage` component in `src/components/` or `src/pages/`
- [ ] **SR16** - Load dataset and find all edges between source and target nodes
- [ ] **SR17** - Display source and target node summary cards (name, type, image thumbnail)
- [ ] **SR18** - For each edge between the pair, display:
  - Relationship type
  - Natural language description ("{Source} {relationship} {Target}")
  - Date range (if available)
  - Evidence text and evidence URLs
  - Strength indicator (if available)
- [ ] **SR19** - Handle case where multiple edges exist between same pair (list all)
- [ ] **SR20** - Handle case where no edges exist between pair (show message, not error)
- [ ] **SR21** - Add "View in Graph" button linking to graph with edge selected
- [ ] **SR22** - Add clickable links to source/target node detail pages
- [ ] **SR23** - Style consistently with node detail page
- [ ] **SR24** - Handle loading and error states

### Permalink & Share UI (InfoboxPanel Integration)

- [ ] **SR25** - Create `ShareButtons` component with Permalink and Share buttons
- [ ] **SR26** - Implement "Permalink" button that copies stable URL to clipboard
- [ ] **SR27** - Implement "Share" button using Web Share API (with fallback to copy)
- [ ] **SR28** - Add visual feedback on successful copy (toast, icon change, or "Copied!" text)
- [ ] **SR29** - Generate correct stable URL based on selected item type:
  - Node: `/#/{dataset}/node/{nodeId}`
  - Edge: `/#/{dataset}/from/{sourceId}/to/{targetId}`
- [ ] **SR30** - Integrate `ShareButtons` into `NodeInfobox` component
- [ ] **SR31** - Integrate `ShareButtons` into `EdgeInfobox` component
- [ ] **SR32** - Style buttons to match existing infobox aesthetic
- [ ] **SR33** - Test: clicking Permalink copies correct URL for both nodes and edges

### Meta Tags (SEO & Social Sharing)

- [ ] **SR34** - Install `react-helmet-async` (or similar) for dynamic meta tag management
- [ ] **SR35** - Create `ResourceMeta` component for setting page-specific meta tags
- [ ] **SR36** - Set dynamic `<title>` tag: `{Item Title} | {Dataset Name} | HistoryNet`
- [ ] **SR37** - Set `<meta name="description">` from node/edge short description
- [ ] **SR38** - Set Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`
- [ ] **SR39** - Set `og:image` to node image if available, otherwise default app image
- [ ] **SR40** - Apply `ResourceMeta` to both `NodeDetailPage` and `EdgeDetailPage`
- [ ] **SR41** - Test: sharing URL on social media shows correct preview (note: limited in SPA without SSR)
- [ ] **SR42** - Document meta tag limitations for pure client-side SPA in code comments

### Navigation & UX

- [ ] **SR43** - Ensure browser back button works correctly from detail pages
- [ ] **SR44** - Add link from detail pages back to dataset home/overview (if applicable)
- [ ] **SR45** - Consider: add "Related" section showing connected nodes (nice-to-have)
- [ ] **SR46** - Ensure keyboard navigation works on detail pages (focus management)
- [ ] **SR47** - Test: navigating between detail pages updates URL correctly

### Testing & Verification

- [ ] **SR48** - Test all node types render correctly on detail pages (person, object, location, entity)
- [ ] **SR49** - Test edge detail page with single edge between pair
- [ ] **SR50** - Test edge detail page with multiple edges between same pair
- [ ] **SR51** - Test with all shipped datasets (Disney, Rosicrucian, Enlightenment, AI-LLM)
- [ ] **SR52** - Test invalid node ID shows appropriate error/not-found state
- [ ] **SR53** - Test invalid dataset ID shows appropriate error state
- [ ] **SR54** - Test Permalink/Share buttons on both graph view infobox and detail pages
- [ ] **SR55** - Build passes with no errors or linter warnings
- [ ] **SR56** - Cross-browser testing (Chrome, Firefox, Safari)
- [ ] **SR57** - Update CHANGELOG.md with M15 completion notes

---

## Notes & Decisions

_Add notes about implementation decisions, blockers, or clarifications here._

### Note Format
```
[YYYY-MM-DD] @agent-name: Description of decision or finding
```

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
- [ ] **TL27** - Test with Disney dataset (may have fewer gaps)

---

## Blocked Tasks

_Move tasks here if they are blocked, with explanation._

None currently.
