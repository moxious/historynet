# M23: Wikimedia Sourcing

**Status**: ✅ Complete (2026-01-19)
**Track**: A (Independent Features)
**Depends on**: None

## Goal

Dynamically fetch supplementary data (summaries, images) from the Wikimedia API for nodes that lack this information locally. Node metadata always takes precedence, with Wikimedia providing fallback enrichment—except for broken local images, which fall back to Wikipedia.

**Pilot Dataset**: Rosicrucian Network (test all features here before rolling out to other datasets)

**API Client**: Uses the [`wikipedia`](https://www.npmjs.com/package/wikipedia) npm package—a full-featured TypeScript client that wraps the Wikipedia REST API. No authentication required for read-only access (500 req/hour rate limit per IP).

## Technical Feasibility (Verified)

| Question | Finding |
|----------|---------|
| **Browser compatibility** | `wikipedia` npm package works in browser. Built with ES6+/TypeScript, uses standard `fetch`. Compatible with Vite. |
| **CORS support** | Wikipedia REST API supports CORS for anonymous requests. No special parameters needed—direct client-side `fetch()` works. |
| **Wikidata QID stability** | QIDs are stable permanent identifiers. They don't change (except rare documented deletions/mergers). Safe for long-term references. |
| **Disambiguation detection** | REST API returns `"type": "disambiguation"` in response. Can detect and handle programmatically. |

## Design Decisions

| Decision | Choice |
|----------|--------|
| **Schema fields** | `wikipediaTitle` (required for mapping) + `wikidataId` (optional stable QID) on all node types |
| **Node type support** | All types: `person`, `location`, `entity`, `object` |
| **Disambiguation handling** | If disambiguation detected, retry with node type appended (e.g., "John Dee (mathematician)") |
| **Attribution UI** | Wikipedia "W" icon with tooltip, linking to article (opens in new tab) |
| **Extract display** | Truncate to 1-2 lines with "Read more on Wikipedia" link (opens in new tab) |
| **Broken image fallback** | If local `imageUrl` returns 404, fall back to Wikipedia thumbnail |
| **Fetch timing** | Lazy—only fetch when InfoboxPanel opens for that node |
| **Cache strategy** | LRU eviction from localStorage, 48-hour TTL |

## Tasks

### Phase 1: Schema & Infrastructure

- [x] **WM1** - Add `wikipediaTitle` and `wikidataId` fields to `GRAPH_SCHEMA.md`
- [x] **WM2** - Update TypeScript types in `src/types/node.ts` to include both fields
- [x] **WM3** - Update dataset validation to accept both fields as valid optional fields
- [x] **WM4** - Install `wikipedia` npm package: `npm install wikipedia`
- [x] **WM5** - Verify package works in browser environment (Vite build)

### Phase 2: Wikipedia Service

- [x] **WM6** - Create `src/services/wikipedia.ts` service module
- [x] **WM7** - Implement disambiguation handling
- [x] **WM8** - Implement error handling in service
- [x] **WM9** - Add request timeout (5 seconds) to prevent UI blocking
- [x] **WM10** - Create `WikipediaData` TypeScript interface for response shape
- [x] **WM11** - Export service from `src/services/index.ts` barrel file

### Phase 3: Caching Layer

- [x] **WM12** - Create `src/hooks/useWikipediaData.ts` hook
- [x] **WM13** - Implement LRU cache in localStorage (500 entries max)
- [x] **WM14** - Implement 48-hour TTL for cache entries
- [x] **WM15** - Add cache hit/miss logging for debugging (dev mode only)
- [x] **WM16** - Handle rate limiting: if 429 response, back off and show cached/empty

### Phase 4: Fallback Logic

- [x] **WM17** - Design fallback priority for biography/description
- [x] **WM18** - Design fallback priority for images
- [x] **WM19** - Implement broken image detection (`onError` handler on `<img>`)
- [x] **WM20** - Create `useNodeEnrichedData` hook that combines node data + Wikipedia fallback
- [x] **WM21** - Add loading state UI while Wikipedia data is being fetched

### Phase 5: UI Integration

- [x] **WM22** - Update `NodeInfobox` to use `useNodeEnrichedData` hook
- [~] **WM23** - Update `NodeDetailPage` to use enriched data (deferred - same patterns work)
- [x] **WM24** - Add Wikipedia attribution icon (`WikipediaAttribution.tsx`)
- [x] **WM25** - Implement truncated extract display with "Read more on Wikipedia" link
- [x] **WM26** - Style loading state (shimmer animation)
- [x] **WM27** - Style error state (unobtrusive, doesn't break layout)
- [x] **WM28** - Ensure Wikipedia images respect aspect ratio and max dimensions

### Phase 6: Pilot Dataset (Rosicrucian Network)

- [x] **WM29** - Audit Rosicrucian Network nodes for Wikipedia mappings
- [x] **WM30** - Add `wikipediaTitle` to representative person nodes (10 nodes)
- [x] **WM31** - Add `wikipediaTitle` to representative location nodes (2 nodes)
- [~] **WM32** - Add `wikipediaTitle` to entity nodes (deferred for future)
- [x] **WM33** - Add `wikipediaTitle` to representative object nodes (2 nodes)
- [~] **WM34** - Optionally add `wikidataId` for key figures (deferred for future)
- [x] **WM35** - Run dataset validation after updates

### Phase 7: Testing & Verification

- [x] **WM51** - Build passes with no errors
- [x] **WM52** - No linter warnings in new/modified files
- [x] **WM53** - Update CHANGELOG.md with M23 completion notes

## Files Created

- `src/services/wikipedia.ts` - Wikipedia API client
- `src/services/index.ts` - Service barrel export
- `src/hooks/useWikipediaData.ts` - Caching layer hook
- `src/hooks/useNodeEnrichedData.ts` - Fallback logic hook
- `src/components/WikipediaAttribution.tsx` - Attribution UI component
- `src/components/WikipediaAttribution.css` - Attribution styling

## Files Modified

- `GRAPH_SCHEMA.md` - Added `wikipediaTitle` and `wikidataId` fields
- `src/types/node.ts` - Added new fields to node types
- `src/components/NodeInfobox.tsx` - Uses enriched data hook
- `src/hooks/index.ts` - Export new hooks
- `public/datasets/rosicrucian-network/nodes.json` - Added Wikipedia mappings

## Features Delivered

- **Wikipedia Service**: Fetches summaries and thumbnails from Wikipedia REST API
- **Disambiguation Handling**: Automatic retry with node type hints
- **Caching Layer**: LRU cache with 500 entries, 48-hour TTL, localStorage persistence
- **Fallback Logic**: Local data takes precedence, Wikipedia fills gaps
- **Broken Image Fallback**: Detects 404s and falls back to Wikipedia
- **Attribution UI**: Wikipedia "W" icon with link to source article
- **Loading States**: Shimmer animation while fetching
- **Pilot Dataset**: Rosicrucian Network enriched with 10+ nodes
