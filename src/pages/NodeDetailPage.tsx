/**
 * NodeDetailPage - Standalone detail page for a node resource
 * 
 * URL: /#/{dataset-id}/node/{node-id}
 * 
 * Displays all node information similar to NodeInfobox but as a full page.
 * Includes navigation back to graph view and share buttons.
 */

import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { GraphNode, GraphData, DatasetManifest } from '@types';
import { isPersonNode, isObjectNode, isLocationNode, isEntityNode } from '@types';
import { loadDataset, isValidDatasetId } from '@utils/dataLoader';
import { sanitizeUrl, isValidImageUrl } from '@utils';
import { useResourceParams, buildFullNodeUrl, buildGraphViewUrl } from '@hooks/useResourceParams';
import ResourceMeta from '@components/ResourceMeta';
import SchemaOrg from '@components/SchemaOrg';
import ShareButtons from '@components/ShareButtons';
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
    // Fall through to return as-is
  }
  return date;
}

/**
 * Get type badge class
 */
function getTypeBadgeClass(type: string): string {
  return `resource-detail__type-badge resource-detail__type-badge--${type}`;
}

function NodeDetailPage() {
  const params = useResourceParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [node, setNode] = useState<GraphNode | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [manifest, setManifest] = useState<DatasetManifest | null>(null);

  // REACT: All hooks must be called unconditionally before any returns (R8)
  // Extract datasetId and nodeId safely (with fallbacks for invalid params)
  const datasetId = params.type === 'node' ? params.datasetId : '';
  const nodeId = params.type === 'node' ? params.nodeId : '';

  // Load dataset and find node
  useEffect(() => {
    // Skip loading if params are invalid
    if (params.type !== 'node') return;
    
    const controller = new AbortController();
    
    async function loadData() {
      setLoading(true);
      setError(null);
      
      // Validate dataset ID
      if (!isValidDatasetId(datasetId)) {
        setError(`Dataset "${datasetId}" not found`);
        setLoading(false);
        return;
      }

      try {
        const dataset = await loadDataset(datasetId);
        
        // Check if aborted
        if (controller.signal.aborted) return;
        
        setManifest(dataset.manifest);
        setGraphData(dataset.data);
        
        // Find the node
        const foundNode = dataset.data.nodes.find((n: GraphNode) => n.id === nodeId);
        if (!foundNode) {
          setError(`Node "${nodeId}" not found in dataset "${datasetId}"`);
        } else {
          setNode(foundNode);
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
  }, [params.type, datasetId, nodeId]);

  // Handler for clicking internal node links
  const handleNodeLinkClick = useCallback((linkedNodeId: string) => {
    navigate(`/${datasetId}/node/${linkedNodeId}`);
  }, [datasetId, navigate]);

  // Get node by ID for resolving references
  const getNode = useCallback((id: string): GraphNode | undefined => {
    return graphData?.nodes.find(n => n.id === id);
  }, [graphData]);

  // Handle invalid params (after all hooks)
  if (params.type === 'invalid') {
    return <NotFoundPage message={params.error} />;
  }

  if (params.type !== 'node') {
    return <NotFoundPage message="Invalid route for node detail page" />;
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

  // Error state
  if (error || !node || !manifest) {
    return <NotFoundPage message={error || 'Node not found'} datasetId={datasetId} />;
  }

  // Build URLs
  const fullUrl = buildFullNodeUrl(datasetId, nodeId);
  const graphViewUrl = buildGraphViewUrl(datasetId, 'node', nodeId);

  return (
    <div className="resource-detail">
      <ResourceMeta
        title={node.title}
        description={node.shortDescription}
        datasetName={manifest.name}
        imageUrl={node.imageUrl}
        canonicalUrl={fullUrl}
        ogType={node.type === 'person' ? 'profile' : 'article'}
        publishedDate={node.dateStart}
      />
      <SchemaOrg
        node={node}
        datasetId={datasetId}
        datasetName={manifest.name}
      />

      {/* Breadcrumb Navigation */}
      <nav className="resource-detail__breadcrumb" aria-label="Breadcrumb">
        <Link to={`/?dataset=${encodeURIComponent(datasetId)}`} className="resource-detail__breadcrumb-link">
          {manifest.name}
        </Link>
        <span className="resource-detail__breadcrumb-separator" aria-hidden="true">›</span>
        <span className="resource-detail__breadcrumb-type">{node.type}</span>
        <span className="resource-detail__breadcrumb-separator" aria-hidden="true">›</span>
        <span className="resource-detail__breadcrumb-current">{node.title}</span>
      </nav>

      {/* Header */}
      <header className="resource-detail__header">
        <div className="resource-detail__header-content">
          <span className={getTypeBadgeClass(node.type)}>{node.type}</span>
          <h1 className="resource-detail__title">{node.title}</h1>
          {node.shortDescription && (
            <p className="resource-detail__description">{node.shortDescription}</p>
          )}
        </div>
        
        {/* SECURITY: validate image URL (F4/F6) */}
        {node.imageUrl && isValidImageUrl(node.imageUrl) && (
          <div className="resource-detail__image-container">
            <img
              src={node.imageUrl}
              alt={node.title}
              className="resource-detail__image"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
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
        <ShareButtons
          url={fullUrl}
          title={node.title}
          description={node.shortDescription}
          variant="inline"
          size="medium"
        />
      </div>

      {/* Content */}
      <main className="resource-detail__content">
        {/* Dates */}
        {(node.dateStart || node.dateEnd) && (
          <section className="resource-detail__section">
            <h2 className="resource-detail__section-title">
              {node.type === 'person' ? 'Lifespan' : 'Dates'}
            </h2>
            <p className="resource-detail__text">
              {node.dateStart && node.dateEnd
                ? `${formatDate(node.dateStart)} – ${formatDate(node.dateEnd)}`
                : node.dateStart
                ? formatDate(node.dateStart)
                : formatDate(node.dateEnd)}
            </p>
          </section>
        )}

        {/* Type-specific fields */}
        {isPersonNode(node) && (
          <>
            {node.alternateNames && node.alternateNames.length > 0 && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Also Known As</h2>
                <p className="resource-detail__text">{node.alternateNames.join(', ')}</p>
              </section>
            )}
            {node.nationality && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Nationality</h2>
                <p className="resource-detail__text">{node.nationality}</p>
              </section>
            )}
            {node.occupations && node.occupations.length > 0 && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Occupations</h2>
                <p className="resource-detail__text">{node.occupations.join(', ')}</p>
              </section>
            )}
            {node.birthPlace && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Birth Place</h2>
                <p className="resource-detail__text">
                  {typeof node.birthPlace === 'string' ? (
                    getNode(node.birthPlace) ? (
                      <button 
                        className="resource-detail__node-link"
                        onClick={() => handleNodeLinkClick(node.birthPlace as string)}
                      >
                        {getNode(node.birthPlace)?.title || node.birthPlace}
                      </button>
                    ) : node.birthPlace
                  ) : node.birthPlace}
                </p>
              </section>
            )}
            {node.deathPlace && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Death Place</h2>
                <p className="resource-detail__text">
                  {typeof node.deathPlace === 'string' ? (
                    getNode(node.deathPlace) ? (
                      <button 
                        className="resource-detail__node-link"
                        onClick={() => handleNodeLinkClick(node.deathPlace as string)}
                      >
                        {getNode(node.deathPlace)?.title || node.deathPlace}
                      </button>
                    ) : node.deathPlace
                  ) : node.deathPlace}
                </p>
              </section>
            )}
            {node.biography && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Biography</h2>
                <p className="resource-detail__text resource-detail__text--long">{node.biography}</p>
              </section>
            )}
          </>
        )}

        {isObjectNode(node) && (
          <>
            {node.objectType && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Object Type</h2>
                <p className="resource-detail__text">{node.objectType}</p>
              </section>
            )}
            {node.creators && node.creators.length > 0 && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Creators</h2>
                <ul className="resource-detail__list">
                  {node.creators.map((creator, index) => (
                    <li key={typeof creator === 'string' ? creator : index}>
                      {typeof creator === 'string' && getNode(creator) ? (
                        <button 
                          className="resource-detail__node-link"
                          onClick={() => handleNodeLinkClick(creator)}
                        >
                          {getNode(creator)?.title || creator}
                        </button>
                      ) : (
                        String(creator)
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {node.dateCreated && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Date Created</h2>
                <p className="resource-detail__text">{formatDate(node.dateCreated)}</p>
              </section>
            )}
            {node.language && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Language</h2>
                <p className="resource-detail__text">{node.language}</p>
              </section>
            )}
            {node.subject && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Subject</h2>
                <p className="resource-detail__text">{node.subject}</p>
              </section>
            )}
          </>
        )}

        {isLocationNode(node) && (
          <>
            {node.locationType && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Location Type</h2>
                <p className="resource-detail__text">{node.locationType}</p>
              </section>
            )}
            {node.country && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Country</h2>
                <p className="resource-detail__text">{node.country}</p>
              </section>
            )}
            {node.parentLocation && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Parent Location</h2>
                <p className="resource-detail__text">
                  {typeof node.parentLocation === 'string' && getNode(node.parentLocation) ? (
                    <button 
                      className="resource-detail__node-link"
                      onClick={() => handleNodeLinkClick(node.parentLocation as string)}
                    >
                      {getNode(node.parentLocation)?.title || node.parentLocation}
                    </button>
                  ) : (
                    String(node.parentLocation)
                  )}
                </p>
              </section>
            )}
            {node.coordinates && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Coordinates</h2>
                <p className="resource-detail__text">
                  {node.coordinates.lat.toFixed(4)}, {node.coordinates.lng.toFixed(4)}
                </p>
              </section>
            )}
          </>
        )}

        {isEntityNode(node) && (
          <>
            {node.entityType && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Entity Type</h2>
                <p className="resource-detail__text">{node.entityType}</p>
              </section>
            )}
            {node.foundedBy && node.foundedBy.length > 0 && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Founded By</h2>
                <ul className="resource-detail__list">
                  {node.foundedBy.map((founder, index) => (
                    <li key={typeof founder === 'string' ? founder : index}>
                      {typeof founder === 'string' && getNode(founder) ? (
                        <button 
                          className="resource-detail__node-link"
                          onClick={() => handleNodeLinkClick(founder)}
                        >
                          {getNode(founder)?.title || founder}
                        </button>
                      ) : (
                        String(founder)
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {node.headquarters && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Headquarters</h2>
                <p className="resource-detail__text">
                  {typeof node.headquarters === 'string' && getNode(node.headquarters) ? (
                    <button 
                      className="resource-detail__node-link"
                      onClick={() => handleNodeLinkClick(node.headquarters as string)}
                    >
                      {getNode(node.headquarters)?.title || node.headquarters}
                    </button>
                  ) : (
                    String(node.headquarters)
                  )}
                </p>
              </section>
            )}
            {node.members && node.members.length > 0 && (
              <section className="resource-detail__section">
                <h2 className="resource-detail__section-title">Members ({node.members.length})</h2>
                <ul className="resource-detail__list">
                  {node.members.map((member, index) => (
                    <li key={typeof member === 'string' ? member : index}>
                      {typeof member === 'string' && getNode(member) ? (
                        <button 
                          className="resource-detail__node-link"
                          onClick={() => handleNodeLinkClick(member)}
                        >
                          {getNode(member)?.title || member}
                        </button>
                      ) : (
                        String(member)
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {/* External Links */}
        {node.externalLinks && node.externalLinks.length > 0 && (
          <section className="resource-detail__section">
            <h2 className="resource-detail__section-title">External Links</h2>
            <ul className="resource-detail__external-links">
              {node.externalLinks.map((link) => (
                <li key={link.url}>
                  <a
                    // SECURITY: sanitized URL (F4/F6)
                    href={sanitizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-detail__external-link"
                  >
                    {link.label}
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
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default NodeDetailPage;
