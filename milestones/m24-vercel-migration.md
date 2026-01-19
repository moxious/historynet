# M24: Vercel Migration

**Status**: ✅ Complete (2026-01-19)
**Track**: B (Infrastructure & Backend)
**Depends on**: None (Foundation for M25, M26, M29)

## Goal

Migrate deployment from GitHub Pages to Vercel to enable serverless API functions. Keep GitHub Pages as a backup deployment.

## Deployment URLs

- **Primary**: https://scenius-seven.vercel.app/ (Vercel, with API support)
- **Backup**: https://moxious.github.io/historynet/ (GitHub Pages, frontend only)

## Key Deliverables

- [x] Vercel project linked to GitHub repository with auto-deploy on push to `main`
- [x] `/api/health` serverless endpoint returning `{ status: "ok", timestamp, environment }`
- [x] CORS headers allowing cross-origin requests (all data is public)
- [x] Dual deployment: pushing to `main` triggers both Vercel and GitHub Pages
- [x] Documentation updated (AGENTS.md, README.md, ROADMAP.md, CHEATSHEET.md, CHANGELOG.md)

## Architecture Decision

**Stayed with Vite** - Evaluated Next.js but rejected due to migration cost vs. benefit for simple serverless needs. Vite + Vercel Serverless Functions is sufficient for:
- Health check endpoint (M24)
- Feedback submission endpoint (M25)
- Cross-scene index API (M29)

## Files Created

- `api/health.ts` - Health check serverless function

## Files Modified

- `.gitignore` - Added `.vercel/`
- `package.json` - Added `@vercel/node` dev dependency
- `AGENTS.md` - Updated with new URLs and API info
- `README.md` - Updated deployment section
- `ROADMAP.md` - Updated live demo URL
- `CHEATSHEET.md` - Updated URLs

## Verification Completed

- [x] API health endpoint returns correct JSON with CORS headers
- [x] All 11 datasets load correctly on Vercel
- [x] All 3 layouts (Graph, Timeline, Radial) work
- [x] Deep links and URL parameters work
- [x] Theme switching works
- [x] Dual deployment verified (both update on push)

## API Endpoints

| Endpoint | Method | Response |
|----------|--------|----------|
| `/api/health` | GET | `{ status: "ok", timestamp: "...", environment: "..." }` |

## Future Endpoints (Planned)

- `/api/submit-feedback` (M25) - Create GitHub issues from user feedback
- `/api/node-scenes` (M29) - Query cross-scene node appearances
