/**
 * DatasetTile - Card component for displaying a dataset on the homepage
 * 
 * Shows:
 * - Banner emoji
 * - Dataset name
 * - Truncated description (2-3 lines)
 * - Node/edge counts
 * - Date range from scope
 * 
 * Clicking navigates to the dataset overview page.
 */

import { Link } from 'react-router-dom';
import type { DatasetManifest } from '@types';
import './DatasetTile.css';

interface DatasetTileProps {
  /** Dataset manifest data */
  manifest: DatasetManifest;
  /** Optional class name */
  className?: string;
}

/**
 * Get temporal range display string from manifest
 */
function getTemporalRange(manifest: DatasetManifest): string | null {
  // Try structured scope first
  if (manifest.scope?.startYear && manifest.scope?.endYear) {
    return `${manifest.scope.startYear}–${manifest.scope.endYear}`;
  }
  // Fallback to legacy temporalScope string
  if (manifest.temporalScope) {
    // Parse "2012-2025" format and convert hyphen to en-dash
    return manifest.temporalScope.replace('-', '–');
  }
  return null;
}

/**
 * Get the start year for sorting
 * Returns Infinity for datasets without a start year (places them at the end)
 */
export function getStartYear(manifest: DatasetManifest): number {
  if (manifest.scope?.startYear) {
    return manifest.scope.startYear;
  }
  // Try to parse from temporalScope
  if (manifest.temporalScope) {
    const match = manifest.temporalScope.match(/^(\d{4})/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  return Infinity;
}

function DatasetTile({ manifest, className = '' }: DatasetTileProps) {
  const bannerEmoji = manifest.bannerEmoji || '❓';
  const temporalRange = getTemporalRange(manifest);

  return (
    <Link
      to={`/${manifest.id}`}
      className={`dataset-tile ${className}`}
    >
      {/* Banner emoji */}
      <div className="dataset-tile__emoji" aria-hidden="true">
        {bannerEmoji}
      </div>

      {/* Dataset name */}
      <h3 className="dataset-tile__name">{manifest.name}</h3>

      {/* Truncated description */}
      <p className="dataset-tile__description">{manifest.description}</p>

      {/* Metadata footer */}
      <div className="dataset-tile__meta">
        {/* Node/edge counts */}
        {manifest.nodeCount !== undefined && manifest.edgeCount !== undefined && (
          <span className="dataset-tile__stats">
            {manifest.nodeCount} nodes · {manifest.edgeCount} edges
          </span>
        )}
        
        {/* Date range */}
        {temporalRange && (
          <span className="dataset-tile__dates">{temporalRange}</span>
        )}
      </div>
    </Link>
  );
}

export default DatasetTile;
