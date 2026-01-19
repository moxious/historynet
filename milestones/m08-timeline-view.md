# M8: Timeline View

**Status**: ✅ Complete (2026-01-18)
**Track**: MVP (Core Application)
**Depends on**: M7 (Deployment)

## Goal

Create a vertical timeline visualization that positions nodes by date, with layout switching between graph and timeline views, URL persistence, and filter integration.

## Tasks

### Timeline Component
- [x] Create `src/layouts/TimelineLayout.tsx` component
- [x] Implement vertical time axis
- [x] Calculate node positions based on dates
- [x] Handle nodes without dates (separate section or hide)

### Timeline Rendering
- [x] Render time scale with year markers
- [x] Position nodes at their birth/dateStart position
- [x] Add death/dateEnd markers for persons
- [x] Render edges between positioned nodes
- [x] Handle overlapping nodes (spread horizontally)

### Timeline Interactions
- [x] Implement vertical scroll/zoom for time navigation
- [x] Implement horizontal pan for spread nodes
- [x] Add node click handling (same as graph view)
- [x] Add edge click handling (same as graph view)

### Layout Switching
- [x] Add layout toggle UI (tabs or buttons)
- [x] Implement layout switching logic
- [x] Preserve selection when switching layouts
- [x] Add layout choice to URL parameters

### Integration
- [x] Ensure filters apply to timeline view
- [x] Ensure search highlighting works in timeline
- [x] Test URL state includes layout choice

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Timeline orientation | Vertical | Natural reading direction for time |
| Undated nodes | Bottom section | Show all content, don't hide |
| Lane assignment | Greedy interval | Efficient overlap prevention |
| Year scale | MIN_YEAR_HEIGHT = 30px | Readable without excessive scrolling |

## Completion Notes

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
