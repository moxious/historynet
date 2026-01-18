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
- `docs/MVP_HISTORY.md` - Archived M1-M8 task lists and completion notes

---

## Completed Milestones (M1-M8)

All MVP and initial post-MVP milestones are complete. See `docs/MVP_HISTORY.md` for detailed task lists and completion notes.

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

- [ ] **V1** - Dataset loading: Test all 4 datasets load correctly, verify manifest metadata displays
- [ ] **V2** - Graph view: Test force-directed layout renders, zoom/pan works, node shapes correct
- [ ] **V3** - Timeline view: Test vertical timeline renders, date positioning, layout switching
- [ ] **V4** - Node selection: Test clicking nodes opens infobox, displays all fields correctly
- [ ] **V5** - Edge selection: Test clicking edges opens infobox, evidence displays, links work
- [ ] **V6** - Filtering: Test date range and text filters, verify counts update, URL sync
- [ ] **V7** - Search: Test search highlighting, keyboard shortcut (Cmd/Ctrl+K), clear behavior
- [ ] **V8** - URL state: Test deep linking - copy URL with filters/selection, paste in new tab
- [ ] **V9** - Keyboard nav: Test Escape to close infobox, tab navigation, focus indicators
- [ ] **V10** - Responsive: Test on narrow viewport (mobile simulation)

### Code Review

- [ ] **R1** - Components: Each component has single responsibility, props are well-typed
- [ ] **R2** - Hooks: Custom hooks are reusable, don't mix concerns (data vs UI)
- [ ] **R3** - Context: GraphContext scope - is it too large? Should it be split?
- [ ] **R4** - Types: Type coverage, discriminated unions used correctly, no `any`
- [ ] **R5** - Layouts: Layout interface is clean, both implementations are consistent
- [ ] **R6** - Utils: Pure functions, testable, no side effects
- [ ] **R7** - Styling: CSS organization, no inline styles, consistent patterns
- [ ] **R8** - Dependencies: Review for unnecessary deps, check bundle impact

### Documentation Review

- [ ] **D1** - Verify README is accurate and helpful for new contributors
- [ ] **D2** - Ensure GRAPH_SCHEMA.md matches actual dataset structures
- [ ] **D3** - Check inline code comments for accuracy

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

### M10 Notes

```
[2026-01-18] UX13 DECIDED: Option A - Keep both search (highlight) and filter (hide) 
behaviors. User requested adding tooltips and visual indicators to clarify the 
difference between the two features:
  - Header SearchBox: highlights matching nodes, keeps all visible
  - FilterPanel Name: filters out (hides) non-matching nodes
```

---

## Blocked Tasks

_Move tasks here if they are blocked, with explanation._

None currently.
