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
| M19 | Radial/Ego-Network View | 🔲 Future |

> **Note**: Independent milestones (those without dependencies on each other) may be executed out of order based on priority and availability. See the Milestone Dependencies section for details on which milestones can be parallelized.

---

## Completed Milestones (M1-M16)

The core application is complete, polished, and deployed. See `HISTORY.md` for detailed task lists and implementation notes.

**Core Features**:
- **Graph Visualization**: Force-directed D3 layout with zoom/pan, type-based node shapes, relationship-colored edges, tuned physics
- **Timeline Visualization**: Vertical timeline with date positioning, lifespan markers, automatic lane assignment
- **Infobox Panel**: Node/edge detail display with type-specific fields, images, internal links, evidence
- **Filtering**: Date range and text filters with URL sync, debounced inputs, collapsible panel
- **Search**: Instant highlighting with keyboard shortcut (Cmd/Ctrl+K)
- **Stable Resource URLs**: Permanent permalinks for nodes and edges (`/#/{dataset}/node/{id}`)
- **Dataset Validation**: Build-time CLI validation integrated into CI/CD

**Shipped Datasets**: Disney Characters, Rosicrucian Network, Enlightenment, AI-LLM Research

### Milestone Summaries

| Milestone | Summary |
|-----------|---------|
| M1-M8 | MVP: Project setup, data layer, graph/timeline visualization, infobox, filtering, search, deployment |
| M9 | Application verification with code review |
| M10 | UX improvements: debounced inputs, collapsible panels, natural language edge descriptions |
| M11 | Graph interaction polish: memoized handlers, physics tuning, zoom/pan hint |
| M13 | Scenius rebrand with light/dark theme system |
| M14 | Timeline improvements: margins, year labels, initial zoom, legend consistency |
| M15 | Stable resource URLs: permalinks for nodes/edges, share buttons, SEO meta tags |
| M16 | Network verification: build-time dataset validation CLI (`npm run validate:datasets`) |

---

## Future: M12 - User Feedback

**Goal**: Allow users to submit feedback about graph data (missing nodes, incorrect information, suggested changes) without requiring a GitHub account. Feedback is captured as GitHub issues for dataset maintainers to review.

**Architecture Decision**: Migrate from GitHub Pages to Vercel to enable serverless API functions. This consolidates hosting and backend on a single platform.

**Note**: Since M15 (Stable Resource URLs) is complete, feedback forms should be integrated into the stable resource pages as well as the main graph view. Each node/edge page becomes a natural place for item-specific feedback.

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

## Future: M19 - Radial/Ego-Network View

**Goal**: Add a radial (ego-network) visualization layout that displays a selected node at the center with its direct connections arranged in a ring around it. This provides a focused, clutter-free view of a single node's relationships—answering "Who was connected to this person?" without the visual noise of the full graph.

**Design Decisions**:

| Decision | Choice |
|----------|--------|
| Center node selection | Uses current selection—radial view is only available when a node is selected |
| Degrees of separation | 1 degree initially (direct connections only) |
| Empty state | "Select a node to explore its connections" prompt |
| Filter interaction | Filters apply to both center node eligibility AND visible connected nodes |
| Ring arrangement | Distance from center = degree of separation |
| Edge rendering | Curved arcs to reduce visual clutter |
| Node styling | Same shapes/colors as force-directed graph (consistency) |

**Conditional Availability**: The radial layout option in the LayoutSwitcher should be disabled/hidden when no node is selected. This prevents users from switching to an empty view.

**Deliverables**:

### Layout Component
- `RadialLayout.tsx` component implementing the `LayoutComponentProps` interface
- D3-based radial positioning with center node and surrounding ring
- Curved arc edges connecting center to peripheral nodes
- Same zoom/pan controls as other layouts
- Consistent node shapes and colors (reuse `graphColors.ts`)

### LayoutSwitcher Enhancement
- Add "Radial" option to the layout switcher
- Conditionally enable/disable based on node selection state
- Visual indication when radial is unavailable (grayed out, tooltip explaining why)
- Icon consistent with existing layout icons

### Type System Updates
- Extend `LayoutType` to include `'radial'`
- Update `useLayout` hook with radial layout metadata
- Update `MainLayout.tsx` switch statement to render `RadialLayout`

### Filter Integration
- Filters apply to connected nodes (hide connections that don't pass filters)
- If center node doesn't pass filters, show appropriate message or fall back to graph view
- URL state for layout persists (`?layout=radial`)

### Infobox Integration
- Clicking center node updates infobox (even though it's already "selected")
- Clicking peripheral nodes updates selection AND re-centers the radial view on that node
- Clicking edges shows edge details in infobox
- Selection state syncs with URL

### Empty/Invalid States
- No selection: Show prompt "Select a node to explore its connections"
- Selection is edge (not node): Show prompt or fall back to graph view
- Center node filtered out: Show message or fall back to graph view

**Visual Design**:

```
        ┌─────┐
       ╱       ╲
    ┌─┴─┐   ┌─┴─┐
    │ B │   │ C │
    └─┬─┘   └─┬─┘
       ╲     ╱
        ╲   ╱  (curved arcs)
         ╲ ╱
       ┌─────┐
       │  A  │  ← Center (selected node)
       └─────┘
         ╱ ╲
        ╱   ╲
       ╱     ╲
    ┌─┴─┐   ┌─┴─┐
    │ D │   │ E │
    └───┘   └───┘
```

**Technical Notes**:
- Reuse existing D3 zoom/pan infrastructure from `ForceGraphLayout`
- Reuse node rendering logic and colors from `graphColors.ts`
- Consider using D3's arc generator for curved edges
- Peripheral nodes should be evenly distributed around the center
- Handle edge cases: node with 0 connections, node with 50+ connections

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
    ├──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┐
    ▼                  ▼                  ▼                  ▼                  ▼                  ▼
   M12                M15 ✅             M16 ✅             M17                M18                M19
   (User Feedback)   (Stable URLs)      (Network Verif.)   (Dataset Search)   (Mobile Adapt)    (Radial View)
   [Vercel req'd]    [Complete]         [Complete]         [independent]      [independent]     [independent]
```

Note: Remaining milestones M12, M17, M18, and M19 can be worked on in parallel:
- **M12 (User Feedback)**: Should integrate with stable resource pages (M15 complete) for per-item feedback. Requires Vercel migration for serverless functions.
- **M17 (Dataset Search)**: Becomes more valuable as more datasets are added—currently lower priority with only 4 datasets.
- **M18 (Mobile Adapt)**: Independent and can be started anytime. Recommended to complete before M12 since mobile users will benefit from the feedback system.
- **M19 (Radial View)**: Independent visualization layout. Builds on existing layout infrastructure (LayoutSwitcher, useLayout hook). Consider coordinating with M18 to ensure radial view works on mobile.

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
