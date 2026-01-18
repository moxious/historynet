# HistoryNet - Agent Collaboration Guidelines

This document provides instructions for AI agents and developers working on the HistoryNet project. It describes the repository structure, how work is coordinated, and guidelines for contributing.

---

## Project Overview

**HistoryNet** is a React/Vite SPA for visualizing and exploring historical social networks. The application displays graph data representing historical figures (persons), their works (objects), locations, and organizations (entities), along with the relationships between them.

The application is:
- **Read-only**: Users view but cannot edit data
- **Dataset-agnostic**: Multiple JSON knowledge bases can be loaded
- **Shareable**: All view/filter state is captured in URLs
- **Static**: Deployed as a pure client-side SPA to GitHub Pages

---

## Repository Structure

```
historynet/
├── PRD.md                 # Product Requirements Document
├── GRAPH_SCHEMA.md        # Node/edge schema specification
├── AGENTS.md              # This file - collaboration guidelines
├── MILESTONES.md          # High-level implementation milestones
├── PROGRESS.md            # Detailed task tracking with checkboxes
├── README.md              # User-facing documentation (created during bootstrap)
│
├── src/                   # Application source code
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Visualization layouts (graph, timeline)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main application component
│
├── public/
│   └── datasets/          # JSON knowledge bases (final output)
│       └── disney-characters/
│           ├── manifest.json
│           ├── nodes.json
│           └── edges.json
│
├── research/              # Research products for dataset creation
│   ├── README.md          # Overview of research projects
│   ├── RESEARCHING_NETWORKS.md  # Meta-process guide
│   └── {network-name}/    # One folder per network being researched
│       ├── progress.md    # Research phase tracking
│       └── *.md           # Research documents (see meta-process)
│
├── .github/
│   └── workflows/         # GitHub Actions for deployment
│
└── [config files]         # vite.config.ts, tsconfig.json, etc.
```

---

## Key Documentation Files

| File | Purpose | When to Update |
|------|---------|----------------|
| `PRD.md` | Product requirements and feature specifications | When requirements change |
| `GRAPH_SCHEMA.md` | Schema for nodes and edges in datasets | When schema evolves |
| `MILESTONES.md` | High-level milestones and their decomposition into tasks | When adding new milestones |
| `PROGRESS.md` | Granular task tracking with checkboxes | After completing any task |
| `research/RESEARCHING_NETWORKS.md` | Meta-process for researching new historical networks | When research methodology evolves |

### Reading Order for New Agents

1. **Start with `PRD.md`** to understand what we're building
2. **Read `GRAPH_SCHEMA.md`** to understand the data model
3. **Check `MILESTONES.md`** to see the implementation roadmap
4. **Consult `PROGRESS.md`** to find tasks to work on
5. **For dataset research**: Read `research/RESEARCHING_NETWORKS.md` for the research methodology

---

## Workflow for Agents

### Finding Work

1. Open `PROGRESS.md` and find unchecked tasks (`[ ]`)
2. Look for tasks that:
   - Have their dependencies completed (checked tasks they depend on)
   - Match your capabilities (frontend, data creation, testing, etc.)
3. Before starting, verify no other agent is actively working on the same task

### Completing Tasks

1. **Announce**: If possible, indicate you're starting a task
2. **Implement**: Complete the work according to specifications
3. **Test**: Verify the implementation works correctly
4. **Update PROGRESS.md**: Check off the completed task `[x]`
5. **Document**: Add any relevant notes or decisions made

### Task Granularity

Tasks in `PROGRESS.md` should be:
- **Atomic**: Completable in a single focused session
- **Verifiable**: Has clear completion criteria
- **Independent**: Minimal dependencies on concurrent work

If a task is too large, break it down into subtasks before starting.

---

## Coordination Guidelines

### Avoiding Conflicts

- **Milestones are sequential**: Complete Milestone N before starting Milestone N+1
- **Tasks within a milestone** can often be parallelized
- **File-level locking**: Avoid multiple agents editing the same file simultaneously
- **Component boundaries**: Respect component/module boundaries when working in parallel

### Communication via Documentation

Since agents may not have direct communication:
- Add notes to `PROGRESS.md` when making significant decisions
- Update `PRD.md` if requirements need clarification
- Document any blockers or issues discovered

### Branching Strategy (for human developers)

- `main`: Production-ready code, deployed to GitHub Pages
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches
- `milestone/*`: Branches for milestone work if needed

---

## Technical Guidelines

### Code Style

- **TypeScript**: All source code should be TypeScript
- **Components**: Functional React components with hooks
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Files**: One component per file, named to match the component

### State Management

- **URL State**: Filter/view state must sync with URL parameters
- **Local State**: Use React hooks for component-local state
- **Shared State**: Use React Context or a lightweight store (Zustand)

### Visualization Architecture

The application should support swappable visualization layouts:

```typescript
interface VisualizationLayout {
  id: string;
  name: string;
  render(container: HTMLElement, data: GraphData, options: LayoutOptions): void;
  update(data: GraphData, options: LayoutOptions): void;
  cleanup(): void;
}
```

This allows graph view and timeline view (and future layouts) to share a common interface.

### Security Considerations

Per the workspace security rules:
- **Sanitize HTML**: Use DOMPurify for any user-supplied or external HTML
- **URL Handling**: Use the `URL` constructor, never string concatenation
- **No eval()**: Never execute dynamic code from dataset content

---

## Dataset Creation Guidelines

For agents creating historical datasets:

1. **Follow `GRAPH_SCHEMA.md`** exactly
2. **Include evidence** for all relationships when possible
3. **Use consistent IDs**: `{type}-{name-slug}` (e.g., `person-aristotle`)
4. **Validate dates**: Use ISO 8601 format or year-only strings
5. **Test loading**: Verify the dataset loads in the application

### Dataset Validation

Before submitting a new dataset:
- [ ] All required fields present
- [ ] All edge source/target IDs exist in nodes
- [ ] No orphan nodes (unless intentional)
- [ ] Evidence provided for relationships
- [ ] Manifest.json is complete and accurate

---

## Common Tasks by Type

### Frontend Implementation Tasks
- Component creation in `src/components/`
- Layout implementation in `src/layouts/`
- Hook creation in `src/hooks/`
- Styling and responsive design

### Data Research Tasks
- Researching new historical networks (see `research/RESEARCHING_NETWORKS.md`)
- Enumerating figures and documenting relationships
- Converting research to JSON datasets

### Data Tasks
- Creating new datasets in `public/datasets/`
- Validating existing datasets
- Adding evidence to edges

### Infrastructure Tasks
- GitHub Actions workflow configuration
- Build optimization
- Testing setup

### Documentation Tasks
- Updating `README.md` for users
- Clarifying requirements in `PRD.md`
- Evolving schema in `GRAPH_SCHEMA.md`

---

## Getting Help

If you encounter:
- **Ambiguous requirements**: Check `PRD.md`, then make a reasonable decision and document it
- **Technical blockers**: Note the blocker in `PROGRESS.md` and move to another task
- **Schema questions**: Refer to `GRAPH_SCHEMA.md` or propose schema changes
- **Conflicts with other agents**: Prefer the simpler solution that meets requirements

---

## Definition of Done

A task is complete when:
1. ✅ Implementation matches the specification
2. ✅ Code compiles without errors
3. ✅ Linter passes (when configured)
4. ✅ Feature works in the browser
5. ✅ `PROGRESS.md` is updated
6. ✅ Any new decisions are documented
