# M4: Infobox Panel

**Status**: ✅ Complete (2026-01-18)
**Track**: MVP (Core Application)
**Depends on**: M3 (Graph Visualization)

## Goal

Create a detail panel that displays comprehensive information about selected nodes and edges, with type-specific fields, internal navigation links, and evidence display.

## Tasks

### Panel Structure
- [x] Create `src/components/InfoboxPanel.tsx` container
- [x] Implement show/hide based on selection state
- [x] Add close button to clear selection
- [x] Style panel (right side, scrollable, fixed width)

### Node Display
- [x] Create `src/components/NodeInfobox.tsx` for node details
- [x] Display common fields (title, type, description, dates)
- [x] Display type-specific fields based on node type
- [x] Display image when `imageUrl` present
- [x] Render external links as clickable anchors

### Edge Display
- [x] Create `src/components/EdgeInfobox.tsx` for edge details
- [x] Display relationship type and label
- [x] Display source and target nodes (as clickable links)
- [x] Display date range if present
- [x] Display evidence information prominently

### Internal Links
- [x] Implement clickable links to other nodes
- [x] Clicking a node link updates infobox to show that node
- [x] Clicking a node link does NOT change graph view/filter

### Extensible Properties
- [x] Render all additional/custom properties as key/value pairs
- [x] Handle arrays (display as lists)
- [x] Handle nested objects (display as nested key/values)

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Internal link behavior | Updates infobox only | Preserves graph view context while exploring |
| Evidence display | Prominent section | Core requirement for scholarly credibility |
| Type-specific fields | Section-based | Clearer organization than flat list |

## Completion Notes

```
[2026-01-18] @claude: Completed Milestone 4 - Infobox Panel
- Created modular component architecture:
  - src/components/InfoboxPanel.tsx: Container with header, close button, placeholder state
  - src/components/NodeInfobox.tsx: Rich node detail display with type-specific sections
  - src/components/EdgeInfobox.tsx: Relationship detail display with evidence prominence
  - src/components/InfoboxPanel.css: Professional styling with responsive design

- NodeInfobox features:
  - Type badge with color coding (person=blue, object=green, location=amber, entity=purple)
  - Image display with lazy loading and error handling
  - Date formatting (supports ISO 8601 and year-only formats)
  - Type-specific field sections:
    - Person: alternateNames, nationality, occupations, birthPlace, deathPlace, biography
    - Object: objectType, creators, dateCreated, language, subject
    - Location: locationType, country, parentLocation, coordinates
    - Entity: entityType, foundedBy, headquarters, members
  - External links with external indicator icon
  - Clickable internal node links (navigates infobox without changing graph view)
  - Custom properties section for extensibility

- EdgeInfobox features:
  - Relationship badge with gradient styling
  - Visual connection diagram (From → To) with directional/bidirectional arrows
  - Clickable source/target node links with type indicators
  - Time period display
  - Relationship strength badge with color coding
  - Prominent evidence section with:
    - Text evidence display
    - Evidence node link (if evidenceNodeId provided)
    - External evidence URL link
    - "No Evidence Provided" warning state
  - Custom properties section for extensibility

- Design decisions:
  - Clicking node links in infobox only updates infobox (does NOT change graph view/filter)
  - All dates gracefully handled with formatDate() helper
  - Nested objects and arrays properly rendered recursively
  - Node IDs automatically detected and rendered as clickable links when they exist in graph
```
