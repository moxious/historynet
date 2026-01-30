# M30: Cross-Scene Discovery UI

**Status**: ✅ Complete (2026-01-30)
**Track**: B (Infrastructure & Backend)
**Depends on**: M29 (Cross-Scene API) ✅

## Integration Context

### Existing Component Structure

**Layouts** (`src/layouts/`):
- `ForceGraphLayout.tsx` - D3 force-directed graph (uses SVG circles for nodes)
- `RadialLayout.tsx` - Radial tree layout
- `TimelineLayout.tsx` - Chronological timeline view
- All layouts accept `LayoutComponentProps` interface
- Node rendering happens in each layout's rendering logic
- Node colors determined by `getNodeColor(node.type)` utility

**Node Detail Page** (`src/pages/NodeDetailPage.tsx`):
- Standalone page at route `/:datasetId/node/:nodeId`
- Loads full dataset, finds specific node
- Renders type-specific fields (Person, Object, Location, Entity)
- Uses `useResourceParams` hook for URL params
- Displays external links section near bottom of page

**Node Infobox** (`src/components/NodeInfobox.tsx`):
- Drawer/panel showing selected node details
- Props: `node`, `edges`, `onNodeLinkClick`, `getNode`
- Renders relationships section (edges connected to node)
- Renders external links section
- Uses `useNodeEnrichedData` for Wikipedia enrichment

**Context & Hooks** (`src/contexts/`, `src/hooks/`):
- `GraphContext.tsx` - Global graph state management
- `useUrlState.ts` - Syncs state with URL query params
- `useNodeEnrichedData.ts` - Wikipedia data fetching
- Pattern: Create new context for cross-scene data (similar to GraphContext)

**Routing**:
- React Router 7 with BrowserRouter
- Current route for node detail: `/:datasetId/node/:nodeId`
- Use `buildFullNodeUrl(datasetId, nodeId)` utility from `useResourceParams.ts`

### Data Flow Pattern

1. User loads dataset → GraphContext loads graph data
2. User selects node → URL updates, infobox opens
3. **NEW**: On dataset load, fetch cross-scene data for all nodes (batch API call)
4. **NEW**: Store in CrossSceneContext, components read from context
5. **NEW**: Async update - doesn't block initial render

### Visual Design Tokens

**Node Colors** (from `utils/getNodeColor.ts`):
- Person: blue (#3b82f6)
- Object: purple (#a855f7)
- Location: green (#10b981)
- Entity: orange (#f59e0b)

**Multi-scene indicator**: 20% darker than base color
- Person multi-scene: darker blue (~#2563eb)
- Object multi-scene: darker purple (~#7c3aed)
- Location multi-scene: darker green (~#059669)
- Entity multi-scene: darker orange (~#d97706)

**Theme Support**:
- Light and dark themes via ThemeContext
- Test indicators in both themes
- Ensure contrast sufficient for accessibility

### Testing Strategy

**Test all 12 datasets**:
- Focus on entities with known cross-dataset presence (see COVERAGE_REPORT.md)
- Test London (Q84) - 8 datasets
- Test Paris (Q90) - 7 datasets
- Test Isaac Newton (Q935) - 3 datasets (person type)

**Test scenarios**:
1. Node in 3+ datasets - full experience
2. Node in exactly 2 datasets (current + 1 other)
3. Node in only 1 dataset - no indicators shown
4. Node without wikidataId/wikipediaTitle - graceful no-op

**Coverage awareness**:
- ~79% of nodes will have cross-scene indicators (have wikidataId)
- ~21% won't (missing identifiers) - this is acceptable
- Don't treat missing indicators as bugs

## Goal

Enable users to discover that historical figures appear in multiple intellectual networks, creating "aha!" moments that enrich their understanding of how ideas and people connect across different contexts.

**Problem**: Users exploring a figure like Geoffrey Hinton in the AI/LLM network have no way to discover he also appears in Cybernetics or Cognitive Science networks. This hidden richness is invisible.

## Core User Need

The fundamental drive is **serendipitous discovery**, not navigation:

> "I didn't know this person was connected to THAT world too!"

The delight comes from the unexpected revelation that someone you're learning about has a richer, more interconnected life than you realized. Everything in this feature should serve that moment of discovery.

**Delight Formula**: `Surprise × Relevance × Low Friction`

- **Surprise**: The user didn't expect this connection
- **Relevance**: It appears when they're already interested in that person
- **Low Friction**: One click, smooth transition, easy return

## Design Principles

| Principle | Application |
|-----------|-------------|
| **Progressive Disclosure** | Three-stage reveal: graph hint → infobox teaser → detail page full context |
| **Don't Compete** | Cross-scene info is secondary; never interrupt the primary exploration task |
| **Discovery Language** | Use "Explore in other contexts" not "Navigate to dataset" |
| **Graceful Absence** | No matching identifier = no cross-scene section. Never show empty states. |
| **Silent Transitions** | Clear filters without explanation; users understand datasets differ |
| **Non-Blocking Fetch** | Pre-fetch cross-scene data on dataset load; update UI async when ready |

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary discovery location | Node Detail Page | User has expressed deep interest; appropriate for full context |
| Infobox treatment | Minimal teaser only | Infobox is already dense; don't compete with relationships |
| Graph indicator | Darker background (20% darker than node type color) | Subtle visual hint without adding extra elements |
| Tooltip treatment | Extend existing title tooltip | "Geoffrey Hinton · In 3 networks" — integrated, not separate |
| Filter behavior | Clear node type filters + search term; preserve layout | Users understand datasets differ; layout preference persists |
| Visual priority | Lower than type/selection/search | Secondary information, peripheral awareness |
| Missing data | Hide section entirely | No empty states; graceful degradation |
| Navigation target | Node detail page in target dataset | Stable URLs, full context for continued exploration |
| Loading states | Skeleton loader in both infobox and detail page | Consistent loading UX |
| Mobile treatment | Compact teaser (icon + count, tap to navigate) | Space-efficient for bottom sheet |
| Pre-fetch strategy | Batch request on dataset load, non-blocking | Fast discovery, no blocking render |

## Three-Stage Progressive Disclosure

### Stage 1: Information Scent (Graph/Radial/Timeline View)

**Goal**: Plant curiosity without interrupting exploration.

```
┌─────────────────────────────────────────┐
│                                         │
│      ┌───┐                              │
│      │ 👤 │ ← Normal node               │
│      └───┘   (standard background)      │
│                                         │
│      ┌───┐                              │
│      │ 👤 │ ← Multi-scene node          │
│      └───┘   (20% darker background)    │
│                                         │
│   Tooltip on hover:                     │
│   "Geoffrey Hinton · In 3 networks"     │
│                                         │
└─────────────────────────────────────────┘
```

**Visual treatment**:
- Background color is 20% darker than the standard node type color
- Same hue as node type, just darker (not a separate ring element)
- Does NOT compete with selection state or search highlighting
- Tooltip extends existing title tooltip: `{name} · In {N} networks`

### Stage 2: Invitation to Explore (Infobox Panel)

**Goal**: Reward the click with a gentle reveal, but don't overwhelm.

**Desktop:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[... relationships section ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Appears in 2 other networks
   View full cross-scene connections →
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... external links section ...]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Mobile (compact):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[... relationships section ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 In 2 networks                      →
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(tap entire row to navigate)
```

**Key decisions**:
- **Don't list the networks here** — save that for the detail page
- Single line teaser with link to node detail page
- Positioned after relationships, before external links
- Only appears when `appearances.length > 1`
- **Show skeleton loader** while data is loading
- **Mobile**: Compact format, tap whole element to navigate

### Stage 3: Full Discovery (Node Detail Page)

**Goal**: Reward deep investment with full discovery context.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Explore in Other Networks

This figure connects multiple intellectual communities:

┌─────────────────────────────────────────┐
│  Florentine Academy                   → │
│  The philosophical circle around        │
│  the Medici in 15th-century Florence    │
├─────────────────────────────────────────┤
│  Christian Kabbalah                   → │
│  The synthesis of Jewish mysticism      │
│  with Renaissance Christian thought     │
├─────────────────────────────────────────┤
│  Renaissance Humanism                 → │
│  The revival of classical learning      │
│  in Italy and Northern Europe           │
└─────────────────────────────────────────┘
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Key decisions**:
- **Include brief context** for each network (from manifest description)
- Cards/links navigate to that node's detail page in the target dataset
- Positioned after biography/identity sections, before external links
- Full visual treatment — this is the payoff moment

## URL Construction (Updated for BrowserRouter)

Cross-scene links navigate to node detail pages (stable permalinks):

```
Current page:
  /ai-llm-research/node/person-geoffrey-hinton

Cross-scene link:
  /cybernetics/node/person-hinton-cybernetics
  ↑ Target dataset   ↑ Node ID in that dataset
```

**Rationale**: Node detail pages are the canonical "deep dive" location. Users clicking cross-scene links want to learn more, not immediately jump into graph exploration.

## Tasks

### Phase 1: Data Layer & Hook

- [ ] **CS-UI-01** Create `useCrossSceneData` context/provider
  - Fetches cross-scene data for all nodes on dataset load (batch API)
  - Non-blocking: doesn't delay initial render
  - Updates UI asynchronously when data arrives
  - Stores results in session cache (keyed by identifier)

- [ ] **CS-UI-02** Create `useCrossSceneAppearances` hook
  - Accepts node with any of: `wikidataId`, `wikipediaTitle`, or `nodeId`
  - Returns `{ appearances, isLoading, isMultiScene, error }`
  - Reads from context cache; triggers fetch only if not cached
  - Returns `{ appearances: [], isMultiScene: false }` for nodes without identifiers

- [ ] **CS-UI-03** Create `buildCrossSceneNodeUrl` utility
  - Takes `targetDatasetId` and `targetNodeId`
  - Returns node detail page URL: `/${datasetId}/node/${nodeId}`

- [ ] **CS-UI-04** Implement filter clearing on cross-scene navigation
  - Clear node type filter checkboxes
  - Clear search term
  - Preserve selected layout (force/radial/timeline)

### Phase 2: Graph Visual Indicator (Stage 1)

- [ ] **CS-UI-05** Add multi-scene indicator to `ForceGraphLayout.tsx`
  - Background color 20% darker than standard node type color
  - Same hue, just darker (modify existing circle fill, not add elements)
  - Only applies when `isMultiScene` is true

- [ ] **CS-UI-06** Add multi-scene indicator to `RadialLayout.tsx`
  - Same visual treatment as force graph

- [ ] **CS-UI-07** Add multi-scene indicator to `TimelineLayout.tsx`
  - Same visual treatment, appropriate for timeline density

- [ ] **CS-UI-08** Extend existing tooltip for multi-scene nodes
  - Format: `{Node Title} · In {N} networks`
  - Extend existing title tooltip, don't add separate tooltip
  - Only add suffix when `isMultiScene` is true

- [ ] **CS-UI-09** Ensure visual hierarchy
  - Selection state takes priority over multi-scene indicator
  - Search highlighting takes priority over multi-scene indicator
  - Multi-scene indicator should not increase node size

### Phase 3: Infobox Teaser (Stage 2)

- [ ] **CS-UI-10** Create `CrossSceneTeaser` component
  - Desktop: "🌐 Appears in N other networks" + "View connections →"
  - Mobile: Compact format — "🌐 In N networks" (tap whole element to navigate)
  - Links to current node's detail page (where full section lives)

- [ ] **CS-UI-11** Integrate teaser into `NodeInfobox.tsx`
  - Position: after Relationships section, before External Links
  - Show skeleton loader while `isLoading`
  - Hide entirely if no cross-scene data or error

### Phase 4: Detail Page Full Section (Stage 3)

- [ ] **CS-UI-12** Create `CrossSceneSection` component
  - Header: "🌐 Explore in Other Networks"
  - Intro text: "This figure connects multiple intellectual communities:"
  - List of network cards with context
  - Show skeleton loader while fetching

- [ ] **CS-UI-13** Create `CrossSceneNetworkCard` component
  - Network name (from manifest)
  - Brief description (from manifest, truncated to ~80 chars)
  - Click navigates to node detail page in that dataset
  - Excludes current dataset from list
  - Show even if only 1 other network (don't require 2+)

- [ ] **CS-UI-14** Integrate section into `NodeDetailPage.tsx`
  - Position: after biography/type-specific fields, before External Links
  - Show skeleton loader while fetching
  - Gracefully hide if API fails or no cross-scene data

### Phase 5: Polish & Edge Cases

- [ ] **CS-UI-15** Handle nodes without matching identifiers
  - Hook returns `{ appearances: [], isMultiScene: false }` immediately
  - No API call, no UI elements rendered
  - Applies when node lacks all of: `wikidataId`, `wikipediaTitle`, `nodeId`

- [ ] **CS-UI-16** Handle API errors gracefully
  - Log error for debugging
  - Hide cross-scene UI entirely (no error states shown to user)

- [ ] **CS-UI-17** Verify visual hierarchy in all themes
  - Light mode: 20% darker background visible but subtle
  - Dark mode: 20% darker background visible but subtle

- [ ] **CS-UI-18** Add analytics event for cross-scene navigation
  - Track: source dataset, target dataset, node identifier
  - Helps understand cross-scene discovery patterns

### Phase 6: Testing

- [ ] **CS-UI-19** Test with node appearing in 3+ datasets
  - All three stages render correctly
  - Navigation works end-to-end
  - Tooltip shows correct count

- [ ] **CS-UI-20** Test with node appearing in exactly 2 datasets (current + 1 other)
  - Shows section with 1 card (the other dataset)
  - Indicator and teaser still appear

- [ ] **CS-UI-21** Test with node appearing in only 1 dataset
  - No indicator, no teaser, no section
  - Clean, no empty states

- [ ] **CS-UI-22** Test with node missing all identifiers
  - Graceful no-op at all stages
  - No API call made

- [ ] **CS-UI-23** Test visual hierarchy
  - Select a multi-scene node: selection state dominates
  - Search for a multi-scene node: search highlighting dominates
  - Darker background visible but not distracting

- [ ] **CS-UI-24** Test responsive behavior
  - Mobile: compact teaser (icon + count) in bottom sheet
  - Desktop: full teaser with link text in drawer
  - Detail page section works on both

- [ ] **CS-UI-25** Test filter clearing on cross-scene navigation
  - Node type filters cleared
  - Search term cleared
  - Layout preserved (if was timeline, stays timeline)

- [ ] **CS-UI-26** Test pre-fetch and async rendering
  - Initial render not blocked by cross-scene data
  - Indicators appear asynchronously when data arrives
  - No flicker or layout shift

## Copy Guidelines

Use discovery-oriented language throughout:

| Instead of... | Use... |
|---------------|--------|
| "Other datasets" | "Other networks" or "other contexts" |
| "Navigate to" | "Explore in" |
| "Links" | "Connections" |
| "Go to dataset" | "See this figure in..." |
| "Related datasets" | "Connected worlds" or "intellectual communities" |

## Key Deliverables

1. **`useCrossSceneData` context/provider** — Batch pre-fetch on dataset load, session caching
2. **`useCrossSceneAppearances` hook** — Per-node access to cached cross-scene data
3. **Graph indicators** — 20% darker background for multi-scene nodes in all three layouts
4. **Extended tooltips** — "{Name} · In N networks" format
5. **`CrossSceneTeaser` component** — Minimal infobox invitation (desktop + mobile variants)
6. **`CrossSceneSection` component** — Full discovery experience on detail page
7. **`CrossSceneNetworkCard` component** — Rich context for each network
8. **`buildCrossSceneNodeUrl` utility** — URL construction for navigation
9. **Filter clearing logic** — Clear filters + search on cross-scene navigation

## Success Metrics

- Users who see multi-scene indicators click on those nodes at higher rates
- Cross-scene navigation events indicate feature is being discovered and used
- Time on site increases when users discover cross-scene connections
- Qualitative: users report "I didn't know X was connected to Y" moments

## Implementation Order

**CRITICAL**: M29 must be complete and deployed before starting M30.

1. **Phase 1 (CS-UI-01 to CS-UI-04)**: Data layer - fetch from M29 API
2. **Phase 2 (CS-UI-05 to CS-UI-09)**: Graph indicators in all layouts
3. **Phase 3 (CS-UI-10 to CS-UI-11)**: Infobox teaser
4. **Phase 4 (CS-UI-12 to CS-UI-14)**: Detail page full section
5. **Phase 5 (CS-UI-15 to CS-UI-18)**: Polish and edge cases
6. **Phase 6 (CS-UI-19 to CS-UI-26)**: Testing

## Validation Checklist

Before marking milestone complete:
- [ ] M29 API deployed and tested ✅
- [ ] Cross-scene data fetches on dataset load (non-blocking)
- [ ] London (Q84) shows indicator in all 8 datasets where it appears
- [ ] Paris (Q90) shows indicator in all 7 datasets where it appears
- [ ] Isaac Newton (Q935) shows indicator in 3 datasets (scientific-revolution, enlightenment, speculative-freemasonry)
- [ ] Indicators visible in force, radial, and timeline layouts
- [ ] Tooltip shows "Entity Name · In N networks"
- [ ] Infobox teaser links to node detail page
- [ ] Detail page shows list of other networks with descriptions
- [ ] Navigation to other dataset works (preserves layout, clears filters)
- [ ] Nodes without identifiers show no indicators (graceful)
- [ ] Visual hierarchy: selection > search > multi-scene indicator
- [ ] Works in both light and dark themes
- [ ] Mobile: compact teaser in bottom sheet
- [ ] Desktop: full teaser in drawer
- [ ] No console errors
- [ ] No layout shift when cross-scene data loads

## Out of Scope (Future Enhancements)

- "Explore all connections" meta-view showing a figure across all their networks
- Cross-scene relationship mapping (how the same relationship appears in different contexts)
- Automatic wikidataId enrichment for datasets missing identifiers
