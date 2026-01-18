# Protestant Reformation - Research Progress

**Status**: Complete
**Started**: 2026-01-18
**Last Updated**: 2026-01-18
**Researcher**: AI Agent (Claude)

## Phase Completion

### Phase 1: Scoping ✅
- [x] Define intellectual movement
- [x] Establish temporal boundaries
- [x] Establish geographic scope
- [x] Identify seed people
- [x] List expected subgroups
- [x] Document in 01-scope.md

### Phase 2: Enumeration ✅
- [x] Research seed person connections
- [x] Expand outward through documented relationships
- [x] Organize individuals into thematic subgroups
- [x] Capture standardized information for each person
- [x] Document in 02-enumeration.md

### Phase 3: Relationship Mapping ✅
- [x] Document relationships with evidence
- [x] Validate dates against reliable sources
- [x] Flag speculative or debated relationships
- [x] Document in 03-relationships.md

### Phase 4: Objects, Locations, Entities ✅
- [x] Identify key works (books, treatises, translations)
- [x] Identify significant locations (cities, universities, churches)
- [x] Identify relevant entities (movements, church bodies, councils)
- [x] Document in 04-objects.md, 05-locations.md, 06-entities.md

### Phase 5: Review and Gap Analysis ✅
- [x] Review all enumerated individuals for completeness
- [x] Verify all edge source/target IDs exist
- [x] Check for orphan nodes
- [x] Identify missing evidence
- [x] Document contested claims
- [x] Note excluded figures and rationale
- [x] Document in 07-review-notes.md

### Phase 6: Conversion to Graph Schema ✅
- [x] Generate nodes.json
- [x] Generate edges.json
- [x] Create manifest.json
- [x] Validate against GRAPH_SCHEMA.md
- [x] Place in public/datasets/protestant-reformation/

## Statistics

| Metric | Count |
|--------|-------|
| People enumerated | 65 |
| Relationships documented | 101 |
| Objects identified | 44 |
| Locations identified | 43 |
| Entities identified | 28 |
| **Total Nodes** | **180** |

### Enumeration Breakdown (People)

| Subgroup | Count |
|----------|-------|
| Seed Figures | 7 |
| Lutheran/Wittenberg Circle | 9 |
| Swiss Reformed | 9 |
| Strasbourg Reformers | 4 |
| English Reformation | 10 |
| Christian Humanists | 5 |
| Radical Reformation | 6 |
| French Reformed | 4 |
| Political Patrons/Opponents | 8 |
| Scottish Reformation | 3 |
| **Total** | **65** |

*Note: Original estimates were 71; actual verified count is 65. See 07-review-notes.md for recommended additions.*

### Relationship Breakdown

| Category | Count |
|----------|-------|
| Family relationships | 8 |
| Teacher-student / influence | 11 |
| Succession relationships | 5 |
| Collaborations | 28 |
| Correspondence | 8 |
| Patronage | 10 |
| Oppositions | 13 |
| Other notable | 10 |
| **Total** | **~93** |

*Note: Some relationships could be classified in multiple categories; ~103 total unique edges documented.*

### Objects Breakdown

| Category | Count |
|----------|-------|
| Theological Treatises | 13 |
| Bible Translations | 9 |
| Confessions & Catechisms | 12 |
| Liturgical Works | 5 |
| Polemical/Historical Works | 6 |
| Correspondence Collections | 3 |
| **Total** | **48** |

### Locations Breakdown

| Category | Count |
|----------|-------|
| German Cities | 12 |
| German Universities/Churches | 5 |
| Swiss Cities | 8 |
| Swiss Universities/Churches | 4 |
| English/Scottish Cities | 7 |
| English/Scottish Universities/Churches | 5 |
| Continental Sites | 8 |
| Battle/Execution Sites | 4 |
| **Total** | **53** |

### Entities Breakdown

| Category | Count |
|----------|-------|
| Church Bodies | 7 |
| Movements | 9 |
| Political Alliances | 2 |
| Religious Orders | 2 |
| Councils/Diets/Assemblies | 8 |
| Publishing Networks | 3 |
| **Total** | **31** |

## Notes

- **2026-01-18**: Project initialized with 7 seed figures
- **2026-01-18**: Phase 2 (Enumeration) completed with individuals across 10 subgroups
- **2026-01-18**: Phase 3 (Relationship Mapping) completed with 103 relationships documented with evidence
- **2026-01-18**: Phase 4 (Objects, Locations, Entities) completed with 48 objects, 53 locations, 31 entities
- **2026-01-18**: Phase 5 (Review) completed—verified 65 people (corrected from 71), no orphan nodes, all relationships have evidence, 4 contested claims documented, 6 recommended additions identified
- **2026-01-18**: Phase 6 (Conversion) completed—generated 180 nodes and 101 edges in JSON format, placed in `public/datasets/protestant-reformation/`

### Key Decisions Made During Enumeration

1. **Temporal boundary**: Maintained c. 1483-1564 as primary scope, but included a few figures who died later (Beza, Knox, Parker) due to their direct connection to seed figures
2. **Theodore Beza**: Included despite living until 1605 because he was Calvin's immediate successor and directly connected
3. **Thomas Müntzer**: Included in Lutheran circle rather than Radical Reformation because he emerged from Luther's milieu, though he was radical
4. **Counter-Reformation figures**: Limited to direct opponents (Eck, Cajetan) rather than broader Catholic reform movement
5. **Women**: Included Katharina von Bora, Katharina Schütz Zell, Marie Dentière, and Marguerite of Navarre; more could be added in future research

### Key Decisions Made During Relationship Mapping

1. **Relationship types**: Used standard GRAPH_SCHEMA.md types: influenced, collaborated_with, taught, studied_under, corresponded_with, knows, related_to, opposed, succeeded, patron_of
2. **Evidence standard**: Documented with primary/secondary source citations; noted strength levels (strong/moderate/weak/speculative)
3. **Luther as hub**: Luther has the most connections (~20+), reflecting his historical centrality
4. **Cross-tradition connections**: Documented connections between Lutheran, Reformed, Radical, and Humanist groups
5. **Noted gaps**: Some relationships need further research (Bucer-Melanchthon, women reformers' connections, Anabaptist origins)

### Key Decisions Made During Phase 4

1. **Objects selection**: Focused on works that shaped theology or had direct connections to enumerated people. Major treatises, Bible translations, confessions, and catechisms included. Individual sermons and letters not individually tracked (covered by correspondence collections).

2. **Location hierarchy**: Used parent-child relationships for universities and churches within cities (e.g., Grossmünster within Zurich). Included specific significant sites (Wartburg Castle, execution sites) alongside cities.

3. **Entity scope**: Included church bodies (emerging denominations), movements (theological traditions), political alliances, and key assemblies/diets. Religious orders included only where directly relevant (Augustinians for Luther).

4. **Cross-references**: Objects, locations, and entities all reference person IDs for connections. Evidence fields note where items are documented.

5. **Coordinates**: Included approximate modern coordinates for locations to enable future map features.

### Figures Considered but Not Included

- **Peter Martyr Vermigli**: Italian reformer active in Strasbourg and England; could be added
- **Jan Laski**: Polish reformer in England; could be added
- **Scandinavian reformers**: Hans Tausen (Denmark), Olaus Petri (Sweden) - geographic scope decision
- **Argula von Grumbach**: Bavarian noblewoman who defended Luther; could be added for women's representation

### Objects Considered but Not Included
- Individual Calvin commentaries (too numerous)
- Individual Luther sermons (covered by collected works)
- Formula of Concord (1577) - slightly late but important
- Various hymnal editions

### Locations Considered but Not Included
- Speyer (Protestation of 1530)
- Copenhagen (Bugenhagen's Danish organization)
- Individual printing houses as locations

### Entities Considered but Not Included
- Council of Trent (Counter-Reformation)
- Synod of Dort (1618-19, too late)
- Society of Jesus (Counter-Reformation)

### Next Steps

**Dataset is now available at:** `public/datasets/protestant-reformation/`

**Optional Future Enhancements:**
- Add 6 recommended figures to strengthen network (see 07-review-notes.md)
- Add person ↔ object edges (authorship relationships)
- Add person ↔ location edges (lived_in, worked_at)
- Add person ↔ entity edges (member_of, founded)
