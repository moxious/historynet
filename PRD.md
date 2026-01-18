# HistoryNet - Product Requirements Document

## Overview

**HistoryNet** is a React/Vite single-page application (SPA) for exploring, visualizing, and filtering social networks of historical figures. The application presents historical relationships as an interactive graph, where nodes represent people, objects, locations, and entities, and edges represent the relationships between them.

The application is designed to be **dataset-agnostic**—it serves as a viewer for static JSON "knowledge bases" that can be swapped out to explore different historical networks, such as intellectual milieus or developments in Western philosophy.

## Goals

1. **Visualize Historical Networks**: Provide an interactive force-directed graph view of historical relationships
2. **Enable Exploration**: Allow users to click on nodes and edges to view detailed metadata in an infobox
3. **Support Filtering**: Offer filters for date ranges and text matching to manage large graphs
4. **Shareable State**: Capture all view and filter state in URL parameters for easy sharing
5. **Multiple Datasets**: Support switching between different historical knowledge bases
6. **Extensible Architecture**: Build with swappable visualization layouts for future expansion

## Target Users

- Historians and researchers exploring intellectual networks
- Students studying philosophy, history, or related fields
- Enthusiasts interested in visualizing historical connections
- Anyone curious about how historical figures related to one another

---

## Core Concepts

### POLE Model

The application adopts a modified POLE (Persons, Objects, Locations, Entities) graph model:

| Node Type | Description | Examples |
|-----------|-------------|----------|
| **Person** | Historical individuals | Philosophers, authors, scientists |
| **Object** | Created artifacts | Books, manuscripts, letters, artworks |
| **Location** | Physical places | Cities, universities, salons, academies, churches |
| **Entity** | Organizations/movements | Schools of thought, institutions, publications |

### Graph Structure

- **Nodes**: Represent any POLE element with common metadata plus type-specific fields
- **Edges**: Represent relationships between nodes with optional metadata and evidence

See `GRAPH_SCHEMA.md` for the complete schema specification.

---

## Features

### F1: Force-Directed Graph View (MVP)

The primary visualization is an interactive force-directed graph layout.

**Requirements:**
- Display all nodes and edges from the loaded dataset
- Use D3.js for rendering and physics simulation
- Support zoom and pan interactions
- Visually distinguish node types (Person, Object, Location, Entity) through color/shape
- Visually distinguish edge types through color/style
- Clicking a node or edge opens/updates the infobox
- Hovering may optionally preview node info (nice-to-have)

### F2: Timeline View (Future Milestone)

A vertical timeline layout showing nodes arranged by their date of relevance.

**Requirements:**
- Vertical orientation (time flows top to bottom)
- Display birth/death points for persons (not lifespan bars)
- Display date of relevance for other node types
- Same click/infobox behavior as graph view
- Same filtering capabilities

**Architecture Note:** The application should be built with swappable visualization layouts. Graph view and timeline view are two implementations of a common layout interface, allowing future layouts to be added.

### F3: Infobox Panel

A right-hand panel displaying detailed information about the selected node or edge.

**Requirements:**
- Display all metadata as key/value pairs
- Support rich values (links to other nodes/edges)
- Clicking a link to another node updates the infobox to show that node's details
- Clicking a link does NOT change the view or filter state
- Gracefully handle missing optional fields
- Display evidence/source information for edges when available

### F4: Filters

A filter panel allowing users to constrain the visible graph.

**Requirements:**
- **Date Range Filters:**
  - "No earlier than" (hide nodes/edges before a date)
  - "No later than" (hide nodes/edges after a date)
  - "Between" (combination of both)
- **Text Filters:**
  - Substring match on node names/titles
  - Substring match on relationship/edge types
- Filters apply to all visualization layouts
- Filter state is reflected in URL parameters
- Clear/reset filters option

### F5: Search

A search box for finding specific nodes.

**Requirements:**
- Text input field (likely in header/toolbar area)
- As user types, highlight nodes in the graph that match the search text
- Search matches against node title/name
- Does not filter the graph—only highlights matches

### F6: Dataset Switching

Support for loading different knowledge bases.

**Requirements:**
- Dropdown menu in the application header
- Display dataset metadata when selected:
  - Name
  - Description
  - Last updated date
- Selected dataset is captured in URL parameters
- Configurable default dataset (loaded when no dataset specified in URL)
- Switching datasets clears current filter state

### F7: URL State Management

All application state should be captured in URL parameters.

**Requirements:**
- **Dataset**: Which knowledge base is loaded
- **View Mode**: Graph view vs timeline view (when implemented)
- **Filters**: All active filter values
- **Selected Node/Edge**: Optionally, which item is selected in the infobox
- Users can copy/paste URLs to share exact application states
- Deep linking: opening a URL restores the complete application state

---

## Non-Functional Requirements

### Performance
- Should handle graphs of 100-500 nodes smoothly
- Larger graphs may require additional optimization (clustering, level-of-detail)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support required

### Accessibility
- Keyboard navigation for core functions
- Appropriate ARIA labels
- Sufficient color contrast

### Distribution
- Hosted on GitHub Pages via GitHub Actions workflow
- Pure client-side SPA (no backend required)
- Assumes users are online (can fetch assets, images)

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18+ |
| Build Tool | Vite |
| Language | TypeScript |
| Visualization | D3.js |
| Styling | TBD (CSS Modules, Tailwind, or similar) |
| State Management | TBD (React Context, Zustand, or URL-based) |
| Routing | React Router (for URL state management) |

---

## Data Architecture

### Dataset Structure

Each dataset is a standalone JSON file (or set of files) containing:

```
datasets/
  disney-characters/
    manifest.json      # Dataset metadata
    nodes.json         # All nodes
    edges.json         # All edges
  enlightenment-philosophers/
    manifest.json
    nodes.json
    edges.json
```

### Manifest Format

```json
{
  "id": "disney-characters",
  "name": "Disney Characters",
  "description": "A sample dataset of Disney animated characters and their relationships",
  "lastUpdated": "2026-01-15",
  "defaultDataset": true
}
```

See `GRAPH_SCHEMA.md` for complete node and edge schemas.

---

## MVP Scope

The Minimum Viable Product includes:

1. ✅ Force-directed graph view (D3.js)
2. ✅ Basic zoom/pan interactions
3. ✅ Node/edge click to view infobox
4. ✅ Date range filters
5. ✅ Text substring filters
6. ✅ URL state management
7. ✅ Dataset dropdown (single dataset for MVP)
8. ✅ Disney characters sample dataset
9. ✅ GitHub Pages deployment

**Explicitly NOT in MVP:**
- ❌ Timeline view
- ❌ User notes/feedback
- ❌ Editing capabilities
- ❌ Multiple historical datasets (structure supports it, but only Disney ships)

---

## Future Considerations

These items are out of scope but should be considered in architectural decisions:

1. **Timeline View**: Vertical timeline layout (planned for post-MVP milestone)
2. **User Annotations**: Allow users to add notes/feedback to nodes and edges
3. **Additional Layouts**: Other visualization modes (radial, hierarchical, etc.)
4. **Export**: Export filtered views or selected data
5. **Historical Datasets**: Enlightenment philosophers, Vienna Circle, etc.

---

## Success Metrics

1. Application loads and renders a graph within 2 seconds
2. Filter changes reflect in URL within 100ms
3. Shared URLs correctly restore application state
4. Users can explore the Disney dataset end-to-end without errors

---

## Related Documents

- `GRAPH_SCHEMA.md` - Detailed node and edge schema specification
- `AGENTS.md` - Repository structure and agent collaboration guidelines
- `MILESTONES.md` - Implementation milestones
- `PROGRESS.md` - Task tracking with checkboxes
