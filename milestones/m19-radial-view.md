# M19: Radial/Ego-Network View

**Status**: ✅ Complete (2026-01-19)
**Track**: Post-MVP Polish
**Depends on**: M18 (Mobile Adaptation)

## Goal

Add a radial (ego-network) visualization that displays a selected node at the center with its direct connections arranged in a ring around it. Provides a focused view of a single node's relationships.

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Availability | Only when node selected | Radial requires a center node |
| Depth | 1 degree of separation | Direct connections only (ego network) |
| Filter application | Filters apply to all nodes | Consistent with other views |
| Node shapes/colors | Reuse existing | Visual consistency across views |

## Tasks

### Type System & Hook Updates

- [x] **RD1-RD4** - Extended `LayoutType` to include `'radial'`, added to LAYOUTS registry, updated MainLayout switch

### LayoutSwitcher Conditional Availability

- [x] **RD5-RD11** - Added `selectedNodeId` prop, conditional disabled state, tooltip, fallback to force-graph

### RadialLayout Component - Core Structure

- [x] **RD12** - Create `src/layouts/RadialLayout.tsx` implementing `LayoutComponentProps`
- [x] **RD13** - Create `src/layouts/RadialLayout.css` for component styles
- [x] **RD14** - Export `RadialLayout` from `src/layouts/index.ts`
- [x] **RD15** - Set up D3 SVG container with zoom/pan behavior
- [x] **RD16** - Add zoom controls consistent with other layouts

### Data Processing

- [x] **RD17-RD22** - Extract center node, find connected edges/nodes, apply filters, handle edge cases

### Positioning & Rendering

- [x] **RD23-RD30** - Position center and peripheral nodes, render curved edges, handle large connection counts

### Interactions

- [x] **RD31-RD38** - Node/edge click handlers, highlight selected items, hover effects, search highlighting

### Empty & Invalid States

- [x] **RD39-RD43** - Empty state component, handle filtered-out nodes

### Filter Integration

- [x] **RD44-RD48** - Verify filters apply to connected nodes

### Infobox Integration

- [x] **RD49-RD53** - Verify clicking updates infobox, test deep links

### Animation & Polish

- [x] **RD54-RD57** - Entrance animation, transition animation, legend

### Theme Support

- [x] **RD58-RD61** - Verify light/dark theme support

### Testing & Verification

- [x] **RD62-RD72** - Test various datasets, connection counts, layout switching, URL sharing

### Documentation

- [x] **RD73-RD75** - JSDoc comments, CHANGELOG update

## Files Created

- `src/layouts/RadialLayout.tsx` - Main radial visualization component
- `src/layouts/RadialLayout.css` - Styling for radial layout

## Files Modified

- `src/layouts/index.ts` - Export RadialLayout
- `src/layouts/types.ts` - Add 'radial' to LayoutType
- `src/hooks/useLayout.ts` - Add radial to LAYOUTS registry
- `src/components/LayoutSwitcher.tsx` - Conditional radial availability
- `src/components/MainLayout.tsx` - Render RadialLayout
- `src/components/Header.tsx` - Pass selectedNodeId to LayoutSwitcher
- `src/components/MobileMenu.tsx` - Pass selectedNodeId to LayoutSwitcher

## Features

- **Center node**: Selected node positioned at center
- **Ring layout**: Direct connections arranged in a ring around center
- **Dynamic radius**: Ring size adjusts based on connection count (150-350px)
- **Curved edges**: Relationship-colored arcs connecting center to periphery
- **Click navigation**: Clicking peripheral node re-centers on that node
- **Info panel**: Shows center node title and connection count
- **Search highlighting**: Matching nodes highlighted, non-matching dimmed
- **Empty states**: Helpful prompts when no selection or no connections
- **Theme support**: Full light/dark mode compatibility
- **URL persistence**: Layout persists in URL (`?layout=radial`)
