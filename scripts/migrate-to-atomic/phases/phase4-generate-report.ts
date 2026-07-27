/**
 * Phase 4: Generate migration report
 * MI-29 to MI-32: Generate statistics, UUID mappings, and conflict reports
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { NodeType } from '../../../src/types/node.js';
import type {
  EntityRegistry,
  MigrationReport,
  CanonicalConflict,
} from '../types.js';
import {
  getConflictSummary,
  formatConflictsForReview,
} from '../conflict-resolver.js';

/**
 * Build UUID mapping table (old nodeId → new entityId) for each dataset
 */
function buildUUIDMappings(
  datasetIds: string[],
  registry: EntityRegistry
): Record<string, Record<string, string>> {
  const mappings: Record<string, Record<string, string>> = {};

  for (const datasetId of datasetIds) {
    mappings[datasetId] = {};

    // Find all mappings for this dataset
    for (const [key, entityId] of registry.byDatasetNode.entries()) {
      if (key.startsWith(`${datasetId}:`)) {
        const nodeId = key.substring(datasetId.length + 1);
        mappings[datasetId][nodeId] = entityId;
      }
    }
  }

  return mappings;
}

/**
 * Count entities by type
 */
function countEntitiesByType(
  registry: EntityRegistry
): Record<NodeType, number> {
  const counts: Record<NodeType, number> = {
    person: 0,
    object: 0,
    location: 0,
    entity: 0,
  };

  for (const entity of registry.entities.values()) {
    counts[entity.type]++;
  }

  return counts;
}

/**
 * Count cross-dataset entities (appear in multiple datasets)
 */
function countCrossDatasetEntities(registry: EntityRegistry): number {
  let count = 0;

  for (const entity of registry.entities.values()) {
    if (entity.appearances.length > 1) {
      count++;
    }
  }

  return count;
}

/**
 * Count dataset-specific entities (no wikidataId)
 */
function countDatasetSpecificEntities(registry: EntityRegistry): number {
  let count = 0;

  for (const entity of registry.entities.values()) {
    if (!entity.canonicalData.wikidataId) {
      count++;
    }
  }

  return count;
}

/**
 * Generate migration report
 */
export async function generateReport(
  projectRoot: string,
  datasetIds: string[],
  registry: EntityRegistry,
  conflicts: CanonicalConflict[],
  totalEdgesUpdated: number,
  dryRun: boolean,
  outputDir: string
): Promise<MigrationReport> {
  console.log('\n=== Phase 4: Generating migration report ===\n');

  // Build report
  const conflictSummary = getConflictSummary(conflicts);

  const report: MigrationReport = {
    timestamp: new Date().toISOString(),
    totalEntities: registry.entities.size,
    entitiesByType: countEntitiesByType(registry),
    crossDatasetEntities: countCrossDatasetEntities(registry),
    datasetSpecificEntities: countDatasetSpecificEntities(registry),
    totalConflicts: conflictSummary.totalConflicts,
    conflictsByField: conflictSummary.conflictsByField,
    conflicts,
    uuidMappings: buildUUIDMappings(datasetIds, registry),
    datasetsProcessed: datasetIds,
    totalEdgesUpdated,
  };

  // Write report to file
  const reportPath = dryRun
    ? join(outputDir, 'migration-report.json')
    : join(projectRoot, 'migration-report.json');

  await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  // Write human-readable conflict report
  const conflictReportPath = dryRun
    ? join(outputDir, 'conflicts.txt')
    : join(projectRoot, 'conflicts.txt');

  const conflictText = formatConflictsForReview(conflicts);
  await writeFile(conflictReportPath, conflictText, 'utf-8');

  // Print summary
  console.log('Migration Report Summary:');
  console.log(`  Total entities: ${report.totalEntities}`);
  console.log(`  Persons: ${report.entitiesByType.person}`);
  console.log(`  Objects: ${report.entitiesByType.object}`);
  console.log(`  Locations: ${report.entitiesByType.location}`);
  console.log(`  Entities: ${report.entitiesByType.entity}`);
  console.log(`  Cross-dataset entities: ${report.crossDatasetEntities}`);
  console.log(`  Dataset-specific entities: ${report.datasetSpecificEntities}`);
  console.log(`  Total edges updated: ${report.totalEdgesUpdated}`);
  console.log(`  Canonical conflicts: ${report.totalConflicts}`);

  if (report.totalConflicts > 0) {
    console.log('\n  Conflicts by field:');
    for (const [field, count] of Object.entries(report.conflictsByField)) {
      console.log(`    ${field}: ${count}`);
    }
    console.log(`\n  See ${conflictReportPath} for details`);
  }

  console.log(`\nReport saved to: ${reportPath}`);

  return report;
}
