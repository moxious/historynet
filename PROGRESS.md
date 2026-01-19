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

## Completed Milestones (M1-M15)

All MVP and post-MVP milestones through M15 are complete. See `HISTORY.md` for detailed task lists and completion notes.

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

## M15: Stable Resource URLs ✅

**Goal**: Give every node and edge a permanent, shareable URL (permalink) that loads a standalone detail page. Enable external citation, bookmarking, and lay the foundation for per-item user feedback.

**Completed**: 2026-01-18

**URL Structure**:
- Nodes: `/#/{dataset-id}/node/{node-id}`
- Edges: `/#/{dataset-id}/from/{source-id}/to/{target-id}` (shows all edges between pair)

### Routing Architecture

- [x] **SR1** - Design route structure and document URL patterns in codebase
- [x] **SR2** - Add new routes to React Router configuration in `App.tsx`
  - `/:datasetId/node/:nodeId` - Node detail page
  - `/:datasetId/from/:sourceId/to/:targetId` - Edge detail page (between node pair)
- [x] **SR3** - Create route parameter extraction hook `useResourceParams` in `src/hooks/`
- [x] **SR4** - Ensure routes work with HashRouter (required for GitHub Pages)
- [x] **SR5** - Handle invalid routes gracefully (404-style page or redirect to main view)
- [x] **SR6** - Test: direct URL access loads correct resource page

### Node Detail Page

- [x] **SR7** - Create `NodeDetailPage` component in `src/pages/`
- [x] **SR8** - Load dataset and find node by ID from route params
- [x] **SR9** - Display node information using same fields as `NodeInfobox`
- [x] **SR10** - Style page consistently with main application
- [x] **SR11** - Add "View in Graph" button linking to `/#/?dataset={id}&selected={nodeId}&type=node`
- [x] **SR12** - Add breadcrumb navigation: `{Dataset Name} > {Node Type} > {Node Title}`
- [x] **SR13** - Handle loading state while dataset fetches
- [x] **SR14** - Handle error state if node ID not found in dataset

### Edge Detail Page

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

### Permalink & Share UI (InfoboxPanel Integration)

- [x] **SR25** - Create `ShareButtons` component with Permalink and Share buttons
- [x] **SR26** - Implement "Permalink" button that copies stable URL to clipboard
- [x] **SR27** - Implement "Share" button using Web Share API (with fallback to copy)
- [x] **SR28** - Add visual feedback on successful copy ("Copied!" text with checkmark)
- [x] **SR29** - Generate correct stable URL based on selected item type
- [x] **SR30** - Integrate `ShareButtons` into `InfoboxPanel` component (shared by Node/Edge)
- [x] **SR31** - Style buttons to match existing infobox aesthetic
- [x] **SR32** - Test: clicking Permalink copies correct URL for both nodes and edges

### Meta Tags (SEO & Social Sharing)

- [x] **SR33** - Install `react-helmet-async` for dynamic meta tag management
- [x] **SR34** - Create `ResourceMeta` component for setting page-specific meta tags
- [x] **SR35** - Set dynamic `<title>` tag: `{Item Title} | {Dataset Name} | Scenius`
- [x] **SR36** - Set `<meta name="description">` from node/edge short description
- [x] **SR37** - Set Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`
- [x] **SR38** - Set `og:image` to node image if available, otherwise default app image
- [x] **SR39** - Apply `ResourceMeta` to both `NodeDetailPage` and `EdgeDetailPage`
- [x] **SR40** - Document meta tag limitations for pure client-side SPA in code comments

### Navigation & UX

- [x] **SR41** - Ensure browser back button works correctly from detail pages
- [x] **SR42** - Add link from detail pages back to dataset (via breadcrumb)
- [x] **SR43** - Test: navigating between detail pages updates URL correctly

### Testing & Verification

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

- [ ] **MB1** - Create `MobileMenu` component (slide-in drawer from right)
  - Full-height overlay with semi-transparent backdrop
  - Contains: Dataset selector, Layout switcher, Theme toggle
  - Close on backdrop tap or explicit close button
- [ ] **MB2** - Create `HamburgerButton` component (44×44px touch target)
  - Three-line icon, transforms to X when menu open
  - Visible only on mobile (< 640px)
- [ ] **MB3** - Create `useMediaQuery` hook or CSS-based responsive logic
  - Return boolean for mobile breakpoint
  - Consider using `window.matchMedia` for JS approach
- [ ] **MB4** - Update `Header.tsx` to conditionally render mobile vs desktop layout
  - Desktop (≥ 640px): Current layout with all controls inline
  - Mobile (< 640px): Logo, search icon, hamburger button only
- [ ] **MB5** - Make search collapsible on mobile
  - Default: Show search icon only
  - Tap: Expand to full search input (overlay or inline)
  - Blur or submit: Collapse back to icon
- [ ] **MB6** - Style mobile menu with theme support (light/dark)
- [ ] **MB7** - Add slide-in animation for menu (transform + opacity)
- [ ] **MB8** - Ensure menu is keyboard accessible (focus trap when open, Escape to close)
- [ ] **MB9** - Test header at 375px, 390px, 430px widths (common iPhone sizes)

### 2. Safe Area Insets for iPhone (HIGH)

**Intent**: Prevent content from being clipped by iPhone notch, Dynamic Island, and home indicator. Essential for landscape orientation and newer devices.

- [ ] **MB10** - Add `viewport-fit=cover` to viewport meta tag in `index.html`
- [ ] **MB11** - Define CSS custom properties for safe area insets in `index.css`:
  ```css
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-left: env(safe-area-inset-left, 0px);
  --safe-area-right: env(safe-area-inset-right, 0px);
  ```
- [ ] **MB12** - Apply safe area padding to Header component on mobile
- [ ] **MB13** - Apply safe area padding to bottom sheet / action bar (MB18-MB27)
- [ ] **MB14** - Apply safe area padding to MobileMenu component
- [ ] **MB15** - Test in iPhone simulator with notch (iPhone 14 Pro) and Dynamic Island
- [ ] **MB16** - Test in landscape orientation for left/right safe areas

### 3. Touch-Friendly Target Sizes (HIGH)

**Intent**: Meet Apple's 44×44pt minimum touch target recommendation. Audit all interactive elements and increase sizes for mobile.

- [ ] **MB17** - Audit all interactive elements and document current sizes
  - Buttons, icons, form inputs, close buttons, etc.
- [ ] **MB18** - Update `InfoboxPanel` close button: 32px → 44px (mobile only)
- [ ] **MB19** - Update `FilterPanel` toggle button to 44px minimum
- [ ] **MB20** - Update `SearchBox` clear button to 44px minimum
- [ ] **MB21** - Update `ThemeToggle` button to 44px minimum
- [ ] **MB22** - Update `LayoutSwitcher` tab buttons to 44px height minimum
- [ ] **MB23** - Update graph/timeline zoom control buttons to 44px minimum
- [ ] **MB24** - Update `DatasetSelector` trigger button height to 44px
- [ ] **MB25** - Add mobile-specific CSS media query block for touch target overrides
- [ ] **MB26** - Verify padding/spacing adjustments maintain visual balance
- [ ] **MB27** - Test with touch input on actual device (not just mouse in dev tools)

### 4. Bottom Sheet InfoboxPanel (MEDIUM)

**Intent**: Replace fixed-height stacked panel with draggable bottom sheet. Allows users to maximize graph area when browsing, then expand details on demand.

- [ ] **MB28** - Create `BottomSheet` component (reusable base component)
  - Props: `isOpen`, `onClose`, `snapPoints` (array of heights), `children`
  - Drag handle indicator at top
  - Touch gesture handling for swipe up/down
- [ ] **MB29** - Implement snap point logic (hidden → peek → expanded)
  - Peek: ~100px showing title bar
  - Expanded: ~60% of viewport height
  - Hidden: Off-screen
- [ ] **MB30** - Implement drag gesture recognition
  - Use `touchstart`, `touchmove`, `touchend` events
  - Calculate velocity for momentum-based snapping
  - Prevent scroll conflict when dragging sheet
- [ ] **MB31** - Add smooth animation between snap points (CSS transition or spring)
- [ ] **MB32** - Create `MobileInfoboxPanel` wrapper that uses BottomSheet
  - Render existing `NodeInfobox`/`EdgeInfobox` content inside
  - Show drag handle and title in peek state
- [ ] **MB33** - Integrate with selection state from `useGraph`
  - No selection → sheet hidden
  - Selection made → sheet opens to peek
  - Clear selection → sheet hides
- [ ] **MB34** - Add close button in sheet header (alternative to swipe-to-dismiss)
- [ ] **MB35** - Update `MainLayout.tsx` to use `MobileInfoboxPanel` on mobile
  - Conditionally render based on viewport width
  - Desktop: Keep current side panel behavior
- [ ] **MB36** - Handle scroll within expanded sheet content
  - Internal scroll when content overflows
  - Drag gesture should not interfere with content scroll
- [ ] **MB37** - Test sheet behavior with various node types (short vs long content)
- [ ] **MB38** - Test sheet with edge selection (different content structure)

### 5. Filter Drawer Pattern (MEDIUM)

**Intent**: Replace floating FilterPanel overlay with slide-in drawer on mobile. Provides cleaner separation between filter UI and graph visualization.

- [ ] **MB39** - Create `Drawer` component (slide from left variant of overlay pattern)
  - Props: `isOpen`, `onClose`, `side` ('left' | 'right'), `children`
  - Semi-transparent backdrop
  - Slide animation
- [ ] **MB40** - Update `FilterPanel` to support drawer mode on mobile
  - Wrap content in Drawer component when mobile
  - Keep floating behavior on desktop (≥ 768px)
- [ ] **MB41** - Add filter toggle button to mobile header or as FAB
  - Icon: filter/funnel icon
  - Badge indicator when filters are active
- [ ] **MB42** - Implement swipe-to-close gesture for drawer
- [ ] **MB43** - Add prominent "Clear Filters" button in drawer footer
- [ ] **MB44** - Show active filter count in toggle button badge
- [ ] **MB45** - Ensure backdrop click closes drawer
- [ ] **MB46** - Test filter drawer with all filter types (date range, node types, text)
- [ ] **MB47** - Test drawer behavior in landscape orientation

### 6. Additional Mobile Optimizations

- [ ] **MB48** - Update `#root` to use `100dvh` (dynamic viewport height) for iOS Safari
  ```css
  #root { height: 100dvh; }
  @supports not (height: 100dvh) { #root { height: 100vh; } }
  ```
- [ ] **MB49** - Add `-webkit-tap-highlight-color: transparent` to remove tap highlight
- [ ] **MB50** - Add `touch-action: manipulation` to prevent double-tap zoom on buttons
- [ ] **MB51** - Review and adjust font sizes for mobile readability

### 7. Testing & Verification

- [ ] **MB52** - Test on iPhone SE (375×667) - smallest common phone
- [ ] **MB53** - Test on iPhone 14 Pro (393×852) - standard iPhone
- [ ] **MB54** - Test on iPhone 14 Pro Max (430×932) - large phone
- [ ] **MB55** - Test on iPad Mini portrait (768×1024)
- [ ] **MB56** - Test on iPad Pro landscape (1194×834)
- [ ] **MB57** - Test all interactive elements with touch input
- [ ] **MB58** - Verify no horizontal scroll on any mobile viewport
- [ ] **MB59** - Test orientation changes (portrait ↔ landscape)
- [ ] **MB60** - Verify graph zoom/pan works with touch gestures
- [ ] **MB61** - Verify timeline zoom/pan works with touch gestures
- [ ] **MB62** - Build passes with no errors
- [ ] **MB63** - No linter warnings in new/modified files
- [ ] **MB64** - Update CHANGELOG.md with M18 completion notes

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
