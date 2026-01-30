# M37: Full POLE Atomization

**Status**: 🔲 Future
**Track**: D (Atomic Architecture)
**Depends on**: M36 (Atomic Persons) - proven pattern

## Goal

Extend atomization to Objects, Locations, and Entities, completing the transition to fully atomic architecture. Deprecate hybrid mode and remove dataset-level `nodes.json` files.

**Problem**: M36 proves atomic architecture works for persons, but dataset-level `nodes.json` files still exist for O/L/E. Full atomization completes the architecture and unlocks full benefits (consistent research workflow, efficient cross-dataset tracking for all entity types).

## Design Principles

| Principle | Application |
|-----------|-------------|
| **Apply proven pattern** | Use exact M36 approach for O/L/E |
| **Complete transition** | Eliminate `nodes.json`, all entities atomic |
| **Incremental migration** | Migrate one entity type at a time (O, then L, then E) |
| **Test-driven** | Run M34 tests at each stage |
| **Learn from M36** | Apply lessons learned, avoid previous issues |

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Migration order | Objects → Locations → Entities | Objects most cross-dataset (books), then locations, entities last |
| UUID strategy | Same as M36 (hn-{type}-{uuid}) | Consistent with persons |
| Override strategy | Same field classification as M36 | Proven pattern |
| Backend changes | Extend existing assembly endpoint | No new endpoints needed |
| Validation | Run M34 tests after each type migration | Catch issues early |

## Migration Stages

### Stage 1: Atomic Objects

**Goal**: Migrate Object nodes to `entities/objects/`

**Rationale**: Books, manuscripts, artworks often appear in multiple datasets (e.g., Principia Mathematica in Scientific Revolution + Enlightenment)

**Tasks**:
- [ ] **FP-01** - Update M34 migration script for object extraction
- [ ] **FP-02** - Generate HistoryNet UUIDs for all objects (deterministic via wikidata or custom)
- [ ] **FP-03** - Create canonical object files in `entities/objects/`
- [ ] **FP-04** - Update dataset members.json to include object references
- [ ] **FP-05** - Update edges to reference object UUIDs
- [ ] **FP-06** - Update assembly API to load objects
- [ ] **FP-07** - Run M34 validation tests (pre/post comparison)
- [ ] **FP-08** - Manual validation: spot-check 5 objects per dataset
- [ ] **FP-09** - Deploy to preview, test in browser
- [ ] **FP-10** - Merge if validation passes

### Stage 2: Atomic Locations

**Goal**: Migrate Location nodes to `entities/locations/`

**Rationale**: Cities, universities, salons often appear in multiple datasets (e.g., Paris in Enlightenment + Renaissance Humanism + Florentine Academy)

**Tasks**:
- [ ] **FP-11** - Update migration script for location extraction
- [ ] **FP-12** - Generate HistoryNet UUIDs for all locations
- [ ] **FP-13** - Handle geographic hierarchy (parentLocation references)
- [ ] **FP-14** - Create canonical location files in `entities/locations/`
- [ ] **FP-15** - Update dataset members.json to include location references
- [ ] **FP-16** - Update edges to reference location UUIDs
- [ ] **FP-17** - Update assembly API to load locations
- [ ] **FP-18** - Run M34 validation tests (pre/post comparison)
- [ ] **FP-19** - Manual validation: spot-check 5 locations per dataset
- [ ] **FP-20** - Deploy to preview, test in browser
- [ ] **FP-21** - Merge if validation passes

### Stage 3: Atomic Entities

**Goal**: Migrate Entity nodes to `entities/entities/`

**Rationale**: Organizations, movements, schools of thought may appear in multiple datasets (e.g., The Royal Society in Scientific Revolution + Enlightenment)

**Tasks**:
- [ ] **FP-22** - Update migration script for entity extraction
- [ ] **FP-23** - Generate HistoryNet UUIDs for all entities
- [ ] **FP-24** - Create canonical entity files in `entities/entities/`
- [ ] **FP-25** - Update dataset members.json to include entity references
- [ ] **FP-26** - Update edges to reference entity UUIDs
- [ ] **FP-27** - Update assembly API to load entities
- [ ] **FP-28** - Run M34 validation tests (pre/post comparison)
- [ ] **FP-29** - Manual validation: spot-check 5 entities per dataset
- [ ] **FP-30** - Deploy to preview, test in browser
- [ ] **FP-31** - Merge if validation passes

### Stage 4: Cleanup and Deprecation

**Goal**: Remove hybrid architecture artifacts, finalize fully atomic architecture

**Tasks**:
- [ ] **FP-32** - Delete all `public/datasets/*/nodes.json` files
- [ ] **FP-33** - Update assembly API to no longer load nodes.json
- [ ] **FP-34** - Update validation script to reject datasets with nodes.json
- [ ] **FP-35** - Rename `members.json` to `entities.json` (clearer naming)
- [ ] **FP-36** - Update all documentation to reflect final architecture
- [ ] **FP-37** - Run full validation suite on all 11 datasets
- [ ] **FP-38** - Deploy to production

## Canonical Schemas

### Object Schema
```typescript
{
  "id": "hn-object-6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "type": "object",
  "title": "Principia Mathematica",
  "wikidataId": "Q721",
  "wikipediaTitle": "Philosophiæ_Naturalis_Principia_Mathematica",
  "objectType": "book",
  "creators": ["hn-person-550e8400..."],  // References to persons
  "dateCreated": "1687",
  "language": "Latin",
  "subject": "Classical mechanics, mathematics",
  "externalLinks": [...]
}
```

**Canonical Fields**: id, type, title, wikidataId, wikipediaTitle, objectType, dateCreated, language
**Override Fields**: shortDescription, creators (emphasize different aspects), subject, imageUrl

### Location Schema
```typescript
{
  "id": "hn-location-6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  "type": "location",
  "title": "Paris",
  "wikidataId": "Q90",
  "wikipediaTitle": "Paris",
  "locationType": "city",
  "coordinates": { "lat": 48.8566, "lng": 2.3522 },
  "country": "France",
  "parentLocation": "hn-location-abc123...",  // France
  "externalLinks": [...]
}
```

**Canonical Fields**: id, type, title, wikidataId, wikipediaTitle, locationType, coordinates, country
**Override Fields**: shortDescription, imageUrl (different historical images per dataset)

### Entity Schema
```typescript
{
  "id": "hn-entity-6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  "type": "entity",
  "title": "The Royal Society",
  "wikidataId": "Q123885",
  "wikipediaTitle": "Royal_Society",
  "entityType": "institution",
  "foundedBy": ["hn-person-abc123..."],
  "dateStart": "1660",
  "headquarters": "hn-location-xyz789...",  // London
  "externalLinks": [...]
}
```

**Canonical Fields**: id, type, title, wikidataId, wikipediaTitle, entityType, dateStart, headquarters
**Override Fields**: shortDescription, members (emphasize different members per dataset), imageUrl

## Research Tooling Updates

Extend M35 CLI tools to support O/L/E:

- [ ] **FP-39** - Update `entity:find` to search objects/locations/entities
- [ ] **FP-40** - Update `entity:create` to support all four types
- [ ] **FP-41** - Update `entity:edit` for type-specific fields
- [ ] **FP-42** - Update `entity:add-to-dataset` for all types
- [ ] **FP-43** - Update `entity:info` to display type-specific fields
- [ ] **FP-44** - Update `entity:list` to filter by all types
- [ ] **FP-45** - Update agent usage instructions for O/L/E

## Lessons from M36

**What worked well**:
- (Document after M36 completion)

**What to improve**:
- (Document after M36 completion)

**Common issues**:
- (Document after M36 completion)

**Migration script improvements**:
- (Document after M36 completion)

## Cross-Dataset Benefits (Post-Migration)

With all POLE types atomic, we unlock:

1. **Cross-dataset object tracking**: See which books influenced multiple scenes
2. **Cross-dataset location tracking**: See which cities were hubs for multiple movements
3. **Cross-dataset entity tracking**: See which institutions connected multiple networks
4. **Consistent research workflow**: Same CLI tools for all entity types
5. **Efficient edits**: Never load entire datasets, only relevant entities
6. **Better evidence trails**: Objects as evidence can reference canonical entities

## Validation Strategy

After each stage (Objects, Locations, Entities):

### Automated Tests
- [ ] **FP-46** - Run M34 graph structure tests
- [ ] **FP-47** - Compare pre/post node counts by type
- [ ] **FP-48** - Compare pre/post edge counts
- [ ] **FP-49** - Compare pre/post connectivity

### Manual Tests
- [ ] **FP-50** - Load 3 datasets in browser
- [ ] **FP-51** - Verify all three layouts render
- [ ] **FP-52** - Test filtering by newly migrated type
- [ ] **FP-53** - Test node detail pages for newly migrated type
- [ ] **FP-54** - Test relationships involving newly migrated type

## Deployment Strategy

**Incremental Deployment**:
- Deploy after each stage (Objects, then Locations, then Entities)
- Monitor production for issues
- Rollback if problems detected
- Continue to next stage only if current stage stable

**Final Deployment** (after Stage 4 cleanup):
- Tag release: `v3.0.0-full-atomic`
- Deploy to production
- Monitor for 48 hours
- Announce architecture completion

## Documentation Updates

- [ ] **FP-55** - Update `GRAPH_SCHEMA.md` with final entity schemas
- [ ] **FP-56** - Update `research/RESEARCHING_NETWORKS.md` with O/L/E workflow
- [ ] **FP-57** - Document override strategies for all types in `GRAPH_SCHEMA.md`
- [ ] **FP-58** - Update README.md with architecture diagrams
- [ ] **FP-59** - Create migration retrospective document (lessons learned)
- [ ] **FP-60** - Update CHANGELOG.md with complete migration history

## Key Deliverables

1. **Atomic objects**: `entities/objects/*.json` with canonical data
2. **Atomic locations**: `entities/locations/*.json` with canonical data
3. **Atomic entities**: `entities/entities/*.json` with canonical data
4. **Unified members files**: `public/datasets/*/entities.json` (all types)
5. **Complete assembly API**: Loads and merges all four POLE types
6. **Extended research tooling**: CLI tools work for O/L/E
7. **Deprecated hybrid mode**: `nodes.json` files removed
8. **Full validation suite**: Tests cover all entity types
9. **Migration retrospective**: Lessons learned document

## Success Metrics

- All 11 datasets fully migrated to atomic architecture
- Zero `nodes.json` files remaining
- Pre/post graph metrics match for all stages
- Research workflow efficient for all entity types
- CLI tools work reliably for O/L/E
- Cross-dataset tracking works for all entity types
- Token usage for edits < 1000 tokens (all types)
- Graph assembly time < 2 seconds (all datasets)

## Notes

- Learn from M36 - apply improvements to O/L/E migration
- Test each stage thoroughly before proceeding
- Objects migrate first (most cross-dataset value)
- Locations second (cities/universities common across scenes)
- Entities last (least cross-dataset overlap, safest to do last)
- Stage 4 cleanup completes the architecture transition
- M38 (inter-dataset research) depends on this milestone completing
