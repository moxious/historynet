# HistoryNet - Implementation Milestones

This document outlines the major milestones for implementing HistoryNet. Each milestone represents a significant, demonstrable increment of functionality. Milestones are composed of tasks tracked in `PROGRESS.md`.

---

## Milestone Overview

| # | Milestone | Description | Status |
|---|-----------|-------------|--------|
| M1 | Project Bootstrap | Initial project setup and infrastructure | ✅ Complete |
| M2 | Core Data Layer | Data loading, types, and state management | ✅ Complete |
| M3 | Graph Visualization | Force-directed graph with D3.js | ✅ Complete |
| M4 | Infobox Panel | Node/edge detail display | ✅ Complete |
| M5 | Filtering System | Date and text filters with URL sync | ✅ Complete |
| M6 | Search & Polish | Search highlighting and UX refinement | ✅ Complete |
| M7 | Deployment | GitHub Pages deployment pipeline | ✅ Complete |
| M8 | Timeline View | Vertical timeline visualization | 🔲 Not Started |

**MVP = Milestones 1-7**

---

## Milestone 1: Project Bootstrap

**Goal**: Establish the project foundation with all necessary tooling and configuration.

**Deliverables**:
- Vite + React + TypeScript project initialized
- Folder structure created
- ESLint and Prettier configured
- Basic App component rendering
- Sample Disney dataset created
- README.md with setup instructions

**Tasks**: See `PROGRESS.md` section M1

---

## Milestone 2: Core Data Layer

**Goal**: Implement data loading, TypeScript types, and state management for graph data.

**Deliverables**:
- TypeScript interfaces matching `GRAPH_SCHEMA.md`
- Dataset loading from JSON files
- Dataset manifest parsing
- Dataset switching capability
- React context or store for graph state
- URL parameter integration for dataset selection

**Tasks**: See `PROGRESS.md` section M2

---

## Milestone 3: Graph Visualization

**Goal**: Render an interactive force-directed graph using D3.js.

**Deliverables**:
- D3.js force simulation setup
- Node rendering with type-based styling
- Edge rendering with relationship-based styling
- Zoom and pan functionality
- Node/edge click handling (emits selection events)
- Responsive container sizing

**Tasks**: See `PROGRESS.md` section M3

---

## Milestone 4: Infobox Panel

**Goal**: Display detailed information for selected nodes and edges.

**Deliverables**:
- Right-side panel component
- Key/value display for all node properties
- Key/value display for all edge properties
- Clickable links to other nodes (updates infobox)
- External link handling
- Image display for nodes with imageUrl
- Graceful handling of missing fields

**Tasks**: See `PROGRESS.md` section M4

---

## Milestone 5: Filtering System

**Goal**: Allow users to filter the graph by date range and text matching.

**Deliverables**:
- Filter panel UI component
- Date range filters (no earlier than, no later than)
- Text filter for node names
- Text filter for relationship types
- Filter logic applied to graph data
- URL parameter sync for all filters
- Clear/reset filters functionality

**Tasks**: See `PROGRESS.md` section M5

---

## Milestone 6: Search & Polish

**Goal**: Add search functionality and polish the overall user experience.

**Deliverables**:
- Search input in header/toolbar
- Node highlighting based on search text
- Dataset dropdown with metadata display
- Loading states and error handling
- Empty state handling
- Keyboard navigation basics
- Visual polish and consistency

**Tasks**: See `PROGRESS.md` section M6

---

## Milestone 7: Deployment

**Goal**: Deploy the application to GitHub Pages via GitHub Actions.

**Deliverables**:
- GitHub Actions workflow file
- Production build configuration
- Successful deployment to GitHub Pages
- Verified deep linking works with hash routing
- Documentation updated with live URL

**Tasks**: See `PROGRESS.md` section M7

---

## Milestone 8: Timeline View (Post-MVP)

**Goal**: Add a vertical timeline visualization as an alternate layout.

**Deliverables**:
- Timeline layout component implementing layout interface
- Vertical time axis (top = earlier, bottom = later)
- Nodes positioned by date
- Birth/death point markers for persons
- Same click/infobox behavior as graph view
- Layout switcher in UI
- URL parameter for active layout

**Tasks**: See `PROGRESS.md` section M8

---

## Future Milestones (Not Yet Planned)

These milestones are anticipated but not yet decomposed into tasks:

### M9: Historical Datasets
- Enlightenment Philosophers dataset
- Vienna Circle dataset
- Dataset validation tooling

### M10: User Annotations
- Note/feedback attachment to nodes
- Local storage persistence
- Export annotations

### M11: Advanced Visualization
- Node clustering for large graphs
- Minimap navigation
- Additional layout modes

---

## Milestone Dependencies

```
M1 ──► M2 ──► M3 ──► M4 ──► M5 ──► M6 ──► M7 (MVP)
                                            │
                                            ▼
                                           M8 (Timeline)
                                            │
                                            ▼
                                    M9, M10, M11 (Future)
```

Milestones should be completed in order. Tasks within a milestone may be parallelized where dependencies allow.

---

## Success Criteria

### MVP (M1-M7) is complete when:
- [ ] Application loads Disney dataset by default
- [ ] Force-directed graph renders all nodes and edges
- [ ] Clicking nodes/edges shows details in infobox
- [ ] Filters narrow the visible graph
- [ ] URL captures complete application state
- [ ] Shared URLs restore exact application state
- [ ] Application is live on GitHub Pages

### Post-MVP (M8) is complete when:
- [ ] Timeline view renders nodes by date
- [ ] User can switch between graph and timeline
- [ ] Layout selection persists in URL
