# M30: Cross-Scene Navigation UI

**Status**: 🔲 Future
**Track**: B (Infrastructure & Backend)
**Depends on**: M29 (Cross-Scene API)

## Goal

Surface cross-scene relationships in the user interface, enabling discovery and navigation between scenes where the same entity appears.

**Problem**: Even with the API from M29, users have no visual indication that a node appears in multiple scenes, and no way to navigate between them.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Filter behavior | Clear all filters on cross-scene navigation | Filters are dataset-specific |
| Visual indicator | Extra ring around multi-scene nodes | Subtle, uses existing color scheme |
| Conflicting data | Defer to target dataset | Consistency, simplicity |
| "Explore connections" | Out of scope | MVP focus |

## UI Components

### 1. Infobox "Related Scenes" Section

When viewing a node that appears in multiple datasets:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Also appears in:

  Florentine Academy      →
  Christian Kabbalah      →
  Renaissance Humanism    →
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Each item is a link that navigates to that node in the other dataset, preserving the user's current layout preference but clearing filters.

### 2. Graph Node Indicator

Nodes that appear in multiple scenes have a visual indicator:
- Extra outer ring around the node shape
- Same color as the node's type color
- Tooltip on hover: "Appears in N scenes"

## Cross-Scene Link Construction

Links preserve user preferences while navigating:

```
Current URL:
  /#/?dataset=ai-llm-research&selected=person-hinton&type=node&layout=radial

Cross-scene link:
  /#/?dataset=cybernetics&selected=person-hinton-cyb&type=node&layout=radial
       ↑ Different dataset    ↑ Different nodeId           ↑ Same layout
```

**Preserved**: layout, theme  
**Cleared**: all filters (they're dataset-specific)

## Tasks

### Hook & Data Fetching

- [ ] **UI1** - Create `useCrossSceneAppearances` hook
- [ ] **UI2** - Fetch from `/api/node-scenes` when node has `wikidataId`
- [ ] **UI3** - Cache results to avoid redundant fetches
- [ ] **UI4** - Return `{ appearances, isLoading, isMultiScene }`

### CrossSceneLinks Component

- [ ] **UI5** - Create `CrossSceneLinks` component
- [ ] **UI6** - Render "Also appears in:" section in infobox
- [ ] **UI7** - Only show when `appearances.length > 1`
- [ ] **UI8** - Exclude current dataset from list

### Link Construction

- [ ] **UI9** - Create `buildCrossSceneUrl(targetDatasetId, nodeId, currentLayout)` utility
- [ ] **UI10** - Preserve layout and theme preferences
- [ ] **UI11** - Clear filters in generated URL

### Graph Visual Indicator

- [ ] **UI12** - Add multi-scene indicator to `ForceGraphLayout.tsx`
- [ ] **UI13** - Add multi-scene indicator to `RadialLayout.tsx`
- [ ] **UI14** - Additional outer ring on nodes with multiple appearances
- [ ] **UI15** - Same color as node's type color
- [ ] **UI16** - Tooltip showing appearance count

### Infobox Integration

- [ ] **UI17** - Add `CrossSceneLinks` section to `NodeInfobox.tsx`
- [ ] **UI18** - Position after main content, before external links
- [ ] **UI19** - Handle loading states gracefully

### Testing

- [ ] **UI20** - Test with nodes appearing in multiple datasets
- [ ] **UI21** - Test with nodes appearing in only one dataset
- [ ] **UI22** - Test layout/theme preservation during navigation
- [ ] **UI23** - Test filter clearing during navigation

## Key Deliverables

1. **`useCrossSceneAppearances` hook** - Fetches and caches cross-scene data
2. **`CrossSceneLinks` component** - Renders "Also appears in:" section
3. **Link construction utility** - `buildCrossSceneUrl()`
4. **Multi-scene node indicator** - Visual marker in graph layouts
5. **Infobox integration** - Section in NodeInfobox
