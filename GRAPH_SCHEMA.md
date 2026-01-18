# HistoryNet Graph Schema

This document describes the schema for nodes and edges in HistoryNet datasets. The schema is designed to be **forgiving and extensible**—only minimal fields are required, while any additional properties can be added to capture domain-specific information.

This schema is intended to be provided to AI agents or researchers who are building datasets, ensuring the data they produce is adequate to drive the HistoryNet application.

---

## Design Principles

1. **Minimal Required Fields**: Only fields absolutely necessary for the application to function are required
2. **Extensible Properties**: Any additional key/value pairs can be added to nodes or edges
3. **Evidence-Grounded**: Edges should include evidence for the relationship when possible
4. **Type-Aware**: Different node types have type-specific fields, but share a common base

---

## Node Schema

### Common Fields (All Node Types)

Every node, regardless of type, shares these common fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique identifier for the node (e.g., "person-aristotle", "loc-athens") |
| `type` | enum | ✅ Yes | One of: `"person"`, `"object"`, `"location"`, `"entity"` |
| `title` | string | ✅ Yes | Display name/title (e.g., "Aristotle", "Critique of Pure Reason") |
| `shortDescription` | string | ⚪ Recommended | Brief description (1-2 sentences) for tooltips and infobox |
| `dateStart` | string | ⚪ Optional | Start date of relevance (ISO 8601 format or year, e.g., "1724" or "1724-04-22") |
| `dateEnd` | string | ⚪ Optional | End date of relevance (ISO 8601 format or year) |
| `imageUrl` | string | ⚪ Optional | URL to an image representing the node |
| `externalLinks` | array | ⚪ Optional | Array of `{ label, url }` objects for external resources |

**Note on Dates**: For persons, `dateStart` typically represents birth and `dateEnd` represents death. For objects, these might represent publication/creation dates. For locations and entities, these represent the period of relevance (if applicable—Paris doesn't need a date range, but "The Vienna Circle" might be 1924-1936).

### Person-Specific Fields

Additional fields for nodes where `type: "person"`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `alternateNames` | array | ⚪ Optional | Array of alternate names, spellings, or pseudonyms |
| `birthPlace` | string | ⚪ Optional | Place of birth (text or reference to location node ID) |
| `deathPlace` | string | ⚪ Optional | Place of death (text or reference to location node ID) |
| `nationality` | string | ⚪ Optional | Nationality or primary cultural affiliation |
| `occupations` | array | ⚪ Optional | Array of occupations/roles (e.g., ["philosopher", "mathematician"]) |
| `biography` | string | ⚪ Recommended | Longer biographical text (can be multiple paragraphs) |

### Object-Specific Fields

Additional fields for nodes where `type: "object"`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `objectType` | string | ⚪ Recommended | Type of object: "book", "manuscript", "letter", "artwork", "treatise", etc. |
| `creators` | array | ⚪ Optional | Array of creator node IDs or names |
| `dateCreated` | string | ⚪ Optional | When the object was created (can duplicate dateStart for clarity) |
| `language` | string | ⚪ Optional | Primary language of the object |
| `subject` | string | ⚪ Optional | Subject matter or topic |

### Location-Specific Fields

Additional fields for nodes where `type: "location"`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `locationType` | string | ⚪ Recommended | Type: "city", "university", "salon", "academy", "church", "school", etc. |
| `coordinates` | object | ⚪ Optional | `{ lat, lng }` for map display (future feature) |
| `country` | string | ⚪ Optional | Country or region |
| `parentLocation` | string | ⚪ Optional | Reference to parent location node ID (e.g., university in a city) |

### Entity-Specific Fields

Additional fields for nodes where `type: "entity"`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `entityType` | string | ⚪ Recommended | Type: "organization", "movement", "school_of_thought", "institution", "publication", etc. |
| `foundedBy` | array | ⚪ Optional | Array of founder node IDs |
| `headquarters` | string | ⚪ Optional | Reference to location node ID |
| `members` | array | ⚪ Optional | Array of member node IDs (alternative to explicit edges) |

---

## Edge Schema

Edges represent relationships between nodes.

### Edge Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique identifier for the edge |
| `source` | string | ✅ Yes | Node ID of the source/origin node |
| `target` | string | ✅ Yes | Node ID of the target/destination node |
| `relationship` | string | ✅ Yes | Type of relationship (see relationship types below) |
| `label` | string | ⚪ Optional | Human-readable label for display (defaults to relationship type) |
| `dateStart` | string | ⚪ Optional | When the relationship began |
| `dateEnd` | string | ⚪ Optional | When the relationship ended |
| `evidence` | string | ⚪ **Strongly Recommended** | Description of evidence for this relationship |
| `evidenceNodeId` | string | ⚪ Optional | Reference to an object node that serves as evidence (e.g., a letter) |
| `evidenceUrl` | string | ⚪ Optional | URL to external evidence/source |
| `directed` | boolean | ⚪ Optional | Whether the relationship is directional (default: depends on type) |
| `strength` | string | ⚪ Optional | Qualitative strength: "strong", "moderate", "weak", "speculative" |

### Standard Relationship Types

The following relationship types are predefined but the schema is **extensible**—additional relationship types can be added as needed.

#### Person ↔ Person

| Relationship | Directed | Description |
|--------------|----------|-------------|
| `influenced` | Yes | Source influenced target's thinking/work |
| `influenced_by` | Yes | Source was influenced by target |
| `collaborated_with` | No | Worked together on a project/work |
| `taught` | Yes | Source taught target |
| `studied_under` | Yes | Source studied under target |
| `corresponded_with` | No | Exchanged letters/communication |
| `knows` | No | General acquaintance/connection |
| `related_to` | No | Family or personal relationship |
| `opposed` | No | Intellectual or personal opposition |
| `succeeded` | Yes | Source succeeded target in a role |

#### Person ↔ Object

| Relationship | Directed | Description |
|--------------|----------|-------------|
| `authored` | Yes | Person created the object |
| `translated` | Yes | Person translated the object |
| `edited` | Yes | Person edited the object |
| `referenced_in` | Yes | Person is referenced in the object |
| `inspired_by` | Yes | Person was inspired by the object |

#### Person ↔ Location

| Relationship | Directed | Description |
|--------------|----------|-------------|
| `born_in` | Yes | Person was born at location |
| `died_in` | Yes | Person died at location |
| `lived_in` | Yes | Person resided at location |
| `worked_at` | Yes | Person worked at location (e.g., university) |
| `visited` | Yes | Person visited location |

#### Person ↔ Entity

| Relationship | Directed | Description |
|--------------|----------|-------------|
| `founded` | Yes | Person founded the entity |
| `member_of` | Yes | Person was a member of the entity |
| `led` | Yes | Person led/directed the entity |
| `associated_with` | No | General association with entity |

#### Object ↔ Object

| Relationship | Directed | Description |
|--------------|----------|-------------|
| `references` | Yes | Source object references target object |
| `responds_to` | Yes | Source object responds to/critiques target |
| `continuation_of` | Yes | Source continues work begun in target |

#### Other Combinations

Additional relationships can exist between any node types. When creating new relationship types, use lowercase with underscores (snake_case) and document the relationship in the dataset's manifest.

---

## Evidence Guidelines

**Evidence is strongly recommended for all edges.** Historical networks should be grounded in real observations and sources. When creating edges, consider:

1. **Primary Sources**: Letters, manuscripts, documented meetings
2. **Secondary Sources**: Biographies, scholarly articles, historical analyses
3. **Logical Inference**: Documented circumstances that imply a relationship

### Evidence Examples

```json
{
  "id": "edge-hume-knows-rousseau",
  "source": "person-david-hume",
  "target": "person-jean-jacques-rousseau",
  "relationship": "knows",
  "dateStart": "1766",
  "dateEnd": "1767",
  "evidence": "Rousseau lived with Hume in England from January 1766, documented in their correspondence",
  "evidenceUrl": "https://example.com/hume-rousseau-correspondence"
}
```

```json
{
  "id": "edge-kant-influenced-by-cpr",
  "source": "person-immanuel-kant",
  "target": "object-enquiry-human-understanding",
  "relationship": "inspired_by",
  "evidence": "Kant famously stated Hume 'awakened him from his dogmatic slumber'",
  "strength": "strong"
}
```

---

## Extensibility

The schema explicitly supports adding custom properties to any node or edge. The application will:

1. Display all properties in the infobox (as key/value pairs)
2. Ignore properties it doesn't recognize for filtering/visualization
3. Treat link-like values (node IDs or URLs) as clickable when possible

### Custom Property Examples

```json
{
  "id": "person-wittgenstein",
  "type": "person",
  "title": "Ludwig Wittgenstein",
  "dateStart": "1889",
  "dateEnd": "1951",
  "favoriteColor": "unknown",
  "philosophicalPeriods": ["early", "later"],
  "keyWorks": ["Tractatus Logico-Philosophicus", "Philosophical Investigations"],
  "customNote": "Known for dramatically different early and later philosophical positions"
}
```

---

## File Format

Datasets should be structured as:

```
datasets/{dataset-id}/
  manifest.json    # Dataset metadata
  nodes.json       # Array of node objects
  edges.json       # Array of edge objects
```

### manifest.json

```json
{
  "id": "enlightenment-philosophers",
  "name": "Enlightenment Philosophers",
  "description": "Key figures of the 18th century Enlightenment and their intellectual relationships",
  "lastUpdated": "2026-01-15",
  "version": "1.0.0",
  "author": "HistoryNet Contributors",
  "license": "CC-BY-4.0",
  "defaultDataset": false,
  "nodeCount": 45,
  "edgeCount": 127,
  "customRelationshipTypes": [
    {
      "type": "debated",
      "description": "Engaged in public intellectual debate",
      "directed": false
    }
  ]
}
```

### nodes.json

```json
[
  {
    "id": "person-voltaire",
    "type": "person",
    "title": "Voltaire",
    "alternateNames": ["François-Marie Arouet"],
    "dateStart": "1694",
    "dateEnd": "1778",
    "shortDescription": "French Enlightenment writer and philosopher",
    "biography": "...",
    "imageUrl": "https://example.com/voltaire.jpg",
    "externalLinks": [
      { "label": "Wikipedia", "url": "https://en.wikipedia.org/wiki/Voltaire" },
      { "label": "Stanford Encyclopedia", "url": "https://plato.stanford.edu/entries/voltaire/" }
    ]
  }
]
```

### edges.json

```json
[
  {
    "id": "edge-voltaire-corresponded-frederick",
    "source": "person-voltaire",
    "target": "person-frederick-great",
    "relationship": "corresponded_with",
    "dateStart": "1736",
    "dateEnd": "1778",
    "evidence": "Extensive correspondence preserved in multiple archives",
    "label": "Correspondence"
  }
]
```

---

## Validation

While the schema is forgiving, datasets should be validated for:

1. **Required fields present** on all nodes and edges
2. **Valid node IDs** referenced in edges exist in nodes
3. **Valid relationship types** (standard or documented custom types)
4. **Date format consistency** (ISO 8601 or year-only)
5. **No orphan nodes** (every node has at least one edge, unless intentional)
6. **Evidence recommendation** warning for edges without evidence

A validation script should be provided as part of the tooling.
