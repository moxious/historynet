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

## M10: User-Prompted UX Improvements

**Goal**: Improve application responsiveness and usability based on user feedback. Focus on reducing UI jitter, simplifying labels, and refining panel visibility behavior.

### Debounce Implementation

- [ ] **UX1** - Create a reusable `useDebounce` hook in `src/hooks/` for debounced state updates
- [ ] **UX2** - Add debounce to FilterPanel name filter input (300-500ms delay before applying filter)
- [ ] **UX3** - Add debounce to FilterPanel relationship filter input (300-500ms delay)
- [ ] **UX4** - Add debounce to Header SearchBox input for search highlighting
- [ ] **UX5** - Test debounce behavior: verify smooth typing without jitter, filters apply after pause

### Label Simplification

- [ ] **UX6** - Change FilterPanel "Filter by Name" label to "Name"
- [ ] **UX7** - Change FilterPanel "Filter by Relationship" label to "Relationship"
- [ ] **UX8** - Add "Dataset:" label prefix to DatasetSelector in Header

### InfoboxPanel Visibility

- [ ] **UX9** - Modify InfoboxPanel to return `null` when no item is selected (hide completely)
- [ ] **UX10** - Update parent layout (App.tsx or MainLayout) to handle conditional InfoboxPanel rendering gracefully
- [ ] **UX11** - Ensure CSS layout doesn't shift awkwardly when InfoboxPanel appears/disappears
- [ ] **UX12** - Test: clicking X hides panel entirely; selecting node shows panel; Escape hides panel

### Search vs Filter Clarification (Decision: Keep Both)

- [x] **UX13** - DECISION: Keep both Header search (highlighting) and FilterPanel name filter (filtering) - Option A chosen
- [ ] **UX14** - Add tooltip to Header SearchBox explaining "Highlights matching nodes without hiding others"
- [ ] **UX15** - Add tooltip to FilterPanel Name field explaining "Hides nodes that don't match"
- [ ] **UX16** - Add visual indicator (e.g., icon or subtle label) distinguishing "Highlight" from "Filter" behavior
- [ ] **UX17** - Update placeholder text: SearchBox → "Highlight nodes..." / FilterPanel → "Filter by name..."

### Graph Interaction Improvements

- [ ] **UX20** - Prevent graph from re-laying out when clicking on an edge (preserve positions)
- [ ] **UX21** - Set graph visualization as the default layout instead of timeline

### Edge Infobox Improvements

- [ ] **UX22** - Color-code the left border of source/target node boxes in edge infobox based on node type
- [ ] **UX23** - Remove redundant type labels (e.g., "PERSON") from edge infobox node display
- [ ] **UX24** - Format edge description as natural sentence: "{source name} {relationship} {target name}"

### Filter Panel Collapsibility

- [ ] **UX25** - Make the Filters panel collapsible/expandable
- [ ] **UX26** - Set Filters panel to collapsed state by default
- [ ] **UX27** - Add visual indicator (chevron/arrow) showing expand/collapse state

### Code Quality (from M9 Review)

- [ ] **CQ1** - Extract `getNodeColor` and `getEdgeColor` from ForceGraphLayout.tsx and TimelineLayout.tsx to `src/utils/graphColors.ts`
- [ ] **CQ2** - Remove duplicate `parseYear` from TimelineLayout.tsx (use existing one from `filterGraph.ts`)
- [ ] **CQ3** - Move `@types/d3` from dependencies to devDependencies in package.json

### Final Verification

- [ ] **UX18** - Test all changes in production URL (GitHub Pages)
- [ ] **UX19** - Verify URL state sync still works correctly with debounced inputs

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
```

---

## Blocked Tasks

_Move tasks here if they are blocked, with explanation._

None currently.
