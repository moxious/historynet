# M14: Timeline Improvements

**Status**: ✅ Complete (2026-01-18)
**Track**: Post-MVP Polish
**Depends on**: M13 (Scenius Rebrand)

## Goal

Address usability issues with the timeline visualization based on user testing feedback. Focus on positioning, readability, initial zoom, temporal gaps, legend consistency, and infobox behavior parity.

## Tasks

### Layout & Positioning (Filter Panel Overlap)

- [x] **TL1** - Identify CSS causing timeline to be hard-aligned left in `TimelineLayout.tsx` / `TimelineLayout.css`
- [x] **TL2** - Adjust timeline container positioning to respect filter panel width when open
- [x] **TL3** - Test timeline visibility with filter panel expanded vs collapsed
- [x] **TL4** - Ensure timeline uses same layout constraints as graph view (MainLayout integration)
- [x] **TL5** - Test: switching between graph and timeline should not cause content to jump behind filter panel

### Year Label Readability

- [x] **TL6** - Locate year label rendering code in `TimelineLayout.tsx`
- [x] **TL7** - Increase font size of year axis labels (suggest 14-16px minimum)
- [x] **TL8** - Consider increasing font weight for improved contrast
- [x] **TL9** - Test year label readability at default zoom level (should be readable without zooming)
- [x] **TL10** - Ensure label sizing works across different viewport sizes

### Initial Zoom & Focus

- [x] **TL11** - Review current initial zoom/transform calculation in `TimelineLayout.tsx`
- [x] **TL12** - Adjust default zoom level so nodes are clearly visible on load
- [x] **TL13** - Calculate initial view to focus on the first chronological item
- [x] **TL14** - Consider "fit to content" initial view that shows all or most nodes
- [x] **TL15** - Test: timeline should show meaningful content immediately without user interaction

### Timeline Gap Handling - Framework Research

- [x] **TL16** - Document current D3 implementation approach for vertical timeline
- [x] **TL17** - Research alternative timeline libraries: vis-timeline, react-chrono, TimelineJS, etc.
- [x] **TL18** - Evaluate alternatives against requirements: vertical orientation, zoom/pan, node display, customization
- [x] **TL19** - Document pros/cons of alternatives vs staying with D3
- [x] **TL20** - Make go/no-go decision on framework change (document in Notes section)

### Timeline Gap Handling - D3 Implementation (Deferred)

- [ ] **TL21** - Analyze dataset to identify gaps (periods with no events for N+ years)
- [ ] **TL22** - Design discontinuity visualization (e.g., jagged break line, "// 75 years //" label)
- [ ] **TL23** - Implement timeline scale that collapses empty periods while preserving relative positioning
- [ ] **TL24** - Add visual indicator at each discontinuity showing years skipped
- [ ] **TL25** - Ensure node positions remain accurate relative to their actual dates
- [ ] **TL26** - Test with Enlightenment dataset (likely has significant gaps)
- [ ] **TL27** - Test with Disney dataset (may have fewer gaps)

### Legend Consistency with Graph

- [x] **TL28** - Audit current timeline legend implementation (birth/death/lifespan)
- [x] **TL29** - Remove birth/death/lifespan legend items from timeline view
- [x] **TL30** - Implement node-type legend matching graph view (Person, Object, Entity, Event)
- [x] **TL31** - Ensure legend uses same colors from `graphColors.ts` as graph legend
- [x] **TL32** - Ensure legend uses same shapes as graph legend (if shapes are shown)
- [x] **TL33** - Verify timeline node rendering uses `getNodeColor()` from shared utils
- [x] **TL34** - Test: node colors in timeline should visually match same nodes in graph view

### Infobox Behavior Parity

- [x] **TL35** - Audit `TimelineLayout.tsx` integration with InfoboxPanel
- [x] **TL36** - Verify timeline uses the same `InfoboxPanel` component as graph (not a separate implementation)
- [x] **TL37** - Trace node click handler to ensure it updates shared selection state
- [x] **TL38** - Verify infobox hides completely when no item selected (should return `null`, not placeholder)
- [x] **TL39** - Test: clicking node on timeline opens infobox with correct details
- [x] **TL40** - Test: pressing Escape or clicking X hides infobox in timeline view
- [x] **TL41** - Test: switching from timeline to graph with selection should preserve infobox state

### Final Verification

- [x] **TL42** - Build passes with no errors or linter warnings
- [x] **TL45** - Update CHANGELOG.md with M14 completion notes

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Gap collapse | Deferred | Complex implementation, datasets don't currently require it |
| Framework | Stay with D3 | Full control, consistent with graph, no new dependencies |
| Legend | Match graph view | Consistency helps users understand node types |

## Research Notes: Framework Evaluation

**Alternatives evaluated:**
- **vis-timeline**: Good for horizontal timelines, poor vertical support
- **react-chrono**: Vertical support but limited zoom/pan, opinionated styling
- **TimelineJS**: Story-focused, not suitable for data exploration
- **@nivo/timeline**: Limited to horizontal orientation

**D3 advantages for our use case:**
- Full control over layout and positioning
- Excellent zoom/pan support with d3-zoom
- Consistent with ForceGraphLayout implementation
- No additional dependencies

**Decision**: STAY WITH D3, defer gap collapse feature to future milestone when datasets with significant gaps require it.

## Completion Notes

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
