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
| [ambient-music/](./ambient-music/) | In Progress | 57 | Enumeration (Phase 2 complete) |
| [protestant-reformation/](./protestant-reformation/) | In Progress | 71 | Enumeration (Phase 2 complete) |
| [renaissance-humanism/](./renaissance-humanism/) | In Progress | 79 | Enumeration (Phase 2 complete) |

### Renaissance Humanism Network (c. 1304-1600)

**Folder**: `renaissance-humanism/`

**Status**: Phase 2 (Enumeration) complete, ready for Phase 3 (Relationship Mapping)

**Scope**: The intellectual network of Renaissance Humanism, spanning from early Italian humanism through Northern Christian humanism, including:
- Early Italian Humanists (Petrarch, Boccaccio, Salutati, Bruni): 10 figures
- Florentine Platonic Academy (Ficino, Pico della Mirandola, Poliziano): 7 figures
- Florentine Civic Humanists (Machiavelli, Guicciardini): 6 figures
- Roman Humanism (Valla, Biondo, papal court): 7 figures
- Venetian and Paduan Humanism (Bembo, Aldus Manutius): 6 figures
- Northern/Christian Humanists (Erasmus, More, Colet): 12 figures
- German Humanists (Reuchlin, Celtis, Pirckheimer): 9 figures
- Spanish Humanists (Nebrija, Vives): 4 figures
- French Humanists (Budé, Lefèvre d'Étaples): 5 figures
- Humanist Educators (Guarino, Vittorino da Feltre): 4 figures
- Greek Scholars and Émigrés: 5 figures
- Additional Significant Figures: 4 figures

**Seed Figures**: Petrarch, Erasmus, Thomas More, Marsilio Ficino, Pico della Mirandola, Leon Battista Alberti, Niccolò Machiavelli

**Total Enumerated**: 79 individuals

See `renaissance-humanism/progress.md` for detailed status.

---

### Protestant Reformation Network (c. 1483-1564)

**Folder**: `protestant-reformation/`

**Status**: Phase 2 (Enumeration) complete, ready for Phase 3 (Relationship Mapping)

**Scope**: The intellectual and personal network of the Protestant Reformation, including:
- Lutheran/Wittenberg Circle (Luther's collaborators): 11 figures
- Swiss Reformed (Zwingli, Calvin, their successors): 10 figures
- Strasbourg Reformers (Bucer's circle): 4 figures
- English Reformation (Cranmer, Tyndale, English reformers): 12 figures
- Christian Humanists (Erasmus and his network): 5 figures
- Radical Reformation (Anabaptists): 6 figures
- French Reformed/Huguenots: 4 figures
- Political Patrons and Catholic Opponents: 9 figures
- Scottish Reformation: 3 figures

**Seed Figures**: Martin Luther, John Calvin, Huldrych Zwingli, Erasmus, William Tyndale, Thomas Cranmer, Philip Melanchthon

**Total Enumerated**: 71 individuals

See `protestant-reformation/progress.md` for detailed status.

---

### Ambient Music Network (c. 1920-1995)

**Folder**: `ambient-music/`

**Status**: Phase 2 (Enumeration) complete, ready for Phase 3 (Relationship Mapping)

**Scope**: The development and practice of ambient music, centered on Brian Eno, including:
- Precursors and conceptual foundations (Satie, Cage, musique concrète)
- Instrument makers and technologists (Moog, Buchla, Theremin)
- Krautrock and German electronic school (Tangerine Dream, Cluster)
- British art school and experimental scene (Eno's collaborators)
- Minimalist composers (Reich, Riley, Glass)
- Studio as instrument practitioners (dub pioneers)
- Japanese ambient pioneers (Hosono, Yoshimura)

**Focus**: "Artists' artists" - those most influential in the development of the form, not the most commercially popular. Includes equipment makers and technological enablers.

**Seed Figures**: Brian Eno, Robert Moog, John Cage, Pierre Schaeffer, Karlheinz Stockhausen

See `ambient-music/progress.md` for detailed status.

---

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
