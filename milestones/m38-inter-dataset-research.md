# M38: Inter-Dataset Research Capabilities

**Status**: 🔲 Future
**Track**: D (Atomic Architecture)
**Depends on**: M37 (Full POLE Atomization) - requires atomic entities

## Goal

Enable AI-assisted dataset expansion and gap detection. Build tools that suggest entities for datasets based on scope, identify missing overlaps between similar datasets, and generate research suggestions.

**Problem**: With atomic entities, we can analyze which entities appear where, but there's no systematic way to ask "who should be in this dataset but isn't?" or "these two datasets overlap in scope, what connections are we missing?"

## Design Principles

| Principle | Application |
|-----------|-------------|
| **Scope-driven suggestions** | Use manifest scope data to guide entity suggestions |
| **Cross-dataset analysis** | Compare similar datasets to find gaps |
| **Evidence-based ranking** | Prioritize suggestions by relevance and confidence |
| **Agent-friendly output** | Generate actionable research tasks |
| **Manual review required** | Suggestions are starting points, not auto-additions |

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Suggestion engine | Rule-based + metadata matching | Explainable, deterministic, no ML required initially |
| Coverage analysis | Compare temporal/spatial/thematic overlap | Datasets with similar scope should share entities |
| Ranking strategy | Relevance score based on dates/location/themes | Most relevant suggestions first |
| Output format | Markdown report + JSON for tools | Human-readable + machine-parseable |
| Integration | CLI tool + optional web UI | Researchers can run locally or view reports |

## Entity Index

**Purpose**: Fast metadata lookup for analysis without loading full entity files

**Location**: `entities/index.json`

**Structure**:
```typescript
{
  "hn-person-550e8400...": {
    "type": "person",
    "title": "Voltaire",
    "wikidataId": "Q937",
    "dateStart": "1694",
    "dateEnd": "1778",
    "occupations": ["Philosopher", "Writer"],
    "nationality": "French",
    "locations": ["hn-location-paris..."],  // Associated locations
    "datasets": ["enlightenment", "scientific-revolution"],
    "relationshipCount": 15  // Total across all datasets
  },
  ...
}
```

**Generation**:
- [ ] **IR-01** - Build index generator script: `scripts/build-entity-index/`
- [ ] **IR-02** - Scan all canonical entity files
- [ ] **IR-03** - Extract metadata (dates, locations, occupations, etc.)
- [ ] **IR-04** - Count dataset appearances (scan members.json files)
- [ ] **IR-05** - Count total relationships (scan edges.json files)
- [ ] **IR-06** - Output to `entities/index.json`
- [ ] **IR-07** - Run as npm script: `npm run build:entity-index`
- [ ] **IR-08** - Integrate into CI/CD (rebuild on dataset changes)

## Suggestion Rules

### Rule 1: Temporal Overlap

**Logic**: If entity's lifespan overlaps with dataset's temporal scope, they're potentially related.

**Example**:
- Dataset: "Enlightenment" (1715-1789)
- Entity: Gottfried Wilhelm Leibniz (1646-1716)
- Analysis: Leibniz died in 1716, just after Enlightenment start. His ideas influenced early Enlightenment thinkers.
- **Suggestion**: Consider adding Leibniz as "peripheral" (influence figure)

**Implementation**:
- [ ] **IR-09** - Load dataset manifest scope (startYear, endYear)
- [ ] **IR-10** - Filter entities by date overlap
- [ ] **IR-11** - Rank by overlap percentage
- [ ] **IR-12** - Flag entities who died just before (influence figures)

### Rule 2: Geographic Overlap

**Logic**: If entity was active in regions covered by dataset, they're potentially related.

**Example**:
- Dataset: "Florentine Academy" (regions: ["Florence", "Italy"])
- Entity: Leonardo da Vinci (lived in Florence 1472-1482)
- Analysis: Leonardo was in Florence during the relevant period
- **Suggestion**: Consider adding Leonardo (was in Florence during academy's peak)

**Implementation**:
- [ ] **IR-13** - Load dataset scope regions
- [ ] **IR-14** - Match entity locations (birthPlace, worked_at, lived_in) to regions
- [ ] **IR-15** - Rank by location relevance (birthPlace > worked_at > visited)

### Rule 3: Thematic Overlap

**Logic**: If entity's occupations/interests match dataset themes, they're potentially related.

**Example**:
- Dataset: "Scientific Revolution" (themes: ["Astronomy", "Physics", "Mathematics"])
- Entity: Gottfried Wilhelm Leibniz (occupations: ["Mathematician", "Philosopher"])
- Analysis: Leibniz was a mathematician active during relevant period
- **Suggestion**: Consider adding Leibniz (mathematician active 1660-1716)

**Implementation**:
- [ ] **IR-16** - Load dataset scope themes
- [ ] **IR-17** - Match entity occupations to themes (fuzzy matching)
- [ ] **IR-18** - Rank by theme relevance (exact match > related terms)

### Rule 4: Cross-Dataset Patterns

**Logic**: If similar datasets include an entity, this dataset might too.

**Example**:
- Dataset A: "Enlightenment" (has Voltaire, Rousseau, Diderot)
- Dataset B: "Scientific Revolution" (has Newton, Galileo, Kepler)
- Dataset C: "French Salons" (has Voltaire, Diderot, but missing Rousseau)
- Analysis: Rousseau appears in similar datasets to French Salons
- **Suggestion**: Consider adding Rousseau to French Salons

**Implementation**:
- [ ] **IR-19** - Define dataset similarity metrics (temporal + thematic overlap)
- [ ] **IR-20** - Find similar datasets (similarity score > threshold)
- [ ] **IR-21** - Identify entities in similar datasets but not in target dataset
- [ ] **IR-22** - Rank by appearance frequency in similar datasets

### Rule 5: Relationship Gaps

**Logic**: If entity A and entity C are in dataset, and A→B→C exists in other datasets, B might belong in this dataset too.

**Example**:
- Dataset: "Enlightenment" (has Voltaire, has Kant)
- Other datasets show: Voltaire → influenced → Rousseau → influenced → Kant
- Analysis: Rousseau bridges Voltaire and Kant, but is missing from Enlightenment
- **Suggestion**: Consider adding Rousseau (bridges Voltaire and Kant)

**Implementation**:
- [ ] **IR-23** - Build cross-dataset influence graph
- [ ] **IR-24** - Find paths between dataset members through external entities
- [ ] **IR-25** - Rank bridge entities by path frequency
- [ ] **IR-26** - Suggest top bridge entities

## CLI Tool: Potential Members Analysis

**Usage**:
```bash
npm run research:suggest -- --dataset enlightenment
npm run research:suggest -- --dataset enlightenment --min-score 0.7
npm run research:suggest -- --dataset enlightenment --output suggestions.md
```

**Output** (Markdown Report):
```markdown
# Research Suggestions: Enlightenment

Generated: 2026-01-30
Dataset scope: 1715-1789, Regions: France, England, Scotland, Germany
Themes: Philosophy, Political Theory, Science, Literature

---

## High Priority Suggestions (score ≥ 0.8)

### 1. Gottfried Wilhelm Leibniz (score: 0.85)
**Entity**: hn-person-abc123... (Q9047)
**Dates**: 1646-1716
**Reason**: Died just after period start, strong thematic match
**Details**:
  - Mathematician and philosopher (matches themes: Philosophy, Science)
  - Active in Germany (region overlap)
  - Appears in similar datasets: scientific-revolution (related)
  - **Rule matches**: Temporal (influence figure), Thematic, Cross-dataset

**Suggested action**:
```bash
npm run entity:add-to-dataset -- hn-person-abc123... enlightenment --role peripheral
```
*Rationale*: Peripheral role as influence figure (died 1716, ideas influenced early Enlightenment)

---

### 2. Jean-Jacques Rousseau (score: 0.82)
**Entity**: hn-person-def456... (Q6527)
**Dates**: 1712-1778
**Reason**: Strong temporal, geographic, and thematic match
**Details**:
  - Philosopher and writer (matches themes: Philosophy, Political Theory, Literature)
  - Active in France and Switzerland (region overlap)
  - Appears in similar datasets: None yet! (gap in coverage)
  - Bridges: Voltaire → Rousseau → Kant (relationship gap)
  - **Rule matches**: Temporal, Geographic, Thematic, Relationship gap

**Suggested action**:
```bash
npm run entity:add-to-dataset -- hn-person-def456... enlightenment --role core
```
*Rationale*: Core figure - central to French Enlightenment, bridges key thinkers

---

## Medium Priority Suggestions (score 0.6-0.8)

[... more suggestions ...]

---

## Coverage Analysis

**Temporal coverage**:
  - 1715-1730: 5 members (sparse - consider adding early figures)
  - 1730-1760: 18 members (good coverage)
  - 1760-1789: 22 members (excellent coverage)

**Geographic coverage**:
  - France: 25 members (excellent)
  - England: 8 members (good)
  - Scotland: 4 members (moderate - consider Scottish Enlightenment figures)
  - Germany: 3 members (sparse - consider adding German figures)

**Thematic coverage**:
  - Philosophy: 20 members (excellent)
  - Political Theory: 12 members (good)
  - Science: 6 members (moderate)
  - Literature: 8 members (good)

---

## Comparison with Similar Datasets

**Similar dataset**: scientific-revolution (similarity: 0.72)
  - Shared members: 4 (Newton, Galileo, ...)
  - Unique to scientific-revolution: 12 entities (potential gaps)
  - Unique to enlightenment: 18 entities

**Potentially missing from enlightenment**:
  - Robert Boyle (chemist, 1627-1691) - influence figure
  - Edmond Halley (astronomer, 1656-1742) - early period overlap
  - [... more ...]

---

## Research Tasks

1. Review high-priority suggestions (score ≥ 0.8)
2. Add 2-3 high-priority entities to dataset
3. Investigate sparse geographic coverage (Germany, Scotland)
4. Investigate sparse temporal coverage (1715-1730)
5. Re-run analysis after additions to see updated coverage
```

**Implementation Tasks**:
- [ ] **IR-27** - Create CLI script: `scripts/research-suggestions/`
- [ ] **IR-28** - Load entity index and dataset manifest
- [ ] **IR-29** - Apply all suggestion rules (IR-09 to IR-26)
- [ ] **IR-30** - Calculate relevance scores (weighted combination of rules)
- [ ] **IR-31** - Rank suggestions by score
- [ ] **IR-32** - Generate markdown report with actionable commands
- [ ] **IR-33** - Generate JSON output for programmatic use
- [ ] **IR-34** - Add coverage analysis (temporal, geographic, thematic)
- [ ] **IR-35** - Add similar dataset comparison
- [ ] **IR-36** - Add npm script: `npm run research:suggest`

## CLI Tool: Coverage Gap Report

**Purpose**: Compare two similar datasets to find missing entities

**Usage**:
```bash
npm run research:compare -- enlightenment scientific-revolution
npm run research:compare -- enlightenment scientific-revolution --output gap-report.md
```

**Output**:
```markdown
# Coverage Gap Report

Comparing: enlightenment vs. scientific-revolution
Similarity score: 0.72 (high - significant overlap expected)

---

## Overlap Analysis

**Shared entities**: 4 (10% of scientific-revolution, 8% of enlightenment)
  - Isaac Newton (hn-person-...)
  - Galileo Galilei (hn-person-...)
  - [...]

**Expected overlap** (based on scope similarity): 15-20 entities (actual: 4)
**Gap**: 11-16 entities missing from one or both datasets

---

## Entities in scientific-revolution but not enlightenment

### High relevance (should probably be in both):

1. **Robert Boyle** (hn-person-..., 1627-1691)
   - Chemist and natural philosopher
   - Temporal overlap: 1627-1691 (died before enlightenment start, but influence figure)
   - Thematic overlap: Science
   - **Suggestion**: Add to enlightenment as peripheral (influence figure)

[... more ...]

---

## Entities in enlightenment but not scientific-revolution

[... similar analysis ...]

---

## Recommended Actions

1. Add 5 high-relevance entities from scientific-revolution to enlightenment
2. Add 2 high-relevance entities from enlightenment to scientific-revolution
3. Document exclusions in manifest if intentionally omitted
```

**Implementation Tasks**:
- [ ] **IR-37** - Create comparison script: `scripts/compare-datasets/`
- [ ] **IR-38** - Calculate dataset similarity (temporal + thematic + geographic)
- [ ] **IR-39** - Identify shared entities
- [ ] **IR-40** - Identify unique entities per dataset
- [ ] **IR-41** - Rank unique entities by relevance to other dataset
- [ ] **IR-42** - Generate gap report with actionable suggestions
- [ ] **IR-43** - Add npm script: `npm run research:compare`

## Web UI (Optional Enhancement)

**Purpose**: Visual interface for exploring suggestions and gaps

**Features**:
- Dataset selector
- Suggestion list with sorting/filtering
- Entity detail preview
- One-click "Add to dataset" (generates CLI command)
- Coverage visualizations (timeline, map, theme chart)

**Implementation** (future work, not in M38 scope):
- React page: `/research/suggestions/:datasetId`
- API endpoint: `GET /api/research/suggestions?dataset=enlightenment`
- Interactive charts (D3 or Recharts)

**M38 Scope**: CLI tools only. Web UI can be future milestone.

## Agent Workflow Integration

**Purpose**: Enable LLM agents to use research tools

**Example Agent Prompt**:
```
You are researching the "Enlightenment" dataset. Your goal is to identify
gaps and suggest improvements.

Step 1: Run suggestion analysis
$ npm run research:suggest -- --dataset enlightenment

Step 2: Review high-priority suggestions (score ≥ 0.8)

Step 3: For each suggestion:
  - Verify entity exists: npm run entity:info -- {uuid}
  - Check if suggestion is valid (read reasoning)
  - If valid, add to research notes

Step 4: Run coverage gap report vs. similar datasets
$ npm run research:compare -- enlightenment scientific-revolution

Step 5: Summarize findings and recommend 3-5 entities to add

DO NOT automatically add entities - generate recommendations for human review.
```

**Implementation Tasks**:
- [ ] **IR-44** - Document agent workflow in `research/ENTITY_MANAGEMENT.md`
- [ ] **IR-45** - Add agent-friendly output formats (JSON with clear actions)
- [ ] **IR-46** - Create agent prompt template in `research/AGENT_PROMPTS.md`

## Validation

- [ ] **IR-47** - Test suggestion tool on 3 datasets (enlightenment, scientific-revolution, florentine-academy)
- [ ] **IR-48** - Verify high-priority suggestions are reasonable (manual review)
- [ ] **IR-49** - Test comparison tool on 2 dataset pairs
- [ ] **IR-50** - Verify gap reports identify real gaps (manual review)
- [ ] **IR-51** - Test entity index generation on all datasets
- [ ] **IR-52** - Verify index size is reasonable (< 500KB)
- [ ] **IR-53** - Test agent workflow with LLM (generate research notes)

## Documentation

- [ ] **IR-54** - Create `research/RESEARCH_TOOLS.md` guide
- [ ] **IR-55** - Document suggestion rules and scoring
- [ ] **IR-56** - Document coverage analysis methodology
- [ ] **IR-57** - Document agent workflow and prompts
- [ ] **IR-58** - Add examples of using research tools
- [ ] **IR-59** - Update `research/RESEARCHING_NETWORKS.md` with research tools section

## Key Deliverables

1. **Entity index**: `entities/index.json` with fast metadata lookup
2. **Suggestion tool**: `npm run research:suggest` with markdown reports
3. **Comparison tool**: `npm run research:compare` for gap analysis
4. **Suggestion rules**: 5 rules for entity relevance scoring
5. **Coverage analysis**: Temporal, geographic, thematic gap detection
6. **Agent workflow**: LLM-friendly research process
7. **Documentation**: Comprehensive guide to research tools

## Success Metrics

- Entity index generation time < 5 seconds
- Suggestion tool runs < 10 seconds per dataset
- High-priority suggestions have ≥ 80% approval rate (manual review)
- Gap reports identify ≥ 3 real gaps per dataset pair
- Agent workflow produces actionable research notes
- Researchers report faster gap detection vs. manual review

## Future Enhancements (Out of Scope)

- ML-based suggestion ranking (learn from accepted/rejected suggestions)
- Automatic entity enrichment from Wikidata
- Web UI for visual exploration
- Real-time suggestions during dataset editing
- Collaborative research workflows (multi-user)
- Integration with evidence gathering tools

## Notes

- This milestone assumes M37 complete (all entities atomic)
- Entity index is critical infrastructure (rebuild on every dataset change)
- Suggestion rules are heuristics, not ML (explainable, deterministic)
- Manual review always required - tools suggest, humans decide
- Agent workflow empowers researchers to work faster, not replace them
- Coverage analysis helps ensure dataset quality and completeness
