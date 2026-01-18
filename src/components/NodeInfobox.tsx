/**
 * NodeInfobox - Displays detailed information for a selected node
 *
 * Shows all node properties including:
 * - Common fields (title, type, description, dates)
 * - Type-specific fields based on node type
 * - Image when imageUrl is present
 * - External links as clickable anchors
 * - All additional custom properties
 */

import type {
  GraphNode,
  PersonNode,
  ObjectNode,
  LocationNode,
  EntityNode,
  ExternalLink,
} from '@types';
import {
  isPersonNode,
  isObjectNode,
  isLocationNode,
  isEntityNode,
} from '@types';

interface NodeInfoboxProps {
  /** The node to display */
  node: GraphNode;
  /** Handler for clicking internal node links */
  onNodeLinkClick: (nodeId: string) => void;
  /** Function to get a node by ID (for resolving references) */
  getNode: (id: string) => GraphNode | undefined;
}

/**
 * Known fields that we handle explicitly (not rendered in "Additional Properties")
 */
const KNOWN_NODE_FIELDS = new Set([
  'id',
  'type',
  'title',
  'shortDescription',
  'dateStart',
  'dateEnd',
  'imageUrl',
  'externalLinks',
  // Person-specific
  'alternateNames',
  'birthPlace',
  'deathPlace',
  'nationality',
  'occupations',
  'biography',
  // Object-specific
  'objectType',
  'creators',
  'dateCreated',
  'language',
  'subject',
  // Location-specific
  'locationType',
  'coordinates',
  'country',
  'parentLocation',
  // Entity-specific
  'entityType',
  'foundedBy',
  'headquarters',
  'members',
]);

/**
 * Format a date string for display
 */
function formatDate(date: string | undefined): string {
  if (!date) return '';
  // If it's just a year, return as-is
  if (/^\d{4}$/.test(date)) return date;
  // If it's an ISO date, format nicely
  try {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  } catch {
    // Fall through to return as-is
  }
  return date;
}

/**
 * Get the type badge class for styling
 */
function getTypeBadgeClass(type: string): string {
  return `node-infobox__type-badge node-infobox__type-badge--${type}`;
}

/**
 * Render an internal node link
 */
function NodeLink({
  nodeId,
  label,
  getNode,
  onClick,
}: {
  nodeId: string;
  label?: string;
  getNode: (id: string) => GraphNode | undefined;
  onClick: (nodeId: string) => void;
}) {
  const targetNode = getNode(nodeId);
  const displayLabel = label ?? targetNode?.title ?? nodeId;

  return (
    <button
      className="node-infobox__node-link"
      onClick={() => onClick(nodeId)}
      title={targetNode ? `View ${targetNode.title}` : `View ${nodeId}`}
    >
      {displayLabel}
    </button>
  );
}

/**
 * Render external links section
 */
function ExternalLinksSection({ links }: { links: ExternalLink[] }) {
  if (links.length === 0) return null;

  return (
    <section className="node-infobox__section">
      <h3 className="node-infobox__section-title">External Links</h3>
      <ul className="node-infobox__external-links">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="node-infobox__external-link"
            >
              {link.label}
              <svg
                className="node-infobox__external-icon"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Render a single property value (handles various types)
 */
function PropertyValue({
  value,
  getNode,
  onNodeLinkClick,
}: {
  value: unknown;
  getNode: (id: string) => GraphNode | undefined;
  onNodeLinkClick: (nodeId: string) => void;
}): JSX.Element {
  // Null/undefined
  if (value === null || value === undefined) {
    return <span className="node-infobox__value--empty">—</span>;
  }

  // Boolean
  if (typeof value === 'boolean') {
    return <span>{value ? 'Yes' : 'No'}</span>;
  }

  // Number
  if (typeof value === 'number') {
    return <span>{value.toLocaleString()}</span>;
  }

  // String - check if it's a node ID
  if (typeof value === 'string') {
    const targetNode = getNode(value);
    if (targetNode) {
      return (
        <NodeLink
          nodeId={value}
          getNode={getNode}
          onClick={onNodeLinkClick}
        />
      );
    }
    return <span>{value}</span>;
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="node-infobox__value--empty">—</span>;
    }
    return (
      <ul className="node-infobox__list">
        {value.map((item, index) => (
          <li key={index}>
            <PropertyValue
              value={item}
              getNode={getNode}
              onNodeLinkClick={onNodeLinkClick}
            />
          </li>
        ))}
      </ul>
    );
  }

  // Object (nested)
  if (typeof value === 'object') {
    return (
      <div className="node-infobox__nested">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="node-infobox__nested-item">
            <span className="node-infobox__nested-key">{formatPropertyKey(key)}:</span>
            <span className="node-infobox__nested-value">
              <PropertyValue
                value={val}
                getNode={getNode}
                onNodeLinkClick={onNodeLinkClick}
              />
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Fallback
  return <span>{String(value)}</span>;
}

/**
 * Format a property key for display (camelCase to Title Case)
 */
function formatPropertyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Render person-specific fields
 */
function PersonFields({
  node,
  getNode,
  onNodeLinkClick,
}: {
  node: PersonNode;
  getNode: (id: string) => GraphNode | undefined;
  onNodeLinkClick: (nodeId: string) => void;
}) {
  return (
    <>
      {/* Alternate Names */}
      {node.alternateNames && node.alternateNames.length > 0 && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Also Known As</span>
          <span className="node-infobox__value">
            {node.alternateNames.join(', ')}
          </span>
        </div>
      )}

      {/* Nationality */}
      {node.nationality && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Nationality</span>
          <span className="node-infobox__value">{node.nationality}</span>
        </div>
      )}

      {/* Occupations */}
      {node.occupations && node.occupations.length > 0 && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Occupations</span>
          <span className="node-infobox__value">
            {node.occupations.join(', ')}
          </span>
        </div>
      )}

      {/* Birth Place */}
      {node.birthPlace && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Birth Place</span>
          <span className="node-infobox__value">
            <PropertyValue
              value={node.birthPlace}
              getNode={getNode}
              onNodeLinkClick={onNodeLinkClick}
            />
          </span>
        </div>
      )}

      {/* Death Place */}
      {node.deathPlace && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Death Place</span>
          <span className="node-infobox__value">
            <PropertyValue
              value={node.deathPlace}
              getNode={getNode}
              onNodeLinkClick={onNodeLinkClick}
            />
          </span>
        </div>
      )}

      {/* Biography */}
      {node.biography && (
        <div className="node-infobox__field node-infobox__field--full">
          <span className="node-infobox__label">Biography</span>
          <p className="node-infobox__biography">{node.biography}</p>
        </div>
      )}
    </>
  );
}

/**
 * Render object-specific fields
 */
function ObjectFields({
  node,
  getNode,
  onNodeLinkClick,
}: {
  node: ObjectNode;
  getNode: (id: string) => GraphNode | undefined;
  onNodeLinkClick: (nodeId: string) => void;
}) {
  return (
    <>
      {/* Object Type */}
      {node.objectType && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Object Type</span>
          <span className="node-infobox__value">{node.objectType}</span>
        </div>
      )}

      {/* Creators */}
      {node.creators && node.creators.length > 0 && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Creators</span>
          <span className="node-infobox__value">
            <PropertyValue
              value={node.creators}
              getNode={getNode}
              onNodeLinkClick={onNodeLinkClick}
            />
          </span>
        </div>
      )}

      {/* Date Created */}
      {node.dateCreated && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Date Created</span>
          <span className="node-infobox__value">{formatDate(node.dateCreated)}</span>
        </div>
      )}

      {/* Language */}
      {node.language && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Language</span>
          <span className="node-infobox__value">{node.language}</span>
        </div>
      )}

      {/* Subject */}
      {node.subject && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Subject</span>
          <span className="node-infobox__value">{node.subject}</span>
        </div>
      )}
    </>
  );
}

/**
 * Render location-specific fields
 */
function LocationFields({
  node,
  getNode,
  onNodeLinkClick,
}: {
  node: LocationNode;
  getNode: (id: string) => GraphNode | undefined;
  onNodeLinkClick: (nodeId: string) => void;
}) {
  return (
    <>
      {/* Location Type */}
      {node.locationType && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Location Type</span>
          <span className="node-infobox__value">{node.locationType}</span>
        </div>
      )}

      {/* Country */}
      {node.country && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Country</span>
          <span className="node-infobox__value">{node.country}</span>
        </div>
      )}

      {/* Parent Location */}
      {node.parentLocation && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Parent Location</span>
          <span className="node-infobox__value">
            <PropertyValue
              value={node.parentLocation}
              getNode={getNode}
              onNodeLinkClick={onNodeLinkClick}
            />
          </span>
        </div>
      )}

      {/* Coordinates */}
      {node.coordinates && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Coordinates</span>
          <span className="node-infobox__value">
            {node.coordinates.lat.toFixed(4)}, {node.coordinates.lng.toFixed(4)}
          </span>
        </div>
      )}
    </>
  );
}

/**
 * Render entity-specific fields
 */
function EntityFields({
  node,
  getNode,
  onNodeLinkClick,
}: {
  node: EntityNode;
  getNode: (id: string) => GraphNode | undefined;
  onNodeLinkClick: (nodeId: string) => void;
}) {
  return (
    <>
      {/* Entity Type */}
      {node.entityType && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Entity Type</span>
          <span className="node-infobox__value">{node.entityType}</span>
        </div>
      )}

      {/* Founded By */}
      {node.foundedBy && node.foundedBy.length > 0 && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Founded By</span>
          <span className="node-infobox__value">
            <PropertyValue
              value={node.foundedBy}
              getNode={getNode}
              onNodeLinkClick={onNodeLinkClick}
            />
          </span>
        </div>
      )}

      {/* Headquarters */}
      {node.headquarters && (
        <div className="node-infobox__field">
          <span className="node-infobox__label">Headquarters</span>
          <span className="node-infobox__value">
            <PropertyValue
              value={node.headquarters}
              getNode={getNode}
              onNodeLinkClick={onNodeLinkClick}
            />
          </span>
        </div>
      )}

      {/* Members */}
      {node.members && node.members.length > 0 && (
        <div className="node-infobox__field node-infobox__field--full">
          <span className="node-infobox__label">Members ({node.members.length})</span>
          <span className="node-infobox__value">
            <PropertyValue
              value={node.members}
              getNode={getNode}
              onNodeLinkClick={onNodeLinkClick}
            />
          </span>
        </div>
      )}
    </>
  );
}

/**
 * Get additional/custom properties (not in the known set)
 */
function getCustomProperties(node: GraphNode): [string, unknown][] {
  return Object.entries(node).filter(([key]) => !KNOWN_NODE_FIELDS.has(key));
}

function NodeInfobox({ node, onNodeLinkClick, getNode }: NodeInfoboxProps) {
  const customProperties = getCustomProperties(node);

  return (
    <div className="node-infobox">
      {/* Header with type badge and image */}
      <div className="node-infobox__header">
        <span className={getTypeBadgeClass(node.type)}>{node.type}</span>

        {node.imageUrl && (
          <div className="node-infobox__image-container">
            <img
              src={node.imageUrl}
              alt={node.title}
              className="node-infobox__image"
              loading="lazy"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Description */}
      {node.shortDescription && (
        <p className="node-infobox__description">{node.shortDescription}</p>
      )}

      {/* Common Fields Section */}
      <section className="node-infobox__section">
        {/* Dates */}
        {(node.dateStart || node.dateEnd) && (
          <div className="node-infobox__field">
            <span className="node-infobox__label">
              {node.type === 'person' ? 'Lifespan' : 'Dates'}
            </span>
            <span className="node-infobox__value">
              {node.dateStart && node.dateEnd
                ? `${formatDate(node.dateStart)} – ${formatDate(node.dateEnd)}`
                : node.dateStart
                ? formatDate(node.dateStart)
                : formatDate(node.dateEnd)}
            </span>
          </div>
        )}
        {/* ID field removed per GI17 - IDs are internal identifiers not meaningful to users */}
      </section>

      {/* Type-Specific Fields */}
      <section className="node-infobox__section">
        {isPersonNode(node) && (
          <PersonFields
            node={node}
            getNode={getNode}
            onNodeLinkClick={onNodeLinkClick}
          />
        )}
        {isObjectNode(node) && (
          <ObjectFields
            node={node}
            getNode={getNode}
            onNodeLinkClick={onNodeLinkClick}
          />
        )}
        {isLocationNode(node) && (
          <LocationFields
            node={node}
            getNode={getNode}
            onNodeLinkClick={onNodeLinkClick}
          />
        )}
        {isEntityNode(node) && (
          <EntityFields
            node={node}
            getNode={getNode}
            onNodeLinkClick={onNodeLinkClick}
          />
        )}
      </section>

      {/* External Links */}
      {node.externalLinks && node.externalLinks.length > 0 && (
        <ExternalLinksSection links={node.externalLinks} />
      )}

      {/* Additional/Custom Properties */}
      {customProperties.length > 0 && (
        <section className="node-infobox__section">
          <h3 className="node-infobox__section-title">Additional Properties</h3>
          {customProperties.map(([key, value]) => (
            <div key={key} className="node-infobox__field">
              <span className="node-infobox__label">{formatPropertyKey(key)}</span>
              <span className="node-infobox__value">
                <PropertyValue
                  value={value}
                  getNode={getNode}
                  onNodeLinkClick={onNodeLinkClick}
                />
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default NodeInfobox;
