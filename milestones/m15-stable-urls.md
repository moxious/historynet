# M15: Stable Resource URLs

**Status**: ✅ Complete (2026-01-18)
**Track**: Post-MVP Polish
**Depends on**: M14 (Timeline Improvements)

## Goal

Give every node and edge a permanent, shareable URL (permalink) that loads a standalone detail page. Enable external citation, bookmarking, and lay the foundation for per-item user feedback.

**URL Structure**:
- Nodes: `/#/{dataset-id}/node/{node-id}`
- Edges: `/#/{dataset-id}/from/{source-id}/to/{target-id}` (shows all edges between pair)

## Tasks

### Routing Architecture

- [x] **SR1** - Design route structure and document URL patterns in codebase
- [x] **SR2** - Add new routes to React Router configuration in `App.tsx`
  - `/:datasetId/node/:nodeId` - Node detail page
  - `/:datasetId/from/:sourceId/to/:targetId` - Edge detail page (between node pair)
- [x] **SR3** - Create route parameter extraction hook `useResourceParams` in `src/hooks/`
- [x] **SR4** - Ensure routes work with HashRouter (required for GitHub Pages)
- [x] **SR5** - Handle invalid routes gracefully (404-style page or redirect to main view)
- [x] **SR6** - Test: direct URL access loads correct resource page

### Node Detail Page

- [x] **SR7** - Create `NodeDetailPage` component in `src/pages/`
- [x] **SR8** - Load dataset and find node by ID from route params
- [x] **SR9** - Display node information using same fields as `NodeInfobox`
- [x] **SR10** - Style page consistently with main application
- [x] **SR11** - Add "View in Graph" button linking to `/#/?dataset={id}&selected={nodeId}&type=node`
- [x] **SR12** - Add breadcrumb navigation: `{Dataset Name} > {Node Type} > {Node Title}`
- [x] **SR13** - Handle loading state while dataset fetches
- [x] **SR14** - Handle error state if node ID not found in dataset

### Edge Detail Page

- [x] **SR15** - Create `EdgeDetailPage` component in `src/pages/`
- [x] **SR16** - Load dataset and find all edges between source and target nodes
- [x] **SR17** - Display source and target node summary cards (name, type, image thumbnail)
- [x] **SR18** - Display edge information (relationship, description, dates, evidence, strength)
- [x] **SR19** - Handle case where multiple edges exist between same pair (list all)
- [x] **SR20** - Handle case where no edges exist between pair (show message, not error)
- [x] **SR21** - Add "View in Graph" button linking to graph with edge selected
- [x] **SR22** - Add clickable links to source/target node detail pages
- [x] **SR23** - Style consistently with node detail page
- [x] **SR24** - Handle loading and error states

### Permalink & Share UI (InfoboxPanel Integration)

- [x] **SR25** - Create `ShareButtons` component with Permalink and Share buttons
- [x] **SR26** - Implement "Permalink" button that copies stable URL to clipboard
- [x] **SR27** - Implement "Share" button using Web Share API (with fallback to copy)
- [x] **SR28** - Add visual feedback on successful copy ("Copied!" text with checkmark)
- [x] **SR29** - Generate correct stable URL based on selected item type
- [x] **SR30** - Integrate `ShareButtons` into `InfoboxPanel` component (shared by Node/Edge)
- [x] **SR31** - Style buttons to match existing infobox aesthetic
- [x] **SR32** - Test: clicking Permalink copies correct URL for both nodes and edges

### Meta Tags (SEO & Social Sharing)

- [x] **SR33** - Install `react-helmet-async` for dynamic meta tag management
- [x] **SR34** - Create `ResourceMeta` component for setting page-specific meta tags
- [x] **SR35** - Set dynamic `<title>` tag: `{Item Title} | {Dataset Name} | Scenius`
- [x] **SR36** - Set `<meta name="description">` from node/edge short description
- [x] **SR37** - Set Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`
- [x] **SR38** - Set `og:image` to node image if available, otherwise default app image
- [x] **SR39** - Apply `ResourceMeta` to both `NodeDetailPage` and `EdgeDetailPage`
- [x] **SR40** - Document meta tag limitations for pure client-side SPA in code comments

### Navigation & UX

- [x] **SR41** - Ensure browser back button works correctly from detail pages
- [x] **SR42** - Add link from detail pages back to dataset (via breadcrumb)
- [x] **SR43** - Test: navigating between detail pages updates URL correctly

### Testing & Verification

- [x] **SR44** - Test all node types render correctly on detail pages (person, object, location, entity)
- [x] **SR45** - Test edge detail page with single edge between pair
- [x] **SR46** - Test with multiple datasets (Disney, Enlightenment)
- [x] **SR47** - Test invalid node ID shows appropriate error/not-found state
- [x] **SR48** - Test invalid dataset ID shows appropriate error state
- [x] **SR49** - Test Permalink/Share buttons on both graph view infobox and detail pages
- [x] **SR50** - Build passes with no errors

## Implementation Notes

- Created `src/pages/` folder for standalone page components
- Added `useResourceParams` hook for extracting route parameters
- Added `buildFullNodeUrl`/`buildFullEdgeUrl` for shareable URLs (with hash)
- Added `buildNodeUrl`/`buildEdgeUrl`/`buildGraphViewUrl` for internal navigation (without hash)
- ShareButtons integrated into InfoboxPanel to work with both graph view and detail pages
- ResourceMeta component uses react-helmet-async for client-side meta tag management
- Note: Meta tags update client-side only; social media crawlers may not see dynamic content without SSR
