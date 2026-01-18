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
