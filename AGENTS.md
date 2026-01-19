# Scenius - Agent Collaboration Guidelines

This document provides instructions for AI agents and developers working on the Scenius project. It describes the repository structure, how work is coordinated, and guidelines for contributing.

---

## Live Application & Testing

> **Production URL**: https://moxious.github.io/historynet/
> 
> **GitHub Repository**: https://github.com/moxious/historynet

The application is automatically deployed to GitHub Pages when changes are pushed to `main`. Use the production URL to test features at runtime using browser tools (MCP browser extension, etc.).

### Example URLs for Testing
- **Home**: `https://moxious.github.io/historynet/#/`
- **AI-LLM Dataset** (default): `https://moxious.github.io/historynet/#/?dataset=ai-llm-research`
- **Rosicrucian Dataset**: `https://moxious.github.io/historynet/#/?dataset=rosicrucian-network`
- **Deep Link to Node**: `https://moxious.github.io/historynet/#/?dataset=ai-llm-research&selected=person-geoffrey-hinton&type=node`
- **Dark Mode**: `https://moxious.github.io/historynet/#/?theme=dark`

---

## Quick Start by Task Type

> **Do not read everything upfront.** Find your task in `PROGRESS.md` first, then pull in context as needed.
>
> **For a one-page project overview**, see [`CHEATSHEET.md`](CHEATSHEET.md).

| Task Type | Read First | Then Consult |
|-----------|------------|--------------|
| Frontend feature | `PROGRESS.md` (find task) | Relevant `src/` code |
| Bug fix | `PROGRESS.md`, relevant `src/` | - |
| Dataset creation | `GRAPH_SCHEMA.md`, `PROGRESS.md` | `research/RESEARCHING_NETWORKS.md` |
| Research task | `research/RESEARCHING_NETWORKS.md` | `GRAPH_SCHEMA.md` |
| Documentation | `PRD.md` | `ROADMAP.md` |
| New milestone | `ROADMAP.md`, `PROGRESS.md` | `PRD.md` |

> **HISTORY.md is archived reference only.** Only consult it when debugging an existing feature or understanding past decisions.

---

## Project Overview

**Scenius** (formerly HistoryNet) is a React/Vite SPA for visualizing and exploring historical social networks. The application displays graph data representing historical figures (persons), their works (objects), locations, and organizations (entities), along with the relationships between them.

The name "Scenius" comes from Brian Eno's concept describing the collective intelligence of creative communities—the idea that great creative work emerges from groups of people encouraging, competing with, and reacting to each other.

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
├── ROADMAP.md             # Future direction and milestone overview
├── PROGRESS.md            # Active task tracking with checkboxes
├── CHANGELOG.md           # What shipped when
├── README.md              # User-facing documentation
│
├── HISTORY.md             # Archived milestone task lists and completion notes
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
| `PROGRESS.md` | Active task tracking with checkboxes | After completing any task |
| `CHANGELOG.md` | Record of what shipped | After completing a milestone |
| `HISTORY.md` | Archived milestone details and completion notes | When archiving completed milestones |
| `research/RESEARCHING_NETWORKS.md` | Meta-process for researching new historical networks | When research methodology evolves |

### Periodic Cleanup: Moving Completed Work to HISTORY.md

To keep `ROADMAP.md` and `PROGRESS.md` focused on current/future work without losing the record of past accomplishments, periodically move completed milestone content to `HISTORY.md`:

1. **When to clean up**: When `PROGRESS.md` or `ROADMAP.md` becomes cluttered with old completed milestones
2. **What to move**: 
   - Completed task lists from `PROGRESS.md`
   - Completion notes and implementation details
   - Archived milestone sections from `ROADMAP.md`
3. **How to move**:
   - Copy the completed milestone section to `HISTORY.md`
   - Replace the detailed content in `PROGRESS.md` with a summary row in the "Completed Milestones" table
   - Keep a brief reference in `ROADMAP.md` pointing to `HISTORY.md`
4. **Preserve**: Always keep the task checkboxes and completion notes—this is the permanent record of what was built and when

### Reading Order for New Agents

**For most tasks, use the Quick Start table above.** The comprehensive reading order below is for major milestones or when you need deep project understanding:

1. **Start with `PRD.md`** to understand what we're building
2. **Read `GRAPH_SCHEMA.md`** to understand the data model
3. **Check `ROADMAP.md`** to see completed work and future direction
4. **Consult `PROGRESS.md`** to find active tasks to work on
5. **For historical context**: Check `HISTORY.md` if debugging or understanding past decisions
6. **For dataset research**: Read `research/RESEARCHING_NETWORKS.md` for the research methodology

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
- Record completed milestones in `CHANGELOG.md`

### Branching Strategy (for human developers)

- `main`: Production-ready code, deployed to GitHub Pages
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

A milestone is complete when:
1. ✅ All tasks checked off in `PROGRESS.md`
2. ✅ Entry added to `CHANGELOG.md`
3. ✅ `ROADMAP.md` updated with completion status
