# M1: Project Bootstrap

**Status**: ✅ Complete (2026-01-18)
**Track**: MVP (Core Application)
**Depends on**: None

## Goal

Initialize the Vite + React + TypeScript project with proper tooling, folder structure, and a sample dataset to enable development of the graph visualization application.

## Tasks

### Setup & Configuration
- [x] Initialize Vite + React + TypeScript project
- [x] Configure folder structure (`src/components`, `src/hooks`, `src/layouts`, `src/types`, `src/utils`)
- [x] Set up ESLint with TypeScript rules
- [x] Set up Prettier for code formatting
- [x] Configure path aliases in `tsconfig.json` and `vite.config.ts`
- [x] Add `.gitignore` for Node.js/Vite project

### Initial Components
- [x] Create basic `App.tsx` shell component
- [x] Create placeholder `Header` component with app title
- [x] Create placeholder `MainLayout` component (left: graph, right: infobox)
- [x] Verify app runs with `npm run dev`

### Sample Dataset
- [x] Create `public/datasets/disney-characters/` directory
- [x] Create `manifest.json` for Disney dataset
- [x] Create `nodes.json` with 10-15 Disney character nodes
- [x] Create `edges.json` with relationships between characters
- [x] Validate dataset against `GRAPH_SCHEMA.md`

### Documentation
- [x] Create `README.md` with project description and setup instructions
- [x] Add npm scripts documentation to README

## Completion Notes

```
[2026-01-18] @claude: Completed Milestone 1 - Project Bootstrap
- Created Vite + React + TypeScript project manually (CLI blocked by existing files)
- Set up ESLint 9 flat config with TypeScript and React plugins
- Configured Prettier with sensible defaults (.prettierrc)
- Added path aliases (@components, @hooks, @layouts, @types, @utils)
- Created CSS custom properties for consistent theming
- Disney dataset includes 15 nodes (persons, objects, locations, entities) and 20 edges
- All edges include evidence as per GRAPH_SCHEMA.md requirements
```
