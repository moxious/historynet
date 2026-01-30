/**
 * CrossSceneSection Component
 *
 * Full cross-scene discovery section for Node Detail Pages.
 * Shows all networks where the entity appears with rich context.
 *
 * Design:
 * - Header: "🌐 Explore in Other Networks"
 * - Intro text: "This figure connects multiple intellectual communities:"
 * - List of network cards (excluding current dataset)
 * - Skeleton loaders during fetch
 * - Gracefully hidden if no cross-scene data
 */

import { CrossSceneNetworkCard, CrossSceneNetworkCardSkeleton } from './CrossSceneNetworkCard';
import type { CrossSceneAppearance } from '@contexts/CrossSceneContext';
import './CrossSceneSection.css';

interface CrossSceneSectionProps {
  /**
   * List of appearances (should already exclude current dataset)
   */
  appearances: CrossSceneAppearance[];

  /**
   * Whether data is still loading
   */
  isLoading: boolean;

  /**
   * Error state
   */
  error?: Error | null;

  /**
   * Current dataset ID (source) for analytics
   */
  sourceDatasetId?: string;

  /**
   * Optional class name
   */
  className?: string;
}

/**
 * Full cross-scene discovery section for detail pages
 */
export function CrossSceneSection({
  appearances,
  isLoading,
  error,
  sourceDatasetId,
  className = '',
}: CrossSceneSectionProps) {
  // Don't render if error or no appearances
  if (error || (!isLoading && appearances.length === 0)) {
    return null;
  }

  return (
    <section className={`cross-scene-section ${className}`}>
      <div className="cross-scene-section__header">
        <h3 className="cross-scene-section__title">
          <span className="cross-scene-section__icon">🌐</span>
          Explore in Other Networks
        </h3>
        <p className="cross-scene-section__intro">
          This figure connects multiple intellectual communities:
        </p>
      </div>

      <div className="cross-scene-section__cards">
        {isLoading ? (
          // Show skeleton loaders while fetching
          <>
            <CrossSceneNetworkCardSkeleton />
            <CrossSceneNetworkCardSkeleton />
            <CrossSceneNetworkCardSkeleton />
          </>
        ) : (
          // Show actual network cards
          appearances.map((appearance) => (
            <CrossSceneNetworkCard
              key={`${appearance.datasetId}-${appearance.nodeId}`}
              appearance={appearance}
              sourceDatasetId={sourceDatasetId}
            />
          ))
        )}
      </div>
    </section>
  );
}
