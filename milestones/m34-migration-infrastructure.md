# M34: Migration Infrastructure & Testing

**Status**: 🔲 Future
**Track**: D (Atomic Architecture)
**Depends on**: None (foundation for atomic architecture)

## Goal

Build comprehensive migration tooling and tests to enable safe transition from current dataset format (nodes.json/edges.json) to atomic entity architecture. Ensures we can migrate with confidence and validate correctness.

**Problem**: Migrating to atomic architecture is high-risk without proper testing. We need to ensure that assembled graphs post-migration have identical structure to pre-migration graphs (same nodes, edges, relationships, connectivity).

## Design Principles

| Principle | Application |
|-----------|-------------|
| **Test-driven migration** | Define tests before migration code |
| **All-or-nothing** | No partial migrations - entire system migrates at once |
| **Validated equivalence** | Pre/post graphs must be structurally identical |
| **Deterministic** | Migration runs should produce identical results |
| **Auditable** | Generate migration reports showing what changed |

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Migration timing | All-at-once (single milestone) | Simpler than hybrid mode, cleaner testing |
| Entity ID strategy | UUID-based (unique to HistoryNet) | Not coupled to Wikidata; stable across dataset changes |
| Wikidata handling | Keep as metadata field | Enrichment and cross-dataset hints, but not primary key |
| Test scope | Graph structure + connectivity | Node counts, edge counts, connected components, relationships |
| Migration mode | Automated script with manual review | Fast conversion, human verification before commit |
| Rollback strategy | Git branch + automated validation | Easy rollback if issues detected |

## UUID Strategy

**Format**: `hn-{type}-{uuid}`

Examples:
- `hn-person-550e8400-e29b-41d4-a716-446655440000`
- `hn-object-6ba7b810-9dad-11d1-80b4-00c04fd430c8`
- `hn-location-6ba7b811-9dad-11d1-80b4-00c04fd430c8`
- `hn-entity-6ba7b812-9dad-11d1-80b4-00c04fd430c8`

**Generation Rules**:
1. Deterministic per dataset+nodeId (use UUID v5 with dataset namespace)
2. Same person appearing in multiple datasets gets same UUID if they share wikidataId
3. If no wikidataId, entity gets unique UUID per dataset appearance (overridable manually later)

## Pre-Migration Tests

Capture baseline metrics for each dataset:

### Graph Structure Tests
- [ ] **MI-01** - Total node count
- [ ] **MI-02** - Node count by type (Person, Object, Location, Entity)
- [ ] **MI-03** - Total edge count
- [ ] **MI-04** - Edge count by relationship type
- [ ] **MI-05** - Connected components count (number of separate subgraphs)
- [ ] **MI-06** - Largest connected component size
- [ ] **MI-07** - Node degree distribution (min, max, mean, median)

### Data Integrity Tests
- [ ] **MI-08** - All edges reference valid source/target nodes
- [ ] **MI-09** - No duplicate node IDs within dataset
- [ ] **MI-10** - No duplicate edge IDs within dataset
- [ ] **MI-11** - All required fields present on nodes
- [ ] **MI-12** - All required fields present on edges
- [ ] **MI-13** - Date format validation (ISO 8601 or year-only)

### Cross-Dataset Tests (using wikidataId)
- [ ] **MI-14** - Count entities appearing in multiple datasets
- [ ] **MI-15** - List all cross-dataset entity appearances
- [ ] **MI-16** - Verify no conflicting canonical data for same wikidataId

## Migration Script

**Location**: `scripts/migrate-to-atomic/`

### Phase 1: Extract Canonical Entities
- [ ] **MI-17** - Scan all datasets, build entity registry keyed by wikidataId
- [ ] **MI-18** - For each unique wikidataId, create canonical entity file
- [ ] **MI-19** - Generate HistoryNet UUID for each entity (deterministic)
- [ ] **MI-20** - Populate canonical fields (wikidataId, wikipediaTitle, dates, birthPlace, etc.)
- [ ] **MI-21** - Handle entities without wikidataId (generate unique UUIDs)

### Phase 2: Create Dataset References
- [ ] **MI-22** - For each dataset, create `members.json` with entity references
- [ ] **MI-23** - Include override fields (biography, shortDescription, imageUrl, etc.)
- [ ] **MI-24** - Map old nodeId → new HistoryNet UUID
- [ ] **MI-25** - Preserve dataset-specific context in overrides

### Phase 3: Update Edges
- [ ] **MI-26** - Update edge source/target to reference HistoryNet UUIDs
- [ ] **MI-27** - Preserve all edge metadata (evidence, strength, dates, etc.)
- [ ] **MI-28** - Maintain edge IDs for stable permalinks

### Phase 4: Generate Migration Report
- [ ] **MI-29** - Report entity extraction statistics
- [ ] **MI-30** - Report UUID mapping (old nodeId → new UUID)
- [ ] **MI-31** - Report cross-dataset entity detection
- [ ] **MI-32** - Flag ambiguous cases for manual review

## Post-Migration Tests

Run identical tests to pre-migration, verify equivalence:

### Automated Validation
- [ ] **MI-33** - Implement graph assembly logic (load entities + apply overrides + load edges)
- [ ] **MI-34** - Run all MI-01 through MI-13 tests on assembled graphs
- [ ] **MI-35** - Compare pre/post metrics (must match exactly)
- [ ] **MI-36** - Generate diff report for any discrepancies

### Manual Validation Checklist
- [ ] **MI-37** - Spot-check 5 random nodes per dataset (verify all fields present)
- [ ] **MI-38** - Spot-check 5 random edges per dataset (verify relationships intact)
- [ ] **MI-39** - Verify UI loads and renders graphs correctly
- [ ] **MI-40** - Test navigation between nodes (permalinks still work)
- [ ] **MI-41** - Verify filters work on assembled graphs

## Test Script Implementation

**Location**: `scripts/test-graph-equivalence/`

### Test Runner
- [ ] **MI-42** - CLI: `npm run test:graph-equivalence -- --dataset {id}`
- [ ] **MI-43** - CLI: `npm run test:graph-equivalence -- --all` (all datasets)
- [ ] **MI-44** - Output: JSON report with pass/fail per metric
- [ ] **MI-45** - Output: Human-readable summary table

### Test Functions
- [ ] **MI-46** - `getNodeCount(graphData)`
- [ ] **MI-47** - `getNodeCountsByType(graphData)`
- [ ] **MI-48** - `getEdgeCount(graphData)`
- [ ] **MI-49** - `getEdgeCountsByType(graphData)`
- [ ] **MI-50** - `getConnectedComponents(graphData)` (use graph traversal)
- [ ] **MI-51** - `getNodeDegreeStats(graphData)`
- [ ] **MI-52** - `validateReferentialIntegrity(graphData)`

## Entity Registry Structure

**Location**: `entities/`

```
entities/
├── persons/
│   ├── hn-person-{uuid}.json
│   └── ...
├── objects/
│   ├── hn-object-{uuid}.json
│   └── ...
├── locations/
│   ├── hn-location-{uuid}.json
│   └── ...
├── entities/
│   ├── hn-entity-{uuid}.json
│   └── ...
└── registry.json  # Master index: uuid → type/wikidataId/canonicalTitle
```

### Canonical Person Schema
```typescript
{
  "id": "hn-person-550e8400-e29b-41d4-a716-446655440000",
  "type": "person",
  "wikidataId": "Q937",         // Canonical identifier
  "wikipediaTitle": "Voltaire",  // Canonical Wikipedia title
  "alternateNames": ["François-Marie Arouet"],
  "dateStart": "1694-11-21",     // Birth date (canonical)
  "dateEnd": "1778-05-30",       // Death date (canonical)
  "birthPlace": "Paris, France",
  "deathPlace": "Paris, France",
  "nationality": "French",
  "occupations": ["Philosopher", "Writer", "Historian"],
  "externalLinks": [...]         // Canonical links
}
```

### Dataset Reference Schema
```typescript
// public/datasets/enlightenment/members.json
{
  "members": [
    {
      "entityId": "hn-person-550e8400-e29b-41d4-a716-446655440000",
      "role": "core",  // or "supporting", "peripheral"
      "overrides": {
        "biography": "Voltaire was a central figure of the French Enlightenment...",
        "shortDescription": "French Enlightenment philosopher and satirist",
        "imageUrl": "voltaire-enlightenment.jpg",
        "occupations": ["Philosopher", "Satirist"]  // Emphasize different aspects
      }
    },
    ...
  ]
}
```

## Rollback Plan

If migration fails validation:

1. Discard migration branch
2. Return to current format
3. Review migration report for issues
4. Fix migration script
5. Re-run migration
6. Re-validate

**Success criteria for merge**: All MI-33 through MI-41 tests pass.

## Tasks Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Pre-Migration Tests | MI-01 to MI-16 | Capture baseline metrics |
| Migration Script | MI-17 to MI-32 | Extract entities, create references, update edges |
| Post-Migration Tests | MI-33 to MI-41 | Validate equivalence, manual spot-checks |
| Test Infrastructure | MI-42 to MI-52 | Build test runner and validation functions |

## Key Deliverables

1. **Test script**: `scripts/test-graph-equivalence/` with automated validation
2. **Migration script**: `scripts/migrate-to-atomic/` with deterministic entity extraction
3. **Entity registry structure**: `entities/{type}/*.json` with canonical data
4. **Dataset reference files**: `public/datasets/{id}/members.json` with overrides
5. **Migration report**: Detailed log of entity extraction and UUID mapping
6. **Validation report**: Pre/post comparison with pass/fail per metric

## Notes

- Run migration on a branch, don't commit until validation passes
- Migration script should be idempotent (can re-run safely)
- Entity UUIDs must be deterministic for reproducibility
- Cross-dataset entity detection uses wikidataId as primary key
- Manual review step required before merging (check migration report)

## Success Metrics

- All graph structure tests pass (MI-01 to MI-07)
- All data integrity tests pass (MI-08 to MI-13)
- Pre/post node and edge counts match exactly
- Pre/post connected components match exactly
- UI renders graphs identically to pre-migration
