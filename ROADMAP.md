# Scenius - Roadmap

This document outlines the future direction for Scenius.

**Live Demo**: https://scenius-seven.vercel.app/

**Detailed task lists**: See `milestones/` directory for individual milestone files.

---

## What's Shipped

**Core Application (M1-M32)** - All foundational features are complete:

- Force-directed graph, timeline, and radial visualization layouts
- Infobox panel with type-specific fields and Wikipedia enrichment
- Date range filtering, text search, and URL state sync
- Mobile-responsive design with light/dark themes
- SEO: OpenSearch, JSON-LD, sitemap, meta tags
- Vercel deployment with serverless API endpoints
- User feedback system (creates GitHub issues)
- Searchable dataset selector and homepage with dataset tiles
- Wikimedia Commons image sourcing

**Shipped Datasets**: AI-LLM Research, Rosicrucian Network, Enlightenment, Ambient Music, Cybernetics, Protestant Reformation, Renaissance Humanism, Scientific Revolution, Florentine Academy, Christian Kabbalah, Statistics & Social Physics

---

## Upcoming Milestones

| # | Milestone | Description | Dependencies |
|---|-----------|-------------|--------------|
| M26 | Custom Domain | Configure custom domain on Vercel | M24 ✅ |
| M27 | Feedback Spam Protection | Rate limiting and honeypot fields | M25 ✅ |
| M29 | Cross-Scene Node Index API | Build-time index for cross-dataset node discovery | M24 ✅ |
| M30 | Cross-Scene Navigation UI | UI to discover same person/entity across datasets | M29 |

### Dependency Diagram

```
Completed Foundation
    │
    ├─────────────────────┬────────────────────┐
    │                     │                    │
    ▼                     ▼                    ▼
   M26                   M27                  M29
  (Custom              (Spam             (Cross-Scene
   Domain)             Protection)          API)
                                             │
                                             ▼
                                            M30
                                        (Cross-Scene
                                            UI)
```

**Recommended next**: M26 (Custom Domain) or M29 (Cross-Scene API) - both are independent.

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

See individual milestone files in `milestones/` for detailed completion criteria.
