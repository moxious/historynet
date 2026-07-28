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

### Dataset Pipeline Tooling — Thread 2A ✅ Complete (2026-07)

Converted the deterministic steps of the "idea → dataset" pipeline from full-LLM
work into CLI tools (all under `scripts/`, all with `--help`; see the
[Dataset Tooling inventory in AGENTS.md](AGENTS.md#dataset-tooling)):

- `new-dataset` — scaffold a dataset skeleton
- `enrich` — fill missing mechanical fields (IDs, dates, places, occupations) from Wikidata/Wikipedia
- `check-evidence` — flag dead evidence links and unsupported edges
- `sync-manifest` — reconcile node/edge counts (+ CI gate)
- `suggest` — cross-dataset gap detection (down payment on M38)
- `fetch-banner` — Wikimedia Commons banner + license capture

### Data Integrity Remediation ✅ (2026-07)

While building the pipeline, `verify-ids` surfaced systematic Wikidata-ID
corruption (fabricated IDs pointing at unrelated entities) in **5 of 12
datasets** — up to 88% wrong. All remediated:

- `verify-ids` / `resolve-ids` — audit, clear, and date-aware re-resolution of IDs
- 5 datasets corrected; ~146 wrong IDs cleared/restored, 72 recovered to the correct entity
- Manifest drift fixed; guards added to CI (`sync-manifest:check` gate + weekly `data-health` report for `verify-ids`, `check-evidence`, and `cross-dataset`)
- `cross-dataset` — cross-dataset entity consistency report (groundwork for the atomic decision below); repaired 82 nodes with duplicate JSON keys (leftover from an enrich bug) and fixed genuine two-entity id collisions

---

## Upcoming Milestones

### Track B: Infrastructure & Backend

| # | Milestone | Description | Dependencies | Status |
|---|-----------|-------------|--------------|--------|
| M26 | Custom Domain | Configure custom domain on Vercel | M24 ✅ | 🔲 Future |
| M27 | Feedback Spam Protection | Rate limiting and honeypot fields | M25 ✅ | 🔲 Future |
| M29 | Cross-Scene Node Index API | Build-time index for cross-dataset node discovery | M24 ✅ | ✅ Complete |
| M30 | Cross-Scene Navigation UI | UI to discover same person/entity across datasets | M29 ✅ | ✅ Complete |

### Track D: Atomic Architecture

| # | Milestone | Description | Dependencies |
|---|-----------|-------------|--------------|
| M34 | Migration Infrastructure & Testing | Build migration tooling and comprehensive tests for atomic architecture transition. Phases 1–2 landed (PR #36). **Decision (2026-07): resume, scoped to persons + places — see Track D decision below.** Next: clear P0 blockers B1–B4, then Phases 3–5. | None |
| M35 | Research Tooling | CLI tools for efficient entity management (find, create, edit, add-to-dataset) | M34 |
| M36 | Atomic Architecture - Persons | Migrate Person entities to atomic files, prove architecture pattern | M34, M35 |
| M37 | Full POLE Atomization | Extend atomization to Objects, Locations, Entities - complete architecture | M36 |
| M38 | Inter-Dataset Research | AI-assisted dataset expansion, gap detection, coverage analysis | M37 |

### Dependency Diagram

```
Completed Foundation
    │
    ├─────────────────────┬────────────────────┬────────────────────┐
    │                     │                    │                    │
    │  TRACK B: Infra     │  TRACK B: Infra    │  TRACK D: Atomic  │
    │                     │                    │  Architecture      │
    ▼                     ▼                    ▼                    ▼
   M26                   M27                  M29                  M34
  (Custom              (Spam             (Cross-Scene         (Migration
   Domain)             Protection)          API)             Infrastructure)
                                             │                     │
                                             ▼                 ├───┴───┐
                                            M30                ▼       ▼
                                        (Cross-Scene          M35     M36
                                            UI)           (Research  (Atomic
                                                           Tooling)  Persons)
                                                                      │
                                                                      ▼
                                                                     M37
                                                                  (Full POLE)
                                                                      │
                                                                      ▼
                                                                     M38
                                                                (Inter-Dataset
                                                                  Research)
```

**Recommended next**: proceed with **Track D (scoped)** — see the decision below.
Track B quick wins (M26 Custom Domain, M27 Spam Protection) remain available as
independent side quests.

### ✅ Track D decision (2026-07): proceed, scoped to persons + places

The Track D reassessment asked whether the atomic migration was still worth doing
after Thread 2A. **Decision: yes — do it, scoped.** The reasoning corrected an
error in the earlier reassessment:

**2A delivered identity *detection*, not identity *unification*.** 2A made it
possible to *know* two nodes are the same entity (shared `wikidataId`), and that
powers `suggest`, cross-scene discovery, and cheap enrichment. But it left the
underlying duplication in place: the same entity still exists as **independent,
drifting copies** per dataset. That single-canonical-record + contextual-override
model is the distinct thing only the atomic architecture provides — and it's the
real reason to do Track D.

**The evidence is measurable now** (`npm run cross-dataset`): **91 entities are
shared/duplicated across datasets**, with real drift — London dated 47 vs 1490,
Reuchlin's biography differing across 4 datasets, and one-`wikidataId`-two-entities
collisions (a person and their book sharing an id). Every new overlapping dataset
makes it worse.

**Scope**: persons and locations are where reuse concentrates (33 persons, 39
locations shared), so target **M36 + the locations half of M37**. Objects/full
POLE (M37 remainder) and M38 can follow or be deferred.

**Sequence**:
1. **Cross-dataset consistency tooling + collision cleanup** — *done* (`cross-dataset`
   report; 82 duplicate-key nodes repaired; genuine two-entity id collisions
   fixed). Shrinks the problem and de-risks the migration.
2. **M34 blockers B1–B4** — B1 (key canonical merge on `type + wikidataId`) and B2
   (intra-dataset dedup) are exactly the mechanics of collapsing the duplicates
   into canonical records. Then M34 Phases 3–5.
3. **M35** — entity CLI.
4. **M36 + locations** — atomic persons and places, with per-dataset overrides.

---

## Track D: Atomic Architecture - Vision & Rationale

### The Problem

**Current Architecture**:
- Each dataset has `nodes.json` (all entities) and `edges.json` (all relationships)
- Adding/editing a single person requires loading entire `nodes.json` file
- Token budget blow-ups: editing one entity costs 10k+ tokens
- No efficient way to track entities across datasets
- Cross-dataset research requires reading multiple full datasets

**Pain Points**:
1. **Research workflow inefficiency**: Editing one person = load entire dataset
2. **Token waste**: LLM agents must read 10k+ tokens for atomic edits
3. **Cross-dataset blindness**: No easy way to know person appears in multiple datasets
4. **Context window issues**: Can't fit multiple datasets in LLM context for analysis

### The Solution: Atomic Entities

**New Architecture**:
- One file per entity: `entities/persons/hn-person-{uuid}.json`
- Datasets reference entities: `public/datasets/{id}/members.json`
- Context-specific overrides: Each dataset customizes biography/description
- Backend assembles graphs dynamically for visualization

**Benefits**:
1. **Efficient edits**: Edit one person = load one file (~500 bytes vs. 50kb+)
2. **Token efficiency**: < 1000 tokens per operation (vs. 10k+)
3. **Cross-dataset tracking**: Entity files list all dataset memberships
4. **Research tools**: CLI tools for finding/creating/editing entities
5. **Inter-dataset research**: AI can suggest entities for datasets based on scope/gaps

### Architecture Principles

- **UUID-based identity**: Every entity gets unique HistoryNet UUID (not coupled to Wikidata)
- **Canonical + overrides**: Core data in entity file, context in dataset references
- **Deterministic**: Same entity extraction produces same UUIDs
- **Validated equivalence**: Pre/post migration graphs must be structurally identical
- **Test-driven**: Migration happens only after comprehensive testing

### Migration Strategy

1. **M34**: Build migration infrastructure and tests FIRST
2. **M35**: Build research tooling, test on samples BEFORE migration
3. **M36**: Migrate Persons only (70% of entities, proves pattern)
4. **M37**: Migrate Objects, Locations, Entities (complete architecture)
5. **M38**: Build inter-dataset research tools (leverage atomic architecture)

### Example: Person Appears in Multiple Datasets

**Before** (current):
```
public/datasets/enlightenment/nodes.json:
  { "id": "person-voltaire", "title": "Voltaire", "biography": "..." }

public/datasets/scientific-revolution/nodes.json:
  { "id": "person-voltaire-sr", "title": "Voltaire", "biography": "..." }

Problem: Two separate nodes, no way to know they're the same person!
```

**After** (atomic):
```
entities/persons/hn-person-550e8400.json:
  { "id": "hn-person-550e8400", "wikidataId": "Q937", "title": "Voltaire",
    "dateStart": "1694", "dateEnd": "1778", ... }

public/datasets/enlightenment/members.json:
  { "entityId": "hn-person-550e8400", "role": "core",
    "overrides": { "biography": "Voltaire was the preeminent philosopher..." } }

public/datasets/scientific-revolution/members.json:
  { "entityId": "hn-person-550e8400", "role": "peripheral",
    "overrides": { "biography": "Though primarily a philosopher, Voltaire..." } }

Benefit: ONE canonical entity, TWO contextualized appearances, cross-dataset navigation!
```

### Research Workflow Transformation

**Before**:
1. Agent reads entire `nodes.json` (10k+ tokens)
2. Finds person to edit
3. Edits in memory
4. Writes entire `nodes.json` back
5. Total: ~20k tokens

**After**:
1. Run `npm run entity:find -- "Voltaire"` (200 tokens)
2. Run `npm run entity:edit -- hn-person-550e8400` (500 tokens)
3. Edit canonical data or dataset-specific override
4. Total: ~1k tokens (20x improvement!)

### Success Criteria

- Migration completes with zero data loss
- Pre/post graph metrics match exactly
- Research operations < 1000 tokens per entity
- Cross-dataset tracking works for all entity types
- Inter-dataset research tools help discover gaps

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
