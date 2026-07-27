# M34: Migration Infrastructure & Testing

**Status**: 🔄 In Progress (Phase 1 & 2 Complete)
**Track**: D (Atomic Architecture)
**Depends on**: None (foundation for atomic architecture)

## Goal

Build comprehensive migration tooling and tests to enable safe transition from current dataset format (nodes.json/edges.json) to atomic entity architecture. Ensures we can migrate with confidence and validate correctness.

**Problem**: Migrating to atomic architecture is high-risk without proper testing. We need to ensure that assembled graphs post-migration have identical structure to pre-migration graphs (same nodes, edges, relationships, connectivity).

## Implementation Progress

### ✅ Phase 1: Test Infrastructure (Complete)

**Implemented**: 2026-02-02

**Location**: `scripts/test-graph-equivalence/`

**Deliverables**:
- Graph metrics calculation (nodes, edges, components, degrees)
- Referential integrity validation
- Current format loader
- Comparison framework
- CLI with JSON/table output

**Pre-migration baseline captured**: `pre-migration-baseline.json`
- 12 datasets: 1,511 nodes, 2,288 edges
- All datasets pass integrity checks

**Scripts**:
- `npm run test:graph-equivalence` - Test single dataset
- `npm run test:pre-migration` - Capture baseline
- `npm run test:compare` - Compare formats

### ✅ Phase 2: Migration Script Core (Complete)

**Implemented**: 2026-02-02

**Location**: `scripts/migrate-to-atomic/`

**Deliverables**:
- UUID v5 generator (deterministic, wikidataId-based)
- Entity extraction (Phase 1)
- Members.json creation (Phase 2)
- Edge remapping (Phase 3)
- Migration report generation (Phase 4)
- Conflict detection and logging

**Test Results** (enlightenment dataset):
- 204 nodes → 197 entities (deduplication working)
- 469 edges remapped to UUIDs
- 7 cross-dataset entities detected
- 19 canonical conflicts logged

**Scripts**:
- `npm run migrate:dry-run` - Safe test migration
- `npm run migrate:to-atomic` - Full migration

### 🔲 Phase 3: Atomic Format Loader (TODO)

**Remaining work**:
- Implement `loadAtomicFormat()` in test infrastructure
- Assemble graphs from entities/ + members.json
- Enable automated comparison testing

### 🔲 Phase 4: Code Integration (TODO)

**Remaining work**:
- Create `src/types/atomic.ts`
- Create `src/utils/atomicDataLoader.ts`
- Update `src/utils/dataLoader.ts`

### 🔲 Phase 5: Migration Execution (TODO)

**Remaining work**:
- Run full migration on all datasets
- Automated validation tests
- Manual validation checklist
- Final migration report

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
| UUID namespace | `historynet.app` (UUID v5) | Domain-based namespace for deterministic UUID generation |
| Entity matching | Strict wikidataId only | Only merge entities with identical wikidataId. No fuzzy matching - safer and simpler |
| Entities without wikidataId | Unique UUID per dataset | Treated as dataset-specific entities, can be manually linked later |
| Canonical data conflicts | First dataset wins | When same wikidataId has conflicting data, use first-processed dataset as canonical |
| Wikidata handling | Keep as metadata field | Enrichment and cross-dataset hints, but not primary key |
| Override scope | All fields except ID and type | Maximum flexibility for dataset-specific presentation and context |
| Graph assembly | On-demand at runtime | Load entities + members + edges when dataset loads. More flexible than pre-assembly |
| Test scope | Graph structure only | Node/edge counts, connectivity. No field-level data quality validation |
| Migration mode | Automated script with manual review | Fast conversion, human verification before commit |
| Backwards compatibility | Clean break | Old nodeIds stop working. Accept broken external references as cost of architecture change |
| Expected scale | 100-1000 entities | Medium scale - sharding helps organization, performance should be good |
| Registry structure | Sharded by type | Separate registry files per type (persons.json, objects.json, etc.) |
| Rollback strategy | Git branch + automated validation | Easy rollback if issues detected |

## UUID Strategy

**Format**: `hn-{type}-{uuid}`

Examples:
- `hn-person-550e8400-e29b-41d4-a716-446655440000`
- `hn-object-6ba7b810-9dad-11d1-80b4-00c04fd430c8`
- `hn-location-6ba7b811-9dad-11d1-80b4-00c04fd430c8`
- `hn-entity-6ba7b812-9dad-11d1-80b4-00c04fd430c8`

**Namespace**: UUID v5 with `historynet.app` as namespace base

**Generation Rules**:
1. **With wikidataId**: Generate UUID v5 from `historynet.app` namespace + wikidataId
   - Same wikidataId always generates same UUID (enables cross-dataset entity merging)
   - Example: `Q937` (Voltaire) → `hn-person-{deterministic-uuid}`

2. **Without wikidataId**: Generate UUID v5 from `historynet.app` namespace + `{datasetId}:{nodeId}`
   - Creates unique UUID per dataset appearance
   - Example: `enlightenment:voltaire` → `hn-person-{deterministic-uuid}`
   - These entities remain dataset-specific unless manually linked later

3. **First dataset wins**: When same wikidataId appears in multiple datasets, first-processed dataset provides canonical data
   - Conflict resolution is deterministic (based on dataset processing order)
   - Conflicts logged in migration report for manual review

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
- [ ] **MI-08** - All edges reference valid source/target nodes (referential integrity)
- [ ] **MI-09** - No duplicate node IDs within assembled dataset
- [ ] **MI-10** - No duplicate edge IDs within dataset
- [ ] **MI-11** - All required fields present on nodes (id, type)
- [ ] **MI-12** - All required fields present on edges (id, source, target)

**Note**: Testing focuses on structural integrity only. Field-level data quality (date formats, URL validity, etc.) is not validated during migration.

### Cross-Dataset Tests (using wikidataId)
- [ ] **MI-14** - Count entities appearing in multiple datasets (by wikidataId match)
- [ ] **MI-15** - List all cross-dataset entity appearances
- [ ] **MI-16** - Log conflicting canonical data for same wikidataId (for manual review)

**Note**: Strict wikidataId matching only. Entities without wikidataId are treated as dataset-specific. No fuzzy matching by name or dates.

## Migration Script

**Location**: `scripts/migrate-to-atomic/`

### Phase 1: Extract Canonical Entities
- [ ] **MI-17** - Scan all datasets in consistent order, build entity registry keyed by wikidataId
- [ ] **MI-18** - For each unique wikidataId, create canonical entity file using first occurrence data
- [ ] **MI-19** - Generate HistoryNet UUID for each entity using UUID v5 (historynet.app namespace + wikidataId)
- [ ] **MI-20** - Populate canonical fields (wikidataId, wikipediaTitle, dates, birthPlace, etc.)
- [ ] **MI-21** - Handle entities without wikidataId (generate UUID v5 from historynet.app + datasetId:nodeId)
- [ ] **MI-21b** - Log canonical data conflicts when same wikidataId appears with different data

**Conflict Resolution**: When same wikidataId appears in multiple datasets with different canonical data, first dataset processed wins. All conflicts logged in migration report for manual review.

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
│   ├── ...
│   └── registry.json  # Index of all persons: uuid → wikidataId/canonicalTitle
├── objects/
│   ├── hn-object-{uuid}.json
│   ├── ...
│   └── registry.json  # Index of all objects
├── locations/
│   ├── hn-location-{uuid}.json
│   ├── ...
│   └── registry.json  # Index of all locations
└── entities/
    ├── hn-entity-{uuid}.json
    ├── ...
    └── registry.json  # Index of all entities (generic type)
```

**Registry Sharding**: Each entity type has its own registry.json file for better organization and performance at medium scale (100-1000 entities expected).

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
        // ALL fields can be overridden except "id" and "type"
        // This allows maximum flexibility for dataset-specific presentation
        "biography": "Voltaire was a central figure of the French Enlightenment...",
        "shortDescription": "French Enlightenment philosopher and satirist",
        "imageUrl": "voltaire-enlightenment.jpg",
        "occupations": ["Philosopher", "Satirist"],  // Emphasize different aspects
        "dateStart": "1694",  // Can simplify canonical date if desired
        "wikipediaTitle": "Voltaire in the Enlightenment"  // Can customize title
        // Any field from canonical entity can be overridden here
      }
    },
    ...
  ]
}
```

**Override Behavior**: When loading a dataset, start with canonical entity data, then apply any overrides from members.json. This allows datasets to customize presentation while maintaining canonical data as the authoritative source.

## Graph Assembly Logic

**On-Demand Assembly**: Graphs are assembled at runtime when datasets are loaded, not pre-built at build time.

### Assembly Steps (per dataset)

1. **Load members.json**: Get list of entity references for this dataset
2. **Load canonical entities**: For each entityId in members, fetch the canonical entity file from `entities/{type}/{uuid}.json`
3. **Apply overrides**: Merge any override fields from members.json into canonical entity data
4. **Build nodes array**: Assembled nodes with canonical + override data
5. **Load edges.json**: Load relationship data (already uses UUIDs after migration)
6. **Return graph data**: Complete graph ready for visualization

**Performance Considerations**:
- Expected entity count: 100-1000 total across all datasets
- Typical dataset size: 10-50 entities per dataset
- Sharded registries reduce file sizes
- Browser caching handles repeated entity loads
- No database required at this scale

## Backwards Compatibility

**Clean Break Approach**: Old node IDs will NOT be supported after migration.

**Impact**:
- Old permalinks (e.g., `/node/voltaire-enlightenment`) will break
- External bookmarks and links will need to be updated
- This is accepted as a cost of the architecture change

**Rationale**:
- Simpler migration code (no ID mapping layer)
- Cleaner URL structure going forward
- UUIDs are more stable for long-term references
- Can document breaking change in migration announcement

**Mitigation**:
- Include old nodeId → new UUID mapping in migration report
- Provide lookup tool for manual URL translation if needed
- Document migration in CHANGELOG with clear date

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
- All data integrity tests pass (MI-08 to MI-12)
- Pre/post node and edge counts match exactly
- Pre/post connected components match exactly
- UI renders graphs identically to pre-migration

## Implementation Summary

### Clarified Decisions (De-Risked)

**Entity Matching**:
- Strict wikidataId matching only
- No fuzzy matching by name or dates
- Entities without wikidataId remain dataset-specific

**UUID Generation**:
- UUID v5 with `historynet.app` namespace
- With wikidataId: `historynet.app` + wikidataId
- Without wikidataId: `historynet.app` + `{datasetId}:{nodeId}`
- Deterministic and reproducible

**Canonical Data Conflicts**:
- First dataset processed wins
- All conflicts logged for manual review
- Processing order is consistent (alphabetical by dataset ID)

**Registry Structure**:
- Sharded by type (persons.json, objects.json, locations.json, entities.json)
- Each type has its own registry file
- Scales well for expected 100-1000 entity count

**Graph Assembly**:
- On-demand at runtime (not pre-built)
- Load canonical entities + apply overrides + load edges
- Simple and flexible approach

**Override Flexibility**:
- All fields can be overridden except id and type
- Maximum flexibility for dataset-specific presentation
- Canonical data remains authoritative source

**Validation Scope**:
- Structure only (counts, connectivity, referential integrity)
- No field-level data quality validation
- Focus on migration correctness, not data cleanup

**Backwards Compatibility**:
- Clean break - old nodeIds will not work
- Accept broken external references as migration cost
- Include nodeId → UUID mapping in migration report for manual lookups

### Migration Process

1. Run pre-migration tests → capture baseline metrics
2. Run migration script → extract entities, create references, update edges
3. Run post-migration tests → verify structural equivalence
4. Manual spot-checks → verify 5 random nodes/edges per dataset
5. Review migration report → check for conflicts and anomalies
6. If all tests pass → merge migration branch
7. If tests fail → discard branch, fix script, re-run

### Key Risk Mitigations

- **Data loss**: Structural equivalence tests ensure no nodes/edges lost
- **Performance**: On-demand assembly tested at 100-1000 entity scale
- **Conflicts**: First-dataset-wins rule is deterministic and auditable
- **Rollback**: Git branch enables easy rollback if issues found
- **UUID collisions**: UUID v5 is deterministic and collision-resistant
- **Complexity**: Strict matching and clean break simplify implementation
