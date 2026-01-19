# Scenius - Roadmap

This document outlines the milestone structure and future direction for Scenius.

**Live Demo**: https://scenius-seven.vercel.app/

**Detailed task lists**: See `milestones/` directory for individual milestone files.

---

## Milestone Overview

| # | Milestone | Status | Track |
|---|-----------|--------|-------|
| M1-M19 | Core Application | ✅ Complete | MVP |
| M20 | SEO Improvements | ✅ Complete | A |
| M21 | Dataset Search & Filter | ✅ Complete | A |
| M23 | Wikimedia Sourcing | ✅ Complete | A |
| M24 | Vercel Migration | ✅ Complete | B |
| M25 | User Feedback Feature | 🔲 Future | B |
| M26 | Custom Domain | 🔲 Future | B |
| M27 | Feedback Spam Protection | 🔲 Future | B |
| M29 | Cross-Scene Node Index API | 🔲 Future | B |
| M30 | Cross-Scene Navigation UI | 🔲 Future | B |
| M31 | Dataset Pages | ✅ Complete | C |
| M32 | New Homepage | ✅ Complete | C |

> **Note**: M12 and M17 were originally reserved for features that have been renumbered to M24 and M21 respectively.

---

## Tracks

| Track | Description | Milestones |
|-------|-------------|------------|
| **A: Independent Features** | No dependencies, can be done in any order | M20 ✅, M21 ✅, M23 ✅ |
| **B: Infrastructure & Backend** | Sequential dependencies starting from M24 | M24 ✅ → M25 → M27, M24 → M26, M24 → M29 → M30 |
| **C: Information Architecture** | App navigation restructuring | M31 ✅ → M32 |

---

## Dependency Diagram

```
M1-M20 (Core Application Complete) ✅
    │
    ├───────────────────────────────────────────┬──────────────────────────┐
    │                                           │                          │
    │  TRACK A: Independent Features            │  TRACK B: Infrastructure │  TRACK C: Info Architecture
    │  (Complete)                               │  (Sequential)            │  (Sequential)
    │                                           │                          │
    ├──────────────┬────────────────┐           │                          │
    ▼              ▼                │           ▼                          ▼
   M21            M23               │          M24                        M31
   (Dataset      (Wikimedia        │         (Vercel) ✅                (Dataset
   Search) ✅    Sourcing) ✅      │            │                        Pages) ✅
                                   │            ├──────────┬──────────┐    │
                                   │            ▼          ▼          ▼    ▼
                                   │           M25        M26        M29  M32
                                   │        (Feedback) (Domain)   (Cross-(Homepage)
                                   │            │                  Scene
                                   │            ▼                  API)
                                   │           M27                   │
                                   │        (Spam Prot.)             ▼
                                   │                                M30
                                   │                             (Cross-
                                   │                             Scene UI)
```

---

## Completed Features Summary

**Core Features (M1-M19)**:
- Force-directed graph visualization with D3.js
- Timeline visualization with vertical date positioning
- Radial/ego-network view centered on selected node
- Infobox panel with type-specific fields
- Date range and text filtering with URL sync
- Search-as-you-type highlighting
- Stable resource URLs (permalinks)
- Build-time dataset validation
- Mobile-responsive design with bottom sheets
- Light/dark theme system
- SEO: OpenSearch, JSON-LD, sitemap

**Shipped Datasets**: AI-LLM Research, Rosicrucian Network, Enlightenment, Ambient Music, Cybernetics, Protestant Reformation, Renaissance Humanism, Scientific Revolution, Florentine Academy, Christian Kabbalah, Statistics & Social Physics

---

## Next Steps

**Ready to implement** (dependencies satisfied):
- **M25: User Feedback** - Serverless endpoint creates GitHub issues from user feedback
- **M26: Custom Domain** - Configure custom domain on Vercel
- **M29: Cross-Scene API** - Build-time index for cross-dataset node discovery
- **M32: New Homepage** - Browsable dataset tiles at root URL

**Recommended next**: M32 (New Homepage) - Completes the information architecture track.

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

---

## Adding New Milestones

When planning a new milestone:

1. Create a new file in `milestones/` directory: `m{N}-{slug}.md`
2. Use the template structure (Status, Goal, Design Decisions, Tasks, Notes)
3. Add the milestone to `milestones/index.md` status table
4. Update this overview table if needed
5. Record completion in `CHANGELOG.md` when done

---

## Success Criteria Reference

### MVP (M1-M8) was complete when:
- [x] Application loads dataset by default
- [x] Force-directed graph renders all nodes and edges
- [x] Clicking nodes/edges shows details in infobox
- [x] Filters narrow the visible graph
- [x] URL captures complete application state
- [x] Shared URLs restore exact application state
- [x] Application is live on production URL
- [x] Timeline view renders nodes by date
- [x] User can switch between graph and timeline
- [x] Layout selection persists in URL

### Post-MVP Polish was complete when:
- [x] All features verified working
- [x] Code review findings addressed
- [x] Debounced inputs prevent UI jitter
- [x] Graph doesn't re-layout on node/edge clicks
- [x] Zoom/pan discoverability hint added
- [x] Timeline doesn't overlap filter panel
- [x] Timeline labels readable at default zoom
- [x] Legend consistent between graph and timeline
- [x] Mobile-responsive with touch-friendly targets
- [x] Light/dark theme support

See individual milestone files in `milestones/` for detailed completion criteria.
