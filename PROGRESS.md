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

## Completed Milestones (M1-M8)

All MVP and initial post-MVP milestones are complete. See `HISTORY.md` for detailed task lists and completion notes.

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

**Key decisions made during MVP:**
- React Context for state management (sufficient for app scale)
- HashRouter for GitHub Pages compatibility
- D3 for both graph and timeline layouts
- URL-first state for deep linking and sharing
- Evidence required on all edges per GRAPH_SCHEMA.md

---

## M9: Application Verification

**Goal**: Systematic verification that all shipped features work correctly, paired with a principal-level code review ensuring the codebase is well-structured for continued evolution.

### Feature Verification

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

### Code Review

- [x] **R1** - Components: ✅ Good - single responsibility, well-typed props, clean separation (NodeInfobox, EdgeInfobox, etc.)
- [x] **R2** - Hooks: ✅ Good - reusable hooks, clean separation of concerns (useUrlState, useFilters, useGraphData, etc.)
- [x] **R3** - Context: ⚠️ GraphContext (280 lines) is large but manageable for current app scale. Consider splitting if app grows.
- [x] **R4** - Types: ✅ Excellent - well-organized exports from index.ts, type guards provided, no `any` types found.
- [x] **R5** - Layouts: ⚠️ Both layouts are consistent but have code duplication (getNodeColor, getEdgeColor, parseYear). Could extract to shared utils.
- [x] **R6** - Utils: ✅ Pure functions, testable, no side effects. filterGraph.ts is well-structured.
- [x] **R7** - Styling: ✅ CSS organization good, BEM-style naming (e.g., `.force-graph-layout__controls`), no inline styles.
- [x] **R8** - Dependencies: ✅ Minimal deps (react, d3, react-router-dom). Note: @types/d3 should be in devDependencies.

### Documentation Review

- [x] **D1** - README: ✅ Accurate and helpful. **FIX APPLIED**: Corrected reference from MILESTONES.md to ROADMAP.md.
- [x] **D2** - GRAPH_SCHEMA.md: ✅ Comprehensive and matches actual dataset structures.
- [x] **D3** - Inline comments: ✅ Good JSDoc comments throughout, component purpose documented.

---

## M10: User-Prompted UX Improvements ✅

**Goal**: Improve application responsiveness and usability based on user feedback. Focus on reducing UI jitter, simplifying labels, and refining panel visibility behavior.

### Debounce Implementation

- [x] **UX1** - Create a reusable `useDebounce` hook in `src/hooks/` for debounced state updates
- [x] **UX2** - Add debounce to FilterPanel name filter input (300-500ms delay before applying filter)
- [x] **UX3** - Add debounce to FilterPanel relationship filter input (300-500ms delay)
- [x] **UX4** - Add debounce to Header SearchBox input for search highlighting
- [x] **UX5** - Test debounce behavior: verify smooth typing without jitter, filters apply after pause

### Label Simplification

- [x] **UX6** - Change FilterPanel "Filter by Name" label to "Name"
- [x] **UX7** - Change FilterPanel "Filter by Relationship" label to "Relationship"
- [x] **UX8** - Add "Dataset:" label prefix to DatasetSelector in Header

### InfoboxPanel Visibility

- [x] **UX9** - Modify InfoboxPanel to return `null` when no item is selected (hide completely)
- [x] **UX10** - Update parent layout (App.tsx or MainLayout) to handle conditional InfoboxPanel rendering gracefully
- [x] **UX11** - Ensure CSS layout doesn't shift awkwardly when InfoboxPanel appears/disappears
- [x] **UX12** - Test: clicking X hides panel entirely; selecting node shows panel; Escape hides panel

### Search vs Filter Clarification (Decision: Keep Both)

- [x] **UX13** - DECISION: Keep both Header search (highlighting) and FilterPanel name filter (filtering) - Option A chosen
- [x] **UX14** - Add tooltip to Header SearchBox explaining "Highlights matching nodes without hiding others"
- [x] **UX15** - Add tooltip to FilterPanel Name field explaining "Hides nodes that don't match"
- [x] **UX16** - Add visual indicator (e.g., icon or subtle label) distinguishing "Highlight" from "Filter" behavior
- [x] **UX17** - Update placeholder text: SearchBox → "Highlight nodes..." / FilterPanel → "Filter by name..."

### Graph Interaction Improvements

- [x] **UX20** - Prevent graph from re-laying out when clicking on an edge (preserve positions)
- [x] **UX21** - Set graph visualization as the default layout instead of timeline (already default)

### Edge Infobox Improvements

- [x] **UX22** - Color-code the left border of source/target node boxes in edge infobox based on node type
- [x] **UX23** - Remove redundant type labels (e.g., "PERSON") from edge infobox node display
- [x] **UX24** - Format edge description as natural sentence: "{source name} {relationship} {target name}"

### Filter Panel Collapsibility

- [x] **UX25** - Make the Filters panel collapsible/expandable (already supported)
- [x] **UX26** - Set Filters panel to collapsed state by default
- [x] **UX27** - Add visual indicator (chevron/arrow) showing expand/collapse state

### Code Quality (from M9 Review)

- [x] **CQ1** - Extract `getNodeColor` and `getEdgeColor` from ForceGraphLayout.tsx and TimelineLayout.tsx to `src/utils/graphColors.ts`
- [x] **CQ2** - Remove duplicate `parseYear` from TimelineLayout.tsx (use existing one from `filterGraph.ts`)
- [x] **CQ3** - Move `@types/d3` from dependencies to devDependencies in package.json

### Final Verification

- [x] **UX18** - Build passes with no errors
- [x] **UX19** - Verify URL state sync still works correctly with debounced inputs (implementation preserves URL sync)

---

## M11: Graph Interaction Polish

**Goal**: Refine graph component behavior and discoverability based on user testing feedback. Focus on interaction predictability, physics tuning, and UX clarity.

### Node Click Behavior (No Re-layout)

- [ ] **GI1** - Identify where node clicks trigger force simulation restart in `ForceGraphLayout.tsx`
- [ ] **GI2** - Modify node click handler to update selection state without calling `simulation.alpha().restart()`
- [ ] **GI3** - Ensure clicked node's position is preserved (no centering or re-positioning)
- [ ] **GI4** - Test: clicking through multiple nodes should not move any nodes; only infobox updates
- [ ] **GI5** - Test: graph should still re-layout appropriately when dataset changes or filters apply

### Physics Tuning (Reduced Gravity)

- [ ] **GI6** - Review current D3 force simulation parameters (gravity, charge, link distance, etc.)
- [ ] **GI7** - Reduce `forceCenter` strength or add bounding constraints to keep disconnected nodes closer
- [ ] **GI8** - Tune `forceManyBody` (charge) to reduce repulsion for weakly-connected nodes
- [ ] **GI9** - Consider adding a soft boundary force to prevent nodes from drifting too far from center
- [ ] **GI10** - Test with Rosicrucian dataset (has some disconnected subgraphs)
- [ ] **GI11** - Test with Disney dataset (relatively connected) to ensure no over-clustering

### Interaction Discoverability (Zoom/Pan Hint)

- [ ] **GI12** - Design subtle visual indicator for zoom/pan capability (icon + text or tooltip)
- [ ] **GI13** - Add hint element near or below the Graph/Timeline view picker in the UI
- [ ] **GI14** - Suggested text: "Scroll to zoom • Drag to pan" or similar
- [ ] **GI15** - Style hint to be unobtrusive (muted color, small text) but noticeable on first use
- [ ] **GI16** - Consider: hide hint after first user interaction (optional, nice-to-have)

### Infobox Simplification (Hide ID Field)

- [ ] **GI17** - Remove ID field display from `NodeInfobox.tsx` component
- [ ] **GI18** - Remove ID field display from `EdgeInfobox.tsx` component (if shown there)
- [ ] **GI19** - Verify ID is still used internally for selection/URL state (do not remove from data model)
- [ ] **GI20** - Test: infobox shows all relevant fields except ID for all node types

### Final Verification

- [ ] **GI21** - Build passes with no errors or linter warnings
- [ ] **GI22** - Test all changes on production URL after deployment
- [ ] **GI23** - Update CHANGELOG.md with M11 completion notes

---

## M12: User Feedback

**Goal**: Enable users to submit feedback about graph data without requiring a GitHub account. Migrate to Vercel for serverless function support.

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

## M13: Scenius Rebrand & Theme System

**Goal**: Rebrand the application from "HistoryNet" to "Scenius" (Brian Eno's concept of collective creative intelligence) and introduce a light/dark theme system with URL persistence.

**Context**: The scenius concept—that creative breakthroughs emerge from communities rather than lone geniuses—perfectly describes what this application visualizes: networks of influence, collaboration, and creative exchange between historical figures.

### Application Rebrand

- [ ] **SC1** - Update `<title>` in `index.html` from "HistoryNet" to "Scenius"
- [ ] **SC2** - Update HTML meta tags: description, og:title, og:description
- [ ] **SC3** - Update Header component to display "Scenius" branding
- [ ] **SC4** - Add tagline/subtitle to Header (e.g., "Mapping collective genius" or "Visualizing creative communities")
- [ ] **SC5** - Update README.md: rename application, explain scenius concept
- [ ] **SC6** - Update AGENTS.md: replace HistoryNet references with Scenius
- [ ] **SC7** - Update PRD.md: reflect new branding
- [ ] **SC8** - Update any other documentation files with new name

### Favicon Design & Implementation

- [ ] **SC9** - Design favicon concept: interconnected nodes forming brain/lightbulb shape
- [ ] **SC10** - Create favicon in multiple sizes: 16x16, 32x32, 48x48, 192x192, 512x512
- [ ] **SC11** - Generate favicon.ico (multi-resolution)
- [ ] **SC12** - Create apple-touch-icon.png (180x180)
- [ ] **SC13** - Update `index.html` with favicon link tags
- [ ] **SC14** - Consider: separate favicons for light/dark browser themes (optional)

### Theme System Architecture

- [ ] **TH1** - Create `ThemeContext` in `src/contexts/ThemeContext.tsx`
- [ ] **TH2** - Define theme types: `'light' | 'dark'` in `src/types/`
- [ ] **TH3** - Implement `useTheme` hook for accessing theme state
- [ ] **TH4** - Add `theme` parameter to URL scheme (extend `useUrlState` hook)
- [ ] **TH5** - Ensure theme syncs bidirectionally with URL (like dataset, filters, selection)
- [ ] **TH6** - Set light mode as default when no theme param in URL
- [ ] **TH7** - Persist theme preference in localStorage as fallback/default
- [ ] **TH8** - Wrap App component with ThemeProvider

### Theme Switcher UI

- [ ] **TH9** - Create `ThemeToggle` component in `src/components/`
- [ ] **TH10** - Design toggle with sun/moon icons (or light/dark metaphor)
- [ ] **TH11** - Add ThemeToggle to Header, positioned near dataset selector
- [ ] **TH12** - Implement keyboard accessibility (Enter/Space to toggle)
- [ ] **TH13** - Add ARIA labels for screen readers
- [ ] **TH14** - Style toggle to match existing UI aesthetic

### CSS Custom Properties (Theme Variables)

- [ ] **TH15** - Define light mode CSS custom properties in `:root` or `[data-theme="light"]`
  - Background colors (page, panels, cards)
  - Text colors (primary, secondary, muted)
  - Border colors
  - Accent/link colors
  - Shadow colors
- [ ] **TH16** - Define dark mode CSS custom properties in `[data-theme="dark"]`
- [ ] **TH17** - Ensure sufficient contrast ratios (WCAG AA: 4.5:1 for text)

### Component CSS Updates

- [ ] **TH18** - Update `App.css` to use theme variables
- [ ] **TH19** - Update `Header.css` to use theme variables
- [ ] **TH20** - Update `FilterPanel.css` to use theme variables
- [ ] **TH21** - Update `InfoboxPanel.css` to use theme variables
- [ ] **TH22** - Update `SearchBox.css` to use theme variables
- [ ] **TH23** - Update `MainLayout.css` to use theme variables
- [ ] **TH24** - Update any other component CSS files

### Visualization Theme Support

- [ ] **TH25** - Update `ForceGraphLayout.tsx` colors to respect theme (or ensure visibility in both)
- [ ] **TH26** - Update `TimelineLayout.tsx` colors to respect theme
- [ ] **TH27** - Update `graphColors.ts` to support theme-aware colors (if needed)
- [ ] **TH28** - Test graph node/edge visibility in both light and dark modes
- [ ] **TH29** - Test timeline readability in both modes

### Integration & Testing

- [ ] **TH30** - Test URL shareability: `?theme=dark` should load dark mode
- [ ] **TH31** - Test combined URL params: `?dataset=disney&theme=dark&selected=...`
- [ ] **TH32** - Test theme toggle updates URL without page reload
- [ ] **TH33** - Test browser back/forward navigation with theme changes
- [ ] **TH34** - Test localStorage fallback when URL has no theme param
- [ ] **TH35** - Verify no flash of wrong theme on page load (avoid FOUC)

### Final Verification

- [ ] **SC15** - Build passes with no errors
- [ ] **SC16** - All linter warnings resolved
- [ ] **SC17** - Test on production URL after deployment
- [ ] **SC18** - Update CHANGELOG.md with M13 completion notes

---

## M14: Timeline Improvements

**Goal**: Address usability issues with the timeline visualization based on user testing feedback. Focus on positioning, readability, initial zoom, temporal gaps, legend consistency, and infobox behavior parity.

**Context**: User testing revealed several friction points that make the timeline view less useful than the graph view for exploration.

### Layout & Positioning (Filter Panel Overlap)

- [ ] **TL1** - Identify CSS causing timeline to be hard-aligned left in `TimelineLayout.tsx` / `TimelineLayout.css`
- [ ] **TL2** - Adjust timeline container positioning to respect filter panel width when open
- [ ] **TL3** - Test timeline visibility with filter panel expanded vs collapsed
- [ ] **TL4** - Ensure timeline uses same layout constraints as graph view (MainLayout integration)
- [ ] **TL5** - Test: switching between graph and timeline should not cause content to jump behind filter panel

### Year Label Readability

- [ ] **TL6** - Locate year label rendering code in `TimelineLayout.tsx`
- [ ] **TL7** - Increase font size of year axis labels (suggest 14-16px minimum)
- [ ] **TL8** - Consider increasing font weight for improved contrast
- [ ] **TL9** - Test year label readability at default zoom level (should be readable without zooming)
- [ ] **TL10** - Ensure label sizing works across different viewport sizes

### Initial Zoom & Focus

- [ ] **TL11** - Review current initial zoom/transform calculation in `TimelineLayout.tsx`
- [ ] **TL12** - Adjust default zoom level so nodes are clearly visible on load
- [ ] **TL13** - Calculate initial view to focus on the first chronological item
- [ ] **TL14** - Consider "fit to content" initial view that shows all or most nodes
- [ ] **TL15** - Test: timeline should show meaningful content immediately without user interaction

### Timeline Gap Handling - Framework Research

- [ ] **TL16** - Document current D3 implementation approach for vertical timeline
- [ ] **TL17** - Research alternative timeline libraries: vis-timeline, react-chrono, TimelineJS, etc.
- [ ] **TL18** - Evaluate alternatives against requirements: vertical orientation, zoom/pan, node display, customization
- [ ] **TL19** - Document pros/cons of alternatives vs staying with D3
- [ ] **TL20** - Make go/no-go decision on framework change (document in Notes section)

### Timeline Gap Handling - D3 Implementation (if staying with D3)

- [ ] **TL21** - Analyze dataset to identify gaps (periods with no events for N+ years)
- [ ] **TL22** - Design discontinuity visualization (e.g., jagged break line, "// 75 years //" label)
- [ ] **TL23** - Implement timeline scale that collapses empty periods while preserving relative positioning
- [ ] **TL24** - Add visual indicator at each discontinuity showing years skipped
- [ ] **TL25** - Ensure node positions remain accurate relative to their actual dates
- [ ] **TL26** - Test with Enlightenment dataset (likely has significant gaps)
- [ ] **TL27** - Test with Disney dataset (may have fewer gaps)

### Legend Consistency with Graph

- [ ] **TL28** - Audit current timeline legend implementation (birth/death/lifespan)
- [ ] **TL29** - Remove birth/death/lifespan legend items from timeline view
- [ ] **TL30** - Implement node-type legend matching graph view (Person, Object, Entity, Event)
- [ ] **TL31** - Ensure legend uses same colors from `graphColors.ts` as graph legend
- [ ] **TL32** - Ensure legend uses same shapes as graph legend (if shapes are shown)
- [ ] **TL33** - Verify timeline node rendering uses `getNodeColor()` from shared utils
- [ ] **TL34** - Test: node colors in timeline should visually match same nodes in graph view

### Infobox Behavior Parity

- [ ] **TL35** - Audit `TimelineLayout.tsx` integration with InfoboxPanel
- [ ] **TL36** - Verify timeline uses the same `InfoboxPanel` component as graph (not a separate implementation)
- [ ] **TL37** - Trace node click handler to ensure it updates shared selection state
- [ ] **TL38** - Verify infobox hides completely when no item selected (should return `null`, not placeholder)
- [ ] **TL39** - Test: clicking node on timeline opens infobox with correct details
- [ ] **TL40** - Test: pressing Escape or clicking X hides infobox in timeline view
- [ ] **TL41** - Test: switching from timeline to graph with selection should preserve infobox state

### Final Verification

- [ ] **TL42** - Build passes with no errors or linter warnings
- [ ] **TL43** - Test all timeline changes on production URL after deployment
- [ ] **TL44** - Cross-browser testing (Chrome, Firefox, Safari)
- [ ] **TL45** - Update CHANGELOG.md with M14 completion notes

---

## Notes & Decisions

_Add notes about implementation decisions, blockers, or clarifications here._

### Note Format
```
[YYYY-MM-DD] @agent-name: Description of decision or finding
```

### M9 Notes

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
```

### M10 Notes

```
[2026-01-18] UX13 DECIDED: Option A - Keep both search (highlight) and filter (hide) 
behaviors. User requested adding tooltips and visual indicators to clarify the 
difference between the two features:
  - Header SearchBox: highlights matching nodes, keeps all visible
  - FilterPanel Name: filters out (hides) non-matching nodes

[2026-01-18] UX20-UX27 ADDED: User-prompted UX improvements:
  - UX20-21: Graph interaction (no re-layout on edge click, graph as default view)
  - UX22-24: Edge infobox improvements (color-coded borders, simplified labels)
  - UX25-27: Collapsible filter panel (collapsed by default)

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
```

---

## Blocked Tasks

_Move tasks here if they are blocked, with explanation._

None currently.
