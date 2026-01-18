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
| M13 | Scenius Rebrand & Theme System | 🔲 Future |
| M14 | Timeline Improvements | 🔲 Future |
| M15 | Stable Resource URLs | 🔲 Future |

> **Note**: Independent milestones (those without dependencies on each other) may be executed out of order based on priority and availability. See the Milestone Dependencies section for details on which milestones can be parallelized.

---

## Completed: MVP + Timeline (M1-M8)

The core application is complete and deployed:

- **Graph Visualization**: Force-directed D3 layout with zoom/pan, type-based node shapes, relationship-colored edges
- **Timeline Visualization**: Vertical timeline with date positioning, lifespan markers, automatic lane assignment
- **Infobox Panel**: Node/edge detail display with type-specific fields, images, internal links, evidence
- **Filtering**: Date range and text filters with URL sync
- **Search**: Instant highlighting with keyboard shortcut (Cmd/Ctrl+K)
- **Dataset Switching**: Dropdown with metadata display
- **URL State**: Deep linking for all view state
- **Deployment**: GitHub Pages via GitHub Actions

**Shipped Datasets**: Disney Characters, Rosicrucian Network, Enlightenment, AI-LLM Research

See `HISTORY.md` for detailed implementation history.

---

## Completed: M9 - Application Verification

**Goal**: Systematic verification of all shipped features paired with principal-level code review.

**Deliverables**:
- ✅ Feature verification checklist (V1-V10) with documented results
- ✅ Code review findings (R1-R8) with actionable recommendations
- ✅ Documentation review (D1-D3)
- ✅ Critical fixes applied (Enlightenment dataset registration, README link fix)
- ✅ Architecture documentation for key decisions

**Key Fixes Applied**:
- Added `enlightenment` to AVAILABLE_DATASETS in `dataLoader.ts`
- Fixed README reference from MILESTONES.md to ROADMAP.md

**See `PROGRESS.md` section M9 for detailed results**

---

## Completed: M10 - UX Improvements

**Goal**: Improve application responsiveness and usability based on user feedback.

**Deliverables**:
- ✅ Debounced filter inputs (300ms) to prevent UI jitter during typing
- ✅ Simplified filter labels ("Name" instead of "Filter by Name")
- ✅ InfoboxPanel hidden when no selection (cleaner default state)
- ✅ Filter panel collapsed by default with chevron indicator
- ✅ Edge infobox shows natural sentence description
- ✅ Search vs Filter distinction clarified with tooltips and visual indicators
- ✅ Graph no longer re-layouts when clicking edges
- ✅ Code quality: shared utilities extracted, @types/d3 in devDependencies

**See `PROGRESS.md` section M10 for detailed implementation notes**

---

## Completed: M11 - Graph Interaction Polish

**Goal**: Refine graph component behavior and discoverability based on user testing feedback. Focus on interaction predictability, physics tuning, and UX clarity.

**Deliverables**:

### Node Click Behavior ✅
- Memoized `handleNodeClick` and `handleEdgeClick` callbacks in MainLayout to prevent unnecessary graph re-layouts
- Node clicks now only update selection state without retriggering force simulation

### Physics Tuning ✅
- Reduced charge repulsion from -400 to -250 to prevent nodes from flying apart
- Added soft gravity forces (forceX/forceY with 0.05 strength) to keep disconnected nodes visible
- Graph now stays more compact while maintaining readable node separation

### Interaction Discoverability ✅
- Added "Scroll to zoom • Drag to pan" hint below the layout switcher
- Styled as unobtrusive pill with icons for visual clarity
- Helps users discover interactive capabilities

### Infobox Simplification ✅
- Removed ID field from NodeInfobox and EdgeInfobox components
- IDs remain in data model for URL state and internal references but are hidden from UI

**See `PROGRESS.md` section M11 for detailed task completion**

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

## Future: M13 - Scenius Rebrand & Theme System

**Goal**: Rebrand the application from "HistoryNet" to "Scenius" and introduce a light/dark theme system with URL persistence for shareability.

**Concept**: The name "Scenius" comes from Brian Eno's concept describing the collective intelligence of creative communities. Unlike the myth of the "lone genius," scenius recognizes that great creative work emerges from fertile scenes—groups of people encouraging, competing with, and reacting to each other. This perfectly captures what the application visualizes: the networks of influence, collaboration, and connection between historical figures.

**Key Principles** (from the scenius concept):
- Mutual appreciation among peers drives creative risk-taking
- Rapid exchange of ideas within a shared language
- Success of one empowers the entire community
- Local tolerance for experimentation and transgression

**Deliverables**:

### Application Rebrand
- Update application title from "HistoryNet" to "Scenius"
- Update Header component with new branding
- Create new favicon (derived from brain/lightbulb emoji concept, symbolizing collective intelligence)
- Update HTML meta tags (title, description, og:title, etc.)
- Update README.md with new name and branding explanation
- Update all documentation references (AGENTS.md, PRD.md, etc.)
- Consider tagline: "Visualizing creative communities" or "Mapping collective genius"

### Theme System Architecture
- Create `ThemeContext` for managing light/dark mode state
- Define CSS custom properties (variables) for all theme-aware colors
- Implement `useTheme` hook for components to access theme state
- Add `theme` parameter to URL scheme (`?theme=light` or `?theme=dark`)
- Ensure theme state syncs with URL like other app state (dataset, filters, selection)
- Light mode as default; dark mode as alternate

### Theme Switcher UI
- Create `ThemeToggle` component for Header/top bar
- Design toggle with sun/moon icons or similar visual metaphor
- Position alongside existing controls (dataset selector, view picker)
- Ensure accessible keyboard navigation and ARIA labels

### CSS Theme Implementation
- Define light mode color palette (warm, inviting, intellectual)
- Define dark mode color palette (contrasting, easy on eyes)
- Update all component CSS to use theme variables
- Ensure graph visualization colors work in both themes
- Ensure timeline visualization colors work in both themes
- Test readability and contrast in both modes (WCAG guidelines)

### Favicon Design
- Design favicon inspired by brain or lightbulb emoji
- Concept: interconnected minds / collective illumination
- Create multiple sizes for various contexts (16x16, 32x32, 192x192, etc.)
- Support both light and dark favicon variants if needed

---

## Future: M14 - Timeline Improvements

**Goal**: Address usability issues with the timeline visualization component based on user testing feedback. Focus on positioning, readability, initial zoom, temporal gaps, legend consistency, and infobox behavior parity with the graph view.

**Context**: User testing revealed several friction points in the timeline view that make it less useful than the graph view for exploration.

**Deliverables**:

### Layout & Positioning
- Fix timeline hard-aligned left positioning that causes overlap with filter panel
- Ensure timeline content is fully visible when filter panel is open/collapsed
- Timeline should respect the same layout constraints as the graph view

### Year Label Readability
- Increase size of year labels on the timeline axis
- Labels should be readable at the default zoom level without requiring zoom-in
- Consider font weight and contrast for improved legibility

### Initial Zoom & Focus
- Adjust default zoom level so nodes are clearly visible on load
- Prioritize visibility of the first chronological item in the timeline
- User should see meaningful content immediately without needing to zoom/pan

### Timeline Gap Handling (Investigation Required)
- Research alternative vertical timeline libraries/frameworks for comparison
- If continuing with D3: investigate implementing timeline "cutouts" or discontinuities
- Goal: collapse large empty periods (50-100+ years) to reduce whitespace
- Visual indicator when timeline has been compressed (e.g., "// 75 years //")
- Preserve accurate date positioning while improving information density

### Legend Consistency with Graph View
- Replace current birth/death/lifespan legend with node-type legend
- Timeline legend should match graph legend exactly (same colors, same shapes, same types)
- Node colors in timeline must use the same color scheme as graph nodes (`graphColors.ts`)
- Birth/death/lifespan information belongs in the infobox detail panel, not the legend

### Infobox Behavior Parity
- Audit timeline's integration with InfoboxPanel
- Ensure timeline uses the exact same InfoboxPanel component as graph view
- When no item is selected on timeline, infobox should be hidden (not show placeholder text)
- Verify node click behavior opens infobox correctly
- Ensure Escape key and X button hide infobox in timeline view

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

## Future Ideas (Not Yet Planned)

These are potential features that may become milestones:

| Feature | Description |
|---------|-------------|
| Export | SVG/PNG export of visualizations, data export |
| Graph Analytics | Centrality metrics, path finding, community detection |
| Comparative View | Overlay multiple datasets |
| Embed Mode | Embeddable visualizations for blogs/papers |
| Bibliography Export | Citation generation from evidence data |
| Dataset Validation CLI | Automated schema validation for new datasets |
| Semantic Search | Natural language queries ("philosophers who influenced Kant") |

---

## Milestone Dependencies

```
M1-M8 (Complete)
    │
    ▼
   M9 (Verification) ✅
    │
    ▼
   M10 (UX Improvements) ✅
    │
    ▼
   M11 (Graph Interaction Polish) ✅
    │
    ├──────────────────┬──────────────────┬──────────────────┬──────────────────┐
    ▼                  ▼                  ▼                  ▼                  ▼
   M12               M13                M14                M15
   (User Feedback)   (Scenius Rebrand)  (Timeline)         (Stable URLs)
   [Vercel req'd]    [independent]      [independent]      [independent]
```

Note: M12, M13, M14, and M15 can be worked on in parallel as they have no dependencies on each other. However, if M15 is completed before M12, the feedback system should be designed to integrate with stable resource pages.

---

## Adding New Milestones

When planning a new milestone:

1. Add a section to this document with Goal and Deliverables
2. Decompose into tasks in `PROGRESS.md`
3. Update the Milestone Overview table
4. Record completion in `CHANGELOG.md` when done

---

## Success Criteria Reference

### MVP was complete when:
- [x] Application loads Disney dataset by default
- [x] Force-directed graph renders all nodes and edges
- [x] Clicking nodes/edges shows details in infobox
- [x] Filters narrow the visible graph
- [x] URL captures complete application state
- [x] Shared URLs restore exact application state
- [x] Application is live on GitHub Pages

### M8 (Timeline) was complete when:
- [x] Timeline view renders nodes by date
- [x] User can switch between graph and timeline
- [x] Layout selection persists in URL

### M9 (Verification) was complete when:
- [x] All feature verification tasks pass (V1-V10)
- [x] Code review findings documented (R1-R8)
- [x] Documentation verified accurate (D1-D3)
- [x] Critical issues resolved
