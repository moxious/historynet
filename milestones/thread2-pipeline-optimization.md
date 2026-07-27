# Thread 2: "Idea → Dataset" Pipeline Optimization (Plan)

**Status**: 🟢 In progress — 2A-1 (`enrich`) and 2A-3 (`sync-manifest`) shipped 2026-07-27
**Goal**: Make the "idea → validated dataset" pipeline faster and cheaper by
converting *deterministic* steps from full-LLM work into scripts, leaving the
LLM to do only what requires judgment.

> Direction chosen 2026-07-27: **2A first**, Track D (M34 atomic migration)
> paused behind it. It complements (does not replace) the atomic-architecture
> milestones M35–M38.

---

## Core insight

The current pipeline (`research/RESEARCHING_NETWORKS.md`) runs **four phases
almost entirely as LLM work**. But only some of that work needs a language
model. The rest is mechanical lookup and bookkeeping that an LLM does slowly,
expensively, and inconsistently.

**Two separable sub-tracks:**

- **2A — Pipeline scripting (format-agnostic, ship now).** Works on the
  *current* `nodes.json` / `edges.json` format. No atomic migration required.
  This is where the fast ROI is.
- **2B — Atomic architecture (M34–M38, deeper refactor).** Token-efficient
  *edits* and cross-dataset entity identity. Foundation already landed in M34
  (PR #36). Higher effort, higher ceiling.

Recommendation: **do 2A first.** It pays off on every existing and future
dataset regardless of whether the atomic migration ever ships.

---

## Step classification: keep-LLM vs. script-it

| Pipeline step (current) | Nature | Verdict |
|---|---|---|
| Decide scope / who belongs / boundaries | Judgment | **Keep LLM** |
| Scaffold `manifest.json` + empty files from scope | Deterministic | **Script** (`new-dataset`) |
| Find each node's `wikipediaTitle` | Lookup | **Script** (`enrich`) |
| Find each node's `wikidataId` | Lookup | **Script** (`enrich`) |
| Fill `dateStart`/`dateEnd`, `shortDescription`, places, occupations | Lookup | **Script** (`enrich`, from Wikidata) |
| Write biographies / contextual descriptions | Judgment | **Keep LLM** |
| Identify relationships + evidence | Judgment | **Keep LLM** |
| Cite/verify evidence URLs are live | Mechanical | **Script** (`check-evidence`) |
| Source a banner image + license | Lookup | **Script** (`fetch-banner`) |
| Keep `nodeCount`/`edgeCount`/`lastUpdated` in sync | Bookkeeping | **Script** (`sync-manifest`) |
| Validate dataset | Mechanical | **Already scripted** (`validate:datasets`) |
| Detect gaps / suggest missing figures | Heuristic | **Script** (`suggest`, see 2B/M38) |

The LLM should end up doing **three** things: scope decisions, prose
(biographies/descriptions), and relationships+evidence. Everything else becomes
a command.

---

## Sub-track 2A — Pipeline scripting (proposed PRs)

Each bullet is a self-contained, PR-sized script under `scripts/`. All are
**format-agnostic** (operate on today's `nodes.json`/`edges.json`).

### PR 2A-1 — `enrich` (highest ROI) ✅ SHIPPED
`scripts/enrich-dataset/` → `npm run enrich -- --dataset <id>`
(`npm run enrich:dry-run` to preview). Fills only-missing `wikidataId`,
`wikipediaTitle`, `dateStart`/`dateEnd`, `shortDescription`, `birthPlace`,
`nationality`, `occupations` from Wikidata/Wikipedia. Never overwrites curated
values or prose. Multi-candidate / type-mismatch / not-found nodes are
quarantined to `<dataset>/enrich-ambiguous.json`. Type-aware guard: a
search-matched person must be an instance of human (Q5).

- For every node missing `wikipediaTitle` / `wikidataId` / dates /
  `shortDescription`, resolve them from the **Wikipedia + Wikidata APIs**.
  The `wikipedia` npm dep is *already installed* but currently unused by tooling.
- Wikidata (`https://www.wikidata.org/w/api.php` + SPARQL/`wbgetentities`) gives
  QID, birth/death dates (P569/P570), birth/death place (P19/P20), occupations
  (P106), and sitelinks → exact Wikipedia title. Deterministic, no LLM.
- Modes: `--dry-run` (report what would fill), `--fields wikidataId,dateStart`,
  `--only-missing` (default). Ambiguous matches (multiple QID candidates) are
  written to a `*-ambiguous.json` file for LLM/human disambiguation rather than
  guessed.
- **Impact**: eliminates the single largest per-node LLM labor. This is the one
  to build first.

### PR 2A-2 — `new-dataset` scaffolder
`scripts/new-dataset/` → `npm run new-dataset -- --id vienna-circle`

- Interactive or flag-driven: emits `manifest.json` (from the
  `RESEARCHING_NETWORKS.md` template), empty `nodes.json`/`edges.json`, and a
  scope skeleton. Pure template fill — zero LLM.
- Optional `--from-idea "logical positivism, Vienna, 1920s"` writes a scope stub
  the LLM then refines (the *only* LLM touch in setup).

### PR 2A-3 — `sync-manifest` ✅ SHIPPED
`scripts/sync-manifest/` → `npm run sync-manifest` (all) or `-- --dataset <id>`

- Recomputes `nodeCount`, `edgeCount`, bumps `lastUpdated` on change. Replaces
  the manual `jq` recipes in `RESEARCHING_NETWORKS.md`. `npm run
  sync-manifest:check` is a read-only CI gate (exits 1 on drift). On first run it
  caught real drift: `christian-kabbalah` edgeCount 75 → 81.

### PR 2A-4 — `fetch-banner`
`scripts/fetch-banner/` → `npm run fetch-banner -- --dataset <id> --query "..."`

- Query Wikimedia Commons API for a themed image, download to
  `public/img/banners/<id>.jpg`, capture license/attribution into the manifest.
  LLM only picks the search query; the fetch + license capture is scripted.

### PR 2A-5 — `check-evidence`
`scripts/check-evidence/` → `npm run check-evidence -- --dataset <id>`

- HEAD/GET every `evidenceUrl`, report dead links and edges missing evidence.
  Pure mechanical QA; candidate for CI on dataset changes.

### PR 2A-6 — `suggest` (format-agnostic gap detection)
`scripts/suggest-members/` → `npm run suggest -- --dataset <id>`

- A pragmatic subset of M38's rules (temporal/thematic/geographic overlap,
  cross-dataset patterns) computed over the **current** format — no atomic
  entities needed. Emits a markdown report of candidate figures + rationale.
  The LLM/human decides; the script surfaces.

**Suggested 2A order:** 2A-1 (enrich) → 2A-3 (sync-manifest) → 2A-2 (scaffold)
→ 2A-5 (check-evidence) → 2A-4 (fetch-banner) → 2A-6 (suggest). Enrich and
sync-manifest are the quickest wins; suggest is the most involved.

---

## Sub-track 2B — Atomic architecture (existing M35–M38)

Keep the existing milestone plans; they remain the long-term direction for
**edit efficiency** and **cross-dataset identity**. Sequence unchanged:

- **M34** — Migration infra & equivalence tests — *Phases 1–2 landed (PR #36)*;
  Phases 3–5 (atomic loader, runtime support, execution) remain.
- **M35** — Entity CLI (`entity:find/create/edit/add-to-dataset/…`).
- **M36** — Migrate Persons to atomic files.
- **M37** — Full POLE atomization (Objects, Locations, Entities).
- **M38** — Inter-dataset research (index, `research:suggest`, `research:compare`).

Note the overlap: 2A-6 (`suggest`) is a format-agnostic down payment on M38, and
2A-1 (`enrich`) is listed as "future/out of scope" in M38 but is far more
valuable *now*, before any migration. Building them in 2A means they're already
proven when the atomic work catches up.

---

## What the optimized pipeline looks like

```
Idea
 └─ npm run new-dataset --from-idea "…"        (script + 1 LLM scope pass)
     └─ LLM: refine scope, enumerate node names + relationships   (JUDGMENT)
         └─ npm run enrich --dataset <id>       (script: IDs, dates, places)
             └─ LLM: biographies, descriptions, evidence          (JUDGMENT)
                 └─ npm run fetch-banner / sync-manifest / check-evidence  (script)
                     └─ npm run validate:datasets  (script)
                         └─ npm run suggest        (script: gap report)
                             └─ LLM: review gaps, decide additions (JUDGMENT)
```

LLM touches: **scope, prose, relationships, gap review.** Everything else is a
command. Target: cut per-dataset LLM token cost substantially and remove the
error-prone manual ID/date lookups entirely.

---

## Open decisions for review

1. **Priority**: build 2A (pipeline scripting) before resuming 2B (atomic), or
   interleave? (Recommendation: 2A first.)
2. **Enrich scope**: auto-write high-confidence Wikidata fields, or always
   route through a `--dry-run` review file first? (Recommendation: write
   high-confidence, quarantine ambiguous.)
3. **CI**: run `sync-manifest --check`, `check-evidence`, `validate:datasets`
   on dataset-change PRs?
4. Do we want the optional M38 web UI (`/research/suggestions/:id`), or keep
   research tooling CLI-only?
```

