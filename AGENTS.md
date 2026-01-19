# Scenius - Agent Collaboration Guidelines

This document provides instructions for AI agents and developers working on the Scenius project. It describes the repository structure, how work is coordinated, and guidelines for contributing.

---

## Live Application & Testing

> **Production URL**: https://scenius-seven.vercel.app/
> 
> **GitHub Repository**: https://github.com/moxious/historynet

The application is deployed to Vercel. Pushing to `main` triggers automatic deployment. Use the production URL to test features at runtime using browser tools (MCP browser extension, etc.).

**API Endpoints**:
- `/api/health` - Health check endpoint
- `/api/og` - Dynamic OG image generation

### Example URLs for Testing
- **Home**: `https://scenius-seven.vercel.app/`
- **AI-LLM Dataset Overview**: `https://scenius-seven.vercel.app/ai-llm-research`
- **AI-LLM Dataset Explore**: `https://scenius-seven.vercel.app/ai-llm-research/explore`
- **Node Detail Page**: `https://scenius-seven.vercel.app/ai-llm-research/node/person-geoffrey-hinton`
- **Edge Detail Page**: `https://scenius-seven.vercel.app/ai-llm-research/from/person-geoffrey-hinton/to/entity-google-brain`
- **Dark Mode**: `https://scenius-seven.vercel.app/?theme=dark`
- **Health API**: `https://scenius-seven.vercel.app/api/health`
- **OG Image API**: `https://scenius-seven.vercel.app/api/og?dataset=ai-llm-research&node=person-geoffrey-hinton`

---

## Quick Start by Task Type

> **Do not read everything upfront.** Read only the relevant milestone file, then pull in context as needed.
>
> **For a one-page project overview**, see [`CHEATSHEET.md`](CHEATSHEET.md).

| Task Type | Read First | Then Consult |
|-----------|------------|--------------|
| Implement milestone M{N} | `milestones/m{N}-*.md` | Relevant `src/` code |
| Check milestone status | `milestones/index.md` | - |
| Frontend feature | Relevant `src/` code | `milestones/index.md` for context |
| Bug fix | Relevant `src/` code | - |
| Dataset creation | `GRAPH_SCHEMA.md` | `research/RESEARCHING_NETWORKS.md` |
| Research task | `research/RESEARCHING_NETWORKS.md` | `GRAPH_SCHEMA.md` |
| Documentation | `PRD.md` | `ROADMAP.md` |

> **Milestone files are self-contained.** Each `milestones/m{N}-*.md` file contains the goal, design decisions, task checklist, and implementation notes for that milestone.

---

## Project Overview

**Scenius** (formerly HistoryNet) is a React/Vite SPA for visualizing and exploring historical social networks. The application displays graph data representing historical figures (persons), their works (objects), locations, and organizations (entities), along with the relationships between them.

The name "Scenius" comes from Brian Eno's concept describing the collective intelligence of creative communities—the idea that great creative work emerges from groups of people encouraging, competing with, and reacting to each other.

The application is:
- **Read-only**: Users view but cannot edit data
- **Dataset-agnostic**: Multiple JSON knowledge bases can be loaded
- **Shareable**: All view/filter state is captured in clean URLs (no hash routing)
- **Deployed**: Vercel (with API endpoints and dynamic OG images)

---

## Repository Structure

```
historynet/
├── PRD.md                 # Product Requirements Document
├── GRAPH_SCHEMA.md        # Node/edge schema specification
├── AGENTS.md              # This file - collaboration guidelines
├── ROADMAP.md             # Future direction and milestone overview
├── CHANGELOG.md           # What shipped when
├── README.md              # User-facing documentation
│
├── milestones/            # One file per milestone (goal, tasks, notes)
│   ├── index.md           # Status table and dependency diagram
│   ├── m01-project-bootstrap.md
│   ├── m02-core-data-layer.md
│   └── ...                # m{N}-{slug}.md for each milestone
│
├── src/                   # Application source code
│   ├── components/        # React components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Visualization layouts (graph, timeline)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main application component
│
├── public/
│   └── datasets/          # JSON knowledge bases (final output)
│       ├── ai-llm-research/
│       ├── enlightenment/
│       ├── rosicrucian-network/
│       └── [other datasets...]
│
├── research/              # Research products for dataset creation
│   ├── README.md          # Overview of research projects
│   ├── RESEARCHING_NETWORKS.md  # Meta-process guide
│   └── {network-name}/    # One folder per network being researched
│       ├── progress.md    # Research phase tracking
│       └── *.md           # Research documents (see meta-process)
│
├── scripts/               # Build-time scripts (not shipped to production)
│   └── validate-datasets/ # Dataset validation CLI tool
│       ├── index.ts       # Main entry point
│       ├── types.ts       # Validation types and interfaces
│       ├── reporter.ts    # Output formatting
│       └── validators/    # Individual validators
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
| `ROADMAP.md` | Future direction and milestone overview | When adding new milestones |
| `milestones/index.md` | Milestone status table and dependencies | After completing a milestone |
| `milestones/m{N}-*.md` | Individual milestone files with tasks | After completing tasks |
| `CHANGELOG.md` | Record of what shipped | After completing a milestone |
| `research/RESEARCHING_NETWORKS.md` | Meta-process for researching new historical networks | When research methodology evolves |

### Milestones Directory

Each milestone has its own file in `milestones/` containing:
- **Status**: Complete/Not started with date
- **Goal**: 1-2 sentence description
- **Design Decisions**: Key choices and rationale
- **Tasks**: Checkbox list of work items
- **Notes**: Implementation notes and completion details

**To implement a milestone**, read only `milestones/m{N}-*.md`. The file is self-contained.

**To check overall status**, read `milestones/index.md` for the status table and dependency diagram.

---

## Workflow for Agents

### Finding Work

1. Check `milestones/index.md` for the next milestone to implement
2. Open the relevant `milestones/m{N}-*.md` file
3. Find unchecked tasks (`[ ]`) in that file
4. Before starting, verify no other agent is actively working on the same task

### Completing Tasks

1. **Announce**: If possible, indicate you're starting a task
2. **Implement**: Complete the work according to specifications
3. **Test**: Verify the implementation works correctly
4. **Update milestone file**: Check off the completed task `[x]` in `milestones/m{N}-*.md`
5. **Document**: Add any relevant notes to the Notes section

### Task Granularity

Tasks in milestone files should be:
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

### Running Dev Servers and Long-Running Processes

**Before running `npm run dev`, `npm start`, or any long-running process:**

1. **Check the terminals folder first** — List the terminals directory to see active terminals and their running commands
2. **Look for existing dev servers** — If you see `npm run dev`, `npm start`, `vite`, or `vercel dev` already running, **do not start another one**
3. **Reuse the existing server** — The app is already available at the URL shown in that terminal

```bash
# Check if dev server is already running
lsof -i :5173   # Frontend-only (npm run dev)
lsof -i :3000   # Full-stack (npm start)
```

If either port is in use, a dev server is already running. Just use it — don't start a new one.

### Development Server Options

| Command | Port | API Endpoints | Use Case |
|---------|------|---------------|----------|
| `npm run dev` | 5173 | No | Frontend-only work (fast startup, default) |
| `npm start` | 3000 | Yes | Full-stack with API endpoints |

**First-time setup** (required for `npm start`):
```bash
vercel link              # Link to Vercel project
vercel env pull .env.local  # Pull environment variables
```

Use `npm run dev` for most frontend work. Use `npm start` when testing API endpoints like `/api/submit-feedback`.

### Communication via Documentation

Since agents may not have direct communication:
- Add notes to the relevant `milestones/m{N}-*.md` file when making significant decisions
- Update `PRD.md` if requirements need clarification
- Document any blockers or issues discovered
- Record completed milestones in `CHANGELOG.md`

### Branching Strategy (for human developers)

- `main`: Production-ready code, deployed to Vercel
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches
- `milestone/*`: Branches for milestone work if needed

---

## Technical Guidelines

### Code

- **TypeScript**: All source code should be TypeScript
- **Components**: Functional React components with hooks
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Files**: One component per file, named to match the component
- Consult .cursor/rules/frontend-security.mdc for secure coding rules
- Consult .cursor/rules/react-antipatterns.mdc for code guidelines dealing with React

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

**Run the validation CLI before submitting any dataset changes:**

```bash
# Validate all datasets
npm run validate:datasets

# Validate a specific dataset
npm run validate:datasets -- --dataset ai-llm-research

# Strict mode (treats warnings as errors)
npm run validate:datasets:strict

# JSON output (for CI/parsing)
npm run validate:datasets -- --json --quiet
```

The validation tool checks:

| Check | Severity | Description |
|-------|----------|-------------|
| JSON syntax | Error | Files must be valid JSON |
| Required fields | Error | `id`, `type`, `title` for nodes; `id`, `source`, `target`, `relationship` for edges |
| Node types | Error | Must be `person`, `object`, `location`, or `entity` |
| Date formats | Error | ISO 8601 (YYYY-MM-DD) or year-only (YYYY) |
| URL formats | Error | Valid HTTP/HTTPS URLs for `imageUrl`, `evidenceUrl`, external links |
| Duplicate IDs | Error | Node and edge IDs must be unique |
| Broken references | Error | Edge `source`/`target` must exist in nodes |
| Missing evidence | Warning | Edges should have `evidence`, `evidenceNodeId`, or `evidenceUrl` |
| Missing recommended fields | Warning | Type-specific fields like `biography`, `objectType` |
| Non-standard IDs | Warning | IDs should follow `{type}-{slug}` pattern |
| Unknown relationship types | Warning | Consider adding to `manifest.customRelationshipTypes` |

**Validation runs automatically in CI** - the GitHub Actions workflow runs `npm run validate:datasets` before building. Invalid datasets will fail the deployment.

Manual checklist for dataset review:
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
- **Technical blockers**: Note the blocker in the milestone file and move to another task
- **Schema questions**: Refer to `GRAPH_SCHEMA.md` or propose schema changes
- **Conflicts with other agents**: Prefer the simpler solution that meets requirements

---

## Definition of Done

A task is complete when:
1. ✅ Implementation matches the specification
2. ✅ Code compiles without errors
3. ✅ Linter passes (when configured)
4. ✅ Feature works in the browser
5. ✅ Task checked off in `milestones/m{N}-*.md`
6. ✅ Any new decisions are documented in the Notes section

A milestone is complete when:
1. ✅ All tasks checked off in the milestone file
2. ✅ Status updated to "✅ Complete" with date in the milestone file
3. ✅ `milestones/index.md` updated with completion status
4. ✅ Entry added to `CHANGELOG.md`
