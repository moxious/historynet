/**
 * Conflict detection and resolution utilities
 */

import type { CanonicalConflict } from './types.js';

/**
 * Group conflicts by field
 */
export function groupConflictsByField(
  conflicts: CanonicalConflict[]
): Record<string, number> {
  const byField: Record<string, number> = {};

  for (const conflict of conflicts) {
    byField[conflict.field] = (byField[conflict.field] || 0) + 1;
  }

  return byField;
}

/**
 * Get summary statistics for conflicts
 */
export function getConflictSummary(conflicts: CanonicalConflict[]): {
  totalConflicts: number;
  affectedEntities: number;
  conflictsByField: Record<string, number>;
} {
  const affectedEntities = new Set(conflicts.map((c) => c.entityId));

  return {
    totalConflicts: conflicts.length,
    affectedEntities: affectedEntities.size,
    conflictsByField: groupConflictsByField(conflicts),
  };
}

/**
 * Format conflicts for human review
 */
export function formatConflictsForReview(conflicts: CanonicalConflict[]): string {
  if (conflicts.length === 0) {
    return 'No conflicts detected';
  }

  const lines: string[] = [
    `Total conflicts: ${conflicts.length}`,
    '',
    'Conflicts by field:',
  ];

  const byField = groupConflictsByField(conflicts);
  for (const [field, count] of Object.entries(byField)) {
    lines.push(`  ${field}: ${count}`);
  }

  lines.push('', 'Detailed conflicts:', '');

  // Show first 20 conflicts in detail
  const sample = conflicts.slice(0, 20);
  for (const conflict of sample) {
    lines.push(`Entity: ${conflict.entityId}`);
    lines.push(`  Wikidata ID: ${conflict.wikidataId}`);
    lines.push(`  Field: ${conflict.field}`);
    lines.push(`  Canonical (${conflict.sourceDataset}): ${JSON.stringify(conflict.canonicalValue)}`);
    lines.push(`  Conflicting (${conflict.conflictingDataset}): ${JSON.stringify(conflict.conflictingValue)}`);
    lines.push('');
  }

  if (conflicts.length > 20) {
    lines.push(`... and ${conflicts.length - 20} more conflicts`);
  }

  return lines.join('\n');
}
