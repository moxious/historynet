# M29 & M30 Implementation Handoff

**Date**: 2026-01-30
**Status**: M29 Complete ✅ | M30 Ready for implementation
**Agent Instructions**: M29 is deployed and working. Ready to start M30.

---

## Overview

These milestones implement cross-dataset entity discovery and navigation, enabling users to see when a person/location/object appears in multiple datasets and navigate between them.

**User Value**: "I'm viewing Galileo in Scientific Revolution → discover he's also in Florentine Academy → click to see him in that context"

---

## Milestone Files

- **M29**: [m29-cross-scene-api.md](./m29-cross-scene-api.md) - Build index + API (18 tasks)
- **M30**: [m30-cross-scene-ui.md](./m30-cross-scene-ui.md) - Build UI components (26 tasks)

---

## Critical Information

### Sequential Dependency

**M29 MUST be complete before starting M30**

M30 depends on the `/api/node-scenes` endpoint built in M29. You cannot build the UI without the API.

### Data Coverage

From `public/datasets/COVERAGE_REPORT.md`:
- 79% of nodes have `wikidataId` (will support cross-dataset matching)
- 21% of nodes lack identifiers (won't show cross-dataset indicators - **this is acceptable**)
- 44 entities appear in multiple datasets
- 118 potential cross-dataset links

**Test Entities**:
- London (Q84) - appears in 8 datasets
- Paris (Q90) - appears in 7 datasets
- Isaac Newton (Q935) - appears in 3 datasets

### Testing Strategy

**Test with ALL 12 datasets**:
1. scientific-revolution (100% wikidata coverage)
2. statistics-social-physics (98% coverage)
3. All other datasets (61-88% coverage)

**Validation Focus**:
- Entities with cross-dataset presence (London, Paris, Newton)
- Entities without wikidataId (should gracefully show no indicators)
- All three layouts (force, radial, timeline)
- Both themes (light, dark)
- Mobile and desktop views

---

## Key Technical Context

### Codebase Structure

**API Patterns** (`/api/`):
- Vercel serverless functions
- Pattern: `export default function(req: VercelRequest, res: VercelResponse)`
- Examples: `/api/submit-feedback.ts`, `/api/health.ts`

**Component Locations**:
- Layouts: `src/layouts/ForceGraphLayout.tsx`, `RadialLayout.tsx`, `TimelineLayout.tsx`
- Node detail page: `src/pages/NodeDetailPage.tsx`
- Node infobox: `src/components/NodeInfobox.tsx`
- Contexts: `src/contexts/GraphContext.tsx`
- Hooks: `src/hooks/useUrlState.ts`, `useNodeEnrichedData.ts`

**Dataset Structure** (`public/datasets/`):
- 12 datasets: ai-llm-research, ambient-music, christian-kabbalah, etc.
- Each has: `manifest.json`, `nodes.json`, `edges.json`
- Nodes have optional: `wikidataId`, `wikipediaTitle`, `id` (nodeId)

**Node Types**:
- Person (blue #3b82f6)
- Object (purple #a855f7)
- Location (green #10b981)
- Entity (orange #f59e0b)

---

## M29 Implementation Guide

### What You're Building

1. **Index Generator Script** (`scripts/build-cross-scene-index/`)
   - Scans all 12 datasets
   - Builds lookup tables by wikidataId, wikipediaTitle, nodeId
   - Outputs static JSON to `public/cross-scene-index/`

2. **Serverless API** (`/api/node-scenes.ts`)
   - Accepts single or batch lookups
   - Loads relevant index files
   - Returns list of datasets where entity appears

3. **CI Integration**
   - Index rebuilds on deployment
   - Included in Vercel build

### Task Breakdown (18 tasks)

See [m29-cross-scene-api.md](./m29-cross-scene-api.md) for full task list:
- **CS1-CS4**: Index build script
- **CS5-CS9**: Index output files
- **CS10-CS15**: Serverless endpoint
- **CS16-CS18**: CI integration

### Validation Before Moving to M30

- [x] Index generated for all 12 datasets ✅
- [x] API returns London (Q84) in 8 datasets ✅ (verified: https://scenius-seven.vercel.app/api/node-scenes?wikidataId=Q84)
- [x] API returns Paris (Q90) in 7 datasets ✅ (verified: https://scenius-seven.vercel.app/api/node-scenes?wikidataId=Q90)
- [x] API returns Isaac Newton (Q935) in 3 datasets ✅ (verified: https://scenius-seven.vercel.app/api/node-scenes?wikidataId=Q935)
- [x] Batch API works (50 nodes in one request) ✅
- [x] Response times: single < 200ms, batch < 500ms ✅
- [x] Deployed to Vercel and accessible ✅

---

## M30 Implementation Guide

### What You're Building

1. **Data Layer**
   - Context/provider fetches cross-scene data on dataset load
   - Hook provides node-level access to cached data
   - Non-blocking (doesn't delay render)

2. **Graph Indicators**
   - Nodes in multiple datasets: 20% darker background
   - Tooltip: "Entity Name · In N networks"
   - All three layouts (force, radial, timeline)

3. **Infobox Teaser**
   - Minimal section: "🌐 Appears in N other networks"
   - Links to detail page for full context

4. **Detail Page Section**
   - Full list of other networks
   - Network cards with descriptions
   - Click navigates to node in other dataset

### Task Breakdown (26 tasks)

See [m30-cross-scene-ui.md](./m30-cross-scene-ui.md) for full task list:
- **Phase 1 (CS-UI-01 to CS-UI-04)**: Data layer & hooks
- **Phase 2 (CS-UI-05 to CS-UI-09)**: Graph indicators
- **Phase 3 (CS-UI-10 to CS-UI-11)**: Infobox teaser
- **Phase 4 (CS-UI-12 to CS-UI-14)**: Detail page section
- **Phase 5 (CS-UI-15 to CS-UI-18)**: Polish & edge cases
- **Phase 6 (CS-UI-19 to CS-UI-26)**: Testing

### Validation Before Completing

- [ ] M29 deployed and working ✅
- [ ] London (Q84) shows indicators in all 8 datasets
- [ ] Isaac Newton shows indicators in 3 datasets
- [ ] Works in all layouts (force, radial, timeline)
- [ ] Infobox teaser navigates to detail page
- [ ] Detail page shows other networks with descriptions
- [ ] Cross-dataset navigation works (clears filters, preserves layout)
- [ ] Graceful handling of nodes without identifiers
- [ ] Both themes (light, dark)
- [ ] Mobile and desktop
- [ ] No console errors
- [ ] No layout shift when data loads

---

## Common Pitfalls to Avoid

1. **Don't start M30 before M29 is deployed** - You need the API
2. **Don't treat 21% missing identifiers as bugs** - Expected, acceptable
3. **Don't block initial render** - Cross-scene data loads async
4. **Don't show empty states** - Hide indicator if no cross-dataset data
5. **Don't compete with selection/search** - Multi-scene is lowest priority visually
6. **Don't add new UI elements** - Darken existing circles, extend existing tooltips
7. **Don't require 2+ datasets** - Show section even if only 1 other network

---

## Definition of Done

### M29 Complete When:
- [x] Index builds successfully ✅
- [x] API returns correct data for test entities ✅
- [x] Deployed to Vercel ✅
- [x] CI rebuilds index on changes ✅ (vercel.json buildCommand)
- [x] Performance targets met (< 200ms single, < 500ms batch) ✅

**M29 Status: COMPLETE (2026-01-30)**
**Live API**: https://scenius-seven.vercel.app/api/node-scenes

### M30 Complete When:
- All 26 tasks checked off
- Test entities show indicators in correct datasets
- Navigation works across datasets
- No visual bugs (themes, mobile, layouts)
- No console errors
- Code reviewed and merged

---

## Questions?

If anything is unclear:
1. Check the coverage report: `public/datasets/COVERAGE_REPORT.md`
2. Review milestone files for detailed task descriptions
3. Inspect existing API patterns: `/api/submit-feedback.ts`
4. Review existing component patterns: `src/components/NodeInfobox.tsx`

---

**Ready to start? Begin with M29, task CS1.**
