/**
 * EdgeInfobox - Displays detailed information for a selected edge
 *
 * Shows all edge properties including:
 * - Relationship type and label
 * - Source and target nodes (as clickable links)
 * - Date range if present
 * - Evidence information prominently displayed
 * - All additional custom properties
 */

import type { GraphEdge, GraphNode } from '@types';
import { getEdgeLabel, hasEvidence } from '@types';

interface EdgeInfoboxProps {
  /** The edge to display */
  edge: GraphEdge;
  /** Handler for clicking internal node links */
  onNodeLinkClick: (nodeId: string) => void;
  /** Function to get a node by ID (for resolving references) */
  getNode: (id: string) => GraphNode | undefined;
  /** All nodes in the graph (for lookup) */
  nodes: GraphNode[];
}

/**
 * Known fields that we handle explicitly (not rendered in "Additional Properties")
 */
const KNOWN_EDGE_FIELDS = new Set([
  'id',
  'source',
  'target',
  'relationship',
  'label',
  'dateStart',
  'dateEnd',
  'evidence',
  'evidenceNodeId',
  'evidenceUrl',
  'directed',
  'strength',
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
 * Format relationship type for display
 */
function formatRelationship(relationship: string): string {
  return relationship
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
 * Get the color for relationship strength
 */
function getStrengthColor(strength: string): string {
  switch (strength) {
    case 'strong':
      return '#10b981'; // green
    case 'moderate':
      return '#3b82f6'; // blue
    case 'weak':
      return '#f59e0b'; // amber
    case 'speculative':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Render a clickable node link
 * Color-coded left border indicates node type (UX22)
 * Type label removed for cleaner display (UX23)
 */
function NodeLink({
  nodeId,
  getNode,
  onClick,
}: {
  nodeId: string;
  getNode: (id: string) => GraphNode | undefined;
  onClick: (nodeId: string) => void;
}) {
  const targetNode = getNode(nodeId);
  const displayLabel = targetNode?.title ?? nodeId;
  const nodeType = targetNode?.type;

  return (
    <button
      className={`edge-infobox__node-link ${nodeType ? `edge-infobox__node-link--${nodeType}` : ''}`}
      onClick={() => onClick(nodeId)}
      title={`View ${displayLabel}${nodeType ? ` (${nodeType})` : ''}`}
    >
      <span className="edge-infobox__node-link-title">{displayLabel}</span>
    </button>
  );
}

/**
 * Render the evidence section prominently
 */
function EvidenceSection({
  edge,
  getNode,
  onNodeLinkClick,
}: {
  edge: GraphEdge;
  getNode: (id: string) => GraphNode | undefined;
  onNodeLinkClick: (nodeId: string) => void;
}) {
  if (!hasEvidence(edge)) {
    return (
      <div className="edge-infobox__evidence edge-infobox__evidence--none">
        <div className="edge-infobox__evidence-header">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          <span>No Evidence Provided</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edge-infobox__evidence">
      <div className="edge-infobox__evidence-header">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Evidence</span>
      </div>

      {/* Text evidence */}
      {edge.evidence && (
        <p className="edge-infobox__evidence-text">{edge.evidence}</p>
      )}

      {/* Evidence from a node */}
      {edge.evidenceNodeId && (
        <div className="edge-infobox__evidence-node">
          <span className="edge-infobox__evidence-label">Source:</span>
          <NodeLink
            nodeId={edge.evidenceNodeId}
            getNode={getNode}
            onClick={onNodeLinkClick}
          />
        </div>
      )}

      {/* External evidence URL */}
      {edge.evidenceUrl && (
        <div className="edge-infobox__evidence-url">
          <span className="edge-infobox__evidence-label">Reference:</span>
          <a
            href={edge.evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="edge-infobox__external-link"
          >
            View Source
            <svg
              className="edge-infobox__external-icon"
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
        </div>
      )}
    </div>
  );
}

/**
 * Render a single property value (handles various types)
 */
function PropertyValue({ value }: { value: unknown }): JSX.Element {
  // Null/undefined
  if (value === null || value === undefined) {
    return <span className="edge-infobox__value--empty">—</span>;
  }

  // Boolean
  if (typeof value === 'boolean') {
    return <span>{value ? 'Yes' : 'No'}</span>;
  }

  // Number
  if (typeof value === 'number') {
    return <span>{value.toLocaleString()}</span>;
  }

  // String
  if (typeof value === 'string') {
    return <span>{value}</span>;
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="edge-infobox__value--empty">—</span>;
    }
    return (
      <ul className="edge-infobox__list">
        {value.map((item, index) => (
          <li key={index}>
            <PropertyValue value={item} />
          </li>
        ))}
      </ul>
    );
  }

  // Object (nested)
  if (typeof value === 'object') {
    return (
      <div className="edge-infobox__nested">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="edge-infobox__nested-item">
            <span className="edge-infobox__nested-key">{formatPropertyKey(key)}:</span>
            <span className="edge-infobox__nested-value">
              <PropertyValue value={val} />
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
 * Get additional/custom properties (not in the known set)
 */
function getCustomProperties(edge: GraphEdge): [string, unknown][] {
  return Object.entries(edge).filter(([key]) => !KNOWN_EDGE_FIELDS.has(key));
}

/**
 * Format edge description as a natural sentence (UX24)
 */
function formatEdgeDescription(edge: GraphEdge, getNode: (id: string) => GraphNode | undefined): string {
  const sourceName = getNode(edge.source)?.title ?? edge.source;
  const targetName = getNode(edge.target)?.title ?? edge.target;

  // Convert relationship to readable format (e.g., "influenced_by" -> "was influenced by")
  const relationship = edge.relationship.replace(/_/g, ' ');

  return `${sourceName} ${relationship} ${targetName}`;
}

function EdgeInfobox({ edge, onNodeLinkClick, getNode }: EdgeInfoboxProps) {
  const customProperties = getCustomProperties(edge);
  const displayLabel = getEdgeLabel(edge);

  return (
    <div className="edge-infobox">
      {/* Header with relationship type */}
      <div className="edge-infobox__header">
        <span className="edge-infobox__relationship-badge">
          {formatRelationship(edge.relationship)}
        </span>
        {edge.label && edge.label !== displayLabel && (
          <span className="edge-infobox__label">{edge.label}</span>
        )}
      </div>

      {/* Natural sentence description */}
      <p className="edge-infobox__description">
        {formatEdgeDescription(edge, getNode)}
      </p>

      {/* Connection visualization */}
      <div className="edge-infobox__connection">
        <div className="edge-infobox__connection-node">
          <span className="edge-infobox__connection-label">From</span>
          <NodeLink
            nodeId={edge.source}
            getNode={getNode}
            onClick={onNodeLinkClick}
          />
        </div>

        <div className="edge-infobox__connection-arrow">
          {edge.directed === false ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 12h8M8 12l3-3M8 12l3 3M16 12l-3-3M16 12l-3 3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          )}
        </div>

        <div className="edge-infobox__connection-node">
          <span className="edge-infobox__connection-label">To</span>
          <NodeLink
            nodeId={edge.target}
            getNode={getNode}
            onClick={onNodeLinkClick}
          />
        </div>
      </div>

      {/* Details Section */}
      <section className="edge-infobox__section">
        {/* Dates */}
        {(edge.dateStart || edge.dateEnd) && (
          <div className="edge-infobox__field">
            <span className="edge-infobox__field-label">Time Period</span>
            <span className="edge-infobox__field-value">
              {edge.dateStart && edge.dateEnd
                ? `${formatDate(edge.dateStart)} – ${formatDate(edge.dateEnd)}`
                : edge.dateStart
                ? `From ${formatDate(edge.dateStart)}`
                : `Until ${formatDate(edge.dateEnd)}`}
            </span>
          </div>
        )}

        {/* Strength */}
        {edge.strength && (
          <div className="edge-infobox__field">
            <span className="edge-infobox__field-label">Strength</span>
            <span
              className="edge-infobox__strength-badge"
              style={{ backgroundColor: getStrengthColor(edge.strength) }}
            >
              {edge.strength}
            </span>
          </div>
        )}

        {/* Directed */}
        <div className="edge-infobox__field">
          <span className="edge-infobox__field-label">Direction</span>
          <span className="edge-infobox__field-value">
            {edge.directed === false ? 'Bidirectional' : 'Directed'}
          </span>
        </div>

        {/* ID */}
        <div className="edge-infobox__field">
          <span className="edge-infobox__field-label">ID</span>
          <code className="edge-infobox__id">{edge.id}</code>
        </div>
      </section>

      {/* Evidence Section (prominent) */}
      <EvidenceSection
        edge={edge}
        getNode={getNode}
        onNodeLinkClick={onNodeLinkClick}
      />

      {/* Additional/Custom Properties */}
      {customProperties.length > 0 && (
        <section className="edge-infobox__section">
          <h3 className="edge-infobox__section-title">Additional Properties</h3>
          {customProperties.map(([key, value]) => (
            <div key={key} className="edge-infobox__field">
              <span className="edge-infobox__field-label">{formatPropertyKey(key)}</span>
              <span className="edge-infobox__field-value">
                <PropertyValue value={value} />
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default EdgeInfobox;
