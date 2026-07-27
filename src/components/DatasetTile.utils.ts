/**
 * Utility helpers for DatasetTile.
 *
 * Kept in a separate module (not DatasetTile.tsx) so the component file only
 * exports components, which keeps React Fast Refresh working.
 */

import type { DatasetManifest } from '@types';

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
