# M33: Social Sharing & Dynamic OG

**Status**: 🔲 Not Started
**Track**: B (Infrastructure & Backend)
**Depends on**: M24 (Vercel Migration) ✅

## Goal

Migrate from HashRouter to BrowserRouter with Vercel rewrites, and add dynamic OpenGraph image generation via Vercel Edge Functions. This removes the structural limitation preventing rich social previews when sharing links to specific datasets, nodes, or edges.

**Why**: Hash-based URLs (`/#/...`) are ignored by social media crawlers (Twitter, Facebook, LinkedIn, Slack, iMessage). Shared links always show generic site metadata instead of context-specific previews. This is the biggest virality limiter for the application.

## Tasks

### Phase 1: Router Migration

- [ ] **SS1** - Update `src/main.tsx`: Replace `HashRouter` with `BrowserRouter`
- [ ] **SS2** - Update `vercel.json`: Add rewrite rules to serve `index.html` for all client routes
- [ ] **SS3** - Update `src/utils/urlBuilder.ts`: Remove `#` from all `buildFull*Url()` functions
- [ ] **SS4** - Update `src/components/ResourceMeta.tsx`: Change `PRODUCTION_BASE_URL` to Vercel URL
- [ ] **SS5** - Update `index.html`: Change canonical URL and OG URLs to Vercel domain
- [ ] **SS6** - Verify all internal `<Link>` components still work (no code changes needed, just testing)
- [ ] **SS7** - Verify query parameters (`?selected=`, `?layout=`, `?theme=`) work correctly

### Phase 2: Vercel Configuration

- [ ] **SS8** - Create rewrite rules for all route patterns:
  - `/` → `index.html`
  - `/:datasetId` → `index.html`
  - `/:datasetId/explore` → `index.html`
  - `/:datasetId/node/:nodeId` → `index.html`
  - `/:datasetId/from/:sourceId/to/:targetId` → `index.html`
- [ ] **SS9** - Ensure `/api/*` routes are NOT rewritten (preserve existing API endpoints)
- [ ] **SS10** - Ensure `/datasets/*` static files are NOT rewritten
- [ ] **SS11** - Test deployment on Vercel preview branch before merging

### Phase 3: Dynamic OG Image API

- [ ] **SS12** - Create `api/og.ts` Vercel Edge Function for dynamic OG images
- [ ] **SS13** - Accept query parameters: `dataset`, `node`, `edge`, `sourceId`, `targetId`
- [ ] **SS14** - Fetch node/edge data from dataset JSON files
- [ ] **SS15** - Generate OG image using `@vercel/og` (Satori-based image generation)
- [ ] **SS16** - Design OG image template:
  - Dataset name + node/edge title
  - Brief description or relationship type
  - Scenius branding
  - Appropriate dimensions (1200×630 for standard, 1200×600 for Twitter)
- [ ] **SS17** - Handle fallback for invalid/missing nodes (generic Scenius image)
- [ ] **SS18** - Set appropriate cache headers for generated images

### Phase 4: Dynamic Meta Tags

- [ ] **SS19** - Update `ResourceMeta.tsx` to point `og:image` to `/api/og?...` with appropriate params
- [ ] **SS20** - For NodeDetailPage: `og:image=/api/og?dataset=X&node=Y`
- [ ] **SS21** - For EdgeDetailPage: `og:image=/api/og?dataset=X&sourceId=Y&targetId=Z`
- [ ] **SS22** - For DatasetOverviewPage: `og:image=/api/og?dataset=X`
- [ ] **SS23** - For HomePage and explore views: use static default OG image
- [ ] **SS24** - Test meta tag updates with browser dev tools (Elements panel)

### Phase 5: Crawler Prerendering (Optional Enhancement)

- [ ] **SS25** - Evaluate if Vercel's built-in ISR/prerendering helps crawlers
- [ ] **SS26** - If needed: Add user-agent detection to serve prerendered HTML to bots
- [ ] **SS27** - Alternative: Document that OG images work but full HTML prerendering is future work

### Phase 6: Testing & Validation

- [ ] **SS28** - Test all routes work without hash:
  - `/` (homepage)
  - `/ai-llm-research` (dataset overview)
  - `/ai-llm-research/explore` (explore view)
  - `/ai-llm-research/node/person-geoffrey-hinton` (node detail)
  - `/ai-llm-research/from/person-x/to/person-y` (edge detail)
- [ ] **SS29** - Test direct URL access (paste URL, hit enter - should not 404)
- [ ] **SS30** - Test browser back/forward navigation
- [ ] **SS31** - Test sharing buttons produce correct URLs (no `#`)
- [ ] **SS32** - Test OG image endpoint returns valid images
- [ ] **SS33** - Validate OG tags with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] **SS34** - Validate OG tags with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] **SS35** - Validate OG tags with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [ ] **SS36** - Test OG image appears in Slack/Discord link previews

### Phase 7: GitHub Pages Removal

- [ ] **SS37** - Delete `.github/workflows/deploy.yml`
- [ ] **SS38** - Update `AGENTS.md`: Remove GitHub Pages references and backup URL
- [ ] **SS39** - Update `README.md`: Remove GitHub Pages URL, update to Vercel-only
- [ ] **SS40** - Optionally: Archive or delete the `gh-pages` branch on GitHub
- [ ] **SS41** - Update any hardcoded `moxious.github.io` references in codebase

### Phase 8: Documentation & Completion

- [ ] **SS42** - Update `CHANGELOG.md` with M33 completion notes
- [ ] **SS43** - Update milestone status in `milestones/index.md`
- [ ] **SS44** - Verify production deployment works end-to-end

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Router type | BrowserRouter | Enables clean URLs that crawlers can read |
| Legacy hash URL support | None | Low traffic, prioritizing growth over backward compat |
| OG image generation | @vercel/og Edge Function | Fast, serverless, no external dependencies |
| OG image dimensions | 1200×630 | Standard size supported by all platforms |
| GitHub Pages | Remove completely | Single deployment target simplifies maintenance |
| Prerendering | Deferred (OG images first) | OG images solve 80% of sharing problem |

## Technical Notes

### Vercel Rewrite Configuration

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/datasets/:path*", "destination": "/datasets/:path*" },
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

### OG Image API Signature

```
GET /api/og?dataset=ai-llm-research&node=person-geoffrey-hinton
GET /api/og?dataset=ai-llm-research&sourceId=person-x&targetId=person-y
GET /api/og?dataset=ai-llm-research
GET /api/og (fallback: generic Scenius image)
```

### URL Changes

| Before (Hash) | After (Browser) |
|--------------|-----------------|
| `/#/` | `/` |
| `/#/ai-llm-research` | `/ai-llm-research` |
| `/#/ai-llm-research/explore?layout=timeline` | `/ai-llm-research/explore?layout=timeline` |
| `/#/ai-llm-research/node/person-hinton` | `/ai-llm-research/node/person-hinton` |

## Files to Create

- `api/og.ts` - Dynamic OG image Edge Function

## Files to Modify

- `src/main.tsx` - Router swap
- `src/utils/urlBuilder.ts` - Remove hash from full URLs
- `src/components/ResourceMeta.tsx` - Update base URL, add dynamic OG image URLs
- `vercel.json` - Add rewrite rules
- `index.html` - Update canonical and OG URLs
- `AGENTS.md` - Remove GitHub Pages references
- `README.md` - Remove GitHub Pages references
- `CHANGELOG.md` - Document changes

## Files to Delete

- `.github/workflows/deploy.yml` - GitHub Pages deployment workflow

## Success Criteria

1. All URLs work without `#` prefix
2. Direct URL access loads correct content (no 404)
3. Sharing a node URL to Twitter/Slack shows custom preview with node name
4. OG images generate correctly for datasets, nodes, and edges
5. No GitHub Pages deployment remains
6. All existing functionality preserved
