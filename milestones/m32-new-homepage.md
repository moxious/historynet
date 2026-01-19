# M32: New Homepage

**Status**: ✅ Complete (2026-01-19)
**Track**: C (Information Architecture)
**Depends on**: M31 (Dataset Pages) ✅

## Goal

Replace the current "jump into graph view" entry point with a browsable list of dataset tiles. Users can discover available datasets, search/filter them, and click through to dataset overview pages.

**Prerequisites**: M31 must be complete (dataset pages exist, routing structure in place)

## Tasks

### Phase 1: HomePage Component

- [x] **HP1** - Create `src/pages/HomePage.tsx` component
- [x] **HP2** - Create `src/pages/HomePage.css` stylesheet
- [x] **HP3** - Export from `src/pages/index.ts` barrel file
- [x] **HP4** - Update `App.tsx` to render HomePage at `/` route
- [x] **HP5** - Add page heading: "Explore Collective Genius"

### Phase 2: Dataset Tiles

- [x] **HP6** - Create `src/components/DatasetTile.tsx` component
- [x] **HP7** - Create `src/components/DatasetTile.css` stylesheet
- [x] **HP8** - Display banner emoji from manifest `bannerEmoji` (default "❓")
- [x] **HP9** - Display dataset name from manifest `name`
- [x] **HP10** - Display truncated description (2-3 lines max with ellipsis)
- [x] **HP11** - Display node/edge counts: "{nodeCount} nodes · {edgeCount} edges"
- [x] **HP12** - Display date range from `scope.startYear`–`scope.endYear` (or `temporalScope` fallback)
- [x] **HP13** - Tile click navigates to `/:datasetId` (dataset overview page)
- [x] **HP14** - Export from `src/components/index.ts` barrel file

### Phase 3: Dataset Grid

- [x] **HP15** - Create `DatasetGrid` component to render tiles (integrated into HomePage)
- [x] **HP16** - Fetch all dataset manifests on page load
- [x] **HP17** - Responsive grid: 2-3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- [x] **HP18** - Consistent tile sizing and spacing

### Phase 4: Chronological Sorting

- [x] **HP19** - Sort datasets by `scope.startYear` ascending
- [x] **HP20** - Handle datasets without `scope.startYear` (place at end of list)
- [x] **HP21** - Fallback: parse `temporalScope` string if `scope.startYear` missing

### Phase 5: Search/Filter

- [x] **HP22** - Add search input at top of page with search icon
- [x] **HP23** - Case-insensitive filter on `name` field
- [x] **HP24** - Case-insensitive filter on `description` field
- [x] **HP25** - Debounced input (reuse `useDebounce` hook)
- [x] **HP26** - Show "No matching datasets" empty state when filter returns empty
- [x] **HP27** - Clear button (×) to reset search

### Phase 6: Header Adjustments

- [x] **HP28** - Evaluate dataset selector in header on homepage
- [x] **HP29** - Option A: Hide dataset selector on homepage (show only on explore/detail pages)
- [N/A] **HP30** - Option B: Keep dataset selector but link to overview pages instead of explore
- [x] **HP31** - Implement chosen option (Option A - HomePage has its own header without dataset selector)
- [x] **HP32** - Ensure header navigation works correctly from homepage (brand links to homepage)

### Phase 7: SEO

- [x] **HP33** - Add homepage meta tags via Helmet or index.html
- [x] **HP34** - Title: "Scenius - Explore Historical Networks"
- [x] **HP35** - Meta description summarizing the application
- [x] **HP36** - Open Graph tags for homepage
- [x] **HP37** - Update sitemap.xml to include homepage entry (already present)
- [N/A] **HP38** - Optional: JSON-LD for WebSite/WebApplication (may already exist)

### Phase 8: Styling & Polish

- [x] **HP39** - Style HomePage consistent with app design
- [x] **HP40** - Support light/dark theme
- [x] **HP41** - Tile hover effects (subtle shadow or border)
- [x] **HP42** - Search input styling consistent with SearchableDatasetSelector
- [x] **HP43** - Loading state while manifests are being fetched
- [x] **HP44** - Mobile-friendly layout and touch targets

### Phase 9: Testing & Verification

- [x] **HP45** - Test landing on `/` shows homepage with all dataset tiles
- [x] **HP46** - Test chronological sorting (earliest date range first)
- [x] **HP47** - Test search filters tiles correctly
- [x] **HP48** - Test clicking tile navigates to dataset overview page
- [x] **HP49** - Test full flow: homepage → dataset page → explore → node detail
- [x] **HP50** - Test theme toggle works on homepage
- [x] **HP51** - Test mobile responsive layout
- [x] **HP52** - Build passes with no errors
- [x] **HP53** - No linter warnings in new/modified files
- [x] **HP54** - Update CHANGELOG.md with M32 completion notes

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tile content | Emoji, name, description, counts, date range | Enough info to decide whether to explore |
| Sorting | Chronological by `scope.startYear` | Natural historical ordering |
| Search | Filter by name or description | Reuses pattern from M21 dataset search |
| Click behavior | Navigate to `/:datasetId` (dataset overview) | Follow the narrative path |
| Homepage header | Separate header without dataset selector | Homepage IS the dataset selector |
| Brand link | Links to homepage on all pages | Easy navigation back to homepage |

## Page Structure

```
┌─────────────────────────────────────────────────┐
│  Scenius                              [Theme]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Explore Collective Genius                      │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🔍 Search datasets...                    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌───────────────────┐ ┌───────────────────┐   │
│  │ 🏛️📜✨              │ │ 🌹⚗️🔮              │   │
│  │ Florentine Academy │ │ Rosicrucian       │   │
│  │ The Platonic Acad- │ │ Intellectual net- │   │
│  │ emy of Florence... │ │ work of the...    │   │
│  │                    │ │                    │   │
│  │ 50 nodes · 102 edges│ │ 112 nodes · 229..│   │
│  │ 1433–1535          │ │ 1493–1700         │   │
│  └───────────────────┘ └───────────────────┘   │
│                                                 │
│  ┌───────────────────┐ ┌───────────────────┐   │
│  │ ...               │ │ ...               │   │
│  └───────────────────┘ └───────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Files Created

- `src/pages/HomePage.tsx` - Main homepage component with search and grid
- `src/pages/HomePage.css` - Homepage styling with responsive grid
- `src/components/DatasetTile.tsx` - Individual tile component
- `src/components/DatasetTile.css` - Tile styling with hover effects

## Files Modified

- `src/App.tsx` - Route `/` to HomePage instead of redirect
- `src/pages/index.ts` - Export HomePage
- `src/components/index.ts` - Export DatasetTile and getStartYear
- `src/components/Header.tsx` - Brand now links to homepage
- `src/components/Header.css` - Brand link styling

## Notes

- The HomePage has its own lightweight header with just brand and theme toggle
- The main Header (used on dataset pages) now has the brand clickable to return home
- Datasets are sorted chronologically by start year using `getStartYear()` helper
- Datasets without dates are placed at the end of the list
- The `useDebounce` hook is reused for search input (200ms delay)
- Loading state shows progress: "Loading datasets (X/Y)..."
- Grid is responsive: 3 cols → 2 cols → 1 col as viewport narrows
- Sitemap already had the homepage entry from prior SEO work
