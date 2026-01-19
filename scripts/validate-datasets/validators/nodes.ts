/**
 * Node schema validation
 * Validates nodes.json structure and individual node fields
 */

import type { ValidationIssue, NodeType } from '../types.js';

const VALID_TYPES: NodeType[] = ['person', 'object', 'location', 'entity'];

/**
 * Validate date format (ISO 8601 date or year-only)
 * Accepts: "1724", "1724-04", "1724-04-22", "1930s" (decade), negative years for BC
 */
function isValidDateFormat(value: string): boolean {
  // Year only (positive or negative)
  if (/^-?\d{1,4}$/.test(value)) return true;

  // Decade format (e.g., "1930s")
  if (/^\d{4}s$/.test(value)) return true;

  // ISO 8601 date (YYYY-MM-DD or YYYY-MM)
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(value)) {
    // Basic validation that month/day are reasonable
    const parts = value.split('-');
    const month = parseInt(parts[1], 10);
    if (month < 1 || month > 12) return false;
    if (parts[2]) {
      const day = parseInt(parts[2], 10);
      if (day < 1 || day > 31) return false;
    }
    return true;
  }

  // Circa dates (e.g., "c. 1500" or "circa 1500")
  if (/^(c\.?\s*|circa\s+)-?\d{1,4}$/i.test(value)) return true;

  // Approximate ranges like "early 1500s" or "late 16th century"
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
 * Check if node ID follows recommended format: {type}-{slug}
 */
function isStandardIdFormat(id: string, type: NodeType): boolean {
  return id.startsWith(`${type}-`) || id.startsWith(`${type.slice(0, 3)}-`);
}

/**
 * Validate a single node object
 */
function validateNode(
  node: unknown,
  index: number,
  fileName: string,
  seenIds: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const path = `nodes[${index}]`;

  // Check that it's an object
  if (typeof node !== 'object' || node === null || Array.isArray(node)) {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Node must be an object',
      path,
      code: 'INVALID_FIELD_TYPE',
    });
    return issues;
  }

  const data = node as Record<string, unknown>;

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
        message: `Duplicate node ID: "${data.id}"`,
        path: `${path}.id`,
        code: 'DUPLICATE_NODE_ID',
      });
    } else {
      seenIds.add(data.id);
    }
  }

  // Required: type
  if (typeof data.type !== 'string') {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Missing required field: "type"',
      path: `${path}.type`,
      code: 'MISSING_REQUIRED_FIELD',
    });
  } else if (!VALID_TYPES.includes(data.type as NodeType)) {
    issues.push({
      severity: 'error',
      file: fileName,
      message: `Invalid node type: "${data.type}". Must be one of: ${VALID_TYPES.join(', ')}`,
      path: `${path}.type`,
      code: 'INVALID_NODE_TYPE',
    });
  }

  // Required: title
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'Missing or invalid required field: "title"',
      path: `${path}.title`,
      code: 'MISSING_REQUIRED_FIELD',
    });
  }

  // Check ID format (warning only)
  if (
    typeof data.id === 'string' &&
    typeof data.type === 'string' &&
    VALID_TYPES.includes(data.type as NodeType)
  ) {
    if (!isStandardIdFormat(data.id, data.type as NodeType)) {
      issues.push({
        severity: 'warning',
        file: fileName,
        message: `Node ID "${data.id}" does not follow recommended format: "{type}-{slug}" (e.g., "${data.type}-example")`,
        path: `${path}.id`,
        code: 'NON_STANDARD_ID_FORMAT',
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
        message: `Invalid date format for "dateStart": "${data.dateStart}". Use ISO 8601 (YYYY-MM-DD, YYYY-MM, or YYYY) or year-only format.`,
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
        message: `Invalid date format for "dateEnd": "${data.dateEnd}". Use ISO 8601 (YYYY-MM-DD, YYYY-MM, or YYYY) or year-only format.`,
        path: `${path}.dateEnd`,
        code: 'INVALID_DATE_FORMAT',
      });
    }
  }

  // Validate imageUrl if present
  if (data.imageUrl !== undefined) {
    if (typeof data.imageUrl !== 'string') {
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'Field "imageUrl" must be a string',
        path: `${path}.imageUrl`,
        code: 'INVALID_FIELD_TYPE',
      });
    } else if (!isValidUrl(data.imageUrl)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Invalid URL format for "imageUrl": "${data.imageUrl}"`,
        path: `${path}.imageUrl`,
        code: 'INVALID_URL_FORMAT',
      });
    }
  }

  // Validate externalLinks if present
  if (data.externalLinks !== undefined) {
    if (!Array.isArray(data.externalLinks)) {
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'Field "externalLinks" must be an array',
        path: `${path}.externalLinks`,
        code: 'INVALID_FIELD_TYPE',
      });
    } else {
      for (let i = 0; i < data.externalLinks.length; i++) {
        const link = data.externalLinks[i] as Record<string, unknown>;
        if (typeof link !== 'object' || link === null) {
          issues.push({
            severity: 'error',
            file: fileName,
            message: `externalLinks[${i}] must be an object`,
            path: `${path}.externalLinks[${i}]`,
            code: 'INVALID_FIELD_TYPE',
          });
          continue;
        }

        if (typeof link.label !== 'string' || link.label.trim() === '') {
          issues.push({
            severity: 'error',
            file: fileName,
            message: `externalLinks[${i}].label is required`,
            path: `${path}.externalLinks[${i}].label`,
            code: 'MISSING_REQUIRED_FIELD',
          });
        }

        if (typeof link.url !== 'string') {
          issues.push({
            severity: 'error',
            file: fileName,
            message: `externalLinks[${i}].url is required`,
            path: `${path}.externalLinks[${i}].url`,
            code: 'MISSING_REQUIRED_FIELD',
          });
        } else if (!isValidUrl(link.url)) {
          issues.push({
            severity: 'error',
            file: fileName,
            message: `Invalid URL in externalLinks[${i}].url: "${link.url}"`,
            path: `${path}.externalLinks[${i}].url`,
            code: 'INVALID_URL_FORMAT',
          });
        }
      }
    }
  }

  // Type-specific recommended field warnings
  const nodeType = data.type as NodeType;
  if (VALID_TYPES.includes(nodeType)) {
    switch (nodeType) {
      case 'person':
        if (!data.biography && !data.shortDescription) {
          issues.push({
            severity: 'warning',
            file: fileName,
            message:
              'Person node is missing recommended fields: "biography" or "shortDescription"',
            path,
            code: 'MISSING_RECOMMENDED_FIELD',
          });
        }
        break;
      case 'object':
        if (!data.objectType) {
          issues.push({
            severity: 'warning',
            file: fileName,
            message: 'Object node is missing recommended field: "objectType"',
            path,
            code: 'MISSING_RECOMMENDED_FIELD',
          });
        }
        break;
      case 'location':
        if (!data.locationType) {
          issues.push({
            severity: 'warning',
            file: fileName,
            message: 'Location node is missing recommended field: "locationType"',
            path,
            code: 'MISSING_RECOMMENDED_FIELD',
          });
        }
        break;
      case 'entity':
        if (!data.entityType) {
          issues.push({
            severity: 'warning',
            file: fileName,
            message: 'Entity node is missing recommended field: "entityType"',
            path,
            code: 'MISSING_RECOMMENDED_FIELD',
          });
        }
        break;
    }
  }

  // Check for missing wikipediaTitle (all node types)
  // Allow null as explicit opt-out, but warn if undefined
  if (data.wikipediaTitle === undefined) {
    issues.push({
      severity: 'warning',
      file: fileName,
      message: `Node "${data.title}" (${data.id}) is missing recommended field: "wikipediaTitle". Add a Wikipedia page title or set to null if no Wikipedia article exists.`,
      path: `${path}.wikipediaTitle`,
      code: 'MISSING_WIKIPEDIA_TITLE',
    });
  }

  return issues;
}

/**
 * Validate an array of nodes
 */
export function validateNodes(
  nodes: unknown,
  fileName: string
): { issues: ValidationIssue[]; nodeIds: Set<string>; nodeCount: number } {
  const issues: ValidationIssue[] = [];
  const nodeIds = new Set<string>();

  if (!Array.isArray(nodes)) {
    issues.push({
      severity: 'error',
      file: fileName,
      message: 'nodes.json must contain a JSON array',
      code: 'INVALID_FIELD_TYPE',
    });
    return { issues, nodeIds, nodeCount: 0 };
  }

  for (let i = 0; i < nodes.length; i++) {
    issues.push(...validateNode(nodes[i], i, fileName, nodeIds));
  }

  return { issues, nodeIds, nodeCount: nodes.length };
}
