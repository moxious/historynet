# M11: Graph Interaction Polish

**Status**: ✅ Complete (2026-01-18)
**Track**: Post-MVP Polish
**Depends on**: M10 (UX Improvements)

## Goal

Refine graph component behavior and discoverability based on user testing feedback. Focus on interaction predictability, physics tuning, and UX clarity.

## Tasks

### Node Click Behavior (No Re-layout)

- [x] **GI1** - Identify where node clicks trigger force simulation restart in `ForceGraphLayout.tsx`
- [x] **GI2** - Modify node click handler to update selection state without calling `simulation.alpha().restart()`
- [x] **GI3** - Ensure clicked node's position is preserved (no centering or re-positioning)
- [x] **GI4** - Test: clicking through multiple nodes should not move any nodes; only infobox updates
- [x] **GI5** - Test: graph should still re-layout appropriately when dataset changes or filters apply

### Physics Tuning (Reduced Gravity)

- [x] **GI6** - Review current D3 force simulation parameters (gravity, charge, link distance, etc.)
- [x] **GI7** - Reduce `forceCenter` strength or add bounding constraints to keep disconnected nodes closer
- [x] **GI8** - Tune `forceManyBody` (charge) to reduce repulsion for weakly-connected nodes
- [x] **GI9** - Consider adding a soft boundary force to prevent nodes from drifting too far from center
- [x] **GI10** - Test with Rosicrucian dataset (has some disconnected subgraphs)
- [x] **GI11** - Test with Disney dataset (relatively connected) to ensure no over-clustering

### Interaction Discoverability (Zoom/Pan Hint)

- [x] **GI12** - Design subtle visual indicator for zoom/pan capability (icon + text or tooltip)
- [x] **GI13** - Add hint element near or below the Graph/Timeline view picker in the UI
- [x] **GI14** - Suggested text: "Scroll to zoom • Drag to pan" or similar
- [x] **GI15** - Style hint to be unobtrusive (muted color, small text) but noticeable on first use
- [x] **GI16** - Consider: hide hint after first user interaction (optional, nice-to-have) - SKIPPED (not necessary)

### Infobox Simplification (Hide ID Field)

- [x] **GI17** - Remove ID field display from `NodeInfobox.tsx` component
- [x] **GI18** - Remove ID field display from `EdgeInfobox.tsx` component (if shown there)
- [x] **GI19** - Verify ID is still used internally for selection/URL state (do not remove from data model)
- [x] **GI20** - Test: infobox shows all relevant fields except ID for all node types

### Final Verification

- [x] **GI21** - Build passes with no errors or linter warnings
- [x] **GI22** - Test all changes on production URL after deployment
- [x] **GI23** - Update CHANGELOG.md with M11 completion notes

## Completion Notes

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
