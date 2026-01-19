# Scenius - Quick Reference

> One-page reference for agents starting work. See `AGENTS.md` for full guidelines.

## What Is This?

**Scenius** is a React/Vite SPA for visualizing historical social networks. Read-only, dataset-agnostic, shareable via URL.

**Live Demo**: https://moxious.github.io/historynet/

**GitHub**: https://github.com/moxious/historynet

---

## Node Types (POLE Model)

| Type | Examples | Shape | Color |
|------|----------|-------|-------|
| Person | Philosophers, authors, scientists | Circle | Blue |
| Object | Books, letters, artworks | Square | Green |
| Location | Cities, universities, salons | Diamond | Amber |
| Entity | Organizations, movements | Hexagon | Purple |

---

## Key Commands

```bash
npm run dev                    # Start dev server (localhost:5173)
npm run build                  # Production build
npm run preview                # Preview production build

npm run validate:datasets      # Validate all datasets
npm run validate:datasets -- --dataset disney-characters  # Validate one
npm run validate:datasets:strict  # Warnings as errors
```

---

## File Locations

| What | Where |
|------|-------|
| React components | `src/components/` |
| Layouts (Graph, Timeline, Radial) | `src/layouts/` |
| Hooks | `src/hooks/` |
| TypeScript types | `src/types/` |
| Utility functions | `src/utils/` |
| Datasets (JSON) | `public/datasets/{name}/` |
| Research notes | `research/{network}/` |
| Cursor rules | `.cursor/rules/` |

---

## URL Parameters

```
?dataset=disney-characters     # Dataset to load
&layout=force-graph            # Layout: force-graph, timeline, radial
&theme=dark                    # Theme: light, dark
&selected=person-mickey-mouse  # Selected node/edge ID
&type=node                     # Selection type: node, edge
&dateStart=1900               # Filter: no earlier than
&dateEnd=2000                 # Filter: no later than
&name=Mickey                  # Filter: name contains
```

---

## Finding Work

1. Open `PROGRESS.md`
2. Find unchecked tasks `[ ]`
3. Mark in-progress `[~]` or completed `[x]`
4. Update `CHANGELOG.md` when milestone complete

---

## Quick Links

| Document | Purpose |
|----------|---------|
| `PROGRESS.md` | Active task tracking |
| `ROADMAP.md` | Milestone overview |
| `PRD.md` | Product requirements |
| `GRAPH_SCHEMA.md` | Data model for datasets |
| `HISTORY.md` | Archived milestone details (don't read unless debugging) |
