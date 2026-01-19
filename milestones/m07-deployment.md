# M7: Deployment

**Status**: ✅ Complete (2026-01-18)
**Track**: MVP (Core Application)
**Depends on**: M6 (Search & Polish)

## Goal

Configure production build, GitHub Actions CI/CD, and deploy to GitHub Pages with verified deep linking support.

## Tasks

### Build Configuration
- [x] Configure Vite for production build
- [x] Set up base URL for GitHub Pages (hash routing if needed)
- [x] Verify production build works locally (`npm run build && npm run preview`)
- [x] Optimize bundle size (analyze with rollup-plugin-visualizer if needed)

### GitHub Actions
- [x] Create `.github/workflows/deploy.yml`
- [x] Configure workflow to trigger on push to main
- [x] Set up Node.js and install dependencies
- [x] Run build command
- [x] Deploy to GitHub Pages branch

### Verification
- [x] Enable GitHub Pages in repository settings (configured to deploy from `gh-pages` branch)
- [x] Verify deployment succeeds
- [x] Test live URL loads correctly: https://moxious.github.io/historynet/
- [x] Test deep linking (URL with filters) works
- [x] Test dataset switching works on live site

### Documentation
- [x] Add live demo URL to README
- [x] Document deployment process
- [x] Add badge for deployment status

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Router type | HashRouter | GitHub Pages compatibility (no server-side routing) |
| Deployment branch | gh-pages | Standard GitHub Pages setup |
| Build trigger | Push to main | Simple, automatic deployments |

## Completion Notes

```
[2026-01-18] @claude: Completed Milestone 7 - Deployment Configuration
- Configured Vite for production builds:
  - Set base URL dynamically: '/historynet/' when GITHUB_ACTIONS env var is set
  - Added vendor chunk splitting for react-vendor and d3-vendor
  - Set chunkSizeWarningLimit to 600KB
  
- Switched from BrowserRouter to HashRouter for GitHub Pages compatibility:
  - URLs now use hash format: https://moxious.github.io/historynet/#/?dataset=xyz
  - Deep linking works correctly with GitHub Pages static hosting
  
- Created GitHub Actions workflow (.github/workflows/deploy.yml):
  - Triggers on push to main branch and manual workflow_dispatch
  - Uses Node.js 20 with npm caching
  - Runs linter and TypeScript type checking before build
  - Uses actions/configure-pages, upload-pages-artifact, and deploy-pages
  - Concurrent deployments are prevented with concurrency groups
  
- Verified production build locally:
  - Build succeeds with clean output
  - Generates separate chunks: index.js (~52KB), react-vendor (~177KB), d3-vendor (~61KB)
  - CSS bundle: ~31KB
  - Datasets correctly copied to dist/
  
- Updated README.md and AGENTS.md with:
  - GitHub Actions deployment status badge
  - Live demo link: https://moxious.github.io/historynet/
  - Deployment documentation section
  - URL structure examples for hash routing

[2026-01-18] @claude: Fixed dataset loading for GitHub Pages deployment
- Issue: Datasets returning 404 because dataLoader used absolute path '/datasets/...'
- Fix: Updated src/utils/dataLoader.ts to use import.meta.env.BASE_URL
  - getDatasetsBasePath() now constructs path from Vite's BASE_URL
  - Local dev: '/datasets/...'
  - GitHub Pages: '/historynet/datasets/...'

[2026-01-18] @claude: Diagnosed GitHub Pages configuration issue
- Issue: Site was serving source files (index.html with /src/main.tsx) instead of built dist/
- Cause: GitHub Pages was configured for "Deploy from a branch" but serving from main instead of gh-pages
- Evidence: package.json was publicly accessible at the deploy URL (shouldn't be!)

[2026-01-18] @claude: Final fix - switched to gh-pages branch deployment
- Updated workflow to use peaceiris/actions-gh-pages@v4
- Workflow now pushes built files to gh-pages branch
- User configured GitHub Pages to deploy from gh-pages branch (root)
- Site now working correctly at https://moxious.github.io/historynet/

✅ MILESTONE 7 COMPLETE - Deployment fully operational
- Production URL: https://moxious.github.io/historynet/
- GitHub Repository: https://github.com/moxious/historynet
- Deployment: Automatic on push to main via GitHub Actions → gh-pages branch
```
