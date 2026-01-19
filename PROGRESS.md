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

- [ ] **DS29** - Test filtering with partial matches (e.g., "disney" finds "Disney Characters")
- [ ] **DS30** - Test filtering by description (e.g., "enlightenment" finds dataset by description)
- [ ] **DS31** - Test keyboard navigation through filtered results
- [ ] **DS32** - Test with empty search (shows all datasets)
- [ ] **DS33** - Test with no-match search (shows empty state message)
- [ ] **DS34** - Test theme switching (light/dark mode)
- [ ] **DS35** - Verify accessibility with screen reader
- [ ] **DS36** - Build passes with no errors or linter warnings
- [ ] **DS37** - Update CHANGELOG.md with M17 completion notes

---

## M18: Adapt for Mobile

**Goal**: Make Scenius fully usable on mobile devices (iPad and iPhone). Transform the desktop-first layout into a responsive, touch-friendly experience using mobile-native patterns like hamburger menus, bottom sheets, and drawers.

**Priority Levels**:
- **High**: Header overflow fix, safe area insets, touch targets (core usability)
- **Medium**: Bottom sheet InfoboxPanel, filter drawer (enhanced UX patterns)

**Key Context for Implementing Agent**:
- Current breakpoint at 768px switches from side-by-side to stacked layout
- Header currently shows: Brand, Layout switcher, Dataset selector, Search, Theme toggle
- InfoboxPanel is currently 320px wide (desktop) or 40% height (mobile)
- FilterPanel floats at top-left, nearly full-width on mobile
- Test on actual devices or browser device emulation for accurate results

### 1. Responsive Header with Hamburger Menu (HIGH)

**Intent**: Prevent header overflow on narrow screens. At < 640px, collapse secondary controls into a menu while keeping primary actions (search, menu toggle) always visible.

- [x] **MB1** - Create `MobileMenu` component (slide-in drawer from right)
  - Full-height overlay with semi-transparent backdrop
  - Contains: Dataset selector, Layout switcher, Theme toggle
  - Close on backdrop tap or explicit close button
- [x] **MB2** - Create `HamburgerButton` component (44×44px touch target)
  - Three-line icon, transforms to X when menu open
  - Visible only on mobile (< 640px)
- [x] **MB3** - Create `useMediaQuery` hook or CSS-based responsive logic
  - Return boolean for mobile breakpoint
  - Consider using `window.matchMedia` for JS approach
- [x] **MB4** - Update `Header.tsx` to conditionally render mobile vs desktop layout
  - Desktop (≥ 640px): Current layout with all controls inline
  - Mobile (< 640px): Logo, search icon, hamburger button only
- [x] **MB5** - Make search collapsible on mobile
  - Default: Show search icon only
  - Tap: Expand to full search input (overlay or inline)
  - Blur or submit: Collapse back to icon
- [x] **MB6** - Style mobile menu with theme support (light/dark)
- [x] **MB7** - Add slide-in animation for menu (transform + opacity)
- [x] **MB8** - Ensure menu is keyboard accessible (focus trap when open, Escape to close)
- [x] **MB9** - Test header at 375px, 390px, 430px widths (common iPhone sizes)

### 2. Safe Area Insets for iPhone (HIGH)

**Intent**: Prevent content from being clipped by iPhone notch, Dynamic Island, and home indicator. Essential for landscape orientation and newer devices.

- [x] **MB10** - Add `viewport-fit=cover` to viewport meta tag in `index.html`
- [x] **MB11** - Define CSS custom properties for safe area insets in `index.css`:
  ```css
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-left: env(safe-area-inset-left, 0px);
  --safe-area-right: env(safe-area-inset-right, 0px);
  ```
- [x] **MB12** - Apply safe area padding to Header component on mobile
- [x] **MB13** - Apply safe area padding to bottom sheet / action bar (MB18-MB27)
- [x] **MB14** - Apply safe area padding to MobileMenu component
- [x] **MB15** - Test in iPhone simulator with notch (iPhone 14 Pro) and Dynamic Island
- [x] **MB16** - Test in landscape orientation for left/right safe areas

### 3. Touch-Friendly Target Sizes (HIGH)

**Intent**: Meet Apple's 44×44pt minimum touch target recommendation. Audit all interactive elements and increase sizes for mobile.

- [x] **MB17** - Audit all interactive elements and document current sizes
  - Buttons, icons, form inputs, close buttons, etc.
- [x] **MB18** - Update `InfoboxPanel` close button: 32px → 44px (mobile only)
- [x] **MB19** - Update `FilterPanel` toggle button to 44px minimum
- [x] **MB20** - Update `SearchBox` clear button to 44px minimum
- [x] **MB21** - Update `ThemeToggle` button to 44px minimum
- [x] **MB22** - Update `LayoutSwitcher` tab buttons to 44px height minimum
- [x] **MB23** - Update graph/timeline zoom control buttons to 44px minimum
- [x] **MB24** - Update `DatasetSelector` trigger button height to 44px
- [x] **MB25** - Add mobile-specific CSS media query block for touch target overrides
- [x] **MB26** - Verify padding/spacing adjustments maintain visual balance
- [x] **MB27** - Test with touch input on actual device (not just mouse in dev tools)

### 4. Bottom Sheet InfoboxPanel (MEDIUM)

**Intent**: Replace fixed-height stacked panel with draggable bottom sheet. Allows users to maximize graph area when browsing, then expand details on demand.

- [x] **MB28** - Create `BottomSheet` component (reusable base component)
  - Props: `isOpen`, `onClose`, `snapPoints` (array of heights), `children`
  - Drag handle indicator at top
  - Touch gesture handling for swipe up/down
- [x] **MB29** - Implement snap point logic (hidden → peek → expanded)
  - Peek: ~100px showing title bar
  - Expanded: ~60% of viewport height
  - Hidden: Off-screen
- [x] **MB30** - Implement drag gesture recognition
  - Use `touchstart`, `touchmove`, `touchend` events
  - Calculate velocity for momentum-based snapping
  - Prevent scroll conflict when dragging sheet
- [x] **MB31** - Add smooth animation between snap points (CSS transition or spring)
- [x] **MB32** - Create `MobileInfoboxPanel` wrapper that uses BottomSheet
  - Render existing `NodeInfobox`/`EdgeInfobox` content inside
  - Show drag handle and title in peek state
- [x] **MB33** - Integrate with selection state from `useGraph`
  - No selection → sheet hidden
  - Selection made → sheet opens to peek
  - Clear selection → sheet hides
- [x] **MB34** - Add close button in sheet header (alternative to swipe-to-dismiss)
- [x] **MB35** - Update `MainLayout.tsx` to use `MobileInfoboxPanel` on mobile
  - Conditionally render based on viewport width
  - Desktop: Keep current side panel behavior
- [x] **MB36** - Handle scroll within expanded sheet content
  - Internal scroll when content overflows
  - Drag gesture should not interfere with content scroll
- [x] **MB37** - Test sheet behavior with various node types (short vs long content)
- [x] **MB38** - Test sheet with edge selection (different content structure)

### 5. Filter Drawer Pattern (MEDIUM)

**Intent**: Replace floating FilterPanel overlay with slide-in drawer on mobile. Provides cleaner separation between filter UI and graph visualization.

- [x] **MB39** - Create `Drawer` component (slide from left variant of overlay pattern)
  - Props: `isOpen`, `onClose`, `side` ('left' | 'right'), `children`
  - Semi-transparent backdrop
  - Slide animation
- [x] **MB40** - Update `FilterPanel` to support drawer mode on mobile
  - Wrap content in Drawer component when mobile
  - Keep floating behavior on desktop (≥ 768px)
- [x] **MB41** - Add filter toggle button to mobile header or as FAB
  - Icon: filter/funnel icon
  - Badge indicator when filters are active
- [x] **MB42** - Implement swipe-to-close gesture for drawer
- [x] **MB43** - Add prominent "Clear Filters" button in drawer footer
- [x] **MB44** - Show active filter count in toggle button badge
- [x] **MB45** - Ensure backdrop click closes drawer
- [x] **MB46** - Test filter drawer with all filter types (date range, node types, text)
- [x] **MB47** - Test drawer behavior in landscape orientation

### 6. Additional Mobile Optimizations

- [x] **MB48** - Update `#root` to use `100dvh` (dynamic viewport height) for iOS Safari
  ```css
  #root { height: 100dvh; }
  @supports not (height: 100dvh) { #root { height: 100vh; } }
  ```
- [x] **MB49** - Add `-webkit-tap-highlight-color: transparent` to remove tap highlight
- [x] **MB50** - Add `touch-action: manipulation` to prevent double-tap zoom on buttons
- [x] **MB51** - Review and adjust font sizes for mobile readability

### 7. Testing & Verification

- [x] **MB52** - Test on iPhone SE (375×667) - smallest common phone
- [x] **MB53** - Test on iPhone 14 Pro (393×852) - standard iPhone
- [x] **MB54** - Test on iPhone 14 Pro Max (430×932) - large phone
- [x] **MB55** - Test on iPad Mini portrait (768×1024)
- [x] **MB56** - Test on iPad Pro landscape (1194×834)
- [x] **MB57** - Test all interactive elements with touch input
- [x] **MB58** - Verify no horizontal scroll on any mobile viewport
- [x] **MB59** - Test orientation changes (portrait ↔ landscape)
- [x] **MB60** - Verify graph zoom/pan works with touch gestures
- [x] **MB61** - Verify timeline zoom/pan works with touch gestures
- [x] **MB62** - Build passes with no errors
- [x] **MB63** - No linter warnings in new/modified files
- [x] **MB64** - Update CHANGELOG.md with M18 completion notes

---

## M19: Radial/Ego-Network View

**Goal**: Add a radial (ego-network) visualization that displays a selected node at the center with its direct connections arranged in a ring around it. Provides a focused view of a single node's relationships.

**Key Design Decisions**:
- Radial layout is only available when a node is selected
- Shows 1 degree of separation (direct connections only)
- Filters apply to both center node and connected nodes
- Reuses existing node shapes/colors for consistency

### 1. Type System & Hook Updates

- [x] **RD1** - Extend `LayoutType` in `src/hooks/useLayout.ts` to include `'radial'`
- [x] **RD2** - Add radial layout entry to `LAYOUTS` registry in `useLayout.ts`:
  - id: `'radial'`
  - name: `'Radial View'`
  - description: `'Ego-network view centered on selected node'`
- [x] **RD3** - Update `MainLayout.tsx` switch statement to handle `case 'radial':`
- [x] **RD4** - Verify URL state works with `?layout=radial` parameter

### 2. LayoutSwitcher Conditional Availability

- [x] **RD5** - Add `selectedNodeId` prop to `LayoutSwitcher` component
- [x] **RD6** - Add radial option to `LAYOUT_OPTIONS` array with appropriate icon:
  - Suggested icon: concentric circles or target/bullseye pattern
- [x] **RD7** - Implement conditional disabled state for radial tab when no node selected
- [x] **RD8** - Add visual styling for disabled state (grayed out, reduced opacity)
- [x] **RD9** - Add tooltip on disabled radial tab: "Select a node to use radial view"
- [x] **RD10** - Update `Header.tsx` to pass `selectedNodeId` to `LayoutSwitcher`
- [x] **RD11** - When radial is selected but node becomes deselected, fall back to force-graph

### 3. RadialLayout Component - Core Structure

- [x] **RD12** - Create `src/layouts/RadialLayout.tsx` implementing `LayoutComponentProps`
- [x] **RD13** - Create `src/layouts/RadialLayout.css` for component styles
- [x] **RD14** - Export `RadialLayout` from `src/layouts/index.ts`
- [x] **RD15** - Set up D3 SVG container with zoom/pan behavior (reuse pattern from ForceGraphLayout)
- [x] **RD16** - Add zoom controls (zoom in, zoom out, reset) consistent with other layouts

### 4. RadialLayout Component - Data Processing

- [x] **RD17** - Extract center node from `selectedNodeId` prop
- [x] **RD18** - Find all edges connected to center node (source OR target matches)
- [x] **RD19** - Extract connected nodes from those edges
- [x] **RD20** - Apply current filters to connected nodes (hide nodes that don't pass)
- [x] **RD21** - Handle edge case: center node has 0 connections (show message)
- [x] **RD22** - Handle edge case: center node not in data (show error or empty state)

### 5. RadialLayout Component - Positioning & Rendering

- [x] **RD23** - Position center node at SVG center
- [x] **RD24** - Calculate positions for peripheral nodes in a circle around center
  - Evenly distribute angles (360° / n nodes)
  - Configurable radius (e.g., 200px, adjustable based on node count)
- [x] **RD25** - Render center node using same shape/color logic as ForceGraphLayout
  - Import and use `getNodeColor`, `getNodeShape` from `graphColors.ts`
- [x] **RD26** - Render peripheral nodes with same shape/color logic
- [x] **RD27** - Render curved arc edges from center to each peripheral node
  - Use D3 line generator with curve interpolation (e.g., `d3.curveBundle` or `d3.curveBasis`)
- [x] **RD28** - Apply edge colors based on relationship type (reuse `getEdgeColor`)
- [x] **RD29** - Add node labels (title) positioned near each node
- [x] **RD30** - Handle large connection counts gracefully (50+ nodes):
  - Reduce node size or label size
  - Increase radius to prevent overlap
  - Consider pagination or "show more" pattern for very large counts

### 6. RadialLayout Component - Interactions

- [x] **RD31** - Implement node click handler calling `onNodeClick` prop
- [x] **RD32** - Implement edge click handler calling `onEdgeClick` prop
- [x] **RD33** - Highlight selected node (center or peripheral) with visual indicator
- [x] **RD34** - Highlight selected edge with visual indicator
- [x] **RD35** - When peripheral node is clicked:
  - Call `onNodeClick` to update selection
  - This will cause re-render with new center node (seamless transition)
- [x] **RD36** - Add hover effects on nodes (cursor pointer, slight scale or glow)
- [x] **RD37** - Add hover effects on edges (cursor pointer, highlight)
- [x] **RD38** - Apply `searchTerm` highlighting to matching nodes (reuse logic from ForceGraphLayout)

### 7. Empty & Invalid States

- [x] **RD39** - Create empty state component: "Select a node to explore its connections"
  - Include icon (e.g., radial/target icon)
  - Style consistent with other empty states in app
- [x] **RD40** - Show empty state when `selectedNodeId` is null/undefined
- [x] **RD41** - Show empty state when selection is an edge (not a node)
- [x] **RD42** - Handle case where center node is filtered out:
  - Option A: Show message "Selected node is hidden by current filters"
  - Option B: Automatically switch to force-graph layout
  - Implement chosen option
- [x] **RD43** - Handle case where all connected nodes are filtered out:
  - Show center node alone with message "No visible connections with current filters"

### 8. Filter Integration

- [x] **RD44** - Verify date range filters apply to connected nodes
- [x] **RD45** - Verify text filters apply to connected nodes
- [x] **RD46** - Verify node type filters apply to connected nodes
- [x] **RD47** - Update filter stats display to reflect radial view context (if applicable)
- [x] **RD48** - Test filter + radial interaction: apply filter, switch to radial, verify correct nodes shown

### 9. Infobox Integration

- [x] **RD49** - Verify clicking center node updates infobox to show that node's details
- [x] **RD50** - Verify clicking peripheral node updates infobox to show that node's details
- [x] **RD51** - Verify clicking edge updates infobox to show edge details
- [x] **RD52** - Verify infobox "related nodes" links work and update radial view appropriately
- [x] **RD53** - Test deep link: load URL with `?layout=radial&selected=person-xyz&type=node`

### 10. Animation & Polish

- [x] **RD54** - Add entrance animation when switching to radial view
  - Nodes animate from center outward to final positions
  - Or fade in with slight scale
- [x] **RD55** - Add transition animation when center node changes
  - Old nodes animate out, new nodes animate in
  - Or smooth position transition if nodes overlap
- [x] **RD56** - Ensure smooth zoom/pan experience (consistent with other layouts)
- [x] **RD57** - Add legend showing node type colors (reuse Legend component if exists)

### 11. Theme Support

- [x] **RD58** - Verify radial layout works in light theme
- [x] **RD59** - Verify radial layout works in dark theme
- [x] **RD60** - Use CSS variables for colors to support theme switching
- [x] **RD61** - Test theme toggle while in radial view

### 12. Testing & Verification

- [x] **RD62** - Test with Disney dataset (varied connection counts)
- [x] **RD63** - Test with Enlightenment dataset (denser connections)
- [x] **RD64** - Test with node that has 1 connection
- [x] **RD65** - Test with node that has 20+ connections
- [x] **RD66** - Test with node that has 0 connections
- [x] **RD67** - Test layout switching: force-graph → radial → timeline → radial
- [x] **RD68** - Test URL sharing: copy URL in radial view, open in new tab, verify state restored
- [x] **RD69** - Test keyboard accessibility: can navigate to radial tab, can activate it
- [x] **RD70** - Verify no console errors or warnings in radial view
- [x] **RD71** - Verify build passes with no TypeScript errors
- [x] **RD72** - Verify no linter warnings in new/modified files

### 13. Documentation

- [x] **RD73** - Add JSDoc comments to RadialLayout component
- [x] **RD74** - Update any user-facing help text if applicable
- [x] **RD75** - Update CHANGELOG.md with M19 completion notes

---

## M20: SEO Improvements

**Goal**: Systematically improve search engine optimization and AI discoverability across all pages. Add OpenSearch metadata, structured data (JSON-LD), enhanced meta tags, and crawler-friendly resources.

**Current State**: The app has basic Open Graph and Twitter Card meta tags in `index.html`, and uses `react-helmet-async` via `ResourceMeta.tsx` for dynamic meta tags on detail pages. This milestone fills in the gaps.

### 1. OpenSearch Integration

**Intent**: Allow browsers to add Scenius as a search provider, enabling users to search datasets directly from the browser's address bar.

- [ ] **SEO1** - Create `public/opensearch.xml` descriptor file
  - Include short name, description, search URL template
  - Point to `/?search={searchTerms}` or appropriate search route
- [ ] **SEO2** - Add `<link rel="search" type="application/opensearchdescription+xml">` to `index.html`
- [ ] **SEO3** - Test browser integration in Chrome (Settings > Search engines)
- [ ] **SEO4** - Test browser integration in Firefox
- [ ] **SEO5** - Test browser integration in Safari

### 2. Structured Data (JSON-LD)

**Intent**: Add Schema.org structured data to help search engines and AI understand content type and relationships.

- [ ] **SEO6** - Add `WebSite` schema to `index.html`
  - Include name, url, description, potentialAction (SearchAction)
- [ ] **SEO7** - Add `WebApplication` schema to `index.html`
  - Include name, description, applicationCategory, operatingSystem
- [ ] **SEO8** - Create `src/components/SchemaOrg.tsx` component for dynamic JSON-LD injection
  - Accept schema type and data as props
  - Render `<script type="application/ld+json">` via Helmet
- [ ] **SEO9** - Export `SchemaOrg` from `src/components/index.ts`
- [ ] **SEO10** - Add `Person` schema to `NodeDetailPage` for person nodes
  - Include name, description, birthDate, deathDate, nationality, image, sameAs (external links)
- [ ] **SEO11** - Add `CreativeWork` schema to `NodeDetailPage` for object nodes
  - Include name, description, dateCreated, creator, inLanguage
- [ ] **SEO12** - Add `Place` schema to `NodeDetailPage` for location nodes
  - Include name, description, geo (coordinates), containedInPlace
- [ ] **SEO13** - Add `Organization` schema to `NodeDetailPage` for entity nodes
  - Include name, description, foundingDate, founder, location
- [ ] **SEO14** - Add `ItemPage` schema wrapper to all detail pages
  - Include mainEntity reference to the specific node schema
- [ ] **SEO15** - Add `BreadcrumbList` schema to detail pages matching visual breadcrumb
  - Include itemListElement with position, name, item (URL)
- [ ] **SEO16** - Test structured data with Google Rich Results Test tool
- [ ] **SEO17** - Test structured data with Schema.org validator

### 3. Enhanced Meta Tags

**Intent**: Improve existing meta tags and add missing recommended tags.

- [ ] **SEO18** - Add `<meta name="robots" content="index, follow">` to `index.html`
- [ ] **SEO19** - Add `<meta name="author" content="Scenius Contributors">` to `index.html`
- [ ] **SEO20** - Add `<meta name="keywords">` with relevant terms (historical networks, visualization, etc.)
- [ ] **SEO21** - Add `<meta name="application-name" content="Scenius">` to `index.html`
- [ ] **SEO22** - Add `<link rel="canonical">` to `index.html` with production URL
- [ ] **SEO23** - Add `<meta property="og:url">` to `index.html` (currently missing)
- [ ] **SEO24** - Add `<meta property="og:locale" content="en_US">` to `index.html`
- [ ] **SEO25** - Update `og:image` to use absolute URL with production domain
- [ ] **SEO26** - Update Twitter image to use absolute URL with production domain
- [ ] **SEO27** - Review and optimize meta description length (150-160 chars ideal)
- [ ] **SEO28** - Update `ResourceMeta.tsx` to ensure all image URLs are absolute
- [ ] **SEO29** - Add dataset-specific description to main graph view when dataset is loaded
  - Create component or hook to update meta tags based on selected dataset

### 4. Crawler Resources

**Intent**: Add standard files that help search engine crawlers discover and index content.

- [ ] **SEO30** - Create `public/robots.txt` with appropriate rules
  - Allow all crawlers
  - Reference sitemap location
- [ ] **SEO31** - Create `public/sitemap.xml` with static routes
  - Include home page, any other static routes
- [ ] **SEO32** - Evaluate: Add build-time script to generate sitemap entries for dataset nodes
  - Read all datasets, generate URLs for each node detail page
  - Consider if practical given SPA nature
- [ ] **SEO33** - If SEO32 is implemented: Update `package.json` with sitemap generation script
- [ ] **SEO34** - Add sitemap reference to robots.txt

### 5. Page-Specific Optimizations

**Intent**: Review each page type and ensure comprehensive SEO coverage.

- [ ] **SEO35** - **Main Graph View** (`/`): Add dynamic meta tags when dataset is selected
  - Title: "{Dataset Name} | Scenius"
  - Description: Dataset description from manifest
- [ ] **SEO36** - **Node Detail Page**: Audit `ResourceMeta` usage
  - Ensure all relevant node fields are used in meta tags
  - Verify image URLs work for social preview
- [ ] **SEO37** - **Edge Detail Page**: Audit `ResourceMeta` usage
  - Ensure relationship description is in meta description
  - Verify source/target node titles are in title
- [ ] **SEO38** - **404 Page**: Add `<meta name="robots" content="noindex">` via Helmet
- [ ] **SEO39** - Verify all pages have unique, descriptive titles
- [ ] **SEO40** - Verify all pages have appropriate canonical URLs

### 6. AI-Friendly Metadata

**Intent**: Add metadata specifically helpful for AI systems and LLMs that may crawl or reference the site.

- [ ] **SEO41** - Add `article:author` meta tag to detail pages
- [ ] **SEO42** - Add `article:published_time` meta tag to detail pages (use dateStart if available)
- [ ] **SEO43** - Evaluate: Add `citation_*` meta tags for academic/research datasets
  - `citation_title`, `citation_author`, `citation_publication_date`
  - May only apply to certain datasets
- [ ] **SEO44** - Evaluate: Add Dublin Core (`dc:*`) metadata for scholarly content
  - `dc.title`, `dc.creator`, `dc.date`, `dc.description`
- [ ] **SEO45** - Evaluate: Create `public/llms.txt` or `public/ai.txt` guidance file
  - Describe what the app does, how AI should interpret content
  - Reference: llmstxt.org specification if applicable
- [ ] **SEO46** - Ensure all descriptions are informative and self-contained
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
- [ ] **SEO56** - Document any SPA-specific limitations in code comments
- [ ] **SEO57** - Build passes with no errors
- [ ] **SEO58** - No linter warnings in new/modified files
- [ ] **SEO59** - Update CHANGELOG.md with M20 completion notes

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
