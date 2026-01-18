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
| M10 | UX Improvements | 🔲 Active |
| M11 | Advanced Visualization | 🔲 Future |

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

## Future: M10 - User Annotations

**Goal**: Allow users to add notes and feedback to nodes and edges.

**Potential Deliverables**:
- Note attachment to nodes/edges
- Local storage persistence
- Export annotations as JSON
- Annotation visibility toggle

---

## Future: M11 - Advanced Visualization

**Goal**: Enhanced visualization capabilities for large graphs.

**Potential Deliverables**:
- Node clustering for graphs with 500+ nodes
- Minimap navigation
- Additional layout modes (hierarchical, radial)
- WebGL rendering option for performance

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
   M9 (Verification) ──► M10, M11 (can parallelize)
```

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
