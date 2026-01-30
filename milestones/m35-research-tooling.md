# M35: Research Tooling for Atomic Architecture

**Status**: 🔲 Future
**Track**: D (Atomic Architecture)
**Depends on**: M34 (Migration Infrastructure) - needs entity schema definitions

## Goal

Build CLI tools for efficient entity management in atomic architecture. Enables researchers to find, create, and edit entities without loading entire datasets, preventing token budget blow-ups and improving research workflow.

**Problem**: Current workflow requires reading entire nodes.json file to add/edit a person, which consumes thousands of tokens and is slow. Atomic architecture enables targeted operations, but needs good tooling.

## Design Principles

| Principle | Application |
|-----------|-------------|
| **Search before create** | Always check if entity exists first |
| **Anti-explosion safeguards** | Grep/fuzzy matching prevents duplicate entities |
| **Context-window friendly** | Tools read only relevant files, never full datasets |
| **Agent-friendly** | Clear CLI output parseable by LLMs |
| **Interactive when appropriate** | Prompt for required fields, confirm destructive operations |

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tool format | CLI scripts (npm run) | Familiar to researchers, easy to document |
| Search strategy | Grep + fuzzy matching | Fast, works without indexes, good recall |
| Creation workflow | Interactive prompts | Prevents missing required fields |
| Edit workflow | Interactive or direct | Support both for flexibility |
| Dataset membership | Explicit add/remove commands | Clear intent, auditable |
| Agent instructions | Embedded in tool output | Self-documenting for LLM agents |

## CLI Tools

### 1. Find Entity (`npm run entity:find`)

**Purpose**: Search for existing entities before creating duplicates

**Usage**:
```bash
npm run entity:find -- "Voltaire"
npm run entity:find -- --wikidata Q937
npm run entity:find -- --type person "Ficino"
```

**Output**:
```
Found 2 matching entities:

1. hn-person-550e8400-e29b-41d4-a716-446655440000
   Name: Voltaire (François-Marie Arouet)
   Wikidata: Q937
   Dates: 1694-1778
   Appears in: enlightenment, scientific-revolution

2. hn-person-6ba7b810-9dad-11d1-80b4-00c04fd430c8
   Name: Voltaire (band)
   Wikidata: Q1234567
   Dates: 1982-present
   Appears in: ambient-music

Use entity ID for further operations.
```

**Implementation Tasks**:
- [ ] **RT-01** - Grep search across entity files (name, alternateNames)
- [ ] **RT-02** - Wikidata ID exact match search
- [ ] **RT-03** - Fuzzy name matching (handle typos, case, accents)
- [ ] **RT-04** - Filter by entity type (--type person/object/location/entity)
- [ ] **RT-05** - Show entity summary (ID, name, dates, datasets)
- [ ] **RT-06** - Return parseable output for agent consumption

### 2. Create Entity (`npm run entity:create`)

**Purpose**: Create new canonical entity with required fields

**Usage**:
```bash
npm run entity:create -- --type person
npm run entity:create -- --type person --interactive
npm run entity:create -- --type person --from-json entity.json
```

**Interactive Workflow**:
```
Creating new Person entity...

Required fields:
  Name: Marsilio Ficino
  Wikidata ID (leave blank if none): Q154781
  Wikipedia Title (leave blank if none): Marsilio_Ficino
  Birth date (YYYY or YYYY-MM-DD): 1433
  Death date (YYYY or YYYY-MM-DD): 1499

Searching for existing entities with these identifiers...
⚠️  WARNING: Found similar entity:
   hn-person-abc123... "Marsilio Ficino" (Q154781)

Create anyway? (y/N): n
Cancelled.
```

**Implementation Tasks**:
- [ ] **RT-07** - Interactive prompts for required fields
- [ ] **RT-08** - Validate wikidata ID format (Q-prefix + digits)
- [ ] **RT-09** - Validate date formats (ISO 8601 or year-only)
- [ ] **RT-10** - Generate deterministic UUID (use wikidataId as seed if available)
- [ ] **RT-11** - Check for existing entity before creation (auto-call find)
- [ ] **RT-12** - Write entity JSON to appropriate directory
- [ ] **RT-13** - Update entities/registry.json index
- [ ] **RT-14** - Support non-interactive mode with --from-json

### 3. Edit Entity (`npm run entity:edit`)

**Purpose**: Modify canonical entity fields

**Usage**:
```bash
npm run entity:edit -- hn-person-550e8400...
npm run entity:edit -- hn-person-550e8400... --field biography --value "..."
npm run entity:edit -- hn-person-550e8400... --interactive
```

**Interactive Workflow**:
```
Editing entity: hn-person-550e8400-e29b-41d4-a716-446655440000
Current name: Voltaire

Fields:
  1. Name
  2. Wikidata ID
  3. Alternate names (add/remove)
  4. Birth date
  5. Death date
  6. Birth place
  7. Death place
  8. Nationality
  9. Occupations (add/remove)
  10. External links (add/remove)
  11. Biography (canonical)

Select field to edit (1-11, or q to quit): 3

Current alternate names:
  - François-Marie Arouet

Action: [a]dd / [r]emove / [b]ack: a
New alternate name: Arouet
Added.

Updated alternate names:
  - François-Marie Arouet
  - Arouet

Saved.
```

**Implementation Tasks**:
- [ ] **RT-15** - Load entity by UUID
- [ ] **RT-16** - Interactive field editor with menu
- [ ] **RT-17** - Direct field update with --field/--value flags
- [ ] **RT-18** - Array field operations (add/remove items)
- [ ] **RT-19** - Validate edits before saving
- [ ] **RT-20** - Show diff of changes before saving
- [ ] **RT-21** - Update entity file atomically (avoid corruption)

### 4. Add to Dataset (`npm run entity:add-to-dataset`)

**Purpose**: Add entity reference to a dataset with context-specific overrides

**Usage**:
```bash
npm run entity:add-to-dataset -- hn-person-550e8400... enlightenment
npm run entity:add-to-dataset -- hn-person-550e8400... enlightenment --role core
```

**Interactive Workflow**:
```
Adding entity to dataset: enlightenment
Entity: Voltaire (hn-person-550e8400...)

Role in this dataset:
  1. Core (central to the network)
  2. Supporting (important but not central)
  3. Peripheral (minor figure)

Select role (1-3): 1

Dataset-specific overrides (leave blank to use canonical values):

  Biography (why this person matters in THIS dataset):
  > Voltaire was the preeminent philosopher of the French Enlightenment,
  > known for his advocacy of civil liberties and criticism of the Church.

  Short description (1-2 sentences):
  > French Enlightenment philosopher, writer, and satirist

  Image URL (relative to public/img/):
  > persons/voltaire.jpg

  Occupations (canonical: Philosopher, Writer, Historian):
  Override? (y/N): y
  > Philosopher, Satirist, Social Critic

Added to dataset: enlightenment

Next steps:
  1. Add relationships (edges) to connect this person to the network
  2. Run validation: npm run validate:datasets -- --dataset enlightenment
```

**Implementation Tasks**:
- [ ] **RT-22** - Load dataset members.json (create if doesn't exist)
- [ ] **RT-23** - Check if entity already in dataset (warn before duplicate)
- [ ] **RT-24** - Prompt for role (core/supporting/peripheral)
- [ ] **RT-25** - Prompt for context-specific overrides (biography, description, etc.)
- [ ] **RT-26** - Add member entry to dataset
- [ ] **RT-27** - Update dataset members.json atomically
- [ ] **RT-28** - Show next steps (add edges, validate)

### 5. Remove from Dataset (`npm run entity:remove-from-dataset`)

**Purpose**: Remove entity reference from a dataset

**Usage**:
```bash
npm run entity:remove-from-dataset -- hn-person-550e8400... enlightenment
npm run entity:remove-from-dataset -- hn-person-550e8400... enlightenment --force
```

**Workflow**:
```
Removing entity from dataset: enlightenment
Entity: Voltaire (hn-person-550e8400...)

⚠️  WARNING: This entity has 12 relationships in this dataset.
These edges will be broken:
  - influenced → person-rousseau
  - influenced → person-kant
  - corresponded_with → person-catherine-ii
  ...and 9 more

Continue? (y/N): n
Cancelled.

To remove anyway, use --force flag.
```

**Implementation Tasks**:
- [ ] **RT-29** - Load dataset members.json
- [ ] **RT-30** - Check if entity exists in dataset
- [ ] **RT-31** - Load edges.json and check for references to this entity
- [ ] **RT-32** - Warn about broken relationships (show count + sample)
- [ ] **RT-33** - Confirm before removal (unless --force)
- [ ] **RT-34** - Remove member entry from dataset
- [ ] **RT-35** - Optionally remove orphaned edges (--remove-edges flag)

### 6. Show Entity Info (`npm run entity:info`)

**Purpose**: Display full entity information and dataset memberships

**Usage**:
```bash
npm run entity:info -- hn-person-550e8400...
npm run entity:info -- --wikidata Q937
```

**Output**:
```
Entity: hn-person-550e8400-e29b-41d4-a716-446655440000

CANONICAL DATA
  Type: Person
  Name: Voltaire
  Alternate names: François-Marie Arouet
  Wikidata: Q937
  Wikipedia: Voltaire
  Birth: 1694-11-21, Paris, France
  Death: 1778-05-30, Paris, France
  Nationality: French
  Occupations: Philosopher, Writer, Historian

DATASET APPEARANCES (2)

1. enlightenment (core)
   Biography: Voltaire was the preeminent philosopher of the French...
   Description: French Enlightenment philosopher, writer, and satirist
   Image: persons/voltaire.jpg
   Occupations: Philosopher, Satirist, Social Critic
   Edges: 12 relationships

2. scientific-revolution (peripheral)
   Biography: Though primarily a philosopher, Voltaire was a strong...
   Description: French philosopher and advocate for scientific method
   Occupations: Philosopher, Science Writer
   Edges: 3 relationships

FILES
  Canonical: entities/persons/hn-person-550e8400-e29b-41d4-a716-446655440000.json
  References:
    - public/datasets/enlightenment/members.json
    - public/datasets/scientific-revolution/members.json
```

**Implementation Tasks**:
- [ ] **RT-36** - Load canonical entity file
- [ ] **RT-37** - Find all dataset memberships (scan members.json files)
- [ ] **RT-38** - Load and display overrides per dataset
- [ ] **RT-39** - Count edges per dataset (scan edges.json)
- [ ] **RT-40** - Show file paths for manual editing
- [ ] **RT-41** - Support lookup by UUID or wikidata ID

### 7. List Entities (`npm run entity:list`)

**Purpose**: Browse all entities with filtering

**Usage**:
```bash
npm run entity:list
npm run entity:list -- --type person
npm run entity:list -- --dataset enlightenment
npm run entity:list -- --cross-dataset  (entities in 2+ datasets)
```

**Output**:
```
Persons (347 total):

  hn-person-550e8400...  Voltaire (1694-1778)
    Wikidata: Q937
    Datasets: enlightenment, scientific-revolution

  hn-person-6ba7b810...  Marsilio Ficino (1433-1499)
    Wikidata: Q154781
    Datasets: florentine-academy, christian-kabbalah, renaissance-humanism

  ...

Filters:
  --type {person|object|location|entity}
  --dataset {datasetId}
  --cross-dataset  (show only entities in 2+ datasets)
  --no-wikidata    (show only entities without wikidata IDs)
```

**Implementation Tasks**:
- [ ] **RT-42** - Scan entities directory (optionally filter by type)
- [ ] **RT-43** - Load entity registry for fast metadata access
- [ ] **RT-44** - Filter by dataset membership (scan members.json files)
- [ ] **RT-45** - Filter cross-dataset entities only
- [ ] **RT-46** - Filter entities without wikidata IDs
- [ ] **RT-47** - Display summary table (ID, name, dates, datasets)
- [ ] **RT-48** - Support pagination for large lists

## Agent Usage Instructions

Each tool should output instructions for LLM agents when invoked with `--help`:

**Example: `npm run entity:find -- --help`**
```
AGENT USAGE INSTRUCTIONS

Before creating a new entity, ALWAYS search first to avoid duplicates:

  1. Search by name:
     npm run entity:find -- "Name Here"

  2. Search by wikidata ID (if you have it):
     npm run entity:find -- --wikidata Q12345

  3. Review results carefully - check dates, aliases, datasets

  4. If entity exists, use its UUID for dataset membership:
     npm run entity:add-to-dataset -- {uuid} {datasetId}

  5. Only create new entity if search returns no matches:
     npm run entity:create -- --type person --interactive

FUZZY MATCHING: This tool handles typos, case differences, and accents.
"Voltaire", "voltaire", and "Voltairè" will all match.

CROSS-DATASET: An entity appearing in multiple datasets is still ONE entity.
Use the same UUID when adding to new datasets.
```

**Implementation Tasks**:
- [ ] **RT-49** - Add --help flag to all tools
- [ ] **RT-50** - Write agent-specific usage instructions
- [ ] **RT-51** - Include common pitfalls and workflows
- [ ] **RT-52** - Show examples with actual commands

## Test Entity Workflow

Before full migration (M36), test tools on sample entities:

- [ ] **RT-53** - Create test directory: `entities-test/`
- [ ] **RT-54** - Extract 5 sample persons from different datasets
- [ ] **RT-55** - Create canonical entity files for samples
- [ ] **RT-56** - Test find: ensure all 5 samples are discoverable
- [ ] **RT-57** - Test create: add 1 new test entity
- [ ] **RT-58** - Test edit: modify sample entity fields
- [ ] **RT-59** - Test add-to-dataset: add sample to test dataset
- [ ] **RT-60** - Test remove-from-dataset: remove and verify warnings
- [ ] **RT-61** - Test info: verify full display
- [ ] **RT-62** - Test list: verify filtering options
- [ ] **RT-63** - Document workflow issues and improvements

## Documentation

- [ ] **RT-64** - Create `research/ENTITY_MANAGEMENT.md` guide
- [ ] **RT-65** - Document search-first workflow
- [ ] **RT-66** - Document entity creation checklist
- [ ] **RT-67** - Document dataset membership workflow
- [ ] **RT-68** - Add examples for common scenarios
- [ ] **RT-69** - Update `research/RESEARCHING_NETWORKS.md` with new workflow

## Key Deliverables

1. **CLI tools** (7 commands):
   - `entity:find` - Search for existing entities
   - `entity:create` - Create new canonical entities
   - `entity:edit` - Edit canonical fields
   - `entity:add-to-dataset` - Add entity reference to dataset
   - `entity:remove-from-dataset` - Remove entity from dataset
   - `entity:info` - Display entity details
   - `entity:list` - Browse all entities

2. **Agent instructions**: Embedded --help output for LLM agents

3. **Test workflow**: Sample entities with validated tool operations

4. **Documentation**: `research/ENTITY_MANAGEMENT.md` guide

## Success Metrics

- Entity creation time < 2 minutes (vs. 10+ minutes with current workflow)
- Token usage per entity operation < 1000 tokens (vs. 10k+ currently)
- Zero duplicate entity creations (search-first workflow enforced)
- Agent-friendly: LLMs can use tools without human intervention
- All 7 tools work reliably on test entities

## Notes

- Tools should be safe by default (confirm before destructive operations)
- Interactive mode for humans, non-interactive flags for agents
- Clear, parseable output for both humans and LLMs
- Validate all inputs before modifying files
- Atomic file writes to prevent corruption
