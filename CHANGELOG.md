# Changelog

All notable changes to HistoryNet are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Planned
- M11: Advanced Visualization - node clustering, minimap, additional layouts

---

## [1.3.0] - 2026-01-18

### Added
- **M10: UX Improvements** - Enhanced application responsiveness and usability

### Improved
- **Debounced inputs**: 300ms delay on filter and search inputs reduces UI jitter during typing
- **InfoboxPanel visibility**: Panel now hides completely when nothing is selected (cleaner default)
- **Filter panel**: Collapsed by default with chevron indicator showing expand/collapse state
- **Edge descriptions**: Natural sentence format like "Mickey Mouse knows Minnie Mouse"
- **Search vs Filter clarity**: Visual indicators and tooltips distinguish highlighting from filtering
- **Graph stability**: Clicking edges no longer causes the graph to re-layout

### Changed
- Filter labels simplified ("Name" instead of "Filter by Name")
- "Dataset:" prefix added to dataset selector in header
- SearchBox placeholder changed to "Highlight nodes..." for clarity

### Code Quality
- Extracted `getNodeColor()` and `getEdgeColor()` to shared `src/utils/graphColors.ts`
- Removed duplicate `parseYear()` from TimelineLayout (now uses `filterGraph.ts` version)
- Moved `@types/d3` from dependencies to devDependencies

---

## [1.2.0] - 2026-01-18

### Added
- **M9: Application Verification** - Comprehensive feature and code review completed

### Fixed
- **Enlightenment dataset** now appears in dataset selector (was missing from AVAILABLE_DATASETS)
- **README.md** documentation link corrected (MILESTONES.md → ROADMAP.md)

### Code Review Findings
- All feature verification tasks (V1-V10) passed
- Code review (R1-R8) completed with recommendations documented
- Documentation review (D1-D3) completed

### Recommendations for Future
- Extract shared layout utilities (getNodeColor, getEdgeColor) to reduce duplication
- Consider splitting GraphContext if application grows significantly
- Move @types/d3 to devDependencies

---

## [1.1.0] - 2026-01-18

### Added
- **Timeline View (M8)**: Vertical timeline visualization showing nodes by date
  - Automatic lane assignment to prevent overlap
  - Birth/death markers for persons with lifespan bars
  - Decade markers and century highlights on time axis
  - Full zoom/pan support
- **Layout Switcher**: Tab-based UI to switch between Graph and Timeline views
- **URL parameter**: `layout=timeline` or `layout=force-graph` for deep linking

### Datasets
- **Enlightenment** dataset: European Enlightenment intellectual network (c. 1685-1804)
- **AI-LLM Research** dataset: Modern AI and LLM research network

---

## [1.0.0] - 2026-01-18

### Added
- **Force-directed graph visualization** using D3.js
  - Node shapes by type: circle (person), square (object), diamond (location), hexagon (entity)
  - Edge coloring by relationship category
  - Zoom/pan with controls
  - Node drag to reposition
  
- **Infobox panel** for node and edge details
  - Type-specific field display
  - Image support for nodes
  - Clickable internal links
  - Evidence display for edges
  
- **Filtering system**
  - Date range filters ("No earlier than", "No later than")
  - Text filters for node names and relationship types
  - Real-time filter statistics
  - URL sync for all filters
  
- **Search functionality**
  - Search-as-you-type with node highlighting
  - Keyboard shortcut (Cmd/Ctrl+K)
  - Result count display
  
- **Dataset switching**
  - Dropdown selector with metadata display
  - URL parameter for dataset selection
  
- **URL state management**
  - All view state captured in URL hash
  - Deep linking support
  - Browser back/forward navigation
  
- **Accessibility**
  - ARIA labels on interactive elements
  - Keyboard navigation
  - Focus indicators
  - Sufficient color contrast

- **GitHub Pages deployment**
  - Automatic deployment via GitHub Actions
  - Live at https://moxious.github.io/historynet/

### Datasets
- **Disney Characters**: Sample dataset with 15 nodes and 20 edges
- **Rosicrucian Network**: Historical network centered on Boehme and Andreae (c. 1540-1660)

---

## [0.1.0] - 2026-01-18

### Added
- Initial project setup (Vite + React + TypeScript)
- Folder structure and tooling configuration
- TypeScript types for POLE graph model
- Data loading utilities
- Basic component shell

---

## Links

- **Live Demo**: https://moxious.github.io/historynet/
- **Repository**: https://github.com/moxious/historynet
