# M36: Atomic Architecture - Persons Only

**Status**: 🔲 Future
**Track**: D (Atomic Architecture)
**Depends on**: M34 (Migration Infrastructure), M35 (Research Tooling)

## Goal

Migrate to atomic file architecture for Person entities while keeping Objects, Locations, and Entities in dataset files. Proves atomization concept with highest-value entity type and establishes patterns for full migration (M37).

**Problem**: Persons represent ~70% of nodes across datasets. Atomizing them first delivers immediate value (efficient edits, cross-dataset tracking) while limiting migration scope and risk.

## Design Principles

| Principle | Application |
|-----------|-------------|
| **Hybrid architecture** | Persons atomic, O/L/E stay in dataset files temporarily |
| **Backend assembly** | New endpoint dynamically assembles graphs for visualization |
| **Transparent to frontend** | UI receives same GraphData shape, no changes needed |
| **Validated migration** | Run M34 tests before and after, ensure equivalence |
| **Incremental value** | Persons atomic = most research workflow improvement |

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Persons only in M36, O/L/E in M37 | Limits risk, proves pattern, delivers 70% of value |
| Backend approach | Serverless function assembles graph | Keeps static files, avoids client-side complexity |
| Frontend changes | Minimal (switch data source) | Same GraphData interface, no visualization changes |
| Node ID format | Edges use HistoryNet UUIDs | Stable references, works with atomic entities |
| Hybrid edge handling | Support both UUID refs (persons) and old nodeIds (O/L/E) | Smooth transition, no broken edges |
| Dataset file format | Keep nodes.json for O/L/E, add members.json for persons | Hybrid mode during transition |

## Architecture

### File Structure (Post-Migration)

```
public/
├── datasets/
│   └── enlightenment/
│       ├── manifest.json         (unchanged)
│       ├── members.json          (NEW: person references + overrides)
│       ├── nodes.json            (MODIFIED: only O/L/E nodes, no persons)
│       └── edges.json            (MODIFIED: source/target use UUIDs)
│
└── entities/
    ├── persons/
    │   ├── hn-person-550e8400....json  (NEW: canonical person data)
    │   └── ...
    └── registry.json             (NEW: uuid → metadata index)
```

### Backend Assembly Endpoint

**Endpoint**: `GET /api/dataset/:datasetId/graph`

**Assembly Logic**:
1. Load `manifest.json`
2. Load `members.json` (person references)
3. For each member, load canonical person entity
4. Apply dataset-specific overrides (biography, description, etc.)
5. Load `nodes.json` (O/L/E nodes)
6. Merge persons + O/L/E into unified node array
7. Load `edges.json`
8. Return `{ manifest, nodes, edges }` (same shape as current format)

**Implementation Tasks**:
- [ ] **AP-01** - Create `/api/dataset/[datasetId]/graph.ts` serverless function
- [ ] **AP-02** - Load members.json with error handling
- [ ] **AP-03** - Batch load person entities (parallel fetch)
- [ ] **AP-04** - Apply overrides: merge canonical + dataset-specific fields
- [ ] **AP-05** - Load remaining O/L/E nodes from nodes.json
- [ ] **AP-06** - Merge persons + O/L/E into unified array
- [ ] **AP-07** - Load edges.json
- [ ] **AP-08** - Validate edge references (all source/target IDs exist)
- [ ] **AP-09** - Return GraphData shape
- [ ] **AP-10** - Add caching headers (1 hour TTL)
- [ ] **AP-11** - Handle errors gracefully (404, malformed files, etc.)

### Frontend Changes

**Current**: `loadGraphData(datasetId)` fetches static JSON files

**New**: `loadGraphData(datasetId)` calls assembly API endpoint

**Implementation Tasks**:
- [ ] **AP-12** - Update `dataLoader.ts` to use `/api/dataset/:id/graph` endpoint
- [ ] **AP-13** - Keep same return type: `GraphData { nodes, edges }`
- [ ] **AP-14** - Add error handling for API failures
- [ ] **AP-15** - Add loading states (same as current)
- [ ] **AP-16** - Test all three layouts (force, timeline, radial)
- [ ] **AP-17** - Test node detail pages
- [ ] **AP-18** - Test edge detail pages
- [ ] **AP-19** - Test filters (ensure persons filterable like before)
- [ ] **AP-20** - Test search (ensure persons searchable like before)

## Migration Execution

### Pre-Migration Validation

- [ ] **AP-21** - Run M34 pre-migration tests on all datasets
- [ ] **AP-22** - Capture baseline metrics (node counts, edge counts, connectivity)
- [ ] **AP-23** - Save test results to `test-results/pre-migration/`
- [ ] **AP-24** - Verify all datasets pass current validation

### Migration Script Execution

- [ ] **AP-25** - Create migration branch: `git checkout -b atomic-persons-migration`
- [ ] **AP-26** - Run migration script: `npm run migrate:persons`
- [ ] **AP-27** - Review migration report (entity count, UUID mapping, warnings)
- [ ] **AP-28** - Manually inspect 5 random person entities (canonical files)
- [ ] **AP-29** - Manually inspect 5 random dataset members.json files
- [ ] **AP-30** - Check for ambiguous entity matches (review warnings)

### Post-Migration Validation

- [ ] **AP-31** - Implement graph assembly logic (load + merge + override)
- [ ] **AP-32** - Run M34 post-migration tests on assembled graphs
- [ ] **AP-33** - Compare pre/post metrics (MUST match exactly)
- [ ] **AP-34** - Save test results to `test-results/post-migration/`
- [ ] **AP-35** - Generate diff report for any discrepancies
- [ ] **AP-36** - If discrepancies found, rollback and fix migration script

### Manual Validation (Critical)

- [ ] **AP-37** - Start dev server: `npm run dev`
- [ ] **AP-38** - Load 3 different datasets in browser
- [ ] **AP-39** - Verify force graph renders correctly
- [ ] **AP-40** - Verify timeline view renders correctly
- [ ] **AP-41** - Verify radial view renders correctly
- [ ] **AP-42** - Select 5 random person nodes, verify infobox displays
- [ ] **AP-43** - Navigate to 3 person detail pages, verify all fields present
- [ ] **AP-44** - Test filtering by person type
- [ ] **AP-45** - Test searching for person names
- [ ] **AP-46** - Test cross-dataset navigation (M30 features)
- [ ] **AP-47** - Verify dataset switcher works
- [ ] **AP-48** - Check browser console for errors (must be clean)

### Deployment Validation

- [ ] **AP-49** - Deploy to Vercel preview: `git push origin atomic-persons-migration`
- [ ] **AP-50** - Test preview URL in browser (repeat manual tests)
- [ ] **AP-51** - Check Vercel function logs for errors
- [ ] **AP-52** - Test performance: graph load time should be < 2 seconds
- [ ] **AP-53** - Test on mobile device (iOS + Android)
- [ ] **AP-54** - Run Lighthouse audit (performance, accessibility)

## Override Field Strategy

**Canonical Fields** (never overridden):
- `id` (HistoryNet UUID)
- `type` ("person")
- `wikidataId`, `wikipediaTitle`
- `dateStart`, `dateEnd` (birth/death dates)
- `birthPlace`, `deathPlace`
- `alternateNames`
- `nationality`

**Context-Specific Overrides** (customizable per dataset):
- `biography` - Why this person matters in THIS network
- `shortDescription` - One-line relevance to this scene
- `imageUrl` - Could use different portraits
- `occupations` - Emphasize different roles (e.g., "Philosopher" vs. "Satirist")
- `externalLinks` - Dataset-specific sources

**Merge Strategy**:
- Overrides completely replace canonical value (no deep merge)
- If override field is absent, use canonical value
- Exception: `externalLinks` can be extended (merge arrays)

**Implementation Tasks**:
- [ ] **AP-55** - Define field classification in TypeScript types
- [ ] **AP-56** - Implement merge logic: `mergeEntityWithOverrides(canonical, overrides)`
- [ ] **AP-57** - Add tests for merge logic
- [ ] **AP-58** - Validate override fields (must be subset of node schema)

## Validation Script Updates

Current: `npm run validate:datasets -- --dataset {id}`

**New Behavior**:
- Load dataset via assembly API
- Validate assembled graph (not raw files)
- Check person references resolve correctly
- Check O/L/E nodes still valid
- Check edges reference valid UUIDs and nodeIds

**Implementation Tasks**:
- [ ] **AP-59** - Update validation script to call assembly API
- [ ] **AP-60** - Validate members.json schema
- [ ] **AP-61** - Validate person entity files exist and are valid
- [ ] **AP-62** - Validate edges reference valid IDs (UUIDs for persons, nodeIds for O/L/E)
- [ ] **AP-63** - Add new validation errors for atomic architecture issues

## Edge Handling (Hybrid Mode)

**Challenge**: Edges reference both persons (UUIDs) and O/L/E (old nodeIds)

**Solution**: Support both in edge source/target fields

**Edge Examples**:
```json
{
  "source": "hn-person-550e8400...",  // Person (UUID)
  "target": "location-paris",          // Location (old nodeId)
  "relationship": "lived_in"
}

{
  "source": "hn-person-550e8400...",  // Person (UUID)
  "target": "hn-person-6ba7b810...",  // Person (UUID)
  "relationship": "influenced"
}
```

**Validation**: Ensure every edge source/target exists in assembled node array

**Implementation Tasks**:
- [ ] **AP-64** - Update edge validation to accept UUIDs and old nodeIds
- [ ] **AP-65** - Build lookup index: `{id: node}` for fast edge validation
- [ ] **AP-66** - Warn if edge references non-existent ID

## Rollback Plan

If any validation fails (automated or manual):

1. **DO NOT MERGE** migration branch
2. Document failures in GitHub issue
3. Roll back to main branch: `git checkout main`
4. Fix migration script based on failure analysis
5. Delete failed migration branch
6. Re-run migration from scratch
7. Re-validate

**Success criteria for merge**:
- All AP-31 to AP-54 validation tasks pass
- No console errors
- Graph load time < 2 seconds
- All three layouts render correctly
- Manual spot-checks confirm data integrity

## Deployment

- [ ] **AP-67** - Merge migration branch to main: `git merge atomic-persons-migration`
- [ ] **AP-68** - Tag release: `git tag v2.0.0-atomic-persons`
- [ ] **AP-69** - Push to GitHub: `git push origin main --tags`
- [ ] **AP-70** - Deploy to Vercel production (automatic on push)
- [ ] **AP-71** - Monitor Vercel function logs for errors (first 24 hours)
- [ ] **AP-72** - Check production site on multiple devices
- [ ] **AP-73** - Update CHANGELOG.md with migration notes

## Documentation Updates

- [ ] **AP-74** - Update `research/RESEARCHING_NETWORKS.md` with atomic workflow
- [ ] **AP-75** - Document members.json schema in `GRAPH_SCHEMA.md`
- [ ] **AP-76** - Document override strategy in `GRAPH_SCHEMA.md`
- [ ] **AP-77** - Update validation docs with new error types
- [ ] **AP-78** - Add migration notes to README.md

## Key Deliverables

1. **Assembly API endpoint**: `/api/dataset/:id/graph` with merge logic
2. **Canonical person entities**: `entities/persons/*.json` for all persons across datasets
3. **Dataset member files**: `public/datasets/*/members.json` with person references
4. **Updated edges**: Reference HistoryNet UUIDs for persons
5. **Updated validation**: Handle hybrid architecture
6. **Frontend integration**: Switch to assembly API, same UI behavior
7. **Migration report**: Detailed log of person extraction and UUID mapping
8. **Validation report**: Pre/post comparison confirming equivalence

## Success Metrics

- All 11 datasets migrate successfully
- Pre/post graph metrics match exactly (node counts, edge counts, connectivity)
- UI renders identically to pre-migration
- Graph assembly time < 2 seconds per dataset
- Zero console errors in production
- Research workflow faster: entity edits take < 1000 tokens (vs. 10k+)
- Cross-dataset person tracking works (M30 integration)

## Notes

- This is the most critical migration milestone - must be perfect
- Run on branch, validate thoroughly before merging
- Manual testing is as important as automated testing
- Performance matters: assembly must be fast
- Hybrid mode is temporary - M37 will migrate O/L/E
- Document all issues for M37 (learn from this migration)
