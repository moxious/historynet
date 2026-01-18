/**
 * Manifest schema validation
 * Validates manifest.json structure and required fields
 */

import type { ValidationIssue, DatasetManifest } from '../types.js';

/**
 * Validate a parsed manifest object
 */
export function validateManifest(
  manifest: unknown,
  fileName: string,
  directoryName: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check that it's an object
  if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest)) {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Manifest must be a JSON object',
      code: 'INVALID_FIELD_TYPE',
    });
    return issues;
  }

  const data = manifest as Record<string, unknown>;

  // Required fields
  if (typeof data.id !== 'string' || data.id.trim() === '') {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Missing or invalid required field: "id" (must be a non-empty string)',
      path: 'id',
      code: 'MISSING_REQUIRED_FIELD',
    });
  } else if (data.id !== directoryName) {
    issues.push({
      severity: 'error',
      file: fileName,
      message: `Manifest id "${data.id}" does not match directory name "${directoryName}"`,
      path: 'id',
      code: 'MANIFEST_ID_MISMATCH',
    });
  }

  if (typeof data.name !== 'string' || data.name.trim() === '') {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Missing or invalid required field: "name" (must be a non-empty string)',
      path: 'name',
      code: 'MISSING_REQUIRED_FIELD',
    });
  }

  // Recommended fields (warnings)
  if (typeof data.description !== 'string' || data.description.trim() === '') {
    issues.push({
      severity: 'warning',
      file: fileName,
      message: 'Recommended field "description" is missing or empty',
      path: 'description',
      code: 'MISSING_RECOMMENDED_FIELD',
    });
  }

  if (typeof data.lastUpdated !== 'string') {
    issues.push({
      severity: 'warning',
      file: fileName,
      message: 'Recommended field "lastUpdated" is missing',
      path: 'lastUpdated',
      code: 'MISSING_RECOMMENDED_FIELD',
    });
  } else {
    // Validate date format (ISO 8601 date only, YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.lastUpdated)) {
      issues.push({
        severity: 'warning',
        file: fileName,
        message: `Field "lastUpdated" should be in ISO 8601 date format (YYYY-MM-DD), got: "${data.lastUpdated}"`,
        path: 'lastUpdated',
        code: 'INVALID_DATE_FORMAT',
      });
    }
  }

  if (typeof data.version !== 'string') {
    issues.push({
      severity: 'warning',
      file: fileName,
      message: 'Recommended field "version" is missing',
      path: 'version',
      code: 'MISSING_RECOMMENDED_FIELD',
    });
  }

  // Validate optional fields if present
  if (data.nodeCount !== undefined && typeof data.nodeCount !== 'number') {
    issues.push({
      severity: 'warning',
      file: fileName,
      message: 'Field "nodeCount" should be a number',
      path: 'nodeCount',
      code: 'INVALID_FIELD_TYPE',
    });
  }

  if (data.edgeCount !== undefined && typeof data.edgeCount !== 'number') {
    issues.push({
      severity: 'warning',
      file: fileName,
      message: 'Field "edgeCount" should be a number',
      path: 'edgeCount',
      code: 'INVALID_FIELD_TYPE',
    });
  }

  // Validate customRelationshipTypes if present
  if (data.customRelationshipTypes !== undefined) {
    if (!Array.isArray(data.customRelationshipTypes)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'Field "customRelationshipTypes" must be an array',
        path: 'customRelationshipTypes',
        code: 'INVALID_FIELD_TYPE',
      });
    } else {
      for (let i = 0; i < data.customRelationshipTypes.length; i++) {
        const crt = data.customRelationshipTypes[i] as Record<string, unknown>;
        if (typeof crt !== 'object' || crt === null) {
          issues.push({
            severity: 'error',
            file: fileName,
            message: `customRelationshipTypes[${i}] must be an object`,
            path: `customRelationshipTypes[${i}]`,
            code: 'INVALID_FIELD_TYPE',
          });
          continue;
        }

        if (typeof crt.type !== 'string' || crt.type.trim() === '') {
          issues.push({
            severity: 'error',
            file: fileName,
            message: `customRelationshipTypes[${i}].type is required`,
            path: `customRelationshipTypes[${i}].type`,
            code: 'MISSING_REQUIRED_FIELD',
          });
        }

        if (typeof crt.description !== 'string') {
          issues.push({
            severity: 'warning',
            file: fileName,
            message: `customRelationshipTypes[${i}].description is recommended`,
            path: `customRelationshipTypes[${i}].description`,
            code: 'MISSING_RECOMMENDED_FIELD',
          });
        }

        if (typeof crt.directed !== 'boolean') {
          issues.push({
            severity: 'warning',
            file: fileName,
            message: `customRelationshipTypes[${i}].directed should be a boolean`,
            path: `customRelationshipTypes[${i}].directed`,
            code: 'INVALID_FIELD_TYPE',
          });
        }
      }
    }
  }

  return issues;
}

/**
 * Extract custom relationship types from a validated manifest
 */
export function getCustomRelationshipTypes(manifest: DatasetManifest): string[] {
  if (!manifest.customRelationshipTypes) {
    return [];
  }
  return manifest.customRelationshipTypes.map((crt) => crt.type);
}
