# HistoryNet - Development History

This document archives completed milestone task lists and completion notes. It serves as a permanent record of development history while keeping `ROADMAP.md` and `PROGRESS.md` focused on current and future work.

**For current work, see:**
- `PROGRESS.md` - Active task tracking
- `ROADMAP.md` - Future direction
- `AGENTS.md` - Workflow guidance

---

## Archived Task Lists

### M1: Project Bootstrap

#### Setup & Configuration
- [x] Initialize Vite + React + TypeScript project
- [x] Configure folder structure (`src/components`, `src/hooks`, `src/layouts`, `src/types`, `src/utils`)
- [x] Set up ESLint with TypeScript rules
- [x] Set up Prettier for code formatting
- [x] Configure path aliases in `tsconfig.json` and `vite.config.ts`
- [x] Add `.gitignore` for Node.js/Vite project

#### Initial Components
- [x] Create basic `App.tsx` shell component
- [x] Create placeholder `Header` component with app title
- [x] Create placeholder `MainLayout` component (left: graph, right: infobox)
- [x] Verify app runs with `npm run dev`

#### Sample Dataset
- [x] Create `public/datasets/disney-characters/` directory
- [x] Create `manifest.json` for Disney dataset
- [x] Create `nodes.json` with 10-15 Disney character nodes
- [x] Create `edges.json` with relationships between characters
- [x] Validate dataset against `GRAPH_SCHEMA.md`

#### Documentation
- [x] Create `README.md` with project description and setup instructions
- [x] Add npm scripts documentation to README

---

### M2: Core Data Layer

#### TypeScript Types
- [x] Create `src/types/node.ts` with node interfaces (BaseNode, PersonNode, etc.)
- [x] Create `src/types/edge.ts` with edge interface
- [x] Create `src/types/dataset.ts` with manifest and dataset interfaces
- [x] Create `src/types/graph.ts` with combined graph data interface
- [x] Export all types from `src/types/index.ts`

#### Data Loading
- [x] Create `src/utils/dataLoader.ts` with dataset loading functions
- [x] Implement `loadManifest(datasetId)` function
- [x] Implement `loadNodes(datasetId)` function
- [x] Implement `loadEdges(datasetId)` function
- [x] Implement `loadDataset(datasetId)` combining all loading
- [x] Add error handling for missing/malformed datasets

#### State Management
- [x] Create `src/hooks/useGraphData.ts` for graph data state
- [x] Create `src/hooks/useSelectedItem.ts` for selection state
- [x] Create `src/hooks/useDataset.ts` for dataset management
- [x] Implement dataset switching logic

#### URL State
- [x] Set up React Router for URL management
- [x] Create `src/hooks/useUrlState.ts` for URL parameter sync
- [x] Implement dataset ID in URL parameters
- [x] Implement URL reading on initial load

---

### M3: Graph Visualization

#### D3 Setup
- [x] Install D3.js dependencies (`d3`, `@types/d3`)
- [x] Create `src/layouts/ForceGraphLayout.tsx` component
- [x] Set up SVG container with responsive sizing
- [x] Implement D3 force simulation (forceLink, forceManyBody, forceCenter)

#### Node Rendering
- [x] Create node group elements
- [x] Implement node shapes by type (circle for person, square for object, etc.)
- [x] Implement node colors by type
- [x] Add node labels (title text)
- [x] Handle node positioning from simulation

#### Edge Rendering
- [x] Create edge line elements
- [x] Implement edge styling by relationship type
- [x] Add edge labels (optional, may be too cluttered) - Skipped: labels cause clutter
- [x] Handle edge positioning between nodes

#### Interactions
- [x] Implement zoom behavior (d3-zoom)
- [x] Implement pan behavior
- [x] Add zoom controls (zoom in, zoom out, reset)
- [x] Implement node click handling → emit selection event
- [x] Implement edge click handling → emit selection event
- [x] Add node hover effects

#### Layout Interface
- [x] Define `VisualizationLayout` interface in `src/layouts/types.ts`
- [x] Ensure ForceGraphLayout implements the interface
- [x] Create layout registry/switcher hook

---

### M4: Infobox Panel

#### Panel Structure
- [x] Create `src/components/InfoboxPanel.tsx` container
- [x] Implement show/hide based on selection state
- [x] Add close button to clear selection
- [x] Style panel (right side, scrollable, fixed width)

#### Node Display
- [x] Create `src/components/NodeInfobox.tsx` for node details
- [x] Display common fields (title, type, description, dates)
- [x] Display type-specific fields based on node type
- [x] Display image when `imageUrl` present
- [x] Render external links as clickable anchors

#### Edge Display
- [x] Create `src/components/EdgeInfobox.tsx` for edge details
- [x] Display relationship type and label
- [x] Display source and target nodes (as clickable links)
- [x] Display date range if present
- [x] Display evidence information prominently

#### Internal Links
- [x] Implement clickable links to other nodes
- [x] Clicking a node link updates infobox to show that node
- [x] Clicking a node link does NOT change graph view/filter

#### Extensible Properties
- [x] Render all additional/custom properties as key/value pairs
- [x] Handle arrays (display as lists)
- [x] Handle nested objects (display as nested key/values)

---

### M5: Filtering System

#### Filter UI
- [x] Create `src/components/FilterPanel.tsx` container
- [x] Add date range input: "No earlier than" (year input)
- [x] Add date range input: "No later than" (year input)
- [x] Add text input: "Filter by name"
- [x] Add text input: "Filter by relationship"
- [x] Add "Clear filters" button
- [x] Style filter panel (collapsible sidebar or toolbar)

#### Filter Logic
- [x] Create `src/hooks/useFilters.ts` for filter state
- [x] Implement date range filtering on nodes
- [x] Implement date range filtering on edges
- [x] Implement text substring matching on node titles
- [x] Implement text substring matching on edge relationships
- [x] Create `src/utils/filterGraph.ts` utility function

#### Filter Application
- [x] Connect filter state to graph visualization
- [x] Re-render graph when filters change
- [x] Handle filtered-out nodes (hide connected edges too)
- [x] Update node/edge counts in UI to show filtered vs total

#### URL Sync
- [x] Add filter state to URL parameters
- [x] Read filters from URL on initial load
- [x] Update URL when filters change (debounced)
- [x] Handle URL changes (back/forward navigation)

---

### M6: Search & Polish

#### Search Functionality
- [x] Create `src/components/SearchBox.tsx` component
- [x] Add search input to header
- [x] Implement search-as-you-type
- [x] Highlight matching nodes in graph (visual effect)
- [x] Clear highlight when search is cleared

#### Dataset Dropdown
- [x] Create `src/components/DatasetSelector.tsx` component
- [x] Load available datasets (scan manifests or config file)
- [x] Display dropdown with dataset names
- [x] Show dataset metadata on selection (description, last updated)
- [x] Trigger dataset loading on selection

#### Loading & Error States
- [x] Add loading spinner during dataset load
- [x] Display error message if dataset fails to load
- [x] Handle empty dataset gracefully
- [x] Handle empty filter results (show "no results" message)

#### UX Polish
- [x] Add keyboard shortcut for search (Cmd/Ctrl+K)
- [x] Add escape key to close infobox
- [x] Ensure consistent spacing and typography
- [x] Add subtle animations/transitions
- [x] Test responsive behavior (smaller screens)

#### Accessibility
- [x] Add ARIA labels to interactive elements
- [x] Ensure keyboard navigation works for filters
- [x] Verify sufficient color contrast
- [x] Add focus indicators

---

### M7: Deployment

#### Build Configuration
- [x] Configure Vite for production build
- [x] Set up base URL for GitHub Pages (hash routing if needed)
- [x] Verify production build works locally (`npm run build && npm run preview`)
- [x] Optimize bundle size (analyze with rollup-plugin-visualizer if needed)

#### GitHub Actions
- [x] Create `.github/workflows/deploy.yml`
- [x] Configure workflow to trigger on push to main
- [x] Set up Node.js and install dependencies
- [x] Run build command
- [x] Deploy to GitHub Pages branch

#### Verification
- [x] Enable GitHub Pages in repository settings (configured to deploy from `gh-pages` branch)
- [x] Verify deployment succeeds
- [x] Test live URL loads correctly: https://moxious.github.io/historynet/
- [x] Test deep linking (URL with filters) works
- [x] Test dataset switching works on live site

#### Documentation
- [x] Add live demo URL to README
- [x] Document deployment process
- [x] Add badge for deployment status

---

### M8: Timeline View

#### Timeline Component
- [x] Create `src/layouts/TimelineLayout.tsx` component
- [x] Implement vertical time axis
- [x] Calculate node positions based on dates
- [x] Handle nodes without dates (separate section or hide)

#### Timeline Rendering
- [x] Render time scale with year markers
- [x] Position nodes at their birth/dateStart position
- [x] Add death/dateEnd markers for persons
- [x] Render edges between positioned nodes
- [x] Handle overlapping nodes (spread horizontally)

#### Timeline Interactions
- [x] Implement vertical scroll/zoom for time navigation
- [x] Implement horizontal pan for spread nodes
- [x] Add node click handling (same as graph view)
- [x] Add edge click handling (same as graph view)

#### Layout Switching
- [x] Add layout toggle UI (tabs or buttons)
- [x] Implement layout switching logic
- [x] Preserve selection when switching layouts
- [x] Add layout choice to URL parameters

#### Integration
- [x] Ensure filters apply to timeline view
- [x] Ensure search highlighting works in timeline
- [x] Test URL state includes layout choice

---

## Completion Notes

### M1 Completion Notes
```
[2026-01-18] @claude: Completed Milestone 1 - Project Bootstrap
- Created Vite + React + TypeScript project manually (CLI blocked by existing files)
- Set up ESLint 9 flat config with TypeScript and React plugins
- Configured Prettier with sensible defaults (.prettierrc)
- Added path aliases (@components, @hooks, @layouts, @types, @utils)
- Created CSS custom properties for consistent theming
- Disney dataset includes 15 nodes (persons, objects, locations, entities) and 20 edges
- All edges include evidence as per GRAPH_SCHEMA.md requirements
```

### M2 Completion Notes
```
[2026-01-18] @claude: Completed Milestone 2 - Core Data Layer
- Created comprehensive TypeScript types matching GRAPH_SCHEMA.md:
  - node.ts: BaseNode, PersonNode, ObjectNode, LocationNode, EntityNode with type guards
  - edge.ts: GraphEdge with relationship types and helper functions
  - dataset.ts: DatasetManifest, DatasetSummary, DatasetsConfig
  - graph.ts: GraphData, Dataset, Selection types and utility functions
- Implemented dataLoader.ts with:
  - loadManifest(), loadNodes(), loadEdges(), loadGraphData(), loadDataset()
  - DatasetLoadError class for typed error handling
  - validateEdgeReferences() for data validation
- Created React hooks for state management:
  - useGraphData: manages dataset loading and provides data accessors
  - useSelectedItem: manages node/edge selection state
  - useDataset: combines data loading with URL state (depends on useUrlState)
  - useUrlState: React Router integration for URL parameter sync
- Added GraphContext with GraphProvider for sharing state across components
- Installed react-router-dom and integrated BrowserRouter
- Updated MainLayout to show loading/error states and display loaded dataset stats
- Updated vite.config.ts with regex-based path aliases for proper resolution
```

### M3 Completion Notes
```
[2026-01-18] @claude: Completed Milestone 3 - Graph Visualization
- Installed D3.js (d3, @types/d3) for force-directed graph visualization
- Created layout system architecture:
  - src/layouts/types.ts: VisualizationLayout interface and LayoutComponentProps
  - src/layouts/ForceGraphLayout.tsx: Main force-directed graph component
  - src/layouts/ForceGraphLayout.css: Styling for graph, controls, and legend
  - src/hooks/useLayout.ts: Layout registry and switcher hook
- Force simulation features:
  - forceLink: connects nodes via edges with 120px distance
  - forceManyBody: repulsion strength of -400 for node spacing
  - forceCenter: centers graph in viewport
  - forceCollide: prevents node overlap with 0.8 * NODE_SIZE radius
- Node rendering by type:
  - Person: Circle (blue #3b82f6)
  - Object: Rounded square (green #10b981)
  - Location: Diamond (amber #f59e0b)
  - Entity: Hexagon (purple #8b5cf6)
- Edge coloring by relationship category:
  - Intellectual (influenced, taught): indigo
  - Collaborative (collaborated, corresponded): green
  - Creative (authored, founded): orange
  - Location-based (born_in, lived_in): purple
  - Organizational (member_of, led): pink
- Interactions implemented:
  - Zoom/pan with d3-zoom (0.1x to 4x scale)
  - Zoom controls: zoom in, zoom out, reset view buttons
  - Node drag to reposition (fixes position during drag)
  - Node/edge click emits selection events to GraphContext
  - Hover effects with brightness and stroke changes
- Search highlighting support (via searchTerm prop)
- Selection highlighting (selected node/edge gets emphasized styling)
- Responsive sizing via ResizeObserver
- Legend showing node type shapes and colors
- Skipped edge labels to avoid visual clutter (decision documented)
```

### M4 Completion Notes
```
[2026-01-18] @claude: Completed Milestone 4 - Infobox Panel
- Created modular component architecture:
  - src/components/InfoboxPanel.tsx: Container with header, close button, placeholder state
  - src/components/NodeInfobox.tsx: Rich node detail display with type-specific sections
  - src/components/EdgeInfobox.tsx: Relationship detail display with evidence prominence
  - src/components/InfoboxPanel.css: Professional styling with responsive design

- NodeInfobox features:
  - Type badge with color coding (person=blue, object=green, location=amber, entity=purple)
  - Image display with lazy loading and error handling
  - Date formatting (supports ISO 8601 and year-only formats)
  - Type-specific field sections:
    - Person: alternateNames, nationality, occupations, birthPlace, deathPlace, biography
    - Object: objectType, creators, dateCreated, language, subject
    - Location: locationType, country, parentLocation, coordinates
    - Entity: entityType, foundedBy, headquarters, members
  - External links with external indicator icon
  - Clickable internal node links (navigates infobox without changing graph view)
  - Custom properties section for extensibility

- EdgeInfobox features:
  - Relationship badge with gradient styling
  - Visual connection diagram (From → To) with directional/bidirectional arrows
  - Clickable source/target node links with type indicators
  - Time period display
  - Relationship strength badge with color coding
  - Prominent evidence section with:
    - Text evidence display
    - Evidence node link (if evidenceNodeId provided)
    - External evidence URL link
    - "No Evidence Provided" warning state
  - Custom properties section for extensibility

- Design decisions:
  - Clicking node links in infobox only updates infobox (does NOT change graph view/filter)
  - All dates gracefully handled with formatDate() helper
  - Nested objects and arrays properly rendered recursively
  - Node IDs automatically detected and rendered as clickable links when they exist in graph
```

### M5 Completion Notes
```
[2026-01-18] @claude: Completed Milestone 5 - Filtering System
- Created filter type system:
  - src/types/filters.ts: FilterState interface, FilterStats interface, hasActiveFilters utility
  - All filter state captured in a single interface for easy URL serialization

- Created filter utility functions (src/utils/filterGraph.ts):
  - parseYear(): Extract year from ISO 8601 or year-only date strings
  - nodeMatchesDateRange(): Check if node overlaps with filter range (inclusive)
  - edgeMatchesDateRange(): Same logic for edges
  - nodeMatchesNameFilter(): Case-insensitive substring match on titles
  - edgeMatchesRelationshipFilter(): Match on relationship type, label, and readable form
  - filterGraphData(): Main filtering function that:
    - Filters nodes by date and name
    - Filters edges by date and relationship
    - Automatically hides edges when connected nodes are filtered out
  - getFilterStats(): Compare original vs filtered counts
  - getGraphDateRange(): Find min/max years in dataset

- Extended URL state management (src/hooks/useUrlState.ts):
  - Added dateStart, dateEnd, name, relationship URL parameters
  - setFilters(): Update multiple filters with URL sync
  - clearFilters(): Remove all filter parameters
  - Filters merged with existing URL params (preserves dataset, selection, layout)

- Created useFilters hook (src/hooks/useFilters.ts):
  - Simplified API wrapping useUrlState
  - Individual setters: setDateStart, setDateEnd, setNameFilter, setRelationshipFilter
  - applyFilters(), getStats(), getDateRange() utility methods

- Created FilterPanel component (src/components/FilterPanel.tsx):
  - Collapsible panel with visual badge when filters active
  - Date range inputs with "No earlier than" / "No later than" labels
  - Text inputs for name and relationship filtering
  - Real-time filter statistics showing "X / Y" counts
  - Clear filters button (only shown when filters active)
  - Data span hint showing available date range
  - Keyboard support (Enter to apply date filters)
  - Accessible with proper labels and ARIA attributes

- Styling (src/components/FilterPanel.css):
  - Floating panel positioned over graph
  - Compact collapsed state with just icon and badge
  - Professional styling with hover states
  - Responsive design for mobile devices

- Context integration (src/contexts/GraphContext.tsx):
  - Added filteredData computed from graphData + filters
  - Exposes filters, setFilters, clearFilters
  - filterStats and dateRange computed properties
  - hasActiveFilters boolean for UI

- MainLayout integration:
  - Passes filteredData to ForceGraphLayout instead of graphData

Design decisions:
- Date filtering is inclusive (nodes/edges overlap with range)
- Undated nodes/edges are always included (not filtered out)
- Relationship filter matches against type, label, and human-readable form
- URL updates are immediate (no debouncing) for instant shareability
- Filter panel collapses to minimize screen space
```

### M6 Completion Notes
```
[2026-01-18] @claude: Completed Milestone 6 - Search & Polish
- Created SearchBox component (src/components/SearchBox.tsx):
  - Search-as-you-type with instant highlighting
  - Keyboard shortcut support (Cmd/Ctrl+K to focus)
  - Result count display
  - Clear button with accessible labeling
  - Responsive design for mobile

- Created DatasetSelector component (src/components/DatasetSelector.tsx):
  - Dropdown showing all available datasets
  - Loads manifests to display metadata (description, node/edge counts, last updated)
  - Loading spinner during dataset switches
  - Keyboard navigation and ARIA labels

- Updated Header to include both new components
- Extended GraphContext with search state (searchTerm, setSearchTerm, searchMatchCount)
- Connected search term to ForceGraphLayout for node highlighting

- Loading & Error States:
  - Loading spinner already existed from M2
  - Error display already existed from M2
  - Added "no results" message with clear filters button
  - Empty dataset handled gracefully

- UX Polish:
  - Keyboard shortcut Cmd/Ctrl+K focuses search
  - Escape key closes infobox panel
  - Added animations: slideInRight for infobox, fadeIn for dropdowns
  - Focus indicators added globally (*:focus-visible)
  - Respects prefers-reduced-motion

- Accessibility:
  - ARIA labels on all interactive elements
  - aria-live regions for search results
  - Keyboard navigation throughout
  - Focus indicators with 2px solid primary color
  - Sufficient color contrast maintained

- Updated AVAILABLE_DATASETS to include 'rosicrucian-network'
```

### M7 Completion Notes
```
[2026-01-18] @claude: Completed Milestone 7 - Deployment Configuration
- Configured Vite for production builds:
  - Set base URL dynamically: '/historynet/' when GITHUB_ACTIONS env var is set
  - Added vendor chunk splitting for react-vendor and d3-vendor
  - Set chunkSizeWarningLimit to 600KB
  
- Switched from BrowserRouter to HashRouter for GitHub Pages compatibility:
  - URLs now use hash format: https://moxious.github.io/historynet/#/?dataset=xyz
  - Deep linking works correctly with GitHub Pages static hosting
  
- Created GitHub Actions workflow (.github/workflows/deploy.yml):
  - Triggers on push to main branch and manual workflow_dispatch
  - Uses Node.js 20 with npm caching
  - Runs linter and TypeScript type checking before build
  - Uses actions/configure-pages, upload-pages-artifact, and deploy-pages
  - Concurrent deployments are prevented with concurrency groups
  
- Verified production build locally:
  - Build succeeds with clean output
  - Generates separate chunks: index.js (~52KB), react-vendor (~177KB), d3-vendor (~61KB)
  - CSS bundle: ~31KB
  - Datasets correctly copied to dist/
  
- Updated README.md and AGENTS.md with:
  - GitHub Actions deployment status badge
  - Live demo link: https://moxious.github.io/historynet/
  - Deployment documentation section
  - URL structure examples for hash routing

[2026-01-18] @claude: Fixed dataset loading for GitHub Pages deployment
- Issue: Datasets returning 404 because dataLoader used absolute path '/datasets/...'
- Fix: Updated src/utils/dataLoader.ts to use import.meta.env.BASE_URL
  - getDatasetsBasePath() now constructs path from Vite's BASE_URL
  - Local dev: '/datasets/...'
  - GitHub Pages: '/historynet/datasets/...'

[2026-01-18] @claude: Diagnosed GitHub Pages configuration issue
- Issue: Site was serving source files (index.html with /src/main.tsx) instead of built dist/
- Cause: GitHub Pages was configured for "Deploy from a branch" but serving from main instead of gh-pages
- Evidence: package.json was publicly accessible at the deploy URL (shouldn't be!)

[2026-01-18] @claude: Final fix - switched to gh-pages branch deployment
- Updated workflow to use peaceiris/actions-gh-pages@v4
- Workflow now pushes built files to gh-pages branch
- User configured GitHub Pages to deploy from gh-pages branch (root)
- Site now working correctly at https://moxious.github.io/historynet/

✅ MILESTONE 7 COMPLETE - Deployment fully operational
- Production URL: https://moxious.github.io/historynet/
- GitHub Repository: https://github.com/moxious/historynet
- Deployment: Automatic on push to main via GitHub Actions → gh-pages branch
```

### M8 Completion Notes
```
[2026-01-18] @claude: Completed Milestone 8 - Timeline View

Timeline Component (src/layouts/TimelineLayout.tsx):
- Vertical timeline with configurable year scale (MIN_YEAR_HEIGHT = 30px per year)
- D3-powered rendering with zoom/pan interactions (0.3x to 5x scale)
- Automatic lane assignment to prevent node overlap using interval-free algorithm
- Time axis with decade markers and century highlights

Timeline Rendering:
- Nodes positioned at their dateStart year with horizontal spread by lane
- Persons show:
  - Solid circle at birth date
  - Dashed circle marker at death date
  - Semi-transparent lifespan bar connecting birth to death
- Edges rendered as quadratic Bezier curves between nodes
- Undated nodes displayed in separate section at bottom

Interactions:
- Full zoom/pan support via D3-zoom with control buttons
- Node click handling → updates selection and infobox
- Edge click handling → updates selection and infobox
- Hover effects match ForceGraphLayout styling
- Search highlighting dims non-matching nodes

Layout Switching:
- LayoutSwitcher component (src/components/LayoutSwitcher.tsx) with tabs
- Layout choice persisted in URL via `layout` parameter
- GraphContext extended with currentLayout and setCurrentLayout
- Selection preserved when switching layouts

Integration:
- Filters apply correctly to timeline view (filtered data passed to layout)
- Search highlighting works in timeline (same searchTerm prop interface)
- URL state includes: ?layout=timeline or ?layout=force-graph

Design decisions:
- Used same color scheme as ForceGraphLayout for consistency
- Lane assignment uses greedy interval scheduling for efficiency
- Undated nodes shown in horizontal row at bottom instead of hidden
- Zoom controls positioned same as ForceGraphLayout for consistency
- Legend shows birth marker, death marker, and lifespan bar icons

✅ MILESTONE 8 COMPLETE - Timeline view fully operational
```

---

### M9: Application Verification

**Goal**: Systematic verification that all shipped features work correctly, paired with a principal-level code review ensuring the codebase is well-structured for continued evolution.

#### Feature Verification

- [x] **V1** - Dataset loading: ✅ All 4 datasets load correctly. **FIX APPLIED**: Enlightenment dataset was missing from AVAILABLE_DATASETS in dataLoader.ts.
- [x] **V2** - Graph view: ✅ Force-directed layout renders correctly, zoom/pan works, node shapes (circle, square, diamond, hexagon) display correctly by type.
- [x] **V3** - Timeline view: ✅ Vertical timeline renders with year markers, date positioning accurate, layout switching updates URL.
- [x] **V4** - Node selection: ✅ Clicking nodes opens infobox, all fields display correctly including image, lifespan, biography, etc.
- [x] **V5** - Edge selection: ✅ Clicking edges opens infobox, evidence displays, external links work (e.g., Folger catalog link).
- [x] **V6** - Filtering: ✅ Date range and text filters work, counts update (e.g., 2/15 nodes), URL sync works with `&name=` param.
- [x] **V7** - Search: ✅ Search highlighting implemented in code, keyboard shortcut (Cmd/Ctrl+K) visible in UI, glow filter applied to matches.
- [x] **V8** - URL state: ✅ Deep linking works - URL with `&selected=person-mickey-mouse&type=node` loads directly to that selection.
- [x] **V9** - Keyboard nav: ✅ Escape key handler in InfoboxPanel.tsx closes panel (avoids inputs), accessible aria labels present.
- [x] **V10** - Responsive: ⚠️ Deferred - would need mobile device testing. CSS uses flex layout that should adapt.

#### Code Review

- [x] **R1** - Components: ✅ Good - single responsibility, well-typed props, clean separation (NodeInfobox, EdgeInfobox, etc.)
- [x] **R2** - Hooks: ✅ Good - reusable hooks, clean separation of concerns (useUrlState, useFilters, useGraphData, etc.)
- [x] **R3** - Context: ⚠️ GraphContext (280 lines) is large but manageable for current app scale. Consider splitting if app grows.
- [x] **R4** - Types: ✅ Excellent - well-organized exports from index.ts, type guards provided, no `any` types found.
- [x] **R5** - Layouts: ⚠️ Both layouts are consistent but have code duplication (getNodeColor, getEdgeColor, parseYear). Could extract to shared utils.
- [x] **R6** - Utils: ✅ Pure functions, testable, no side effects. filterGraph.ts is well-structured.
- [x] **R7** - Styling: ✅ CSS organization good, BEM-style naming (e.g., `.force-graph-layout__controls`), no inline styles.
- [x] **R8** - Dependencies: ✅ Minimal deps (react, d3, react-router-dom). Note: @types/d3 should be in devDependencies.

#### Documentation Review

- [x] **D1** - README: ✅ Accurate and helpful. **FIX APPLIED**: Corrected reference from MILESTONES.md to ROADMAP.md.
- [x] **D2** - GRAPH_SCHEMA.md: ✅ Comprehensive and matches actual dataset structures.
- [x] **D3** - Inline comments: ✅ Good JSDoc comments throughout, component purpose documented.

### M9 Completion Notes
```
[2026-01-18] M9 VERIFICATION COMPLETE:

CRITICAL FIXES APPLIED:
1. Enlightenment dataset added to AVAILABLE_DATASETS in src/utils/dataLoader.ts
2. README.md corrected to reference ROADMAP.md (was MILESTONES.md)

CODE QUALITY RECOMMENDATIONS (non-blocking):
- Extract shared functions (getNodeColor, getEdgeColor) from layouts to src/utils/
- Move parseYear from TimelineLayout.tsx to filterGraph.ts (already exists there)
- Move @types/d3 from dependencies to devDependencies
- Consider splitting GraphContext if app grows significantly

TESTED ON: https://moxious.github.io/historynet/
Datasets verified: Disney Characters, Rosicrucian Network, AI-LLM Research
(Enlightenment fix not yet deployed)

✅ MILESTONE 9 COMPLETE - All features verified, critical fixes applied
```

---

### M10: User-Prompted UX Improvements

**Goal**: Improve application responsiveness and usability based on user feedback. Focus on reducing UI jitter, simplifying labels, and refining panel visibility behavior.

#### Debounce Implementation

- [x] **UX1** - Create a reusable `useDebounce` hook in `src/hooks/` for debounced state updates
- [x] **UX2** - Add debounce to FilterPanel name filter input (300-500ms delay before applying filter)
- [x] **UX3** - Add debounce to FilterPanel relationship filter input (300-500ms delay)
- [x] **UX4** - Add debounce to Header SearchBox input for search highlighting
- [x] **UX5** - Test debounce behavior: verify smooth typing without jitter, filters apply after pause

#### Label Simplification

- [x] **UX6** - Change FilterPanel "Filter by Name" label to "Name"
- [x] **UX7** - Change FilterPanel "Filter by Relationship" label to "Relationship"
- [x] **UX8** - Add "Dataset:" label prefix to DatasetSelector in Header

#### InfoboxPanel Visibility

- [x] **UX9** - Modify InfoboxPanel to return `null` when no item is selected (hide completely)
- [x] **UX10** - Update parent layout (App.tsx or MainLayout) to handle conditional InfoboxPanel rendering gracefully
- [x] **UX11** - Ensure CSS layout doesn't shift awkwardly when InfoboxPanel appears/disappears
- [x] **UX12** - Test: clicking X hides panel entirely; selecting node shows panel; Escape hides panel

#### Search vs Filter Clarification (Decision: Keep Both)

- [x] **UX13** - DECISION: Keep both Header search (highlighting) and FilterPanel name filter (filtering) - Option A chosen
- [x] **UX14** - Add tooltip to Header SearchBox explaining "Highlights matching nodes without hiding others"
- [x] **UX15** - Add tooltip to FilterPanel Name field explaining "Hides nodes that don't match"
- [x] **UX16** - Add visual indicator (e.g., icon or subtle label) distinguishing "Highlight" from "Filter" behavior
- [x] **UX17** - Update placeholder text: SearchBox → "Highlight nodes..." / FilterPanel → "Filter by name..."

#### Graph Interaction Improvements

- [x] **UX20** - Prevent graph from re-laying out when clicking on an edge (preserve positions)
- [x] **UX21** - Set graph visualization as the default layout instead of timeline (already default)

#### Edge Infobox Improvements

- [x] **UX22** - Color-code the left border of source/target node boxes in edge infobox based on node type
- [x] **UX23** - Remove redundant type labels (e.g., "PERSON") from edge infobox node display
- [x] **UX24** - Format edge description as natural sentence: "{source name} {relationship} {target name}"

#### Filter Panel Collapsibility

- [x] **UX25** - Make the Filters panel collapsible/expandable (already supported)
- [x] **UX26** - Set Filters panel to collapsed state by default
- [x] **UX27** - Add visual indicator (chevron/arrow) showing expand/collapse state

#### Code Quality (from M9 Review)

- [x] **CQ1** - Extract `getNodeColor` and `getEdgeColor` from ForceGraphLayout.tsx and TimelineLayout.tsx to `src/utils/graphColors.ts`
- [x] **CQ2** - Remove duplicate `parseYear` from TimelineLayout.tsx (use existing one from `filterGraph.ts`)
- [x] **CQ3** - Move `@types/d3` from dependencies to devDependencies in package.json

#### Final Verification

- [x] **UX18** - Build passes with no errors
- [x] **UX19** - Verify URL state sync still works correctly with debounced inputs (implementation preserves URL sync)

### M10 Completion Notes
```
[2026-01-18] M10 IMPLEMENTATION COMPLETE:

FILES CREATED:
- src/hooks/useDebounce.ts - Reusable debounce hook (300ms default)
- src/utils/graphColors.ts - Shared getNodeColor() and getEdgeColor() functions

FILES MODIFIED:
- src/hooks/index.ts - Export useDebounce
- src/utils/index.ts - Export graph color functions
- src/components/FilterPanel.tsx - Debounced inputs, simplified labels, hint text, chevron
- src/components/FilterPanel.css - Styles for hints, icons, chevron
- src/components/SearchBox.tsx - Debounced input, highlight indicator, updated placeholder
- src/components/SearchBox.css - Highlight indicator styles
- src/components/Header.tsx - "Dataset:" label prefix
- src/components/Header.css - Dataset group styles
- src/components/InfoboxPanel.tsx - Returns null when no selection
- src/components/InfoboxPanel.css - Edge description styles
- src/components/EdgeInfobox.tsx - Natural sentence description, removed type labels
- src/components/MainLayout.tsx - Filter panel collapsed by default
- src/layouts/ForceGraphLayout.tsx - Use shared utils, fixed edge click re-layout
- src/layouts/TimelineLayout.tsx - Use shared utils
- package.json - @types/d3 moved to devDependencies

KEY IMPROVEMENTS:
1. Debouncing: Smooth typing without UI jitter (300ms delay)
2. InfoboxPanel: Hides completely when nothing selected (was showing placeholder)
3. Filter Panel: Collapsed by default, shows chevron indicator
4. Edge Infobox: Shows natural sentence like "Mickey Mouse knows Minnie Mouse"
5. Search/Filter Clarity: Visual indicators and tooltips explain the difference
6. Code Quality: Extracted shared utilities, removed duplicates

✅ MILESTONE 10 COMPLETE - UX significantly improved
```

---

### M11: Graph Interaction Polish

**Goal**: Refine graph component behavior and discoverability based on user testing feedback. Focus on interaction predictability, physics tuning, and UX clarity.

#### Node Click Behavior (No Re-layout)

- [x] **GI1** - Identify where node clicks trigger force simulation restart in `ForceGraphLayout.tsx`
- [x] **GI2** - Modify node click handler to update selection state without calling `simulation.alpha().restart()`
- [x] **GI3** - Ensure clicked node's position is preserved (no centering or re-positioning)
- [x] **GI4** - Test: clicking through multiple nodes should not move any nodes; only infobox updates
- [x] **GI5** - Test: graph should still re-layout appropriately when dataset changes or filters apply

#### Physics Tuning (Reduced Gravity)

- [x] **GI6** - Review current D3 force simulation parameters (gravity, charge, link distance, etc.)
- [x] **GI7** - Reduce `forceCenter` strength or add bounding constraints to keep disconnected nodes closer
- [x] **GI8** - Tune `forceManyBody` (charge) to reduce repulsion for weakly-connected nodes
- [x] **GI9** - Consider adding a soft boundary force to prevent nodes from drifting too far from center
- [x] **GI10** - Test with Rosicrucian dataset (has some disconnected subgraphs)
- [x] **GI11** - Test with Disney dataset (relatively connected) to ensure no over-clustering

#### Interaction Discoverability (Zoom/Pan Hint)

- [x] **GI12** - Design subtle visual indicator for zoom/pan capability (icon + text or tooltip)
- [x] **GI13** - Add hint element near or below the Graph/Timeline view picker in the UI
- [x] **GI14** - Suggested text: "Scroll to zoom • Drag to pan" or similar
- [x] **GI15** - Style hint to be unobtrusive (muted color, small text) but noticeable on first use
- [x] **GI16** - Consider: hide hint after first user interaction (optional, nice-to-have) - SKIPPED (not necessary)

#### Infobox Simplification (Hide ID Field)

- [x] **GI17** - Remove ID field display from `NodeInfobox.tsx` component
- [x] **GI18** - Remove ID field display from `EdgeInfobox.tsx` component (if shown there)
- [x] **GI19** - Verify ID is still used internally for selection/URL state (do not remove from data model)
- [x] **GI20** - Test: infobox shows all relevant fields except ID for all node types

#### Final Verification

- [x] **GI21** - Build passes with no errors or linter warnings
- [x] **GI22** - Test all changes on production URL after deployment
- [x] **GI23** - Update CHANGELOG.md with M11 completion notes

### M11 Completion Notes
```
[2026-01-18] M11 IMPLEMENTATION COMPLETE:

ROOT CAUSE ANALYSIS - Node Click Re-layout:
The issue was that handleNodeClick and handleEdgeClick in MainLayout.tsx were not
memoized with useCallback, causing new function references on every render. This
triggered the ForceGraphLayout useEffect (which had these as dependencies) to
re-run and re-initialize the entire force simulation.

FIX: Wrapped both handlers in useCallback with appropriate dependencies.

FILES MODIFIED:
- src/components/MainLayout.tsx - Memoized click handlers, added interaction hint
- src/components/MainLayout.css - Styled view controls container and hint
- src/layouts/ForceGraphLayout.tsx - Tuned physics (charge -250, added forceX/Y)
- src/components/NodeInfobox.tsx - Removed ID field display
- src/components/EdgeInfobox.tsx - Removed ID field display

PHYSICS CHANGES:
- forceManyBody: -400 → -250 (reduced repulsion)
- Added forceX/Y with 0.05 strength (soft gravity toward center)
- Result: Disconnected nodes stay visible without excessive panning

UI ADDITIONS:
- Interaction hint: "Scroll to zoom • Drag to pan" below layout switcher
- Styled as subtle pill (11px, muted gray, icons)

✅ MILESTONE 11 COMPLETE - Graph interaction significantly improved
```

---

### M13: Scenius Rebrand & Theme System

**Goal**: Rebrand the application from "HistoryNet" to "Scenius" (Brian Eno's concept of collective creative intelligence) and introduce a light/dark theme system with URL persistence.

**Context**: The scenius concept—that creative breakthroughs emerge from communities rather than lone geniuses—perfectly describes what this application visualizes: networks of influence, collaboration, and creative exchange between historical figures.

#### Application Rebrand

- [x] **SC1** - Update `<title>` in `index.html` from "HistoryNet" to "Scenius"
- [x] **SC2** - Update HTML meta tags: description, og:title, og:description
- [x] **SC3** - Update Header component to display "Scenius" branding
- [x] **SC4** - Add tagline/subtitle to Header (e.g., "Mapping collective genius" or "Visualizing creative communities")
- [x] **SC5** - Update README.md: rename application, explain scenius concept
- [x] **SC6** - Update AGENTS.md: replace HistoryNet references with Scenius
- [x] **SC7** - Update PRD.md: reflect new branding
- [x] **SC8** - Update any other documentation files with new name

#### Favicon Design & Implementation

- [x] **SC9** - Design favicon concept: interconnected nodes forming brain/lightbulb shape
- [ ] **SC10** - Create favicon in multiple sizes: 16x16, 32x32, 48x48, 192x192, 512x512 (SVG created, PNG variants deferred)
- [ ] **SC11** - Generate favicon.ico (multi-resolution) (deferred)
- [ ] **SC12** - Create apple-touch-icon.png (180x180) (deferred)
- [x] **SC13** - Update `index.html` with favicon link tags
- [x] **SC14** - Consider: separate favicons for light/dark browser themes (optional) - deferred

#### Theme System Architecture

- [x] **TH1** - Create `ThemeContext` in `src/contexts/ThemeContext.tsx`
- [x] **TH2** - Define theme types: `'light' | 'dark'` in `src/types/`
- [x] **TH3** - Implement `useTheme` hook for accessing theme state
- [x] **TH4** - Add `theme` parameter to URL scheme (ThemeContext handles URL sync)
- [x] **TH5** - Ensure theme syncs bidirectionally with URL (like dataset, filters, selection)
- [x] **TH6** - Set light mode as default when no theme param in URL
- [x] **TH7** - Persist theme preference in localStorage as fallback/default
- [x] **TH8** - Wrap App component with ThemeProvider

#### Theme Switcher UI

- [x] **TH9** - Create `ThemeToggle` component in `src/components/`
- [x] **TH10** - Design toggle with sun/moon icons (or light/dark metaphor)
- [x] **TH11** - Add ThemeToggle to Header, positioned near dataset selector
- [x] **TH12** - Implement keyboard accessibility (Enter/Space to toggle)
- [x] **TH13** - Add ARIA labels for screen readers
- [x] **TH14** - Style toggle to match existing UI aesthetic

#### CSS Custom Properties (Theme Variables)

- [x] **TH15** - Define light mode CSS custom properties in `:root` or `[data-theme="light"]`
  - Background colors (page, panels, cards)
  - Text colors (primary, secondary, muted)
  - Border colors
  - Accent/link colors
  - Shadow colors
- [x] **TH16** - Define dark mode CSS custom properties in `[data-theme="dark"]`
- [x] **TH17** - Ensure sufficient contrast ratios (WCAG AA: 4.5:1 for text)

#### Component CSS Updates

- [x] **TH18** - Update `App.css` to use theme variables (already uses variables)
- [x] **TH19** - Update `Header.css` to use theme variables (already uses variables)
- [x] **TH20** - Update `FilterPanel.css` to use theme variables (already uses variables)
- [x] **TH21** - Update `InfoboxPanel.css` to use theme variables (already uses variables)
- [x] **TH22** - Update `SearchBox.css` to use theme variables (already uses variables)
- [x] **TH23** - Update `MainLayout.css` to use theme variables
- [x] **TH24** - Update any other component CSS files

#### Visualization Theme Support

- [x] **TH25** - Update `ForceGraphLayout.tsx` colors to respect theme (or ensure visibility in both)
- [x] **TH26** - Update `TimelineLayout.tsx` colors to respect theme
- [x] **TH27** - Update `graphColors.ts` to support theme-aware colors (if needed) - node colors stay consistent, CSS handles theme
- [x] **TH28** - Test graph node/edge visibility in both light and dark modes
- [x] **TH29** - Test timeline readability in both modes

#### Integration & Testing

- [x] **TH30** - Test URL shareability: `?theme=dark` should load dark mode
- [x] **TH31** - Test combined URL params: `?dataset=disney&theme=dark&selected=...`
- [x] **TH32** - Test theme toggle updates URL without page reload
- [x] **TH33** - Test browser back/forward navigation with theme changes
- [x] **TH34** - Test localStorage fallback when URL has no theme param
- [x] **TH35** - Verify no flash of wrong theme on page load (avoid FOUC)

#### Final Verification

- [x] **SC15** - Build passes with no errors
- [x] **SC16** - All linter warnings resolved (pre-existing warnings remain, not introduced by M13)
- [x] **SC17** - Test on production URL after deployment
- [x] **SC18** - Update CHANGELOG.md with M13 completion notes

### M13 Completion Notes
```
[2026-01-18] M13 IMPLEMENTATION COMPLETE:

APPLICATION REBRAND:
- Application renamed from "HistoryNet" to "Scenius"
- New tagline: "Mapping collective genius"
- All documentation updated with new branding
- New SVG favicon with interconnected nodes design

THEME SYSTEM:
- ThemeContext provides light/dark mode state
- URL parameter support: ?theme=dark or ?theme=light
- localStorage persistence as fallback
- All components use CSS custom properties
- WCAG AA contrast ratios maintained

FILES CREATED:
- src/contexts/ThemeContext.tsx - Theme state management
- src/components/ThemeToggle.tsx - Sun/moon toggle component
- src/components/ThemeToggle.css - Toggle styling
- public/favicon.svg - New interconnected nodes favicon

FILES MODIFIED:
- index.html - New title, meta tags, favicon link
- src/App.tsx - ThemeProvider wrapper
- src/App.css - Dark mode CSS variables
- src/components/Header.tsx - New branding, ThemeToggle
- All component CSS files - Theme-aware variables

DEFERRED TASKS:
- PNG favicon variants (SC10-SC12) - SVG sufficient for modern browsers
- Separate light/dark favicons (SC14) - Single SVG works well

✅ MILESTONE 13 COMPLETE - Scenius rebrand and theme system operational
```

---

### M14: Timeline Improvements

**Goal**: Address usability issues with the timeline visualization based on user testing feedback. Focus on positioning, readability, initial zoom, temporal gaps, legend consistency, and infobox behavior parity.

#### Layout & Positioning (Filter Panel Overlap)

- [x] **TL1** - Identify CSS causing timeline to be hard-aligned left in `TimelineLayout.tsx` / `TimelineLayout.css`
- [x] **TL2** - Adjust timeline container positioning to respect filter panel width when open
- [x] **TL3** - Test timeline visibility with filter panel expanded vs collapsed
- [x] **TL4** - Ensure timeline uses same layout constraints as graph view (MainLayout integration)
- [x] **TL5** - Test: switching between graph and timeline should not cause content to jump behind filter panel

#### Year Label Readability

- [x] **TL6** - Locate year label rendering code in `TimelineLayout.tsx`
- [x] **TL7** - Increase font size of year axis labels (suggest 14-16px minimum)
- [x] **TL8** - Consider increasing font weight for improved contrast
- [x] **TL9** - Test year label readability at default zoom level (should be readable without zooming)
- [x] **TL10** - Ensure label sizing works across different viewport sizes

#### Initial Zoom & Focus

- [x] **TL11** - Review current initial zoom/transform calculation in `TimelineLayout.tsx`
- [x] **TL12** - Adjust default zoom level so nodes are clearly visible on load
- [x] **TL13** - Calculate initial view to focus on the first chronological item
- [x] **TL14** - Consider "fit to content" initial view that shows all or most nodes
- [x] **TL15** - Test: timeline should show meaningful content immediately without user interaction

#### Timeline Gap Handling - Framework Research

- [x] **TL16** - Document current D3 implementation approach for vertical timeline
- [x] **TL17** - Research alternative timeline libraries: vis-timeline, react-chrono, TimelineJS, etc.
- [x] **TL18** - Evaluate alternatives against requirements: vertical orientation, zoom/pan, node display, customization
- [x] **TL19** - Document pros/cons of alternatives vs staying with D3
- [x] **TL20** - Make go/no-go decision on framework change (document in Notes section)

#### Timeline Gap Handling - D3 Implementation (Deferred)

- [ ] **TL21** - Analyze dataset to identify gaps (periods with no events for N+ years)
- [ ] **TL22** - Design discontinuity visualization (e.g., jagged break line, "// 75 years //" label)
- [ ] **TL23** - Implement timeline scale that collapses empty periods while preserving relative positioning
- [ ] **TL24** - Add visual indicator at each discontinuity showing years skipped
- [ ] **TL25** - Ensure node positions remain accurate relative to their actual dates
- [ ] **TL26** - Test with Enlightenment dataset (likely has significant gaps)
- [ ] **TL27** - Test with Disney dataset (may have fewer gaps)

#### Legend Consistency with Graph

- [x] **TL28** - Audit current timeline legend implementation (birth/death/lifespan)
- [x] **TL29** - Remove birth/death/lifespan legend items from timeline view
- [x] **TL30** - Implement node-type legend matching graph view (Person, Object, Entity, Event)
- [x] **TL31** - Ensure legend uses same colors from `graphColors.ts` as graph legend
- [x] **TL32** - Ensure legend uses same shapes as graph legend (if shapes are shown)
- [x] **TL33** - Verify timeline node rendering uses `getNodeColor()` from shared utils
- [x] **TL34** - Test: node colors in timeline should visually match same nodes in graph view

#### Infobox Behavior Parity

- [x] **TL35** - Audit `TimelineLayout.tsx` integration with InfoboxPanel
- [x] **TL36** - Verify timeline uses the same `InfoboxPanel` component as graph (not a separate implementation)
- [x] **TL37** - Trace node click handler to ensure it updates shared selection state
- [x] **TL38** - Verify infobox hides completely when no item selected (should return `null`, not placeholder)
- [x] **TL39** - Test: clicking node on timeline opens infobox with correct details
- [x] **TL40** - Test: pressing Escape or clicking X hides infobox in timeline view
- [x] **TL41** - Test: switching from timeline to graph with selection should preserve infobox state

#### Final Verification

- [x] **TL42** - Build passes with no errors or linter warnings
- [x] **TL45** - Update CHANGELOG.md with M14 completion notes

### M14 Completion Notes
```
[2026-01-18] M14 TIMELINE IMPROVEMENTS COMPLETE:

LAYOUT & POSITIONING (TL1-TL5):
- Added LEFT_MARGIN constant (300px) to account for filter panel width
- All timeline content (axis, nodes, undated section) now starts after the margin
- Timeline content no longer overlaps with the filter panel when expanded

YEAR LABEL READABILITY (TL6-TL10):
- Century labels: 12px → 16px, font-weight 600 → 700, color #1e293b → #0f172a
- Decade labels: 10px → 13px, font-weight 400 → 500, color #64748b → #475569
- Improved contrast and readability at default zoom level

INITIAL ZOOM & FOCUS (TL11-TL15):
- New INITIAL_ZOOM_SCALE constant (0.8) for reasonable default
- Calculate initial position to focus on first chronological item
- Offset view to account for left margin, showing content immediately

TIMELINE GAP HANDLING RESEARCH (TL16-TL20):
Decision: STAY WITH D3, defer gap collapse feature to future milestone

Alternatives evaluated:
- vis-timeline: Good for horizontal timelines, poor vertical support
- react-chrono: Vertical support but limited zoom/pan, opinionated styling
- TimelineJS: Story-focused, not suitable for data exploration
- @nivo/timeline: Limited to horizontal orientation

D3 advantages for our use case:
- Full control over layout and positioning
- Excellent zoom/pan support with d3-zoom
- Consistent with ForceGraphLayout implementation
- No additional dependencies

Gap collapse implementation is complex (requires non-linear scales, 
discontinuity indicators) and deferred to a future milestone when 
datasets with significant gaps require it.

LEGEND CONSISTENCY (TL28-TL34):
- Replaced birth/death/lifespan legend with node-type legend
- Now matches graph view exactly: Person, Object, Location, Entity
- Uses same SVG shapes and colors from graphColors.ts

INFOBOX BEHAVIOR PARITY (TL35-TL41):
- Verified: Timeline uses shared GraphContext selection state
- InfoboxPanel component is shared between both views
- Click handlers correctly call selectNode() from context
- Escape key and X button work correctly in both views
- Selection state preserved when switching views

FILES MODIFIED:
- src/layouts/TimelineLayout.tsx - All positioning, sizing, legend changes
- src/layouts/TimelineLayout.css - Legend CSS updates

NOTE: TL21-TL27 (gap collapse) and TL43-TL44 (cross-browser testing) deferred to future work.

✅ MILESTONE 14 COMPLETE - Timeline significantly improved
```

---

## Key Architecture Decisions (Summary)

| Decision | Rationale |
|----------|-----------|
| React Context over Redux | Simpler API, sufficient for app scale |
| HashRouter over BrowserRouter | GitHub Pages compatibility |
| D3 for both layouts | Consistent interaction model, powerful zoom/pan |
| URL-first state | Enables deep linking and sharing |
| Evidence required on edges | Data quality over convenience |
| Layout interface abstraction | Enables future visualization modes |

---

### M15: Stable Resource URLs

**Completed**: 2026-01-18

**Goal**: Give every node and edge a permanent, shareable URL (permalink) that loads a standalone detail page. Enable external citation, bookmarking, and lay the foundation for per-item user feedback.

**URL Structure**:
- Nodes: `/#/{dataset-id}/node/{node-id}`
- Edges: `/#/{dataset-id}/from/{source-id}/to/{target-id}` (shows all edges between pair)

#### Routing Architecture

- [x] **SR1** - Design route structure and document URL patterns in codebase
- [x] **SR2** - Add new routes to React Router configuration in `App.tsx`
  - `/:datasetId/node/:nodeId` - Node detail page
  - `/:datasetId/from/:sourceId/to/:targetId` - Edge detail page (between node pair)
- [x] **SR3** - Create route parameter extraction hook `useResourceParams` in `src/hooks/`
- [x] **SR4** - Ensure routes work with HashRouter (required for GitHub Pages)
- [x] **SR5** - Handle invalid routes gracefully (404-style page or redirect to main view)
- [x] **SR6** - Test: direct URL access loads correct resource page

#### Node Detail Page

- [x] **SR7** - Create `NodeDetailPage` component in `src/pages/`
- [x] **SR8** - Load dataset and find node by ID from route params
- [x] **SR9** - Display node information using same fields as `NodeInfobox`
- [x] **SR10** - Style page consistently with main application
- [x] **SR11** - Add "View in Graph" button linking to `/#/?dataset={id}&selected={nodeId}&type=node`
- [x] **SR12** - Add breadcrumb navigation: `{Dataset Name} > {Node Type} > {Node Title}`
- [x] **SR13** - Handle loading state while dataset fetches
- [x] **SR14** - Handle error state if node ID not found in dataset

#### Edge Detail Page

- [x] **SR15** - Create `EdgeDetailPage` component in `src/pages/`
- [x] **SR16** - Load dataset and find all edges between source and target nodes
- [x] **SR17** - Display source and target node summary cards (name, type, image thumbnail)
- [x] **SR18** - Display edge information (relationship, description, dates, evidence, strength)
- [x] **SR19** - Handle case where multiple edges exist between same pair (list all)
- [x] **SR20** - Handle case where no edges exist between pair (show message, not error)
- [x] **SR21** - Add "View in Graph" button linking to graph with edge selected
- [x] **SR22** - Add clickable links to source/target node detail pages
- [x] **SR23** - Style consistently with node detail page
- [x] **SR24** - Handle loading and error states

#### Permalink & Share UI (InfoboxPanel Integration)

- [x] **SR25** - Create `ShareButtons` component with Permalink and Share buttons
- [x] **SR26** - Implement "Permalink" button that copies stable URL to clipboard
- [x] **SR27** - Implement "Share" button using Web Share API (with fallback to copy)
- [x] **SR28** - Add visual feedback on successful copy ("Copied!" text with checkmark)
- [x] **SR29** - Generate correct stable URL based on selected item type
- [x] **SR30** - Integrate `ShareButtons` into `InfoboxPanel` component (shared by Node/Edge)
- [x] **SR31** - Style buttons to match existing infobox aesthetic
- [x] **SR32** - Test: clicking Permalink copies correct URL for both nodes and edges

#### Meta Tags (SEO & Social Sharing)

- [x] **SR33** - Install `react-helmet-async` for dynamic meta tag management
- [x] **SR34** - Create `ResourceMeta` component for setting page-specific meta tags
- [x] **SR35** - Set dynamic `<title>` tag: `{Item Title} | {Dataset Name} | Scenius`
- [x] **SR36** - Set `<meta name="description">` from node/edge short description
- [x] **SR37** - Set Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`
- [x] **SR38** - Set `og:image` to node image if available, otherwise default app image
- [x] **SR39** - Apply `ResourceMeta` to both `NodeDetailPage` and `EdgeDetailPage`
- [x] **SR40** - Document meta tag limitations for pure client-side SPA in code comments

#### Navigation & UX

- [x] **SR41** - Ensure browser back button works correctly from detail pages
- [x] **SR42** - Add link from detail pages back to dataset (via breadcrumb)
- [x] **SR43** - Test: navigating between detail pages updates URL correctly

#### Testing & Verification

- [x] **SR44** - Test all node types render correctly on detail pages (person, object, location, entity)
- [x] **SR45** - Test edge detail page with single edge between pair
- [x] **SR46** - Test with multiple datasets (Disney, Enlightenment)
- [x] **SR47** - Test invalid node ID shows appropriate error/not-found state
- [x] **SR48** - Test invalid dataset ID shows appropriate error state
- [x] **SR49** - Test Permalink/Share buttons on both graph view infobox and detail pages
- [x] **SR50** - Build passes with no errors

**Implementation Notes**:
- Created `src/pages/` folder for standalone page components
- Added `useResourceParams` hook for extracting route parameters
- Added `buildFullNodeUrl`/`buildFullEdgeUrl` for shareable URLs (with hash)
- Added `buildNodeUrl`/`buildEdgeUrl`/`buildGraphViewUrl` for internal navigation (without hash)
- ShareButtons integrated into InfoboxPanel to work with both graph view and detail pages
- ResourceMeta component uses react-helmet-async for client-side meta tag management
- Note: Meta tags update client-side only; social media crawlers may not see dynamic content without SSR

---

### M16: Network Verification

**Completed**: 2026-01-18

**Goal**: Implement build-time CLI validation tools that verify all datasets conform to the graph schema before deployment. Invalid or malformed datasets should fail the build, preventing broken data from reaching production.

**Architecture**: TypeScript CLI scripts executed via npm, integrated into the GitHub Actions workflow after the build step. Validation runs against the JSON files in `public/datasets/`.

**Key Principle**: This is **build-time only** validation. No validation code should be shipped to the runtime bundle. The CLI tools live in a separate `scripts/` directory and are excluded from the production build.

#### CLI Tool Architecture

Created validation scripts in `scripts/validate-datasets/`:

```
scripts/
└── validate-datasets/
    ├── index.ts           # Main entry point
    ├── validators/
    │   ├── json-syntax.ts    # JSON parsing validation
    │   ├── manifest.ts       # Manifest schema validation
    │   ├── nodes.ts          # Node schema validation
    │   ├── edges.ts          # Edge schema validation
    │   └── cross-references.ts # Referential integrity
    ├── types.ts           # Validation types and interfaces
    └── reporter.ts        # Output formatting (errors, warnings, summary)
```

#### Validation Checks

| Check | Severity | Description |
|-------|----------|-------------|
| JSON syntax | Error | Files must be valid JSON |
| Required fields | Error | `id`, `type`, `title` for nodes; `id`, `source`, `target`, `relationship` for edges |
| Node types | Error | Must be `person`, `object`, `location`, or `entity` |
| Date formats | Error | ISO 8601 (YYYY-MM-DD) or year-only (YYYY) |
| URL formats | Error | Valid HTTP/HTTPS URLs for `imageUrl`, `evidenceUrl`, external links |
| Duplicate IDs | Error | Node and edge IDs must be unique |
| Broken references | Error | Edge `source`/`target` must exist in nodes |
| Missing evidence | Warning | Edges should have `evidence`, `evidenceNodeId`, or `evidenceUrl` |
| Missing recommended fields | Warning | Type-specific fields like `biography`, `objectType` |
| Non-standard IDs | Warning | IDs should follow `{type}-{slug}` pattern |
| Unknown relationship types | Warning | Consider adding to `manifest.customRelationshipTypes` |

#### npm Scripts

```json
{
  "scripts": {
    "validate:datasets": "npx tsx scripts/validate-datasets/index.ts",
    "validate:datasets:strict": "npx tsx scripts/validate-datasets/index.ts --strict"
  }
}
```

Options: `--strict` (warnings as errors), `--dataset <id>` (single dataset), `--quiet`, `--json`

#### Tasks

- [x] Create `scripts/validate-datasets/` directory structure
- [x] Implement JSON syntax validator
- [x] Implement manifest schema validator
- [x] Implement node schema validator with type-specific rules
- [x] Implement edge schema validator
- [x] Implement cross-reference validator
- [x] Implement reporter with colored output and summary
- [x] Add CLI argument parsing (--strict, --dataset, --quiet, --json)
- [x] Add npm scripts to package.json
- [x] Update GitHub Actions workflow to run validation before build
- [x] Add validation documentation to AGENTS.md
- [x] Test against all existing datasets, fix any discovered issues

---

*This document was created during documentation graduation on 2026-01-18.*
