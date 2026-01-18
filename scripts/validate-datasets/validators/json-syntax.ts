/**
 * JSON syntax validation
 * Verifies JSON files parse correctly and have valid encoding
 */

import { readFile } from 'node:fs/promises';
import type { ValidationIssue } from '../types.js';

/**
 * Result of parsing a JSON file
 */
export interface JsonParseResult<T = unknown> {
  /** Whether parsing succeeded */
  success: boolean;
  /** Parsed data (undefined if failed) */
  data?: T;
  /** Validation issues found */
  issues: ValidationIssue[];
}

/**
 * Attempt to parse a JSON file and return validation results
 */
export async function parseJsonFile<T = unknown>(
  filePath: string,
  fileName: string
): Promise<JsonParseResult<T>> {
  const issues: ValidationIssue[] = [];

  try {
    // Read file as buffer first to check encoding
    const buffer = await readFile(filePath);

    // Check for BOM (byte order mark) which indicates encoding issues
    if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
      // UTF-8 BOM is acceptable but worth noting
      // We'll strip it and continue
    } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
      // UTF-16 BE BOM - not supported
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'File appears to be UTF-16 BE encoded. Please convert to UTF-8.',
        code: 'INVALID_ENCODING',
      });
      return { success: false, issues };
    } else if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      // UTF-16 LE BOM - not supported
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'File appears to be UTF-16 LE encoded. Please convert to UTF-8.',
        code: 'INVALID_ENCODING',
      });
      return { success: false, issues };
    }

    // Convert to string (assuming UTF-8)
    const content = buffer.toString('utf8');

    // Check for common encoding issues (replacement character)
    if (content.includes('\ufffd')) {
      issues.push({
        severity: 'warning',
        file: fileName,
        message:
          'File contains replacement characters (�), which may indicate encoding issues.',
        code: 'INVALID_ENCODING',
      });
    }

    // Attempt to parse JSON
    const data = JSON.parse(content) as T;

    return { success: true, data, issues };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Try to extract line number from error message
      const lineMatch = error.message.match(/position\s+(\d+)/i);
      let line: number | undefined;

      if (lineMatch) {
        // Rough estimate of line number from position
        try {
          const content = await readFile(filePath, 'utf8');
          const position = parseInt(lineMatch[1], 10);
          const beforeError = content.substring(0, position);
          line = (beforeError.match(/\n/g) || []).length + 1;
        } catch {
          // Ignore errors getting line number
        }
      }

      issues.push({
        severity: 'error',
        file: fileName,
        message: `JSON parse error: ${error.message}`,
        line,
        code: 'JSON_PARSE_ERROR',
      });
    } else if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      issues.push({
        severity: 'error',
        file: fileName,
        message: 'File not found',
        code: 'JSON_PARSE_ERROR',
      });
    } else {
      issues.push({
        severity: 'error',
        file: fileName,
        message: `Failed to read file: ${(error as Error).message}`,
        code: 'JSON_PARSE_ERROR',
      });
    }

    return { success: false, issues };
  }
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}
