# Enlightenment Intellectual Network - Research Progress

**Status**: In Progress
**Started**: 2026-01-18
**Last Updated**: 2026-01-18 (Phase 4 complete)
**Researcher**: AI Agent (Claude)

## Phase Completion

### Phase 1: Scoping
- [x] Define intellectual movement
- [x] Establish temporal boundaries
- [x] Establish geographic scope
- [x] Identify seed people
- [x] List expected subgroups
- [x] Document in 01-scope.md

### Phase 2: Enumeration
- [x] Research seed person connections
- [x] Expand outward through documented relationships
- [x] Organize into subgroups
- [x] Validate dates against reliable sources
- [x] Document in 02-enumeration.md

### Phase 3: Relationship Mapping
- [x] Document relationships with evidence
- [x] Validate date ranges
- [x] Flag speculative relationships
- [x] Document in 03-relationships.md

### Phase 4: Objects, Locations, Entities
- [x] Identify key works (04-objects.md)
- [x] Identify significant locations (05-locations.md)
- [x] Identify relevant entities (06-entities.md)

### Phase 5: Review and Gap Analysis
- [ ] Review completeness
- [ ] Verify edge source/target IDs
- [ ] Check for orphan nodes
- [ ] Document in 07-review-notes.md

### Phase 6: Conversion
- [ ] Generate nodes.json
- [ ] Generate edges.json
- [ ] Create manifest.json
- [ ] Validate against GRAPH_SCHEMA.md

## Statistics

| Metric | Count |
|--------|-------|
| People enumerated | 58 |
| Relationships documented | ~116 |
| Objects identified | 83 |
| Locations identified | 41 |
| Entities identified | 30 |

## Notes

- Initial seed figures provided: Locke, Montesquieu, Voltaire, Rousseau, Hume, Kant, Smith
- This network spans multiple national traditions (British, French, German/Prussian)
- The Enlightenment is a large intellectual movement; careful scoping needed to stay within ~200 person limit
- **Phase 2 Notes**: 
  - Enumerated 58 figures across 10 subgroups
  - Well below 200 limit; room for expansion in later phases
  - Strong coverage of French philosophes, Scottish Enlightenment, and seed figures' networks
  - Research gaps identified: Italian, Dutch, Swiss, Spanish Enlightenment; women intellectuals beyond salon hostesses
  - Preliminary relationship data captured in "Connections" fields—ready for formal documentation in Phase 3
- **Phase 3 Notes**:
  - Documented ~116 relationships across 9 categories
  - Categories: Foundational influences, French philosophes, Scottish Enlightenment, German Aufklärung, British empiricist/political, American connections, Scientific-mathematical, Salon network, Patronage
  - Relationship types used: influenced, taught, studied_under, corresponded_with, collaborated_with, knows, opposed, patronized
  - All relationships include evidence citations from scholarly secondary sources
  - 3 relationships marked as speculative: Voltaire's role in Rousseau exposure, Smith meeting Voltaire, Smith's intended dedication to Quesnay
  - Identified cross-cutting patterns: Encyclopédie as network hub, "quarrel" pattern (Diderot-Rousseau, Hume-Rousseau, etc.), mentorship chains
- **Phase 4 Notes**:
  - **Objects (83)**: Key works organized by region/tradition
    - Foundational Works (Pre-1720): 9 works including Principia, Essay Concerning Human Understanding, Two Treatises
    - French Enlightenment: 21 works including Encyclopédie, Candide, Spirit of the Laws, Social Contract
    - British/Scottish: 19 works including Treatise of Human Nature, Wealth of Nations, Theory of Moral Sentiments
    - German: 15 works including three Critiques, Nathan the Wise, What is Enlightenment?
    - American: 10 works including Declaration of Independence, Federalist Papers, Common Sense
    - Scientific: 5 works; Correspondence collections: 3
  - **Locations (41)**: Geographic nodes of the network
    - Major cities: 12 (Paris, Edinburgh, London, Berlin, etc.)
    - Universities: 6 (Edinburgh, Glasgow, Halle, Königsberg, etc.)
    - Academies: 6 (Académie française, Académie des Sciences, Berlin Academy, Royal Society, etc.)
    - Salons: 5 (Geoffrin, d'Holbach, Lespinasse, du Deffand, Helvétius)
    - Courts/Residences: 5 (Sans-Souci, Versailles, Ferney, Cirey, Winter Palace)
    - Publishing centers: 3; Scottish clubs: 3; Coffee houses: 1
  - **Entities (30)**: Organizations and movements
    - Major project: Encyclopédie
    - Schools of thought: 10 (Philosophes, Scottish Enlightenment, Aufklärung, Haskalah, Physiocracy, British Empiricism, Rationalism, Utilitarianism, Common Sense Philosophy, Radical Enlightenment)
    - Formal academies: 5
    - Informal circles: 3 (d'Holbach's circle, Edinburgh literati, American founders)
    - Journals: 3; Reform movements: 3; Religious currents: 3; Political entities: 2
  - All nodes include proposed IDs ready for JSON conversion
  - Ready for Phase 5: Review and Gap Analysis
