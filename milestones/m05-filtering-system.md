# M5: Filtering System

**Status**: ✅ Complete (2026-01-18)
**Track**: MVP (Core Application)
**Depends on**: M4 (Infobox Panel)

## Goal

Implement date range and text-based filtering with URL sync, allowing users to narrow the visible graph to specific time periods and matching nodes/relationships.

## Tasks

### Filter UI
- [x] Create `src/components/FilterPanel.tsx` container
- [x] Add date range input: "No earlier than" (year input)
- [x] Add date range input: "No later than" (year input)
- [x] Add text input: "Filter by name"
- [x] Add text input: "Filter by relationship"
- [x] Add "Clear filters" button
- [x] Style filter panel (collapsible sidebar or toolbar)

### Filter Logic
- [x] Create `src/hooks/useFilters.ts` for filter state
- [x] Implement date range filtering on nodes
- [x] Implement date range filtering on edges
- [x] Implement text substring matching on node titles
- [x] Implement text substring matching on edge relationships
- [x] Create `src/utils/filterGraph.ts` utility function

### Filter Application
- [x] Connect filter state to graph visualization
- [x] Re-render graph when filters change
- [x] Handle filtered-out nodes (hide connected edges too)
- [x] Update node/edge counts in UI to show filtered vs total

### URL Sync
- [x] Add filter state to URL parameters
- [x] Read filters from URL on initial load
- [x] Update URL when filters change (debounced)
- [x] Handle URL changes (back/forward navigation)

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Date filtering | Inclusive overlap | Nodes/edges that overlap with range are shown |
| Undated items | Always included | Don't hide content lacking date metadata |
| URL updates | Immediate | Enables instant shareability |
| Panel state | Collapsible | Minimizes screen space when not in use |

## Completion Notes

```
[2026-01-18] @claude: Completed Milestone 5 - Filtering System
- Created filter type system:
  - src/types/filters.ts: FilterState interface, FilterStats interface, hasActiveFilters utility
  - All filter state captured in a single interface for easy URL serialization

- Created filter utility functions (src/utils/filterGraph.ts):
  - parseYear(): Extract year from ISO 8601 or year-only date strings
  - nodeMatchesDateRange(): Check if node overlaps with filter range (inclusive)
  - edgeMatchesDateRange(): Same logic for edges
  - nodeMatchesNameFilter(): Case-insensitive substring match on titles
  - edgeMatchesRelationshipFilter(): Match on relationship type, label, and readable form
  - filterGraphData(): Main filtering function that:
    - Filters nodes by date and name
    - Filters edges by date and relationship
    - Automatically hides edges when connected nodes are filtered out
  - getFilterStats(): Compare original vs filtered counts
  - getGraphDateRange(): Find min/max years in dataset

- Extended URL state management (src/hooks/useUrlState.ts):
  - Added dateStart, dateEnd, name, relationship URL parameters
  - setFilters(): Update multiple filters with URL sync
  - clearFilters(): Remove all filter parameters
  - Filters merged with existing URL params (preserves dataset, selection, layout)

- Created useFilters hook (src/hooks/useFilters.ts):
  - Simplified API wrapping useUrlState
  - Individual setters: setDateStart, setDateEnd, setNameFilter, setRelationshipFilter
  - applyFilters(), getStats(), getDateRange() utility methods

- Created FilterPanel component (src/components/FilterPanel.tsx):
  - Collapsible panel with visual badge when filters active
  - Date range inputs with "No earlier than" / "No later than" labels
  - Text inputs for name and relationship filtering
  - Real-time filter statistics showing "X / Y" counts
  - Clear filters button (only shown when filters active)
  - Data span hint showing available date range
  - Keyboard support (Enter to apply date filters)
  - Accessible with proper labels and ARIA attributes

- Styling (src/components/FilterPanel.css):
  - Floating panel positioned over graph
  - Compact collapsed state with just icon and badge
  - Professional styling with hover states
  - Responsive design for mobile devices

- Context integration (src/contexts/GraphContext.tsx):
  - Added filteredData computed from graphData + filters
  - Exposes filters, setFilters, clearFilters
  - filterStats and dateRange computed properties
  - hasActiveFilters boolean for UI

- MainLayout integration:
  - Passes filteredData to ForceGraphLayout instead of graphData

Design decisions:
- Date filtering is inclusive (nodes/edges overlap with range)
- Undated nodes/edges are always included (not filtered out)
- Relationship filter matches against type, label, and human-readable form
- URL updates are immediate (no debouncing) for instant shareability
- Filter panel collapses to minimize screen space
```
