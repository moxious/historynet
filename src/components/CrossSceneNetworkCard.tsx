/**
 * CrossSceneNetworkCard Component
 *
 * Card showing a network where the current entity also appears.
 * Displays the network name, a brief description, and links to the node in that network.
 *
 * Design:
 * - Network name as heading
 * - Truncated description (~80 chars)
 * - Clickable card navigates to node detail page in target dataset
 * - Arrow indicator for navigation affordance
 */

import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { buildCrossSceneNodeUrl } from '@utils/crossScene';
import { trackEvent } from '@utils/analytics';
import type { CrossSceneAppearance } from '@contexts/CrossSceneContext';
import './CrossSceneNetworkCard.css';

interface CrossSceneNetworkCardProps {
  /**
   * The appearance/dataset where this entity appears
   */
  appearance: CrossSceneAppearance;

  /**
   * Optional: current dataset ID for analytics tracking
   */
  sourceDatasetId?: string;

  /**
   * Optional class name
   */
  className?: string;
}

/**
 * Card component displaying a network where the entity appears
 */
export function CrossSceneNetworkCard({
  appearance,
  sourceDatasetId,
  className = '',
}: CrossSceneNetworkCardProps) {
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Track cross-scene navigation
  const handleClick = useCallback(() => {
    trackEvent(
      'CrossScene',
      'navigate',
      `${sourceDatasetId || 'unknown'} -> ${appearance.datasetId}`
    );
  }, [sourceDatasetId, appearance.datasetId]);

  // Fetch dataset manifest to get description
  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const response = await fetch(`/datasets/${appearance.datasetId}/manifest.json`);
        if (response.ok) {
          const manifest = await response.json();
          // Truncate description to ~80 chars
          const desc = manifest.description || '';
          const truncated = desc.length > 80 ? desc.substring(0, 77) + '...' : desc;
          setDescription(truncated);
        }
      } catch (error) {
        console.error(`Failed to load manifest for ${appearance.datasetId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchManifest();
  }, [appearance.datasetId]);

  const targetUrl = buildCrossSceneNodeUrl(appearance.datasetId, appearance.nodeId);

  return (
    <Link
      to={targetUrl}
      onClick={handleClick}
      className={`cross-scene-network-card ${className}`}
    >
      <div className="cross-scene-network-card__content">
        <div className="cross-scene-network-card__header">
          <h4 className="cross-scene-network-card__title">
            {appearance.datasetName}
          </h4>
          <span className="cross-scene-network-card__arrow">→</span>
        </div>
        {loading ? (
          <div className="cross-scene-network-card__description-skeleton" />
        ) : (
          description && (
            <p className="cross-scene-network-card__description">
              {description}
            </p>
          )
        )}
      </div>
    </Link>
  );
}

/**
 * Loading skeleton for CrossSceneNetworkCard
 */
export function CrossSceneNetworkCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`cross-scene-network-card cross-scene-network-card--loading ${className}`}>
      <div className="cross-scene-network-card__content">
        <div className="cross-scene-network-card__header">
          <div className="cross-scene-network-card__title-skeleton" />
        </div>
        <div className="cross-scene-network-card__description-skeleton" />
      </div>
    </div>
  );
}
