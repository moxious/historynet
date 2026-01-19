# Researching Historical Networks

This document defines the process for building and maintaining historical network datasets for HistoryNet. It supports both **creating new networks** and **repairing existing networks**.

---

## Quick Reference

| Mode | Start Point | Goal |
|------|-------------|------|
| **Create** | Empty folder | Complete validated dataset |
| **Repair** | Existing dataset | Fix validator errors, fill gaps, clean up |

| Phase | Output | Context Required |
|-------|--------|------------------|
| 1. Initialize | `manifest.json`, empty arrays | GRAPH_SCHEMA.md |
| 2. Nodes | `nodes.json` (batched) | manifest + current nodes |
| 3. Edges | `edges.json` (batched) | nodes.json + current edges |
| 4. Validate | Clean dataset | Validator output |

---

## Key Principles

- **Work directly in JSON**: No markdown-to-JSON conversion step
- **Batch operations**: Add 10-20 nodes or 20-30 edges per session
- **Validate continuously**: Run `npm run validate:datasets` after each batch
- **Evidence-grounded**: All edges should cite sources; speculative claims must be flagged
- **Size-bounded**: Networks should not exceed ~200 nodes
- **Clean up artifacts**: Delete intermediate files when done

---

## Phase 1: Initialize

**Goal**: Set up the dataset structure with scope and metadata.

**Tasks**:
1. Create `public/datasets/{network-id}/manifest.json` with scope data
2. Create `public/datasets/{network-id}/nodes.json` as empty array `[]`
3. Create `public/datasets/{network-id}/edges.json` as empty array `[]`

### manifest.json Template

```json
{
  "id": "network-id",
  "name": "Network Display Name",
  "description": "1-2 paragraph description of the network and its significance.",
  "lastUpdated": "2026-01-19",
  "version": "1.0.0",
  "author": "HistoryNet Contributors",
  "license": "CC-BY-4.0",
  "defaultDataset": false,
  "nodeCount": 0,
  "edgeCount": 0,
  
  "scope": {
    "startYear": 1920,
    "endYear": 1940,
    "regions": ["Austria", "Germany", "United States"],
    "themes": ["logical positivism", "philosophy of science"],
    "seedFigures": ["person-moritz-schlick", "person-rudolf-carnap"],
    "subgroups": [
      { "id": "core", "name": "Core Members", "description": "Founding members of the circle" },
      { "id": "periphery", "name": "Associated Scholars", "description": "Collaborators and correspondents" }
    ],
    "exclusionNotes": "Excluding pure mathematicians without philosophical publications"
  },
  
  "research": {
    "status": "in-progress",
    "completedBatches": [],
    "pendingBatches": ["core", "periphery"],
    "gaps": [],
    "excludedFigures": []
  },
  
  "customRelationshipTypes": []
}
```

### Scope Fields

| Field | Type | Purpose |
|-------|------|---------|
| `startYear` | number | Temporal boundary start |
| `endYear` | number | Temporal boundary end |
| `regions` | string[] | Geographic scope |
| `themes` | string[] | Intellectual themes uniting the network |
| `seedFigures` | string[] | Node IDs of central figures to research outward from |
| `subgroups` | object[] | Logical groupings for batched research |
| `exclusionNotes` | string | What types of figures are NOT included and why |

### Research Status Fields

| Field | Type | Purpose |
|-------|------|---------|
| `status` | string | `"in-progress"` or `"complete"` |
| `completedBatches` | string[] | Subgroup IDs that have been researched |
| `pendingBatches` | string[] | Subgroup IDs remaining |
| `gaps` | object[] | Known gaps: `{ description, priority }` |
| `excludedFigures` | object[] | Excluded candidates: `{ name, reason }` |

**Handoff**: manifest.json exists with scope populated, empty nodes.json and edges.json created.

---

## Phase 2: Enumerate Nodes

**Goal**: Build `nodes.json` with all persons, objects, locations, and entities.

**Work in batches** organized by subgroup. For each batch:

1. **Read current state**: Load `nodes.json` to know what exists
2. **Research the batch**: Gather data for 10-20 nodes in one subgroup
3. **Include Wikipedia IDs**: Look up `wikipediaTitle` and `wikidataId` while researching each entity
4. **Append to nodes.json**: Add the new nodes
5. **Validate**: Run `npm run validate:datasets -- --dataset {id}`
6. **Update progress**: Move subgroup from `pendingBatches` to `completedBatches` in manifest

### Node Research Checklist

For each node, gather:

| Field | Required | Notes |
|-------|----------|-------|
| `id` | Yes | Format: `{type}-{slug}` (e.g., `person-voltaire`) |
| `type` | Yes | `person`, `object`, `location`, or `entity` |
| `title` | Yes | Display name |
| `shortDescription` | Recommended | 1-2 sentences for tooltips |
| `dateStart` | Recommended | Birth year (persons) or creation date |
| `dateEnd` | Optional | Death year (persons) or end date |
| `wikipediaTitle` | Recommended | Exact Wikipedia page title (e.g., `"Ludwig_Wittgenstein"`) |
| `wikidataId` | Recommended | Stable Wikidata QID (e.g., `"Q9391"`) |
| Type-specific fields | Varies | See GRAPH_SCHEMA.md |

### Wikipedia ID Lookup

Look up Wikipedia/Wikidata IDs **during node research**, not as a separate phase:

1. Search Wikipedia for the entity
2. Copy the exact page title (with underscores)
3. Find the Wikidata QID in the Wikipedia sidebar
4. If no article exists, set `"wikipediaTitle": null` explicitly

### Batch Size Guidelines

| Situation | Recommended Batch Size |
|-----------|----------------------|
| Core figures with many relationships | 10-15 nodes |
| Peripheral figures with less complexity | 15-20 nodes |
| Objects, locations, entities | 20-30 nodes |

**Why batch?** Large JSON writes can timeout, and keeping context small reduces errors.

**Handoff**: nodes.json populated, all batches in `completedBatches`, `research.status` still `"in-progress"`.

---

## Phase 3: Map Edges

**Goal**: Build `edges.json` with all relationships between nodes.

**Work in batches** organized by relationship category or source node. For each batch:

1. **Read current state**: Load `nodes.json` (for valid IDs) and `edges.json`
2. **Research relationships**: Document 20-30 edges with evidence
3. **Append to edges.json**: Add the new edges
4. **Validate**: Run validator to catch broken references immediately
5. **Continue until complete**

### Edge Research Checklist

For each edge, gather:

| Field | Required | Notes |
|-------|----------|-------|
| `id` | Yes | Unique identifier (e.g., `edge-kant-influenced-hegel`) |
| `source` | Yes | Must exist in nodes.json |
| `target` | Yes | Must exist in nodes.json |
| `relationship` | Yes | Standard type or custom (document in manifest) |
| `evidence` | Strongly Recommended | Description of evidence for this relationship |
| `evidenceUrl` | Recommended | Link to source |
| `dateStart` / `dateEnd` | Optional | When relationship was active |
| `strength` | Optional | `"strong"`, `"moderate"`, `"weak"`, `"speculative"` |

### Evidence Standards

| Source Type | Quality | Notes |
|-------------|---------|-------|
| Primary sources (letters, documents) | Highest | Prefer when available |
| Academic secondary sources | High | Good for synthesis |
| Wikipedia (with citations) | Acceptable | Verify underlying sources when possible |
| Encyclopedias (Britannica, etc.) | Acceptable | Good for dates and basic facts |
| Popular history | Lower | Note source quality in evidence field |

### Handling Speculation

If a relationship is debated but worth including:
- Set `"strength": "speculative"`
- In evidence field, cite WHO speculates (e.g., "Frances Yates argues in *The Rosicrucian Enlightenment* that...")
- Speculation still requires a citation—no unsourced claims

**Handoff**: edges.json populated, validator passes.

---

## Phase 4: Validate and Finalize

**Goal**: Ensure dataset passes validation and is complete.

**Tasks**:

1. **Run full validation**:
   ```bash
   npm run validate:datasets -- --dataset {network-id}
   ```

2. **Fix all errors**: Errors must be resolved before marking complete

3. **Review warnings**: Address or document acceptable warnings

4. **Update manifest**:
   - Set `"research.status": "complete"`
   - Update `nodeCount` and `edgeCount`
   - Document any remaining gaps in `research.gaps`
   - Update `lastUpdated` date

5. **Clean up**: Delete any intermediate files in `research/{network-id}/`

### Validation Checklist

| Check | Severity | How to Fix |
|-------|----------|-----------|
| Missing required fields | Error | Add the field |
| Broken edge references | Error | Fix source/target ID or add missing node |
| Invalid date format | Error | Use `"YYYY"` or `"YYYY-MM-DD"` |
| Invalid URL format | Error | Use valid HTTP/HTTPS URL |
| Duplicate IDs | Error | Rename one of the duplicates |
| Missing evidence | Warning | Add evidence or accept warning |
| Missing Wikipedia ID | Warning | Look up or set to null |
| Orphan nodes | Warning | Add edges or document why isolated |

**Handoff**: Dataset complete, validator passes, research folder cleaned up.

---

## Repair Mode

For existing networks, the same phases become validation questions.

### Repair Flow

```
1. Run validator
   ↓
2. Fix errors → Re-run validator → Repeat until clean
   ↓
3. Review warnings → Fix or document acceptable ones
   ↓  
4. Update manifest.research fields
   ↓
5. Delete research/{network}/ folder if it exists
   ↓
6. Done
```

### Repair Checklist

- [ ] Validator passes with no errors
- [ ] All nodes have `wikipediaTitle` (or explicit null)
- [ ] All edges have `evidence` or `evidenceUrl`
- [ ] `manifest.research.status` is `"complete"`
- [ ] `nodeCount` and `edgeCount` are accurate
- [ ] `research/{network}/` folder deleted
- [ ] No orphan nodes (unless documented)

---

## Intermediate Artifacts

You may use `research/{network-id}/` for scratch work during research:

- Draft notes
- Source compilations  
- Temporary checklists
- URL collections

**Important**: Delete all intermediate files when the network is complete. The JSON files are the source of truth—research folders should not persist after completion.

### What NOT to Put in Research Folders

- Final data (it belongs in JSON)
- Scope information (it belongs in manifest.json)
- Progress tracking (it belongs in manifest.research)

---

## Quality Guidelines

### Inclusion Decisions

**Include** a figure if:
- They have documented relationships to 2+ existing network members
- They are frequently mentioned in scholarship about the movement
- Primary or secondary sources establish their role

**Exclude** (and document in `research.excludedFigures`) if:
- Only tangential connection to the network
- Poor source quality with no corroboration
- Would push network over 200 nodes without adding significant value

### Connectedness

- All nodes should have at least one edge
- If a node must be disconnected, document why in its metadata
- Prefer connected graphs—isolated nodes suggest incomplete research

### Date Validation

- Use ISO 8601 format: `"YYYY"` or `"YYYY-MM-DD"`
- Validate dates against reliable sources
- For uncertain dates, use the most reliable estimate and note uncertainty

---

## Example: New Network Lifecycle

```
Session 1: Initialize
  - Create manifest.json with scope for Vienna Circle
  - Create empty nodes.json and edges.json
  - Define subgroups: core, berlin-group, british, american

Session 2: Core members batch
  - Research Schlick, Carnap, Neurath, Waismann, etc. (12 nodes)
  - Include Wikipedia IDs for each
  - Run validator, fix any issues
  - Update manifest: move "core" to completedBatches

Session 3: Berlin Group batch
  - Research Reichenbach, Hempel, etc. (8 nodes)
  - Run validator
  - Update manifest

Session 4-5: Continue node batches...

Session 6: Begin edges
  - Document relationships for core members (30 edges)
  - Run validator to catch broken refs
  - Continue...

Session 7: Finalize
  - Run full validation
  - Fix remaining issues
  - Update manifest.research.status to "complete"
  - Delete research/vienna-circle/ if it exists
```

---

## Related Documents

- [GRAPH_SCHEMA.md](../GRAPH_SCHEMA.md) - Schema for nodes, edges, and manifest
- [AGENTS.md](../AGENTS.md) - General agent collaboration guidelines
- [PRD.md](../PRD.md) - Product requirements for HistoryNet application
