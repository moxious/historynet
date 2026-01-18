# AI/LLM Research Network - Research Progress

**Status**: Complete (All phases finished)
**Started**: 2026-01-18
**Last Updated**: 2026-01-18
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
- [x] Expand through documented relationships
- [x] Organize into subgroups
- [x] Capture details for each person
- [x] Document in 02-enumeration.md

### Phase 3: Relationship Mapping
- [x] Document relationships with evidence
- [x] Validate dates
- [x] Flag speculative relationships
- [x] Document in 03-relationships.md

### Phase 4: Objects, Locations, Entities
- [x] Identify key works (papers, models)
- [x] Identify significant locations
- [x] Identify relevant entities (labs, companies)
- [x] Document in 04-objects.md, 05-locations.md, 06-entities.md

### Phase 5: Review and Gap Analysis
- [x] Review completeness
- [x] Verify edge source/target IDs
- [x] Check for orphan nodes
- [x] Identify missing evidence
- [x] Document contested/debated claims
- [x] Note excluded figures and rationale
- [x] Document in 07-review-notes.md

### Phase 6: Conversion
- [x] Generate nodes.json
- [x] Generate edges.json
- [x] Create manifest.json
- [x] Validate against schema
- [x] Place in public/datasets/

## Statistics

| Metric | Count |
|--------|-------|
| People enumerated | 91 |
| Relationships documented | 121 |
| Objects identified | 65 |
| Locations identified | 49 |
| Entities identified | 41 |

## Notes

- Initial seed list provided by user focuses on OpenAI founders and Meta AI researchers
- This is a contemporary network (2012-present) rather than historical
- Many figures are still active, so relationships are ongoing
- Expanded to include DeepMind, Anthropic, Google Brain, academic pioneers
- Chinese AI explicitly excluded (noted in scope document)
- 91 unique individuals enumerated across 17 subgroups
- Phase 2 completed 2026-01-18
- Phase 3 completed 2026-01-18
- Custom relationship types added: co_founded, recruited, departed_from, co_authored, employed
- Phase 4 completed 2026-01-18
- Objects include: foundational papers (Transformer, AlexNet, GAN, etc.), model families (GPT, Claude, LLaMA, Gemini), key systems (ChatGPT, AlphaGo, AlphaFold), textbooks and courses
- Locations span major AI hubs: SF Bay Area, London, Paris, Toronto/Montreal corridor, plus universities
- Entities include: major labs (OpenAI, Anthropic, DeepMind, Meta AI, xAI), startups (Mistral, Cohere, Sakana), academic institutes (MILA, Vector, Stanford HAI), conferences (NeurIPS, ICML, ICLR)
- Phase 5 completed 2026-01-18
- Review found: 91 people well-documented, ~12 potential orphan nodes (acceptable), 9 missing referenced figures identified
- Contested claims documented: Stable Diffusion credit, OpenAI mission drift, AI safety debate
- Dataset rated "Good" quality and "Ready for Conversion"
- Phase 6 completed 2026-01-18: Conversion agent generated JSON dataset
- Final dataset: 90 people, 34 objects, 14 locations, 22 entities = 160 nodes total, 145 relationships
- Dataset placed in public/datasets/ai-llm-research/
