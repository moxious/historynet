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

### Phase R: Revisions (2026-01-18)
Targeted additions based on review feedback:

**High Priority:**
- [x] Add Tomas Mikolov (Word2Vec creator) and fix Word2Vec authorship
- [x] Add Jacob Devlin and BERT authorship edges
- [x] Add Inflection AI entity and connect to Suleyman
- [x] Verify SSI entity includes Jan Leike as co-founder (already correct)

**Medium Priority:**
- [x] Add Max Welling (VAE co-author) and VAE paper object
- [x] Add Character.AI entity with Shazeer connection
- [x] Add PPO and TRPO papers as objects with Schulman edges
- [x] Add Claude 3 and LLaMA 3 as model objects

### Phase R: Corrections (2026-01-18) - User Feedback Round 2

**Feedback received and disposition:**

1. **Mira Murati's CTO timeline** - CORRECTED
   - *Issue*: Node stated CTO from 2018-2024, but Fortune.com confirms she was promoted to CTO in May 2022
   - *Change*: Updated shortDescription from "(2018-2024)" to "(2022-2024)" and biography from "from 2018 to September 2024" to "from May 2022 to September 2024"
   - *Rationale*: User-provided source (Fortune.com) is reliable; the 2022 date aligns with ChatGPT development timeline

2. **Pamela Vagata's status** - CORRECTED
   - *Issue*: Node described her as "OpenAI co-founder" but authoritative sources (OpenAI Wikipedia, news outlets) do not include her in the founding team
   - *Change*: Updated shortDescription from "Co-founder of OpenAI; early infrastructure work" to "Early OpenAI engineer; infrastructure contributor" and biography to "early engineer" rather than "co-founder"
   - *Rationale*: Cannot verify co-founder claim; changing to verifiable role (early engineer). Note: OpenAI entity's foundedBy list correctly excludes her.

3. **Niki Parmar's Anthropic join date** - CORRECTED
   - *Issue*: Node said she joined Anthropic in 2025, but her own announcement and Analytics India Magazine coverage confirm December 2024
   - *Change*: Updated shortDescription from "joined Anthropic (2025)" to "joined Anthropic (Dec 2024)" and biography from "in 2025" to "in December 2024"
   - *Rationale*: Multiple sources confirm December 2024; precision matters for recent events

## Statistics

| Metric | Count |
|--------|-------|
| People enumerated | 94 |
| Relationships documented | 139 |
| Objects identified | 70 |
| Locations identified | 49 |
| Entities identified | 43 |

*Updated after Phase R additions (2026-01-18)*

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
- Phase R completed 2026-01-18: Added Mikolov, Devlin, Welling; fixed Word2Vec/BERT authorship; added VAE, PPO, TRPO papers; added Claude 3, LLaMA 3 models; added Inflection AI, Character.AI entities
- Updated dataset: 93 people, 39 objects, 14 locations, 24 entities = 170 nodes total, 163 relationships
