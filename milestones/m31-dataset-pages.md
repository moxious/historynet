# M31: Dataset Pages

**Status**: ✅ Complete (2026-01-19)
**Track**: C (Information Architecture)
**Depends on**: None

## Goal

Create a narrative overview page for each dataset that provides a gentler entry point than the graph visualization. Users can browse dataset contents before diving into the full interactive experience.

## URL Structure Change

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | List of all datasets (implemented in M32) |
| `/:datasetId` | **Dataset Overview** | New narrative page for each dataset |
| `/:datasetId/explore` | Graph/Timeline/Radial | Current main visualization (moved from `/`) |
| `/:datasetId/node/:nodeId` | Node Detail | Unchanged |
| `/:datasetId/from/:sourceId/to/:targetId` | Edge Detail | Unchanged |

## Schema Change

Added `bannerEmoji` field to manifest schema:

```json
{
  "bannerEmoji": "🔬🧬🤖"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bannerEmoji` | string | ⚪ Optional | 1-3 emoji representing the dataset's theme. Default: "❓" |

## Tasks

### Phase 1: Schema & Data Migration

- [x] **DP1** - Add `bannerEmoji` field to `GRAPH_SCHEMA.md` manifest section
- [x] **DP2** - Add `"bannerEmoji": "❓"` placeholder to all existing manifest.json files (11 datasets)
- [x] **DP3** - Dataset validation accepts `bannerEmoji` (schema is extensible by design, no changes needed)

### Phase 2: Routing Architecture

- [x] **DP4** - Create new route `/:datasetId` for DatasetOverviewPage
- [x] **DP5** - Create new route `/:datasetId/explore` for current graph/timeline/radial view
- [x] **DP6** - Move MainLayout rendering from `/` to `/:datasetId/explore`
- [x] **DP7** - Update `App.tsx` with new route structure
- [x] **DP8** - Ensure `/:datasetId/node/:nodeId` and `/:datasetId/from/:sourceId/to/:targetId` routes still work
- [x] **DP9** - Add redirect or 404 handling for old `/` route (will be replaced by homepage in M32)

### Phase 3: DatasetOverviewPage Component

- [x] **DP10** - Create `src/pages/DatasetOverviewPage.tsx` component
- [x] **DP11** - Create `src/pages/DatasetOverviewPage.css` stylesheet
- [x] **DP12** - Display banner emoji (large, centered) from manifest `bannerEmoji` (default "❓")
- [x] **DP13** - Display dataset title from manifest `name`
- [x] **DP14** - Display dataset description from manifest `description`
- [x] **DP15** - Export from `src/pages/index.ts` barrel file

### Phase 4: Most Connected Items (POLE Columns)

- [x] **DP16** - Create `useTopConnectedNodes` hook to calculate degree (edge count) per node
- [x] **DP17** - Group nodes by POLE type (person, object, location, entity)
- [x] **DP18** - Sort each group by degree descending
- [x] **DP19** - Return top 5 per type (or all if fewer than 5)
- [x] **DP20** - Create `TopConnectedSection` component for rendering POLE columns
- [x] **DP21** - Responsive layout: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- [x] **DP22** - Display node title as link for each item

### Phase 5: Explore Links

- [x] **DP23** - Add 🔍 (spyglass) icon next to each item in POLE columns
- [x] **DP24** - Create `buildExploreUrl` utility: `/:datasetId/explore?selected={nodeId}&type=node&layout=graph`
- [x] **DP25** - Explore link clears all filters (no filter params in URL)
- [x] **DP26** - Explore link preserves theme (if theme param exists, keep it)
- [x] **DP27** - Spyglass icon links to graph layout specifically (not timeline/radial)

### Phase 6: Link Generation Migration

- [x] **DP28** - Audit all internal link generation in codebase
- [x] **DP29** - Update `NodeInfobox.tsx` links to use new URL scheme
- [x] **DP30** - Update `EdgeInfobox.tsx` links to use new URL scheme
- [x] **DP31** - Update `ShareButtons.tsx` to generate new URL format
- [x] **DP32** - Update `SearchBox.tsx` result links (if applicable)
- [x] **DP33** - Update any cross-linking in layouts (ForceGraphLayout, TimelineLayout, RadialLayout)
- [x] **DP34** - Create `src/utils/urlBuilder.ts` with centralized URL construction helpers
- [x] **DP35** - Verify no old-format URLs remain in generated links

### Phase 7: SEO

- [x] **DP36** - Create `DatasetMeta.tsx` component for dataset page meta tags (using Helmet in DatasetOverviewPage)
- [x] **DP37** - Unique `<title>` per dataset: "{name} | Scenius"
- [x] **DP38** - Unique meta description per dataset (truncated `description`)
- [x] **DP39** - Open Graph tags: og:title, og:description, og:url
- [~] **DP40** - Add JSON-LD structured data (`@type: Dataset` or `DataCatalog`) - deferred for future
- [x] **DP41** - Update `public/sitemap.xml` with entries for all dataset pages (`/:datasetId`)
- [x] **DP42** - Verify sitemap includes both dataset pages and explore pages

### Phase 8: Styling & Polish

- [x] **DP43** - Style DatasetOverviewPage consistent with app design
- [x] **DP44** - Support light/dark theme (use existing CSS variables)
- [x] **DP45** - Emoji display at appropriate size (e.g., 3-4rem)
- [x] **DP46** - POLE column headers with type icons or labels
- [x] **DP47** - Hover states on item links
- [x] **DP48** - Mobile-friendly touch targets

### Phase 9: Testing & Verification

- [x] **DP49** - Test navigation: homepage → dataset page → explore → back
- [x] **DP50** - Test all 11 datasets load correctly on overview page
- [x] **DP51** - Test POLE columns show correct top 5 (verify against manual edge count)
- [x] **DP52** - Test explore links open graph view with correct item selected
- [x] **DP53** - Test theme persistence across navigation
- [x] **DP54** - Test mobile responsive layout
- [x] **DP55** - Verify old deep links to nodes/edges still work
- [x] **DP56** - Build passes with no errors
- [x] **DP57** - No linter warnings in new/modified files
- [x] **DP58** - Update CHANGELOG.md with M31 completion notes

## Files Created

- `src/pages/DatasetOverviewPage.tsx` - Main overview page component
- `src/pages/DatasetOverviewPage.css` - Styling
- `src/utils/urlBuilder.ts` - Centralized URL construction helpers
- `src/hooks/useTopConnectedNodes.ts` - Calculate node degree by type
- `src/components/DatasetExploreWrapper.tsx` - Route param to query param sync

## Files Modified

- All 11 `manifest.json` files - Added `bannerEmoji` field
- `src/App.tsx` - New routing structure
- `src/pages/index.ts` - Export new page
- `public/sitemap.xml` - Dataset overview and explore URLs
- Various components - Updated to use new URL scheme

## Features Delivered

- **URL Restructure**: New information architecture with dataset overview pages
- **DatasetOverviewPage**: Narrative entry point with metadata display
- **POLE Columns**: Top 5 most connected items per type
- **Explore Links**: Spyglass icon to explore items in graph view
- **SEO**: Unique meta tags per dataset
- **Responsive Design**: 4 → 2 → 1 column layout
