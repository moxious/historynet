/**
 * Edge schema validation
 * Validates edges.json structure and individual edge fields
 */

import type { ValidationIssue } from '../types.js';
import { STANDARD_RELATIONSHIP_TYPES } from '../types.js';

/**
 * Validate date format (same as nodes.ts)
 */
function isValidDateFormat(value: string): boolean {
  // Year only (positive or negative)
  if (/^-?\d{1,4}$/.test(value)) return true;

  // Decade format (e.g., "1930s")
  if (/^\d{4}s$/.test(value)) return true;

  // ISO 8601 date (YYYY-MM-DD or YYYY-MM)
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(value)) {
    const parts = value.split('-');
    const month = parseInt(parts[1], 10);
    if (month < 1 || month > 12) return false;
    if (parts[2]) {
      const day = parseInt(parts[2], 10);
      if (day < 1 || day > 31) return false;
    }
    return true;
  }

  // Circa dates
  if (/^(c\.?\s*|circa\s+)-?\d{1,4}$/i.test(value)) return true;

  // Approximate ranges
  if (/^(early|mid|late)\s+\d{4}s?$/i.test(value)) return true;
  if (/^(early|mid|late)\s+\d{1,2}(st|nd|rd|th)\s+century$/i.test(value)) return true;

  return false;
}

/**
 * Validate URL format
 */
function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate a single edge object
 */
function validateEdge(
  edge: unknown,
  index: number,
  fileName: string,
  seenIds: Set<string>,
  customRelationshipTypes: string[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const path = `edges[${index}]`;

  // Check that it's an object
  if (typeof edge !== 'object' || edge === null || Array.isArray(edge)) {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Edge must be an object',
      path,
      code: 'INVALID_FIELD_TYPE',
    });
    return issues;
  }

  const data = edge as Record<string, unknown>;

  // Required: id
  if (typeof data.id !== 'string' || data.id.trim() === '') {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Missing or invalid required field: "id"',
      path: `${path}.id`,
      code: 'MISSING_REQUIRED_FIELD',
    });
  } else {
    // Check for duplicates
    if (seenIds.has(data.id)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Duplicate edge ID: "${data.id}"`,
        path: `${path}.id`,
        code: 'DUPLICATE_EDGE_ID',
      });
    } else {
      seenIds.add(data.id);
    }
  }

  // Required: source
  if (typeof data.source !== 'string' || data.source.trim() === '') {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Missing or invalid required field: "source"',
      path: `${path}.source`,
      code: 'MISSING_REQUIRED_FIELD',
    });
  }

  // Required: target
  if (typeof data.target !== 'string' || data.target.trim() === '') {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Missing or invalid required field: "target"',
      path: `${path}.target`,
      code: 'MISSING_REQUIRED_FIELD',
    });
  }

  // Required: relationship
  if (typeof data.relationship !== 'string' || data.relationship.trim() === '') {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Missing or invalid required field: "relationship"',
      path: `${path}.relationship`,
      code: 'MISSING_REQUIRED_FIELD',
    });
  } else {
    // Check if relationship type is known (standard or custom)
    const allKnownTypes = [
      ...STANDARD_RELATIONSHIP_TYPES,
      ...customRelationshipTypes,
    ];
    if (!allKnownTypes.includes(data.relationship as string)) {
      // Not a standard type and not declared as custom - warning only
      issues.push({
        severity: 'warning',
        file: fileName,
        message: `Unknown relationship type: "${data.relationship}". Consider adding it to manifest.customRelationshipTypes if intentional.`,
        path: `${path}.relationship`,
        code: 'INVALID_RELATIONSHIP_TYPE',
      });
    }
  }

  // Validate dateStart if present
  if (data.dateStart !== undefined) {
    if (typeof data.dateStart !== 'string') {
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'Field "dateStart" must be a string',
        path: `${path}.dateStart`,
        code: 'INVALID_FIELD_TYPE',
      });
    } else if (!isValidDateFormat(data.dateStart)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Invalid date format for "dateStart": "${data.dateStart}"`,
        path: `${path}.dateStart`,
        code: 'INVALID_DATE_FORMAT',
      });
    }
  }

  // Validate dateEnd if present
  if (data.dateEnd !== undefined) {
    if (typeof data.dateEnd !== 'string') {
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'Field "dateEnd" must be a string',
        path: `${path}.dateEnd`,
        code: 'INVALID_FIELD_TYPE',
      });
    } else if (!isValidDateFormat(data.dateEnd)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Invalid date format for "dateEnd": "${data.dateEnd}"`,
        path: `${path}.dateEnd`,
        code: 'INVALID_DATE_FORMAT',
      });
    }
  }

  // Validate evidenceUrl if present
  if (data.evidenceUrl !== undefined) {
    if (typeof data.evidenceUrl !== 'string') {
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'Field "evidenceUrl" must be a string',
        path: `${path}.evidenceUrl`,
        code: 'INVALID_FIELD_TYPE',
      });
    } else if (!isValidUrl(data.evidenceUrl)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Invalid URL format for "evidenceUrl": "${data.evidenceUrl}"`,
        path: `${path}.evidenceUrl`,
        code: 'INVALID_URL_FORMAT',
      });
    }
  }

  // Validate strength if present
  if (data.strength !== undefined) {
    const validStrengths = ['strong', 'moderate', 'weak', 'speculative'];
    if (
      typeof data.strength !== 'string' ||
      !validStrengths.includes(data.strength)
    ) {
      issues.push({
        severity: 'warning',
        file: fileName,
        message: `Field "strength" should be one of: ${validStrengths.join(', ')}`,
        path: `${path}.strength`,
        code: 'INVALID_FIELD_TYPE',
      });
    }
  }

  // Warning: missing evidence
  const hasEvidence = data.evidence || data.evidenceNodeId || data.evidenceUrl;
  if (!hasEvidence) {
    issues.push({
      severity: 'warning',
      file: fileName,
      message:
        'Edge is missing evidence (recommended: evidence, evidenceNodeId, or evidenceUrl)',
      path,
      code: 'MISSING_EVIDENCE',
    });
  }

  return issues;
}

/**
 * Validate an array of edges
 */
export function validateEdges(
  edges: unknown,
  fileName: string,
  customRelationshipTypes: string[]
): {
  issues: ValidationIssue[];
  edgeIds: Set<string>;
  edgeCount: number;
  edgeSources: string[];
  edgeTargets: string[];
  evidenceNodeIds: string[];
} {
  const issues: ValidationIssue[] = [];
  const edgeIds = new Set<string>();
  const edgeSources: string[] = [];
  const edgeTargets: string[] = [];
  const evidenceNodeIds: string[] = [];

  if (!Array.isArray(edges)) {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'edges.json must contain a JSON array',
      code: 'INVALID_FIELD_TYPE',
    });
    return {
      issues,
      edgeIds,
      edgeCount: 0,
      edgeSources,
      edgeTargets,
      evidenceNodeIds,
    };
  }

  for (let i = 0; i < edges.length; i++) {
    issues.push(
      ...validateEdge(edges[i], i, fileName, edgeIds, customRelationshipTypes)
    );

    // Collect sources, targets, and evidence node IDs for cross-reference validation
    const edge = edges[i] as Record<string, unknown>;
    if (typeof edge.source === 'string') {
      edgeSources.push(edge.source);
    }
    if (typeof edge.target === 'string') {
      edgeTargets.push(edge.target);
    }
    if (typeof edge.evidenceNodeId === 'string') {
      evidenceNodeIds.push(edge.evidenceNodeId);
    }
  }

  return {
    issues,
    edgeIds,
    edgeCount: edges.length,
    edgeSources,
    edgeTargets,
    evidenceNodeIds,
  };
}
