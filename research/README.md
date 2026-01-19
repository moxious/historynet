# Research Directory

This directory contains **intermediate research artifacts** for building historical network datasets. Final data lives in `public/datasets/`.

**For the complete research methodology, see [`RESEARCHING_NETWORKS.md`](./RESEARCHING_NETWORKS.md).**

---

## Important: Intermediate Artifacts Policy

This directory is for **scratch work only**. The JSON files in `public/datasets/` are the source of truth.

### What Goes Here

- Draft notes and source compilations
- Temporary checklists during research
- URL collections for reference
- Any working files needed during active research

### What Does NOT Go Here

- Final node or edge data (belongs in JSON)
- Scope information (belongs in `manifest.json`)
- Progress tracking (belongs in `manifest.research`)

### Cleanup Requirement

**Delete all files in a network's research folder when:**
- The network passes validation (`npm run validate:datasets`)
- `manifest.research.status` is set to `"complete"`

Completed networks should NOT have research folders. The presence of a research folder indicates work in progress.

---

## Current Research Projects

Check each network's `manifest.json` for current status. Networks with `research.status: "complete"` should have their research folders deleted.

| Network | Dataset Location | Research Folder Status |
|---------|-----------------|----------------------|
| ai-llm-research | `public/datasets/ai-llm-research/` | Should be deleted |
| ambient-music | `public/datasets/ambient-music/` | Should be deleted |
| cybernetics-information-theory | `public/datasets/cybernetics-information-theory/` | Should be deleted |
| enlightenment | `public/datasets/enlightenment/` | Should be deleted |
| protestant-reformation | `public/datasets/protestant-reformation/` | Should be deleted |
| renaissance-humanism | `public/datasets/renaissance-humanism/` | Should be deleted |
| rosicrucian-network | `public/datasets/rosicrucian-network/` | Should be deleted |

**Note**: The research folders listed above were created under an older process. They can be deleted once their corresponding datasets pass validation.

---

## Starting a New Network

1. Read [`RESEARCHING_NETWORKS.md`](./RESEARCHING_NETWORKS.md) for the complete 4-phase process
2. Create `public/datasets/{network-id}/manifest.json` with scope data
3. Create empty `nodes.json` and `edges.json` arrays
4. Work directly in JSON, using this directory only for scratch notes if needed
5. Delete any scratch files when validation passes

---

## Repairing an Existing Network

1. Run `npm run validate:datasets -- --dataset {network-id}`
2. Fix any errors in the JSON files
3. Update `manifest.research` fields
4. Delete the research folder if it exists
5. Set `research.status: "complete"` in manifest

See "Repair Mode" section in [`RESEARCHING_NETWORKS.md`](./RESEARCHING_NETWORKS.md) for details.

---

## Quick Reference

- **Research process**: [`RESEARCHING_NETWORKS.md`](./RESEARCHING_NETWORKS.md)
- **Graph schema**: [`../GRAPH_SCHEMA.md`](../GRAPH_SCHEMA.md)
- **Final datasets**: `../public/datasets/`
- **Validator**: `npm run validate:datasets`
