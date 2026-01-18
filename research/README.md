# Research Directory

This directory contains intermediate research products for building historical network datasets for HistoryNet.

**For the complete research methodology, see [`RESEARCHING_NETWORKS.md`](./RESEARCHING_NETWORKS.md).**

---

## Purpose

AI agents and researchers use this directory to:
1. Store enumeration lists of historical figures
2. Document relationships and evidence before formatting as JSON
3. Track research gaps and questions
4. Coordinate work between agents on dataset creation

Each network is stored in its own subdirectory with a standardized structure. See the meta-process guide for details.

---

## Current Research Projects

| Network | Status | People | Phase |
|---------|--------|--------|-------|
| [rosicrucian/](./rosicrucian/) | In Progress | 42 | Relationship mapping |
| [enlightenment/](./enlightenment/) | In Progress | 0 | Scoping (Phase 1 complete) |

### Enlightenment Intellectual Network (c. 1685-1804)

**Folder**: `enlightenment/`

**Status**: Phase 1 (Scoping) complete, ready for Phase 2 (Enumeration)

**Scope**: The intellectual network of the European Enlightenment, including:
- French Philosophes (Diderot, d'Alembert, Voltaire's circle)
- Scottish Enlightenment (Hume, Smith, Ferguson)
- British empiricists and political thinkers
- German Aufklärung (Kant, Lessing, Mendelssohn)
- Physiocrats and early economists
- American Enlightenment figures
- Scientific-mathematical intersections

**Seed Figures**: Locke, Montesquieu, Voltaire, Rousseau, Hume, Kant, Smith

See `enlightenment/progress.md` for detailed status.

---

### Rosicrucian-Paracelsian Network (c. 1540-1660)

**Folder**: `rosicrucian/`

**Status**: Enumeration complete, relationship mapping in progress

**Scope**: Intellectual network centered on Jacob Boehme and Johann Valentin Andreae, including:
- Tübingen Circle (Rosicrucian manifesto authors)
- German Christian theosophers and mystics
- Paracelsian physicians and alchemists
- Prague court under Rudolf II
- English Rosicrucian reception
- Political patrons

See `rosicrucian/progress.md` for detailed status.

---

## Starting a New Network

1. Read `RESEARCHING_NETWORKS.md` for the complete process
2. Create a new folder: `research/{network-name}/`
3. Initialize `progress.md` with the template from the guide
4. Begin with Phase 1: Scoping

---

## Directory Structure

```
research/
├── README.md                    # This file
├── RESEARCHING_NETWORKS.md      # Meta-process guide
│
└── {network-name}/              # One folder per network
    ├── progress.md              # Phase completion tracking
    ├── 01-scope.md              # Network boundaries and seed figures
    ├── 02-enumeration.md        # Person list with details
    ├── 03-relationships.md      # Documented edges with evidence
    ├── 04-objects.md            # Key works and publications
    ├── 05-locations.md          # Significant places
    ├── 06-entities.md           # Organizations and movements
    └── 07-review-notes.md       # Gaps and review findings
```

---

## Quick Reference

- **Meta-process guide**: `RESEARCHING_NETWORKS.md`
- **Graph schema**: `../GRAPH_SCHEMA.md`
- **Final datasets**: `../public/datasets/`
