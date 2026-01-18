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
| M16 | Network Verification | 🔲 Future |
| M17 | Dataset Search & Filter | 🔲 Future |

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

## Future: M16 - Network Verification

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

1. [ ] Create `scripts/validate-datasets/` directory structure
2. [ ] Implement JSON syntax validator
3. [ ] Implement manifest schema validator
4. [ ] Implement node schema validator with type-specific rules
5. [ ] Implement edge schema validator
6. [ ] Implement cross-reference validator
7. [ ] Implement reporter with colored output and summary
8. [ ] Add CLI argument parsing (--strict, --dataset, --quiet, --json)
9. [ ] Add npm scripts to package.json
10. [ ] Update GitHub Actions workflow to run validation before build
11. [ ] Add validation documentation to AGENTS.md
12. [ ] Test against all existing datasets, fix any discovered issues

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
    ├──────────────────┬──────────────────┬──────────────────┐
    ▼                  ▼                  ▼                  ▼
   M12                M15                M16                M17
   (User Feedback)   (Stable URLs)      (Network Verif.)   (Dataset Search)
   [Vercel req'd]    [independent]      [independent]      [independent]
```

Note: M12, M15, M16, and M17 can be worked on in parallel as they have no dependencies on each other. However:
- If M15 is completed before M12, the feedback system should be designed to integrate with stable resource pages.
- M16 is particularly high-value as it improves data quality for all future dataset development and catches errors before deployment.
- M17 becomes more valuable as more datasets are added—currently lower priority with only 4 datasets, but will become essential as the collection grows.

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
