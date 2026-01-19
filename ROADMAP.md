# HistoryNet - Roadmap

This document outlines the milestone structure and future direction for HistoryNet. For detailed task tracking, see `PROGRESS.md`.

**Live Demo**: https://moxious.github.io/historynet/

---

## Milestone Overview

| # | Milestone | Status |
|---|-----------|--------|
| M1-M7 | MVP (Bootstrap through Deployment) | ✅ Complete |
| M8 | Timeline View | ✅ Complete |
| M9 | Application Verification | ✅ Complete |
| M10 | UX Improvements | ✅ Complete |
| M11 | Graph Interaction Polish | ✅ Complete |
| M12 | User Feedback | 🔲 Future |
| M13 | Scenius Rebrand & Theme System | ✅ Complete |
| M14 | Timeline Improvements | ✅ Complete |
| M15 | Stable Resource URLs | ✅ Complete |
| M16 | Network Verification | ✅ Complete |
| M17 | Dataset Search & Filter | 🔲 Future |
| M18 | Adapt for Mobile | 🔲 Future |

> **Note**: Independent milestones (those without dependencies on each other) may be executed out of order based on priority and availability. See the Milestone Dependencies section for details on which milestones can be parallelized.

---

## Completed: MVP + Post-MVP Polish (M1-M11, M14)

The core application is complete, polished, and deployed:

- **Graph Visualization**: Force-directed D3 layout with zoom/pan, type-based node shapes, relationship-colored edges, tuned physics
- **Timeline Visualization**: Vertical timeline with date positioning, lifespan markers, automatic lane assignment, improved readability
- **Infobox Panel**: Node/edge detail display with type-specific fields, images, internal links, evidence, natural language edge descriptions
- **Filtering**: Date range and text filters with URL sync, debounced inputs, collapsible panel
- **Search**: Instant highlighting with keyboard shortcut (Cmd/Ctrl+K), clear visual distinction from filtering
- **Dataset Switching**: Dropdown with metadata display
- **URL State**: Deep linking for all view state
- **Deployment**: GitHub Pages via GitHub Actions

**Shipped Datasets**: Disney Characters, Rosicrucian Network, Enlightenment, AI-LLM Research

See `HISTORY.md` for detailed implementation history and completion notes.

---

## Completed: M9-M11, M13, M14

The following milestones have been completed. See `HISTORY.md` for detailed task lists and implementation notes.

### M9 - Application Verification ✅
Systematic verification of all shipped features with principal-level code review. Key fixes: Enlightenment dataset registration, README link correction.

### M10 - UX Improvements ✅
Debounced filter inputs, simplified labels, InfoboxPanel hidden when no selection, filter panel collapsed by default, edge infobox natural language descriptions, search vs filter clarification.

### M11 - Graph Interaction Polish ✅
Memoized click handlers to prevent graph re-layout, physics tuning (reduced repulsion, added soft gravity), zoom/pan hint for discoverability, removed ID fields from infobox.

### M13 - Scenius Rebrand & Theme System ✅
Application rebranded from "HistoryNet" to "Scenius" with new tagline "Mapping collective genius". Full light/dark theme system with URL parameter support (`?theme=dark`), localStorage persistence, and theme-aware visualizations. New SVG favicon with interconnected nodes design.

### M14 - Timeline Improvements ✅
300px left margin for filter panel clearance, improved year label readability, initial zoom focus on first item, node-type legend matching graph view, verified infobox behavior parity. Gap collapse feature researched but deferred.

See `HISTORY.md` for detailed task lists and implementation notes for all completed milestones.

---

## Future: M12 - User Feedback

**Goal**: Allow users to submit feedback about graph data (missing nodes, incorrect information, suggested changes) without requiring a GitHub account. Feedback is captured as GitHub issues for dataset maintainers to review.

**Architecture Decision**: Migrate from GitHub Pages to Vercel to enable serverless API functions. This consolidates hosting and backend on a single platform.

**Note**: If M15 (Stable Resource URLs) is completed before this milestone, feedback forms should be integrated into the stable resource pages as well as the main graph view. Each node/edge page becomes a natural place for item-specific feedback.

**Deliverables**:

### Platform Migration
- Migrate deployment from GitHub Pages to Vercel
- Configure Vercel project with GitHub integration
- Set up environment variables for GitHub PAT
- Update documentation with new deployment URL

### Frontend Feedback Form
- Feedback form component (modal or slide-out panel)
- Context-aware: captures current dataset, selected node/edge, current URL
- Feedback types: missing node, missing edge, incorrect data, remove item, general
- Fields for description, suggested change, evidence URLs
- Optional contact email for follow-up
- Form validation and user-friendly error handling

### Serverless API Endpoint
- `/api/submit-feedback` endpoint (Vercel serverless function)
- Input validation and sanitization
- GitHub issue creation via GitHub API
- Structured issue body with all feedback details
- Appropriate labels applied automatically
- Rate limiting to prevent abuse
- Return issue URL to user on success

### Security & Anti-Abuse
- Rate limiting by IP address
- Input sanitization (prevent injection)
- Honeypot field for bot detection
- Optional: CAPTCHA integration if abuse occurs

**Schema** (feedback submission):
```typescript
interface FeedbackSubmission {
  feedbackType: 'missing_node' | 'missing_edge' | 'incorrect_data' | 'remove_item' | 'general';
  dataset: string;
  selectedNodeId?: string;
  selectedEdgeId?: string;
  currentUrl?: string;
  title: string;
  description: string;
  suggestedChange?: string;
  evidenceUrls?: string[];
  evidenceText?: string;
  contactEmail?: string;
}
```

---

## Future: M15 - Stable Resource URLs

**Goal**: Give every node and edge across all datasets a permanent, shareable URL (permalink) that loads a standalone detail page. This enables external citation, bookmarking, and serves as the foundation for per-item user feedback in future milestones.

**Context**: Currently, items can be deep-linked via query parameters (e.g., `?dataset=disney&selected=person-mickey-mouse&type=node`), but these URLs are tied to the graph view. Stable resource URLs provide a cleaner, more "resource-like" URL structure that treats each node and edge as a first-class addressable resource.

**Deliverables**:

### URL Routing Architecture

New path-based routes (using HashRouter for GitHub Pages compatibility):

**Node URLs**:
```
/#/{dataset-id}/node/{node-id}
```
Examples:
- `/#/disney-characters/node/person-mickey-mouse`
- `/#/enlightenment/node/person-voltaire`
- `/#/rosicrucian-network/node/object-fama-fraternitatis`

**Edge URLs** (by source/target pair):
```
/#/{dataset-id}/from/{source-id}/to/{target-id}
```
Examples:
- `/#/disney-characters/from/person-mickey-mouse/to/person-minnie-mouse`
- `/#/enlightenment/from/person-voltaire/to/person-frederick-great`

Note: Edge URLs show **all edges** between the source and target nodes on a single page, since multiple relationships may exist between the same pair of entities.

### Standalone Resource Pages

- **Node Detail Page**: Renders the same content as the infobox panel (title, type, dates, description, biography, image, external links, etc.) but as a full standalone page
- **Edge Detail Page**: Renders edge information (relationship type, evidence, dates) plus summary cards for both source and target nodes. Shows all edges between the pair if multiple exist.
- **No graph visualization** on these pages—they are pure detail views
- Consistent styling with the main application
- Clear navigation back to the graph view ("View in Graph" button)

### Permalink & Share UI

- Add "Permalink" button/icon to the InfoboxPanel that copies the stable URL to clipboard
- Add "Share" button/icon that opens native share dialog (if available) or copies URL
- Visual feedback on copy (e.g., "Copied!" toast or icon change)
- Both buttons should be visible for both nodes and edges

### Meta Tags for SEO & Social Sharing

Each stable page should have dynamic meta tags:

- `<title>`: `{Node Title} | {Dataset Name} | HistoryNet`
- `<meta name="description">`: Short description from the node/edge
- `<meta property="og:title">`: Same as title
- `<meta property="og:description">`: Short description
- `<meta property="og:type">`: `article` or `website`
- `<meta property="og:url">`: Canonical URL of the page
- `<meta property="og:image">`: Node image if available, or default app image

Note: Dynamic meta tags in an SPA require either server-side rendering or a prerendering strategy. For GitHub Pages, consider using `react-helmet` or similar for client-side updates (works for users, limited for crawlers), or document that full SEO requires the Vercel migration in M12.

### Navigation & Back Links

- "View in Graph" button that navigates to `/#/?dataset={id}&selected={node-id}&type=node`
- Breadcrumb or header showing: `Dataset Name > Node Type > Node Title`
- If arriving from a graph deep link, browser back button should work correctly

---

## Completed: M16 - Network Verification ✅

**Goal**: Implement build-time CLI validation tools that verify all datasets conform to the graph schema before deployment. Invalid or malformed datasets should fail the build, preventing broken data from reaching production.

**Architecture**: TypeScript CLI scripts executed via npm, integrated into the GitHub Actions workflow after the build step. Validation runs against the JSON files in `public/datasets/`.

**Key Principle**: This is **build-time only** validation. No validation code should be shipped to the runtime bundle. The CLI tools live in a separate `scripts/` directory and are excluded from the production build.

**Deliverables**:

### CLI Tool Architecture

Create validation scripts in `scripts/validate-datasets/`:

```
scripts/
└── validate-datasets/
    ├── index.ts           # Main entry point
    ├── validators/
    │   ├── json-syntax.ts    # JSON parsing validation
    │   ├── manifest.ts       # Manifest schema validation
    │   ├── nodes.ts          # Node schema validation
    │   ├── edges.ts          # Edge schema validation
    │   └── cross-references.ts # Referential integrity
    ├── types.ts           # Validation types and interfaces
    └── reporter.ts        # Output formatting (errors, warnings, summary)
```

### JSON Syntax Validation
- Verify all JSON files parse without errors
- Report specific parsing errors with line numbers when possible
- Validate file encoding (UTF-8)

### Manifest Validation
- Required fields: `id`, `name`
- Recommended fields warning: `description`, `lastUpdated`, `version`
- Verify `id` matches directory name
- Validate `customRelationshipTypes` structure if present

### Node Validation
- **Required fields**: `id`, `type`, `title`
- **Type validation**: `type` must be one of `"person"`, `"object"`, `"location"`, `"entity"`
- **ID format**: Warning if ID doesn't follow `{type}-{slug}` pattern
- **Date validation**: If `dateStart` or `dateEnd` present, validate ISO 8601 or year-only format
- **URL validation**: If `imageUrl` or `externalLinks` present, validate URL format
- **Type-specific fields**: Warn if type-specific recommended fields missing (e.g., `biography` for persons, `objectType` for objects)
- **Duplicate detection**: Error if multiple nodes share the same ID

### Edge Validation
- **Required fields**: `id`, `source`, `target`, `relationship`
- **Relationship type**: Validate against known types or documented custom types in manifest
- **Date validation**: Same rules as nodes
- **Evidence warning**: Warning if edge lacks `evidence`, `evidenceNodeId`, or `evidenceUrl`
- **Duplicate detection**: Error if multiple edges share the same ID

### Cross-Reference Validation
- **Referential integrity**: Every `source` and `target` in edges must exist in nodes
- **Orphan detection**: Warning for nodes with no connected edges (configurable)
- **Evidence node validation**: If `evidenceNodeId` specified, verify it exists in nodes
- **Internal link validation**: Validate any node ID references in custom fields

### npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "validate:datasets": "npx tsx scripts/validate-datasets/index.ts",
    "validate:datasets:strict": "npx tsx scripts/validate-datasets/index.ts --strict"
  }
}
```

Options:
- `--strict`: Treat warnings as errors
- `--dataset <id>`: Validate only a specific dataset
- `--quiet`: Only output errors and final summary
- `--json`: Output results as JSON (for CI parsing)

### Output Format

Human-readable output with severity levels:

```
🔍 Validating datasets...

📁 disney-characters/
  ✅ manifest.json - valid
  ✅ nodes.json - valid (47 nodes)
  ⚠️  edges.json - 3 warnings
     └─ edge-001: missing evidence field
     └─ edge-015: missing evidence field
     └─ edge-023: missing evidence field
  ✅ Cross-references valid

📁 enlightenment/
  ✅ manifest.json - valid
  ❌ nodes.json - 1 error
     └─ person-voltaire-2: duplicate node ID (line 45)
  ⏭️  Skipping further validation due to errors

📊 Summary:
   Datasets: 4 checked, 3 passed, 1 failed
   Errors: 1
   Warnings: 3

❌ Validation failed
```

### GitHub Actions Integration

Update `.github/workflows/deploy.yml` to add validation step:

```yaml
- name: Validate datasets
  run: npm run validate:datasets

- name: Build for production
  run: npm run build
```

Validation runs **before** build to fail fast. Build artifacts are not created if datasets are invalid.

### Error Categories

| Category | Severity | Build Impact |
|----------|----------|--------------|
| JSON parse error | Error | ❌ Fails build |
| Missing required field | Error | ❌ Fails build |
| Invalid node type | Error | ❌ Fails build |
| Duplicate ID | Error | ❌ Fails build |
| Broken reference (source/target) | Error | ❌ Fails build |
| Invalid date format | Error | ❌ Fails build |
| Missing recommended field | Warning | ⚠️ Logged only |
| Missing evidence | Warning | ⚠️ Logged only |
| Orphan node | Warning | ⚠️ Logged only |
| Non-standard ID format | Warning | ⚠️ Logged only |

### Development Dependencies

Add to `devDependencies`:
- `tsx` - TypeScript execution (already likely present)
- `zod` - Schema validation (recommended for type-safe validation)

### Tasks

1. [x] Create `scripts/validate-datasets/` directory structure
2. [x] Implement JSON syntax validator
3. [x] Implement manifest schema validator
4. [x] Implement node schema validator with type-specific rules
5. [x] Implement edge schema validator
6. [x] Implement cross-reference validator
7. [x] Implement reporter with colored output and summary
8. [x] Add CLI argument parsing (--strict, --dataset, --quiet, --json)
9. [x] Add npm scripts to package.json
10. [x] Update GitHub Actions workflow to run validation before build
11. [x] Add validation documentation to AGENTS.md
12. [x] Test against all existing datasets, fix any discovered issues

---

## Future: M17 - Dataset Search & Filter

**Goal**: Replace the current dataset dropdown with a searchable combobox that allows users to quickly find datasets by typing keywords. As the number of available datasets grows, the simple dropdown becomes unwieldy—users should be able to type a word or two to filter the list by dataset name or description.

**Context**: The current `DatasetSelector` component displays all available datasets in a plain dropdown. With only 4 datasets this works well, but as more historical networks are added, users need a faster way to locate the dataset they want without scrolling through a long list.

**Deliverables**:

### Searchable Combobox Component

- Transform the dataset dropdown into a searchable combobox (text input + filtered dropdown)
- On focus or click, show the full list of datasets
- On typing, filter the visible datasets in real-time
- Match against both `name` and `description` fields from dataset manifests
- Case-insensitive matching
- Highlight matching text in results (optional enhancement)

### Search Behavior

- **Instant filtering**: Filter results as the user types (debounced if needed for performance)
- **Match anywhere**: Search term can match anywhere in name or description (not just prefix)
- **Empty state**: Show "No matching datasets" message when filter returns no results
- **Clear button**: Allow users to clear the search input and see all datasets again

### Keyboard Navigation

- Arrow keys navigate through filtered results
- Enter selects the highlighted dataset
- Escape closes the dropdown and clears search
- Tab moves focus appropriately
- Maintain accessibility (ARIA attributes for combobox pattern)

### Visual Design

- Consistent styling with existing application theme (light/dark mode support)
- Dataset items show name and description snippet (as current dropdown does)
- Visual distinction between currently selected dataset and hovered/highlighted item
- Smooth transitions when filtering

### URL State Integration

- Selected dataset continues to sync with URL (`?dataset=...`)
- Search/filter state is ephemeral (not persisted to URL)

**Technical Notes**:

Consider using an established combobox/autocomplete pattern or library:
- Native HTML `<datalist>` (limited styling)
- Headless UI (Downshift, React Aria, Radix)
- Custom implementation following ARIA combobox pattern

The component should gracefully handle:
- Empty datasets array (show helpful message)
- Very long dataset descriptions (truncate in dropdown, show full on hover or in tooltip)
- Rapid typing (debounce the filter if needed)

**Schema** (no changes required—uses existing manifest metadata):
```typescript
// From existing DatasetManifest
interface DatasetManifest {
  id: string;
  name: string;
  description?: string;
  // ... other fields
}
```

---

## Future: M18 - Adapt for Mobile

**Goal**: Make Scenius fully usable on mobile devices (iPad and iPhone). The current layout has basic 768px responsive breakpoints but suffers from header overflow, fixed panel heights that don't suit mobile interaction patterns, and insufficient touch target sizes. This milestone transforms the application into a mobile-first experience while preserving the desktop layout.

**Context**: The application currently uses a side-by-side layout (graph + infobox panel) that switches to a stacked layout at 768px. However, this approach has significant issues on phones:
- Header controls overflow on narrow screens (< 520px needed for all controls)
- Fixed 40% InfoboxPanel height doesn't allow users to maximize the graph
- No safe area handling for iPhone notches and home indicators
- Touch targets below Apple's 44pt minimum recommendation
- FilterPanel floats over the graph, blocking content on small screens

**Design Philosophy**: Mobile users should be able to:
1. See the full graph visualization with minimal UI chrome
2. Access controls through progressive disclosure (hamburger menu, bottom sheets)
3. Use comfortable touch targets throughout
4. Navigate using familiar mobile patterns (swipe gestures, bottom sheets)

**Deliverables**:

### 1. Responsive Header with Hamburger Menu (High Priority)

Transform the header for mobile screens to prevent overflow and improve usability.

**Current Problem**: At 375px width (iPhone SE), controls total ~520px and overflow.

**Solution**:
- At < 640px: Collapse controls into a hamburger menu
- Keep visible: Logo/title, search trigger (icon), menu button
- Move to menu: Dataset selector, Layout switcher, Theme toggle

**Mobile Header Layout**:
```
┌─────────────────────────────────┐
│ Scenius        [🔍]        [≡] │
└─────────────────────────────────┘
```

**Hamburger Menu Contents**:
- Dataset selector (full-width)
- Layout switcher (Graph / Timeline)
- Theme toggle (Light / Dark)
- Links to any future settings

**Implementation Notes**:
- Create `MobileMenu` component (slide-in drawer from right or modal)
- Add `useMediaQuery` hook or CSS-only approach with checkbox hack
- Hamburger button should be 44×44px minimum
- Menu should have backdrop overlay that closes on tap
- Consider animation (slide-in, fade)

### 2. Safe Area Insets for iPhone (High Priority)

Prevent content from being obscured by iPhone notches, Dynamic Island, and home indicator.

**Implementation**:

Add CSS environment variables:
```css
:root {
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-left: env(safe-area-inset-left, 0px);
  --safe-area-right: env(safe-area-inset-right, 0px);
}
```

Apply to key elements:
- Header: Add `padding-top: var(--safe-area-top)` on mobile
- Bottom sheet/bar: Add `padding-bottom: var(--safe-area-bottom)` 
- FilterPanel: Respect left safe area in landscape

Also add viewport meta tag if not present:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

### 3. Touch-Friendly Target Sizes (High Priority)

Increase all interactive elements to meet Apple's 44×44pt minimum touch target guideline.

**Elements to audit and update**:
- Close buttons (currently 32×32px) → 44×44px
- Filter panel toggle
- SearchBox clear button
- Theme toggle
- LayoutSwitcher tabs
- Zoom control buttons in graph/timeline
- All form inputs and buttons

**Implementation approach**:
- Add mobile-specific size overrides in media queries
- Use `min-width`/`min-height` to ensure touch targets
- May need to adjust padding/margins for visual balance
- Test with actual touch input, not just visual inspection

### 4. Bottom Sheet InfoboxPanel (Medium Priority)

Replace the fixed-height stacked panel with a draggable bottom sheet pattern for mobile devices.

**Current Problem**: Fixed 40% height doesn't let users maximize graph space; scrolling within the panel competes with page scrolling.

**Bottom Sheet States**:
1. **Hidden**: No selection, sheet not visible (graph uses full height)
2. **Peek**: Selection made, shows title bar + peek content (~100px)
3. **Expanded**: User swipes up or taps, shows full content (~60% of screen)
4. **Dismissed**: User swipes down from peek, returns to hidden

**Visual Design**:
```
┌─────────────────────┐
│ Logo  [🔍]  [≡]     │  Header
├─────────────────────┤
│                     │
│    Full-height      │
│    Graph Area       │  (no fixed bottom section)
│                     │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ ═══════════════════ │  ← Drag handle indicator
│ Mickey Mouse   [×]  │  Peek state
├─────────────────────┤
│ (swipe up to expand)│  
│ Full node details   │  Expanded state
│ ...                 │
└─────────────────────┘
```

**Implementation Notes**:
- Create `BottomSheet` component (reusable for future features)
- Use touch events for drag gestures (`touchstart`, `touchmove`, `touchend`)
- Add momentum/velocity detection for natural-feeling swipes
- Snap to discrete states (not arbitrary positions)
- Consider existing library: `react-spring-bottom-sheet`, `framer-motion`
- Preserve scroll position within sheet when collapsing/expanding
- Only apply on mobile (< 768px); desktop keeps side panel

**Gesture Details**:
- Drag handle at top of sheet for grab affordance
- Swipe down from peek → dismiss (hide sheet)
- Swipe up from peek → expand
- Swipe down from expanded → peek (not dismiss)
- Tap outside sheet → no action (unlike a modal)

### 5. Filter Drawer/Modal Pattern (Medium Priority)

Replace the floating FilterPanel overlay with a dedicated drawer or modal on mobile.

**Current Problem**: FilterPanel floats over the graph at top-left, blocking content. On mobile, it expands to near full-width, which is better, but still covers the graph and doesn't match mobile UX patterns.

**Solution Options**:

**Option A: Left Drawer** (recommended for discoverability)
- Slide-in from left edge
- Full height, ~280px width
- Backdrop dims graph
- Close button and swipe-to-close gesture

**Option B: Bottom Modal Sheet**
- Slides up from bottom
- Takes ~70% of screen height
- Same bottom sheet mechanics as InfoboxPanel
- Risk: Two competing bottom sheets if both open

**Recommendation**: Use left drawer to differentiate from InfoboxPanel bottom sheet.

**Implementation Notes**:
- Create `Drawer` component (left-aligned variant of bottom sheet concept)
- Add filter toggle button in header menu or as floating action button
- FilterPanel content remains unchanged; just wrapped in Drawer
- Include "Apply" button (even though filters apply instantly) for clarity
- Include "Clear Filters" button prominently
- On desktop (> 768px), keep current floating panel behavior

### Additional Considerations

**Dynamic Viewport Height**: Use `100dvh` instead of `100vh` to handle iOS Safari's dynamic toolbar:
```css
#root {
  height: 100dvh;
  height: 100vh; /* Fallback for older browsers */
}

@supports (height: 100dvh) {
  #root {
    height: 100dvh;
  }
}
```

**Breakpoint Strategy** (for reference):
| Breakpoint | Target Devices | Key Changes |
|------------|----------------|-------------|
| < 480px | Small phones (iPhone SE) | Hamburger menu, compact everything |
| 480-640px | Standard phones | Hamburger menu, search icon |
| 640-768px | Large phones, landscape | May show some controls |
| 768-1024px | Tablets (iPad portrait) | Side panel, compact controls |
| > 1024px | Tablets landscape, desktop | Full desktop layout |

**Testing Checklist**:
- iPhone SE (375×667) - smallest common phone
- iPhone 14 Pro (393×852) - standard iPhone with Dynamic Island
- iPhone 14 Pro Max (430×932) - large phone
- iPad Mini (768×1024) - tablet portrait
- iPad Pro 11" (834×1194) - tablet landscape
- Test with actual devices, not just browser resize

---

## Future Ideas (Not Yet Planned)

These are potential features that may become milestones:

| Feature | Description |
|---------|-------------|
| Export | SVG/PNG export of visualizations, data export |
| Graph Analytics | Centrality metrics, path finding, community detection |
| Comparative View | Overlay multiple datasets |
| Embed Mode | Embeddable visualizations for blogs/papers |
| Bibliography Export | Citation generation from evidence data |
| Semantic Search | Natural language queries ("philosophers who influenced Kant") |

> **Note**: "Dataset Validation CLI" was promoted to **M16 - Network Verification**.

---

## Milestone Dependencies

```
M1-M8 (MVP Complete) ✅
    │
    ▼
M9-M11, M13, M14 (Polish Complete) ✅
    │
    ├──────────────────┬──────────────────┬──────────────────┬──────────────────┐
    ▼                  ▼                  ▼                  ▼                  ▼
   M12                M15 ✅             M16 ✅             M17                M18
   (User Feedback)   (Stable URLs)      (Network Verif.)   (Dataset Search)   (Mobile Adapt)
   [Vercel req'd]    [Complete]         [Complete]         [independent]      [independent]
```

Note: M12, M15, M16, M17, and M18 can be worked on in parallel as they have no dependencies on each other. However:
- If M15 is completed before M12, the feedback system should be designed to integrate with stable resource pages.
- M16 is particularly high-value as it improves data quality for all future dataset development and catches errors before deployment.
- M17 becomes more valuable as more datasets are added—currently lower priority with only 4 datasets, but will become essential as the collection grows.
- M18 (Mobile Adapt) is independent and can be started anytime. Recommended to complete before M12 since mobile users will benefit from the feedback system.

---

## Adding New Milestones

When planning a new milestone:

1. Add a section to this document with Goal and Deliverables
2. Decompose into tasks in `PROGRESS.md`
3. Update the Milestone Overview table
4. Record completion in `CHANGELOG.md` when done

---

## Success Criteria Reference

### MVP (M1-M8) was complete when:
- [x] Application loads Disney dataset by default
- [x] Force-directed graph renders all nodes and edges
- [x] Clicking nodes/edges shows details in infobox
- [x] Filters narrow the visible graph
- [x] URL captures complete application state
- [x] Shared URLs restore exact application state
- [x] Application is live on GitHub Pages
- [x] Timeline view renders nodes by date
- [x] User can switch between graph and timeline
- [x] Layout selection persists in URL

### Post-MVP Polish (M9-M11, M14) was complete when:
- [x] All features verified working (V1-V10 checklist)
- [x] Code review findings documented and addressed
- [x] Debounced inputs prevent UI jitter
- [x] Graph doesn't re-layout on node/edge clicks
- [x] Zoom/pan discoverability hint added
- [x] Timeline doesn't overlap filter panel
- [x] Timeline labels readable at default zoom
- [x] Legend consistent between graph and timeline

See `HISTORY.md` for detailed completion criteria for each milestone.
