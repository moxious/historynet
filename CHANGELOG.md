# Changelog

All notable changes to Scenius (formerly HistoryNet) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **M23: Wikimedia Sourcing** - Dynamic Wikipedia enrichment for nodes lacking local data
  - **Wikipedia Service**: `src/services/wikipedia.ts` wraps the `wikipedia` npm package
    - Fetches page summaries and thumbnails from Wikipedia REST API
    - Handles disambiguation pages with automatic retry using node type hints
    - 5-second timeout, graceful error handling (returns null, doesn't throw)
    - Optional fallback by Wikidata QID
  - **Caching Layer**: `useWikipediaData` hook with LRU cache
    - localStorage-based cache with 500-entry limit
    - 48-hour TTL for cache entries
    - LRU eviction when cache is full
    - Cache stats and clear utilities for debugging
  - **Fallback Logic**: `useNodeEnrichedData` hook combines local + Wikipedia data
    - Description priority: biography → shortDescription → Wikipedia extract
    - Image priority: local imageUrl (if loads) → Wikipedia thumbnail
    - Broken image detection via onError handler triggers Wikipedia fallback
    - Tracks data source ('local' | 'wikipedia' | 'none') for attribution
  - **UI Integration**: Wikipedia attribution in NodeInfobox
    - Shows Wikipedia "W" icon when image sourced from Wikipedia
    - "Read more on Wikipedia" link for Wikipedia-sourced descriptions
    - Loading shimmer while fetching Wikipedia data
  - **Schema Updates**: Added `wikipediaTitle` and `wikidataId` fields to GRAPH_SCHEMA.md
    - `wikipediaTitle`: Exact Wikipedia page title for sourcing
    - `wikidataId`: Stable Wikidata QID for long-term reference
    - Both fields added to TypeScript types in `src/types/node.ts`
  - **Pilot Dataset**: Rosicrucian Network enriched with `wikipediaTitle` for key nodes
    - Added to 10 representative nodes (persons, locations, objects)
    - Includes Jacob Boehme, John Dee, Johannes Kepler, Paracelsus, etc.
  - **New Files**: `wikipedia.ts`, `useWikipediaData.ts`, `useNodeEnrichedData.ts`, `WikipediaAttribution.tsx`

- **M21: Dataset Search & Filter** - Searchable combobox for faster dataset discovery
  - **Search Input**: Type to filter datasets by name or description
  - **Case-Insensitive Matching**: Matches anywhere in name or description text
  - **Text Highlighting**: Matching text highlighted with `<mark>` elements in results
  - **Keyboard Navigation**: Arrow keys to navigate, Enter to select, Escape to close/clear
  - **ARIA Accessibility**: Full combobox pattern with `role="combobox"`, `aria-expanded`, `aria-activedescendant`, screen reader announcements ("7 datasets found")
  - **Clear Button**: Quick reset of search input
  - **Light/Dark Theme**: Uses existing CSS variables for theme support
  - **URL Sync**: Selected dataset syncs with URL (`?dataset=...`), search state is ephemeral
  - **Loading State**: Shows loading indicator while manifests load
  - **Empty State**: "No matching datasets" message when filter returns no results
  - **New Components**: `SearchableDatasetSelector.tsx`, `SearchableDatasetSelector.css`
  - **Updated Components**: `Header.tsx`, `MobileMenu.tsx`, `index.ts`

- **Protestant Reformation Dataset** - New historical network with 180 nodes (65 people, 44 objects, 43 locations, 28 entities) and 101 relationships covering the 16th century Reformation (c. 1483-1564). Includes Luther, Calvin, Zwingli, Erasmus, and their networks across Lutheran, Reformed, Radical, and English reform movements.

- **M19: Radial/Ego-Network View** - New visualization layout for exploring a node's direct connections
  - **Radial Layout**: Center node with direct connections arranged in a ring
  - **Conditional Availability**: Radial tab disabled when no node selected, with tooltip explanation
  - **Auto-fallback**: Switches to force-graph when selection is cleared while in radial view
  - **Node Shapes**: Same type-based shapes as force-graph (circle, square, diamond, hexagon)
  - **Curved Edges**: Relationship-colored curved arcs connecting center to periphery
  - **Dynamic Radius**: Radius adjusts based on connection count (150-350px)
  - **Info Panel**: Shows center node title and connection count
  - **Click Navigation**: Clicking peripheral nodes re-centers the radial view on that node
  - **Search Highlighting**: Matching nodes highlighted, non-matching dimmed
  - **Empty States**: Helpful prompts when no selection or no connections
  - **Theme Support**: Full light/dark theme compatibility
  - **URL State**: Layout persists in URL (`?layout=radial`)
  - **New Components**: `RadialLayout.tsx`, `RadialLayout.css`
  - **Updated Components**: `useLayout.ts`, `LayoutSwitcher.tsx`, `MainLayout.tsx`, `Header.tsx`, `MobileMenu.tsx`

- **M16: Network Verification** - Build-time CLI validation tools for dataset integrity
  - Validates JSON syntax, encoding, and structure
  - Checks manifest.json required/recommended fields
  - Validates nodes (required fields, valid types, date formats, URL formats)
  - Validates edges (required fields, relationship types, evidence)
  - Cross-reference validation (broken references, orphan detection)
  - CLI with options: `--strict`, `--dataset`, `--quiet`, `--json`
  - npm scripts: `validate:datasets`, `validate:datasets:strict`
  - Integrated into GitHub Actions - runs before build
  - Fixed data issues in ai-llm-research (missing location-new-york node) and ambient-music (empty dateEnd fields)

- **M18: Adapt for Mobile** - Full mobile device support for iPad and iPhone
  - **Responsive Header**: Collapses controls into hamburger menu on mobile (< 640px)
  - **Mobile Menu**: Slide-in drawer with Dataset selector, Layout switcher, Theme toggle
  - **Collapsible Search**: Expands from icon to full input on mobile
  - **Safe Area Insets**: Support for iPhone notch, Dynamic Island, and home indicator
  - **Touch Targets**: All interactive elements meet 44×44pt minimum (Apple HIG)
  - **Bottom Sheet InfoboxPanel**: Draggable sheet with peek (100px) and expanded (60%) states
  - **Filter Drawer**: Left-side drawer for FilterPanel on mobile
  - **Dynamic Viewport Height**: Uses `100dvh` for iOS Safari toolbar handling
  - **Touch Optimizations**: Removed tap highlight, disabled double-tap zoom on buttons
  - **New Components**: `useMediaQuery` hook, `MobileMenu`, `HamburgerButton`, `BottomSheet`, `Drawer`, `MobileInfoboxPanel`

- **M20: SEO Improvements** - Comprehensive search engine and AI discoverability improvements
  - **OpenSearch Integration**: `opensearch.xml` for browser search provider integration
  - **Structured Data (JSON-LD)**:
    - `WebSite` and `WebApplication` schemas on all pages
    - `Person` schema for person nodes (birthDate, nationality, sameAs)
    - `CreativeWork` schema for object nodes (dateCreated, inLanguage)
    - `Place` schema for location nodes (geo coordinates)
    - `Organization` schema for entity nodes (foundingDate)
    - `ItemPage` wrapper with `BreadcrumbList` on all detail pages
  - **Enhanced Meta Tags**: robots, author, keywords, application-name, canonical URL, og:url, og:locale
  - **Absolute Image URLs**: All og:image and twitter:image use production domain for social sharing
  - **Crawler Resources**: `robots.txt` with sitemap reference, `sitemap.xml` with all 7 datasets
  - **AI-Friendly Metadata**: `llms.txt` guidance file, article:author, article:published_time on detail pages
  - **404 Page**: Added noindex meta tag via Helmet
  - **New Components**: `SchemaOrg.tsx` for dynamic JSON-LD injection
  - **Updated Components**: `ResourceMeta.tsx` (absolute URLs, og:locale, article meta), `NotFoundPage.tsx` (noindex)

### Planned
- M12: User Feedback - feedback form with Vercel serverless functions

---

## [1.7.0] - 2026-01-18

### Added
- **M15: Stable Resource URLs** - Permanent, shareable permalinks for every node and edge

### Features
- **Node Detail Pages**: Standalone pages at `/#/{dataset}/node/{nodeId}`
  - Full node information (title, type, dates, description, biography, etc.)
  - Type-specific fields for persons, objects, locations, entities
  - External links with security-sanitized URLs
  - "View in Graph" navigation back to graph view
  - Breadcrumb navigation (Dataset > Type > Title)

- **Edge Detail Pages**: Standalone pages at `/#/{dataset}/from/{sourceId}/to/{targetId}`
  - Shows all relationships between two nodes
  - Source/target node summary cards with clickable links
  - Relationship details (type, dates, evidence, strength)
  - Natural language descriptions ("Mickey Mouse related to Minnie Mouse")

- **Share Functionality**
  - Permalink button copies stable URL to clipboard
  - Share button uses Web Share API (with fallback to clipboard)
  - Visual feedback with "Copied!" confirmation
  - Integrated into both InfoboxPanel (graph view) and detail pages

- **Dynamic Meta Tags** (via react-helmet-async)
  - Page titles update dynamically (e.g., "Voltaire | Enlightenment | Scenius")
  - Open Graph tags for social sharing
  - Meta descriptions from node/edge content
  - Note: Client-side only; SSR needed for full social media crawler support

- **Error Handling**
  - NotFoundPage for invalid nodes, edges, or datasets
  - Specific error messages (e.g., "Node not found in dataset")
  - Navigation options back to home or dataset view

### Technical Details
- New `src/pages/` folder for page components
- `useResourceParams` hook for route parameter extraction
- URL helper functions for building stable URLs
- HashRouter compatible (works with GitHub Pages)
- Responsive design for mobile devices

---

## [1.6.0] - 2026-01-18

### Added
- **M13: Scenius Rebrand & Theme System** - Application rebranding and theme support

### Changed
- **Application renamed** from "HistoryNet" to "Scenius" - reflecting Brian Eno's concept of collective creative intelligence
- **New tagline**: "Mapping collective genius"
- **New favicon**: SVG favicon with interconnected nodes design symbolizing collective intelligence

### Added
- **Light/Dark Theme System**
  - Theme toggle in header with sun/moon icons
  - URL parameter support (`?theme=dark` or `?theme=light`)
  - localStorage fallback for theme persistence
  - Theme state shareable via URL
  
- **CSS Custom Properties**
  - Comprehensive light mode color palette (warm, inviting)
  - Dark mode color palette (slate tones, easy on eyes)
  - Theme-aware graph visualization colors
  - Theme-aware timeline visualization colors
  
- **ThemeContext** for React state management
  - `useTheme` hook for accessing theme state
  - Automatic sync between URL, localStorage, and DOM

### Documentation
- Updated README.md with new name and scenius concept explanation
- Updated AGENTS.md with Scenius branding
- Updated PRD.md with theme system requirements (F8)
- Added theme URL examples to documentation

---

## [1.5.0] - 2026-01-18

### Added
- **M14: Timeline Improvements** - Major usability enhancements to the timeline visualization

### Improved
- **Layout positioning**: Timeline content now respects filter panel width with 300px left margin
- **Year label readability**: Century labels increased to 16px (was 12px), decade labels to 13px (was 10px) with improved font weights and contrast
- **Initial zoom & focus**: Timeline now opens with content clearly visible and focused on the first chronological item
- **Legend consistency**: Timeline legend now matches graph view exactly with Person, Object, Location, Entity types and shapes

### Fixed
- Timeline content no longer overlaps with the filter panel when expanded
- Initial view no longer requires zooming to see content

### Verified
- Infobox behavior parity: Timeline uses the same shared InfoboxPanel as graph view
- Selection state preserved when switching between graph and timeline views
- Escape key and X button work correctly to close infobox in timeline view

### Research (Documented)
- Timeline gap handling: Evaluated vis-timeline, react-chrono, TimelineJS alternatives
- Decision: Stay with D3 for full control; defer gap collapse feature to future milestone

---

## [1.4.0] - 2026-01-18

### Added
- **M11: Graph Interaction Polish** - Refined graph behavior and discoverability

### Improved
- **Node click stability**: Clicking nodes no longer causes the graph to re-layout (memoized callbacks)
- **Physics tuning**: Reduced charge repulsion and added soft gravity to keep disconnected nodes visible
- **Interaction discoverability**: Added "Scroll to zoom • Drag to pan" hint near layout switcher

### Removed
- **ID fields**: Removed technical ID display from node and edge infoboxes (IDs are internal identifiers not meaningful to users)

---

## [1.3.0] - 2026-01-18

### Added
- **M10: UX Improvements** - Enhanced application responsiveness and usability

### Improved
- **Debounced inputs**: 300ms delay on filter and search inputs reduces UI jitter during typing
- **InfoboxPanel visibility**: Panel now hides completely when nothing is selected (cleaner default)
- **Filter panel**: Collapsed by default with chevron indicator showing expand/collapse state
- **Edge descriptions**: Natural sentence format like "Mickey Mouse knows Minnie Mouse"
- **Search vs Filter clarity**: Visual indicators and tooltips distinguish highlighting from filtering
- **Graph stability**: Clicking edges no longer causes the graph to re-layout

### Changed
- Filter labels simplified ("Name" instead of "Filter by Name")
- "Dataset:" prefix added to dataset selector in header
- SearchBox placeholder changed to "Highlight nodes..." for clarity

### Code Quality
- Extracted `getNodeColor()` and `getEdgeColor()` to shared `src/utils/graphColors.ts`
- Removed duplicate `parseYear()` from TimelineLayout (now uses `filterGraph.ts` version)
- Moved `@types/d3` from dependencies to devDependencies

---

## [1.2.0] - 2026-01-18

### Added
- **M9: Application Verification** - Comprehensive feature and code review completed

### Fixed
- **Enlightenment dataset** now appears in dataset selector (was missing from AVAILABLE_DATASETS)
- **README.md** documentation link corrected (MILESTONES.md → ROADMAP.md)

### Code Review Findings
- All feature verification tasks (V1-V10) passed
- Code review (R1-R8) completed with recommendations documented
- Documentation review (D1-D3) completed

### Recommendations for Future
- Extract shared layout utilities (getNodeColor, getEdgeColor) to reduce duplication
- Consider splitting GraphContext if application grows significantly
- Move @types/d3 to devDependencies

---

## [1.1.0] - 2026-01-18

### Added
- **Timeline View (M8)**: Vertical timeline visualization showing nodes by date
  - Automatic lane assignment to prevent overlap
  - Birth/death markers for persons with lifespan bars
  - Decade markers and century highlights on time axis
  - Full zoom/pan support
- **Layout Switcher**: Tab-based UI to switch between Graph and Timeline views
- **URL parameter**: `layout=timeline` or `layout=force-graph` for deep linking

### Datasets
- **Enlightenment** dataset: European Enlightenment intellectual network (c. 1685-1804)
- **AI-LLM Research** dataset: Modern AI and LLM research network

---

## [1.0.0] - 2026-01-18

### Added
- **Force-directed graph visualization** using D3.js
  - Node shapes by type: circle (person), square (object), diamond (location), hexagon (entity)
  - Edge coloring by relationship category
  - Zoom/pan with controls
  - Node drag to reposition
  
- **Infobox panel** for node and edge details
  - Type-specific field display
  - Image support for nodes
  - Clickable internal links
  - Evidence display for edges
  
- **Filtering system**
  - Date range filters ("No earlier than", "No later than")
  - Text filters for node names and relationship types
  - Real-time filter statistics
  - URL sync for all filters
  
- **Search functionality**
  - Search-as-you-type with node highlighting
  - Keyboard shortcut (Cmd/Ctrl+K)
  - Result count display
  
- **Dataset switching**
  - Dropdown selector with metadata display
  - URL parameter for dataset selection
  
- **URL state management**
  - All view state captured in URL hash
  - Deep linking support
  - Browser back/forward navigation
  
- **Accessibility**
  - ARIA labels on interactive elements
  - Keyboard navigation
  - Focus indicators
  - Sufficient color contrast

- **GitHub Pages deployment**
  - Automatic deployment via GitHub Actions
  - Live at https://moxious.github.io/historynet/

### Datasets
- **AI & LLM Research Network** (default): Key researchers, organizations, and works of the modern AI/LLM revolution (2012-present)
- **Rosicrucian Network**: Historical network centered on Boehme and Andreae (c. 1540-1660)

---

## [0.1.0] - 2026-01-18

### Added
- Initial project setup (Vite + React + TypeScript)
- Folder structure and tooling configuration
- TypeScript types for POLE graph model
- Data loading utilities
- Basic component shell

---

## Links

- **Live Demo**: https://moxious.github.io/historynet/
- **Repository**: https://github.com/moxious/historynet
