/**
 * CrossSceneTeaser Component
 *
 * Minimal teaser shown in the NodeInfobox when a node appears in multiple datasets.
 * Invites users to explore full cross-scene connections on the node detail page.
 *
 * Design:
 * - Desktop: "🌐 Appears in N other networks" + "View connections →"
 * - Mobile: Compact format "🌐 In N networks →"
 * - Links to node detail page where full cross-scene section is shown
 * - Only renders when node appears in 2+ datasets
 */

import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { buildNodeUrl } from '@utils/urlBuilder';
import { formatNetworksCount } from '@utils/crossScene';
import { trackEvent } from '@utils/analytics';
import './CrossSceneTeaser.css';

interface CrossSceneTeaserProps {
  /**
   * Number of OTHER networks (excluding current)
   */
  otherNetworksCount: number;

  /**
   * Current dataset ID
   */
  datasetId: string;

  /**
   * Node ID in current dataset
   */
  nodeId: string;

  /**
   * Optional class name
   */
  className?: string;
}

/**
 * Teaser component for cross-scene discovery in the infobox
 */
export function CrossSceneTeaser({
  otherNetworksCount,
  datasetId,
  nodeId,
  className = '',
}: CrossSceneTeaserProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Don't render if no other networks
  if (otherNetworksCount === 0) {
    return null;
  }

  const nodeDetailUrl = buildNodeUrl(datasetId, nodeId);

  // Track teaser clicks
  const handleClick = useCallback(() => {
    trackEvent('CrossScene', 'teaser_click', datasetId);
  }, [datasetId]);

  // Mobile: compact format
  if (isMobile) {
    return (
      <Link
        to={nodeDetailUrl}
        onClick={handleClick}
        className={`cross-scene-teaser cross-scene-teaser--mobile ${className}`}
      >
        <span className="cross-scene-teaser__icon">🌐</span>
        <span className="cross-scene-teaser__text">
          In {otherNetworksCount} {otherNetworksCount === 1 ? 'network' : 'networks'}
        </span>
        <span className="cross-scene-teaser__arrow">→</span>
      </Link>
    );
  }

  // Desktop: full format
  return (
    <Link
      to={nodeDetailUrl}
      onClick={handleClick}
      className={`cross-scene-teaser cross-scene-teaser--desktop ${className}`}
    >
      <div className="cross-scene-teaser__content">
        <span className="cross-scene-teaser__icon">🌐</span>
        <span className="cross-scene-teaser__text">
          Appears in {formatNetworksCount(otherNetworksCount)}
        </span>
      </div>
      <span className="cross-scene-teaser__link">
        View connections →
      </span>
    </Link>
  );
}

/**
 * Loading skeleton for CrossSceneTeaser
 */
export function CrossSceneTeaserSkeleton({ className = '' }: { className?: string }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className={`cross-scene-teaser cross-scene-teaser--mobile cross-scene-teaser--loading ${className}`}>
        <span className="cross-scene-teaser__icon">🌐</span>
        <span className="cross-scene-teaser__skeleton" />
      </div>
    );
  }

  return (
    <div className={`cross-scene-teaser cross-scene-teaser--desktop cross-scene-teaser--loading ${className}`}>
      <div className="cross-scene-teaser__content">
        <span className="cross-scene-teaser__icon">🌐</span>
        <span className="cross-scene-teaser__skeleton" />
      </div>
    </div>
  );
}
