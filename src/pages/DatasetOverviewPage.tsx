/**
 * DatasetOverviewPage - Narrative overview page for a dataset
 * 
 * URL: /#/{datasetId}
 * 
 * Provides a gentler entry point than the graph visualization.
 * Displays dataset metadata and most connected items by POLE type.
 */

import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { DatasetManifest, GraphData } from '@types';
import { loadDataset, isValidDatasetId, getPublicAssetUrl } from '@utils/dataLoader';
import { buildExploreUrl, buildNodeUrl, buildFullDatasetUrl } from '@utils/urlBuilder';
import { useTopConnectedNodes, getTypeLabel, getTypeIcon, TopConnectedByType } from '@hooks/useTopConnectedNodes';
import NotFoundPage from './NotFoundPage';
import './DatasetOverviewPage.css';

/**
 * Get temporal range display string from manifest
 */
function getTemporalRange(manifest: DatasetManifest): string | null {
  if (manifest.scope?.startYear && manifest.scope?.endYear) {
    return `${manifest.scope.startYear}–${manifest.scope.endYear}`;
  }
  if (manifest.temporalScope) {
    return manifest.temporalScope.replace('-', '–');
  }
  return null;
}

/**
 * TopConnectedSection - Display top connected nodes for a POLE type
 */
interface TopConnectedSectionProps {
  type: keyof TopConnectedByType;
  items: { node: { id: string; title: string }; degree: number }[];
  datasetId: string;
}

function TopConnectedSection({ type, items, datasetId }: TopConnectedSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="dataset-overview__pole-column">
      <h3 className="dataset-overview__pole-header">
        <span className="dataset-overview__pole-icon" aria-hidden="true">
          {getTypeIcon(type)}
        </span>
        {getTypeLabel(type)}
      </h3>
      <ul className="dataset-overview__pole-list">
        {items.map(({ node, degree }) => (
          <li key={node.id} className="dataset-overview__pole-item">
            <Link
              to={buildNodeUrl(datasetId, node.id)}
              className="dataset-overview__pole-link"
            >
              {node.title}
            </Link>
            <Link
              to={buildExploreUrl(datasetId, {
                selected: node.id,
                type: 'node',
                layout: 'graph',
              })}
              className="dataset-overview__explore-link"
              title={`Explore ${node.title} in graph`}
              aria-label={`Explore ${node.title} in graph view`}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>
            <span className="dataset-overview__pole-degree" title={`${degree} connections`}>
              {degree}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DatasetOverviewPage() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manifest, setManifest] = useState<DatasetManifest | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  // Load dataset
  useEffect(() => {
    if (!datasetId) {
      setError('No dataset specified');
      setLoading(false);
      return;
    }

    if (!isValidDatasetId(datasetId)) {
      setError(`Dataset "${datasetId}" not found`);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const dataset = await loadDataset(datasetId!, controller.signal);
        
        if (controller.signal.aborted) return;
        
        setManifest(dataset.manifest);
        setGraphData(dataset.data);
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

    return () => controller.abort();
  }, [datasetId]);

  // Calculate top connected nodes
  const topConnected = useTopConnectedNodes(
    graphData?.nodes || [],
    graphData?.edges || [],
    5
  );

  // Pick a random node for the "Discover Random" button
  const randomNode = useMemo(() => {
    if (!graphData?.nodes?.length) return null;
    const idx = Math.floor(Math.random() * graphData.nodes.length);
    return graphData.nodes[idx];
  }, [graphData]);

  // Loading state
  if (loading) {
    return (
      <div className="dataset-overview dataset-overview--loading">
        <div className="dataset-overview__spinner" aria-hidden="true" />
        <p>Loading dataset...</p>
      </div>
    );
  }

  // Error state
  if (error || !manifest || !datasetId) {
    return <NotFoundPage message={error || 'Dataset not found'} />;
  }

  const temporalRange = getTemporalRange(manifest);
  const bannerEmoji = manifest.bannerEmoji || '❓';
  const fullUrl = buildFullDatasetUrl(datasetId);

  return (
    <div className="dataset-overview">
      <Helmet>
        <title>{manifest.name} | Scenius</title>
        <meta name="description" content={manifest.description} />
        <link rel="canonical" href={fullUrl} />
        <meta property="og:title" content={`${manifest.name} | Scenius`} />
        <meta property="og:description" content={manifest.description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Back navigation */}
      <nav className="dataset-overview__breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="dataset-overview__back-link">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All Datasets
        </Link>
      </nav>

      {/* Banner Section */}
      <header className="dataset-overview__header">
        {/* Banner image or emoji fallback */}
        {manifest.bannerImage ? (
          <div className="dataset-overview__banner-image-container">
            <img
              src={getPublicAssetUrl(manifest.bannerImage)}
              alt={`${manifest.name} banner`}
              className="dataset-overview__banner-image"
            />
          </div>
        ) : (
          <div className="dataset-overview__banner-emoji" aria-hidden="true">
            {bannerEmoji}
          </div>
        )}
        
        <div className="dataset-overview__header-content">
          <h1 className="dataset-overview__title">{manifest.name}</h1>
          <p className="dataset-overview__description">{manifest.description}</p>
          
          {/* Metadata */}
          <div className="dataset-overview__meta">
            {temporalRange && (
              <span className="dataset-overview__meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {temporalRange}
              </span>
            )}
            {manifest.nodeCount !== undefined && (
              <span className="dataset-overview__meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="5" cy="6" r="2" />
                  <circle cx="19" cy="6" r="2" />
                  <circle cx="5" cy="18" r="2" />
                  <circle cx="19" cy="18" r="2" />
                  <line x1="9.5" y1="10" x2="6.5" y2="7.5" />
                  <line x1="14.5" y1="10" x2="17.5" y2="7.5" />
                  <line x1="9.5" y1="14" x2="6.5" y2="16.5" />
                  <line x1="14.5" y1="14" x2="17.5" y2="16.5" />
                </svg>
                {manifest.nodeCount} nodes
              </span>
            )}
            {manifest.edgeCount !== undefined && (
              <span className="dataset-overview__meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12,5 19,12 12,19" />
                </svg>
                {manifest.edgeCount} connections
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="dataset-overview__cta-group">
            <Link
              to={buildExploreUrl(datasetId)}
              className="dataset-overview__explore-button"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="6" r="2" />
                <circle cx="19" cy="6" r="2" />
                <circle cx="5" cy="18" r="2" />
                <circle cx="19" cy="18" r="2" />
                <line x1="9.5" y1="10" x2="6.5" y2="7.5" />
                <line x1="14.5" y1="10" x2="17.5" y2="7.5" />
                <line x1="9.5" y1="14" x2="6.5" y2="16.5" />
                <line x1="14.5" y1="14" x2="17.5" y2="16.5" />
              </svg>
              Explore Network
            </Link>
            {randomNode && (
              <Link
                to={buildNodeUrl(datasetId, randomNode.id)}
                className="dataset-overview__random-button"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="4" y="4" width="6" height="6" rx="1" />
                  <rect x="14" y="4" width="6" height="6" rx="1" />
                  <rect x="4" y="14" width="6" height="6" rx="1" />
                  <rect x="14" y="14" width="6" height="6" rx="1" />
                  <circle cx="7" cy="7" r="1" fill="currentColor" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" />
                  <circle cx="15" cy="17" r="1" fill="currentColor" />
                  <circle cx="19" cy="17" r="1" fill="currentColor" />
                  <circle cx="7" cy="17" r="1" fill="currentColor" />
                </svg>
                Discover Random Node
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Most Connected Items */}
      <main className="dataset-overview__content">
        <section className="dataset-overview__pole-section">
          <h2 className="dataset-overview__section-title">Most Connected</h2>
          <p className="dataset-overview__section-description">
            Key figures and elements in this network, ranked by number of connections.
          </p>
          <div className="dataset-overview__pole-grid">
            <TopConnectedSection type="person" items={topConnected.person} datasetId={datasetId} />
            <TopConnectedSection type="object" items={topConnected.object} datasetId={datasetId} />
            <TopConnectedSection type="location" items={topConnected.location} datasetId={datasetId} />
            <TopConnectedSection type="entity" items={topConnected.entity} datasetId={datasetId} />
          </div>
        </section>

        {/* Dataset Info Footer */}
        <footer className="dataset-overview__footer">
          <div className="dataset-overview__footer-info">
            {manifest.author && (
              <p className="dataset-overview__footer-item">
                <strong>Author:</strong> {manifest.author}
              </p>
            )}
            {manifest.version && (
              <p className="dataset-overview__footer-item">
                <strong>Version:</strong> {manifest.version}
              </p>
            )}
            {manifest.lastUpdated && (
              <p className="dataset-overview__footer-item">
                <strong>Last Updated:</strong> {manifest.lastUpdated}
              </p>
            )}
            {manifest.license && (
              <p className="dataset-overview__footer-item">
                <strong>License:</strong> {manifest.license}
              </p>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}

export default DatasetOverviewPage;
