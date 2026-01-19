# M21: Dataset Search & Filter

**Status**: ✅ Complete (2026-01-19)
**Track**: A (Independent Features)
**Depends on**: None

## Goal

Replace the dataset dropdown with a searchable combobox that filters datasets by name or description as the user types.

## Tasks

### Component Architecture

- [x] **DS1** - Design searchable combobox component API and props interface
- [x] **DS2** - Decide on implementation approach: custom build vs. headless library (Downshift, React Aria, etc.)
- [x] **DS3** - Create `SearchableDatasetSelector` component in `src/components/`
- [x] **DS4** - Add text input field for search/filter query
- [x] **DS5** - Implement dropdown list showing filtered dataset options
- [x] **DS6** - Wire up to existing dataset loading from `useDataset` hook or context

### Search & Filter Logic

- [x] **DS7** - Implement case-insensitive filtering against dataset `name` field
- [x] **DS8** - Extend filtering to also match against dataset `description` field
- [x] **DS9** - Match search term anywhere in name/description (not just prefix)
- [x] **DS10** - Add debouncing to filter input if performance requires (use existing `useDebounce` hook)
- [x] **DS11** - Show "No matching datasets" message when filter returns empty results
- [x] **DS12** - Add clear button (×) to reset search input

### Keyboard Navigation & Accessibility

- [x] **DS13** - Implement arrow key navigation through filtered results
- [x] **DS14** - Enter key selects highlighted/focused dataset
- [x] **DS15** - Escape key closes dropdown and clears search
- [x] **DS16** - Tab key moves focus appropriately (into/out of component)
- [x] **DS17** - Add ARIA attributes for combobox pattern (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, etc.)
- [x] **DS18** - Ensure screen reader announces filtered results count

### Visual Design & Theming

- [x] **DS19** - Style component consistent with existing app design
- [x] **DS20** - Support light/dark theme (use existing theme CSS variables)
- [x] **DS21** - Display dataset name and description snippet in dropdown items
- [x] **DS22** - Truncate long descriptions with ellipsis
- [x] **DS23** - Visual distinction between: currently selected, hovered, keyboard-focused states
- [x] **DS24** - Optional: highlight matching text in search results

### Integration

- [x] **DS25** - Replace existing `DatasetSelector` dropdown with new searchable component
- [x] **DS26** - Ensure selected dataset continues to sync with URL (`?dataset=...`)
- [x] **DS27** - Search/filter state is ephemeral (not persisted to URL)
- [x] **DS28** - Component works correctly when datasets are still loading

### Testing & Verification

- [x] **DS29** - Test filtering with partial matches (e.g., "llm" finds "AI & LLM Research Network")
- [x] **DS30** - Test filtering by description (e.g., "enlightenment" finds dataset by description)
- [x] **DS31** - Test keyboard navigation through filtered results
- [x] **DS32** - Test with empty search (shows all datasets)
- [x] **DS33** - Test with no-match search (shows empty state message)
- [x] **DS34** - Test theme switching (light/dark mode)
- [x] **DS35** - Verify accessibility with screen reader
- [x] **DS36** - Build passes with no errors or linter warnings
- [x] **DS37** - Update CHANGELOG.md with M21 completion notes

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Implementation | Custom build | Full control over behavior, no new dependencies |
| Match location | Anywhere in string | More flexible search (not just prefix) |
| State persistence | Ephemeral | Search is exploratory, not shareable |
| Highlighting | Yes | Visual feedback helps users understand matches |

## Files Created

- `src/components/SearchableDatasetSelector.tsx` - Main component
- `src/components/SearchableDatasetSelector.css` - Styling

## Files Modified

- `src/components/Header.tsx` - Use SearchableDatasetSelector
- `src/components/MobileMenu.tsx` - Use SearchableDatasetSelector
- `src/components/index.ts` - Export new component

## Features Delivered

- **Search Input**: Type to filter datasets by name or description
- **Case-Insensitive Matching**: Matches anywhere in name or description text
- **Text Highlighting**: Matching text highlighted with `<mark>` elements in results
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select, Escape to close/clear
- **ARIA Accessibility**: Full combobox pattern with screen reader announcements
- **Clear Button**: Quick reset of search input
- **Light/Dark Theme**: Uses existing CSS variables for theme support
- **URL Sync**: Selected dataset syncs with URL, search state is ephemeral
- **Loading State**: Shows loading indicator while manifests load
- **Empty State**: "No matching datasets" message when filter returns no results
