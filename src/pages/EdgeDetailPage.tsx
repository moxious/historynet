/**
 * EdgeDetailPage - Standalone detail page for edges between two nodes
 * 
 * URL: /#/{dataset-id}/from/{source-id}/to/{target-id}
 * 
 * Displays all edges between the source and target nodes.
 * Includes summary cards for both nodes and navigation to graph view.
 */

import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { GraphNode, GraphEdge, GraphData, DatasetManifest } from '@types';
import { hasEvidence } from '@types';
import { loadDataset, isValidDatasetId } from '@utils/dataLoader';
import { sanitizeUrl, isValidImageUrl } from '@utils';
import { useResourceParams, buildFullEdgeUrl, buildGraphViewUrl } from '@hooks/useResourceParams';
import ResourceMeta from '@components/ResourceMeta';
import NotFoundPage from './NotFoundPage';
import './ResourceDetailPage.css';

/**
 * Format a date string for display
 */
function formatDate(date: string | undefined): string {
  if (!date) return '';
  if (/^\d{4}$/.test(date)) return date;
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
    // Fall through
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
 * Format edge as natural language description
 */
function formatEdgeDescription(
  edge: GraphEdge,
  sourceNode: GraphNode | undefined,
  targetNode: GraphNode | undefined
): string {
  const sourceName = sourceNode?.title ?? edge.source;
  const targetName = targetNode?.title ?? edge.target;
  const relationship = edge.relationship.replace(/_/g, ' ');
  return `${sourceName} ${relationship} ${targetName}`;
}

/**
 * Get strength badge color
 */
function getStrengthColor(strength: string): string {
  switch (strength) {
    case 'strong': return '#10b981';
    case 'moderate': return '#3b82f6';
    case 'weak': return '#f59e0b';
    case 'speculative': return '#ef4444';
    default: return '#6b7280';
  }
}

/**
 * Node summary card component
 */
function NodeCard({
  node,
  label,
  datasetId,
}: {
  node: GraphNode | undefined;
  label: string;
  datasetId: string;
}) {
  if (!node) {
    return (
      <div className="edge-detail__node-card edge-detail__node-card--missing">
        <span className="edge-detail__node-card-label">{label}</span>
        <span className="edge-detail__node-card-name">Node not found</span>
      </div>
    );
  }

  return (
    <Link 
      to={`/${datasetId}/node/${node.id}`}
      className={`edge-detail__node-card edge-detail__node-card--${node.type}`}
    >
      {/* SECURITY: validate image URL (F4/F6) */}
      {node.imageUrl && isValidImageUrl(node.imageUrl) && (
        <div className="edge-detail__node-card-image">
          <img
            src={node.imageUrl}
            alt={node.title}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="edge-detail__node-card-content">
        <span className="edge-detail__node-card-label">{label}</span>
        <span className="edge-detail__node-card-name">{node.title}</span>
        <span className="edge-detail__node-card-type">{node.type}</span>
      </div>
    </Link>
  );
}

/**
 * Single edge detail component
 */
function EdgeCard({
  edge,
  sourceNode,
  targetNode,
  getNode,
  onNodeClick,
}: {
  edge: GraphEdge;
  sourceNode: GraphNode | undefined;
  targetNode: GraphNode | undefined;
  getNode: (id: string) => GraphNode | undefined;
  onNodeClick: (nodeId: string) => void;
}) {
  return (
    <div className="edge-detail__edge-card">
      {/* Relationship badge */}
      <div className="edge-detail__edge-card-header">
        <span className="edge-detail__relationship-badge">
          {formatRelationship(edge.relationship)}
        </span>
        {edge.strength && (
          <span
            className="edge-detail__strength-badge"
            style={{ backgroundColor: getStrengthColor(edge.strength) }}
          >
            {edge.strength}
          </span>
        )}
      </div>

      {/* Natural language description */}
      <p className="edge-detail__edge-description">
        {formatEdgeDescription(edge, sourceNode, targetNode)}
      </p>

      {/* Date range */}
      {(edge.dateStart || edge.dateEnd) && (
        <div className="edge-detail__edge-field">
          <span className="edge-detail__edge-field-label">Time Period</span>
          <span className="edge-detail__edge-field-value">
            {edge.dateStart && edge.dateEnd
              ? `${formatDate(edge.dateStart)} – ${formatDate(edge.dateEnd)}`
              : edge.dateStart
              ? `From ${formatDate(edge.dateStart)}`
              : `Until ${formatDate(edge.dateEnd)}`}
          </span>
        </div>
      )}

      {/* Direction */}
      <div className="edge-detail__edge-field">
        <span className="edge-detail__edge-field-label">Direction</span>
        <span className="edge-detail__edge-field-value">
          {edge.directed === false ? 'Bidirectional' : 'Directed'}
        </span>
      </div>

      {/* Evidence section */}
      <div className={`edge-detail__evidence ${hasEvidence(edge) ? '' : 'edge-detail__evidence--none'}`}>
        <div className="edge-detail__evidence-header">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {hasEvidence(edge) ? (
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </>
            )}
          </svg>
          <span>{hasEvidence(edge) ? 'Evidence' : 'No Evidence Provided'}</span>
        </div>

        {edge.evidence && (
          <p className="edge-detail__evidence-text">{edge.evidence}</p>
        )}

        {edge.evidenceNodeId && (
          <div className="edge-detail__evidence-source">
            <span className="edge-detail__evidence-label">Source:</span>
            <button
              className="edge-detail__node-link"
              onClick={() => onNodeClick(edge.evidenceNodeId!)}
            >
              {getNode(edge.evidenceNodeId)?.title || edge.evidenceNodeId}
            </button>
          </div>
        )}

        {edge.evidenceUrl && (
          <div className="edge-detail__evidence-url">
            <span className="edge-detail__evidence-label">Reference:</span>
            <a
              // SECURITY: sanitized URL (F4/F6)
              href={sanitizeUrl(edge.evidenceUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="edge-detail__external-link"
            >
              View Source
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function EdgeDetailPage() {
  const params = useResourceParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [sourceNode, setSourceNode] = useState<GraphNode | undefined>();
  const [targetNode, setTargetNode] = useState<GraphNode | undefined>();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [manifest, setManifest] = useState<DatasetManifest | null>(null);

  // REACT: All hooks must be called unconditionally before any returns (R8)
  // Extract params safely (with fallbacks for invalid params)
  const datasetId = params.type === 'edge' ? params.datasetId : '';
  const sourceId = params.type === 'edge' ? params.sourceId : '';
  const targetId = params.type === 'edge' ? params.targetId : '';

  // Load dataset and find edges
  useEffect(() => {
    // Skip loading if params are invalid
    if (params.type !== 'edge') return;
    
    const controller = new AbortController();
    
    async function loadData() {
      setLoading(true);
      setError(null);
      
      if (!isValidDatasetId(datasetId)) {
        setError(`Dataset "${datasetId}" not found`);
        setLoading(false);
        return;
      }

      try {
        const dataset = await loadDataset(datasetId);
        
        if (controller.signal.aborted) return;
        
        setManifest(dataset.manifest);
        setGraphData(dataset.data);
        
        // Find source and target nodes
        const source = dataset.data.nodes.find((n: GraphNode) => n.id === sourceId);
        const target = dataset.data.nodes.find((n: GraphNode) => n.id === targetId);
        
        setSourceNode(source);
        setTargetNode(target);
        
        // Find all edges between source and target (in either direction)
        const foundEdges = dataset.data.edges.filter((e: GraphEdge) =>
          (e.source === sourceId && e.target === targetId) ||
          (e.source === targetId && e.target === sourceId)
        );
        
        setEdges(foundEdges);
        
        // Check for errors
        if (!source && !target) {
          setError(`Neither "${sourceId}" nor "${targetId}" found in dataset`);
        } else if (!source) {
          setError(`Source node "${sourceId}" not found in dataset`);
        } else if (!target) {
          setError(`Target node "${targetId}" not found in dataset`);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load dataset');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    loadData();
    
    // REACT: cleanup on unmount (R4)
    return () => controller.abort();
  }, [params.type, datasetId, sourceId, targetId]);

  // Handler for clicking node links
  const handleNodeClick = useCallback((nodeId: string) => {
    navigate(`/${datasetId}/node/${nodeId}`);
  }, [datasetId, navigate]);

  // Get node by ID
  const getNode = useCallback((id: string): GraphNode | undefined => {
    return graphData?.nodes.find(n => n.id === id);
  }, [graphData]);

  // Handle invalid params (after all hooks)
  if (params.type === 'invalid') {
    return <NotFoundPage message={params.error} />;
  }

  if (params.type !== 'edge') {
    return <NotFoundPage message="Invalid route for edge detail page" />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="resource-detail resource-detail--loading">
        <div className="resource-detail__spinner" aria-hidden="true" />
        <p>Loading...</p>
      </div>
    );
  }

  // Error state (both nodes missing)
  if (error && !sourceNode && !targetNode) {
    return <NotFoundPage message={error} datasetId={datasetId} />;
  }

  // Build URLs
  const fullUrl = buildFullEdgeUrl(datasetId, sourceId, targetId);
  
  // For graph view, use the first edge if available
  const firstEdge = edges[0];
  const graphViewUrl = firstEdge
    ? buildGraphViewUrl(datasetId, 'edge', firstEdge.id)
    : `/${encodeURIComponent(datasetId)}/explore`;

  // Build page title
  const sourceName = sourceNode?.title || sourceId;
  const targetName = targetNode?.title || targetId;
  const pageTitle = `${sourceName} → ${targetName}`;
  const pageDescription = edges.length > 0
    ? `${edges.length} relationship${edges.length === 1 ? '' : 's'} between ${sourceName} and ${targetName}`
    : `Relationship between ${sourceName} and ${targetName}`;

  return (
    <div className="resource-detail edge-detail">
      <ResourceMeta
        title={pageTitle}
        description={pageDescription}
        datasetName={manifest?.name || datasetId}
        canonicalUrl={fullUrl}
        ogType="article"
        publishedDate={firstEdge?.dateStart}
      />

      {/* Breadcrumb Navigation */}
      <nav className="resource-detail__breadcrumb" aria-label="Breadcrumb">
        <Link to={`/${encodeURIComponent(datasetId)}`} className="resource-detail__breadcrumb-link">
          {manifest?.name || datasetId}
        </Link>
        <span className="resource-detail__breadcrumb-separator" aria-hidden="true">›</span>
        <span className="resource-detail__breadcrumb-current">Relationship</span>
      </nav>

      {/* Header */}
      <header className="resource-detail__header">
        <div className="resource-detail__header-content">
          <span className="resource-detail__type-badge resource-detail__type-badge--relationship">
            Relationship
          </span>
          <h1 className="resource-detail__title">{pageTitle}</h1>
          <p className="resource-detail__description">{pageDescription}</p>
        </div>
      </header>

      {/* Actions Bar */}
      <div className="resource-detail__actions">
        <Link to={graphViewUrl} className="resource-detail__action-button resource-detail__action-button--primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          View in Graph
        </Link>
      </div>

      {/* Node Cards */}
      <div className="edge-detail__nodes">
        <NodeCard node={sourceNode} label="From" datasetId={datasetId} />
        <div className="edge-detail__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
        <NodeCard node={targetNode} label="To" datasetId={datasetId} />
      </div>

      {/* Edges Content */}
      <main className="resource-detail__content">
        {edges.length === 0 ? (
          <div className="edge-detail__no-edges">
            <p>No direct relationships found between these nodes.</p>
            <p className="edge-detail__no-edges-hint">
              They may be connected through other nodes in the network.
            </p>
          </div>
        ) : (
          <section className="edge-detail__edges-section">
            <h2 className="resource-detail__section-title">
              {edges.length === 1 ? 'Relationship' : `${edges.length} Relationships`}
            </h2>
            <div className="edge-detail__edges-list">
              {edges.map((edge) => (
                <EdgeCard
                  key={edge.id}
                  edge={edge}
                  sourceNode={sourceNode}
                  targetNode={targetNode}
                  getNode={getNode}
                  onNodeClick={handleNodeClick}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default EdgeDetailPage;
