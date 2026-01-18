# Researching Historical Networks: Meta-Process Guide

This document defines the standard process for researching and building a new historical network dataset for HistoryNet. It is intended for AI agents and human researchers who are creating network datasets from scratch.

---

## Overview

Building a historical network dataset is a multi-phase research project that proceeds from initial scoping through enumeration, relationship mapping, evidence gathering, and finally conversion to the application's JSON format.

**Key Principles:**
- **Networks are standalone**: Each network is self-contained. Figures appearing in multiple networks may be duplicated with network-specific details.
- **Evidence-grounded**: All relationships should cite sources; speculative claims must be flagged.
- **Size-bounded**: Networks should not exceed ~200 people. Above this threshold, make critical choices about inclusion.
- **Research preserved**: Raw research notes are kept separate from final JSON, allowing re-evaluation over time.

---

## Directory Structure

All research products live in the `research/` directory, namespaced by network:

```
research/
├── README.md                           # Overview of all research projects
├── RESEARCHING_NETWORKS.md             # This file (meta-process guide)
│
├── {network-name}/                     # One folder per network
│   ├── progress.md                     # Tracks research phase completion
│   ├── 01-scope.md                     # Network scope and seed figures
│   ├── 02-enumeration.md               # Full list of people in the network
│   ├── 03-relationships.md             # Documented relationships with evidence
│   ├── 04-objects.md                   # Key works, manuscripts, publications
│   ├── 05-locations.md                 # Significant places
│   ├── 06-entities.md                  # Organizations, movements, institutions
│   └── 07-review-notes.md              # Issues, gaps, and review findings
│
└── rosicrucian/                        # Example: existing rosicrucian research
    ├── progress.md
    ├── ...
```

### Naming Convention

- **Network folders**: lowercase with hyphens (e.g., `enlightenment-philosophers`, `vienna-circle`, `florentine-renaissance`)
- **Research files**: numbered prefixes for ordering, descriptive names
- **Progress file**: always lowercase `progress.md` (distinct from system `PROGRESS.md`)

---

## Research Phases

### Phase 1: Scoping

**Goal**: Define the boundaries and identify seed figures for the network.

**Tasks**:
- [ ] Define the intellectual movement or milieu being mapped
- [ ] Establish approximate temporal boundaries (e.g., 1540-1660)
- [ ] Establish geographic scope (if applicable)
- [ ] Identify 3-5 "seed people" who are central to the network
- [ ] List major subgroups or circles expected to appear
- [ ] Create `01-scope.md` documenting these decisions

**Seed People**: These are the anchors of your research—figures whose connections will radiate outward to reveal the network. Examples:
- Voltaire for the Enlightenment
- Robert Fludd or Johann Valentin Andreae for Rosicrucianism
- Ludwig Wittgenstein for the Vienna Circle

**Output**: `01-scope.md` with:
- Movement name and description
- Temporal and geographic boundaries
- Seed figures with brief rationale
- Expected subgroups/circles
- Any exclusion criteria

---

### Phase 2: Enumeration

**Goal**: Build a comprehensive list of individuals in the network.

**Tasks**:
- [ ] Research each seed person's connections
- [ ] Expand outward through documented relationships
- [ ] Organize individuals into thematic subgroups
- [ ] For each person, capture:
  - Name (and alternate names/spellings)
  - Birth and death dates (validate against reliable sources)
  - Primary role/occupation
  - Location(s) of activity
  - Brief significance to the network
  - Key works (if applicable)
  - Known connections (preliminary)
- [ ] Create `02-enumeration.md` with all individuals

**Completion Criteria**:
- Network has reached ~200 people, OR
- No major well-documented figures with quality evidence remain to enumerate

**Size Management**: If you're approaching 200 people and more candidates exist:
1. Prioritize figures with documented relationships to existing members
2. Prioritize figures with primary source evidence
3. Deprioritize peripheral figures with tenuous connections
4. Document excluded candidates and rationale in review notes

**Output**: `02-enumeration.md` with:
- Individuals organized by subgroup
- Standardized entry format for each person
- Summary statistics (count by subgroup)
- Research gaps flagged

---

### Phase 3: Relationship Mapping

**Goal**: Document specific relationships between individuals with evidence.

**Tasks**:
- [ ] For each relationship, document:
  - Source and target persons
  - Relationship type (see GRAPH_SCHEMA.md for standard types)
  - Date range (if known)
  - Evidence description
  - Source citation
  - Strength/confidence level
- [ ] Validate dates against reliable sources
- [ ] Flag speculative or debated relationships
- [ ] Create `03-relationships.md`

**Relationship Types** (from GRAPH_SCHEMA.md):
- `influenced` / `influenced_by`
- `collaborated_with`
- `taught` / `studied_under`
- `corresponded_with`
- `knows`
- `related_to` (family)
- `opposed`
- Custom types as needed (document in manifest)

**Evidence Standards**:

| Source Type | Acceptable? | Notes |
|-------------|-------------|-------|
| Primary sources (letters, documents) | ✅ Yes | Highest quality |
| Academic secondary sources | ✅ Yes | Preferred for synthesis |
| Wikipedia (with citations) | ✅ Yes | Verify underlying sources when possible |
| Encyclopedias (Britannica, etc.) | ✅ Yes | Good for dates and basic facts |
| Popular history books | ⚠️ Qualified | Note source quality |
| Blogs, forums, low-quality sources | ⚠️ Qualified | Flag as "evidence questionable" |

**Handling Speculation**:
- If a relationship is widely discussed but debated, include it
- Flag with `strength: "speculative"` 
- In evidence field, cite WHO is speculating (e.g., "Frances Yates argues in *The Rosicrucian Enlightenment* that...")
- Speculation still requires a citation—no unsourced speculation

**Output**: `03-relationships.md` with:
- Relationships organized by category or subgroup
- Consistent format: persons, type, evidence, source, dates
- Validation notes for dates
- Speculative relationships clearly marked

---

### Phase 4: Objects, Locations, and Entities

**Goal**: Identify non-person nodes that connect and contextualize the network.

**Tasks**:
- [ ] Identify key works (books, manuscripts, letters, artworks)
- [ ] Identify significant locations (cities, universities, courts, salons)
- [ ] Identify relevant entities (organizations, movements, institutions)
- [ ] For each, capture fields per GRAPH_SCHEMA.md
- [ ] Create `04-objects.md`, `05-locations.md`, `06-entities.md`

**Objects** should include:
- Major published works by network members
- Manifestos, treatises, or foundational texts
- Correspondence collections
- Artworks or artifacts of significance

**Locations** should include:
- Cities where key figures lived/worked
- Universities and academies
- Courts of patrons
- Salons, coffee houses, or meeting places
- Publishers or printing centers

**Entities** should include:
- Formal organizations (academies, societies)
- Informal circles or movements
- Schools of thought
- Journals or publications (as institutions)

**Output**: Three files with node data ready for conversion.

---

### Phase 5: Review and Gap Analysis

**Goal**: Identify issues, validate completeness, and document remaining gaps.

**Tasks**:
- [ ] Review all enumerated individuals for completeness
- [ ] Verify all edge source/target IDs exist
- [ ] Check for orphan nodes (people with no relationships)
- [ ] Identify missing evidence that should be found
- [ ] Document any contested or debated claims
- [ ] Note figures that were excluded and why
- [ ] Create `07-review-notes.md`

**Review Checklist**:
- [ ] All dates validated against reliable sources
- [ ] All relationships have evidence citations
- [ ] Speculative claims are flagged and sourced
- [ ] No obvious major figures are missing
- [ ] Subgroups are reasonably balanced
- [ ] Size is within bounds (~200 people max)

**Output**: `07-review-notes.md` with:
- Known gaps and limitations
- Excluded figures and rationale
- Contested claims and their status
- Recommendations for future research

---

### Phase 6: Conversion to Graph Schema

**Goal**: Transform research notes into the JSON format required by HistoryNet.

**Executor**: This phase is handled by a **separate conversion agent**, not the research agent.

**Tasks**:
- [ ] Generate `nodes.json` from enumeration + objects + locations + entities
- [ ] Generate `edges.json` from relationships
- [ ] Create `manifest.json` with dataset metadata
- [ ] Validate against GRAPH_SCHEMA.md requirements
- [ ] Run validation checks (all IDs exist, no orphans, etc.)
- [ ] Place final dataset in `public/datasets/{network-id}/`

**Why Separate Conversion?**
- Research notes are preserved for future re-evaluation
- Conversion can be re-run if schema evolves
- Allows human review between research and publication
- Research agents focus on research quality, not JSON formatting

**Output**: 
- `public/datasets/{network-id}/manifest.json`
- `public/datasets/{network-id}/nodes.json`
- `public/datasets/{network-id}/edges.json`

---

## Progress Tracking

Each network folder contains a `progress.md` file tracking completion. Use this format:

```markdown
# {Network Name} - Research Progress

**Status**: {In Progress | Ready for Review | Ready for Conversion | Complete}
**Started**: {date}
**Last Updated**: {date}
**Researcher**: {agent/human identifier if relevant}

## Phase Completion

### Phase 1: Scoping
- [x] Define intellectual movement
- [x] Establish temporal boundaries
- [x] Identify seed people
- [ ] Document in 01-scope.md

### Phase 2: Enumeration
- [ ] Research seed person connections
- [ ] Organize into subgroups
- [ ] Validate dates
- [ ] Document in 02-enumeration.md

... (continue for all phases)

## Statistics

| Metric | Count |
|--------|-------|
| People enumerated | 0 |
| Relationships documented | 0 |
| Objects identified | 0 |
| Locations identified | 0 |
| Entities identified | 0 |

## Notes

(Any relevant notes, blockers, or decisions)
```

---

## Quality Guidelines

### Inclusion Decisions

**Include** a figure if:
- They have documented relationships to 2+ existing network members
- They are frequently mentioned in scholarship about the movement
- Primary or secondary sources establish their role

**Exclude** (or defer) a figure if:
- Only tangential connection to the network
- Poor source quality with no corroboration
- Including them would push network over size limit without adding significant value

**For debated/contested figures**:
- Include if widely discussed in scholarship
- Qualify the entry with notes about the debate
- Cite who makes the contested claim

### Evidence Quality

Always prefer higher-quality sources, but practical research may require a mix:

```
Primary Sources > Academic Secondary > Encyclopedias > Wikipedia > Popular History > Blogs
```

When using lower-quality sources:
- Cross-reference when possible
- Note the source quality in evidence field
- Flag with "evidence questionable" if significant doubt exists

### Relationship Confidence

Use the `strength` field to indicate confidence:
- `strong`: Well-documented, multiple sources
- `moderate`: Documented but limited sources
- `weak`: Single source or indirect evidence
- `speculative`: Debated or hypothetical, but worth including

---

## Starting a New Network

1. **Create the folder**: `research/{network-name}/`
2. **Initialize progress.md**: Copy template above
3. **Begin Phase 1**: Create `01-scope.md` with initial scoping
4. **Proceed through phases**: Update progress.md as you go
5. **Request conversion**: When research is complete, note "Ready for Conversion" status

---

## Example: Network Research Lifecycle

```
Day 1: Create research/vienna-circle/
        Define scope: logical positivism, 1920s-1930s Vienna
        Seed people: Schlick, Carnap, Neurath, Wittgenstein

Day 2: Enumeration begins
        Core Vienna Circle members (13)
        Berlin Group connections (8)
        Prague linguistic circle overlap (5)
        ...

Day 3: Continue enumeration
        American logical empiricists (12)
        British connections (7)
        Reach 45 people, continue expanding...

Day 4: Relationship mapping begins
        Document Schlick's students
        Map the Monday evening discussions
        Trace correspondence networks...

Day 5: Objects and locations
        Key publications (Erkenntnis journal, manifestos)
        Locations (Vienna cafés, university)
        Entities (Vienna Circle, Unity of Science movement)

Day 6: Review
        Gap analysis
        Validate all dates
        Flag speculative claims

Day 7: Mark ready for conversion
        Conversion agent creates JSON dataset
```

---

## Appendix: File Templates

### 01-scope.md Template

```markdown
# {Network Name} - Scope Definition

**Date**: {date}
**Researcher**: {identifier}

## Movement Description

{1-2 paragraphs describing the intellectual movement}

## Boundaries

- **Temporal**: {start year} - {end year}
- **Geographic**: {regions/countries, or "international"}
- **Intellectual**: {what ideas/themes unite this network}

## Seed Figures

1. **{Name}** ({dates}): {why they're central}
2. **{Name}** ({dates}): {why they're central}
3. ...

## Expected Subgroups

- {Subgroup 1}: {brief description}
- {Subgroup 2}: {brief description}
- ...

## Exclusion Criteria

- {What types of figures will NOT be included}
- {Any explicit scope limitations}

## Sources to Consult

- {Key secondary works}
- {Reference encyclopedias}
- {Online resources}
```

### 02-enumeration.md Template

```markdown
# {Network Name} - Person Enumeration

**Date**: {date}
**Purpose**: Enumerate individuals for the {network} historical network.

---

## {Subgroup 1 Name}

### {Person Name} ({birth}-{death})
- **Role**: {primary role/occupation}
- **Location**: {where they were active}
- **Significance**: {why they matter to this network}
- **Key Works**: {major publications, if any}
- **Connections**: {preliminary known connections}
- **Notes**: {any flags, gaps, or issues}

### {Next Person}...

---

## Summary Statistics

| Subgroup | Count |
|----------|-------|
| {Subgroup 1} | X |
| {Subgroup 2} | Y |
| **Total** | **Z** |

---

## Research Gaps

1. {Missing information}
2. {Figures needing more research}
```

---

## Related Documents

- `GRAPH_SCHEMA.md` - Schema for final JSON format
- `AGENTS.md` - General agent collaboration guidelines
- `PRD.md` - Product requirements for HistoryNet application
