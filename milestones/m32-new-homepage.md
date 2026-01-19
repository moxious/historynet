# M32: New Homepage

**Status**: 🔲 Future
**Track**: C (Information Architecture)
**Depends on**: M31 (Dataset Pages) ✅

## Goal

Replace the current "jump into graph view" entry point with a browsable list of dataset tiles. Users can discover available datasets, search/filter them, and click through to dataset overview pages.

**Prerequisites**: M31 must be complete (dataset pages exist, routing structure in place)

## Tasks

### Phase 1: HomePage Component

- [ ] **HP1** - Create `src/pages/HomePage.tsx` component
- [ ] **HP2** - Create `src/pages/HomePage.css` stylesheet
- [ ] **HP3** - Export from `src/pages/index.ts` barrel file
- [ ] **HP4** - Update `App.tsx` to render HomePage at `/` route
- [ ] **HP5** - Add page heading: "Explore Historical Networks" or similar

### Phase 2: Dataset Tiles

- [ ] **HP6** - Create `src/components/DatasetTile.tsx` component
- [ ] **HP7** - Create `src/components/DatasetTile.css` stylesheet
- [ ] **HP8** - Display banner emoji from manifest `bannerEmoji` (default "❓")
- [ ] **HP9** - Display dataset name from manifest `name`
- [ ] **HP10** - Display truncated description (2-3 lines max with ellipsis)
- [ ] **HP11** - Display node/edge counts: "{nodeCount} nodes · {edgeCount} edges"
- [ ] **HP12** - Display date range from `scope.startYear`–`scope.endYear` (or `temporalScope` fallback)
- [ ] **HP13** - Tile click navigates to `/:datasetId` (dataset overview page)
- [ ] **HP14** - Export from `src/components/index.ts` barrel file

### Phase 3: Dataset Grid

- [ ] **HP15** - Create `DatasetGrid` component to render tiles
- [ ] **HP16** - Fetch all dataset manifests on page load
- [ ] **HP17** - Responsive grid: 2-3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- [ ] **HP18** - Consistent tile sizing and spacing

### Phase 4: Chronological Sorting

- [ ] **HP19** - Sort datasets by `scope.startYear` ascending
- [ ] **HP20** - Handle datasets without `scope.startYear` (place at end of list)
- [ ] **HP21** - Fallback: parse `temporalScope` string if `scope.startYear` missing

### Phase 5: Search/Filter

- [ ] **HP22** - Add search input at top of page with search icon
- [ ] **HP23** - Case-insensitive filter on `name` field
- [ ] **HP24** - Case-insensitive filter on `description` field
- [ ] **HP25** - Debounced input (reuse `useDebounce` hook)
- [ ] **HP26** - Show "No matching datasets" empty state when filter returns empty
- [ ] **HP27** - Clear button (×) to reset search

### Phase 6: Header Adjustments

- [ ] **HP28** - Evaluate dataset selector in header on homepage
- [ ] **HP29** - Option A: Hide dataset selector on homepage (show only on explore/detail pages)
- [ ] **HP30** - Option B: Keep dataset selector but link to overview pages instead of explore
- [ ] **HP31** - Implement chosen option
- [ ] **HP32** - Ensure header navigation works correctly from homepage

### Phase 7: SEO

- [ ] **HP33** - Add homepage meta tags via Helmet or index.html
- [ ] **HP34** - Title: "Scenius - Explore Historical Networks"
- [ ] **HP35** - Meta description summarizing the application
- [ ] **HP36** - Open Graph tags for homepage
- [ ] **HP37** - Update sitemap.xml to include homepage entry
- [ ] **HP38** - Optional: JSON-LD for WebSite/WebApplication (may already exist)

### Phase 8: Styling & Polish

- [ ] **HP39** - Style HomePage consistent with app design
- [ ] **HP40** - Support light/dark theme
- [ ] **HP41** - Tile hover effects (subtle shadow or border)
- [ ] **HP42** - Search input styling consistent with SearchableDatasetSelector
- [ ] **HP43** - Loading state while manifests are being fetched
- [ ] **HP44** - Mobile-friendly layout and touch targets

### Phase 9: Testing & Verification

- [ ] **HP45** - Test landing on `/` shows homepage with all dataset tiles
- [ ] **HP46** - Test chronological sorting (earliest date range first)
- [ ] **HP47** - Test search filters tiles correctly
- [ ] **HP48** - Test clicking tile navigates to dataset overview page
- [ ] **HP49** - Test full flow: homepage → dataset page → explore → node detail
- [ ] **HP50** - Test theme toggle works on homepage
- [ ] **HP51** - Test mobile responsive layout
- [ ] **HP52** - Build passes with no errors
- [ ] **HP53** - No linter warnings in new/modified files
- [ ] **HP54** - Update CHANGELOG.md with M32 completion notes

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tile content | Emoji, name, description, counts, date range | Enough info to decide whether to explore |
| Sorting | Chronological by `scope.startYear` | Natural historical ordering |
| Search | Filter by name or description | Reuses pattern from M21 dataset search |
| Click behavior | Navigate to `/:datasetId` (dataset overview) | Follow the narrative path |

## Page Structure

```
┌─────────────────────────────────────────────────┐
│  Scenius                              [Theme]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Explore Historical Networks                    │
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

## Files to Create

- `src/pages/HomePage.tsx` - Main homepage component
- `src/pages/HomePage.css` - Homepage styling
- `src/components/DatasetTile.tsx` - Individual tile component
- `src/components/DatasetTile.css` - Tile styling

## Files to Modify

- `src/App.tsx` - Route `/` to HomePage
- `src/pages/index.ts` - Export HomePage
- `src/components/index.ts` - Export DatasetTile
- `src/components/Header.tsx` - Conditional dataset selector visibility
- `public/sitemap.xml` - Add homepage entry
