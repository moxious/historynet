/**
 * Output formatting and reporting for validation results
 * Provides colored console output and JSON output modes
 */

import type {
  ValidationResult,
  DatasetValidationResult,
  ValidationIssue,
  CLIOptions,
} from './types.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Format a validation issue for console output
 */
function formatIssue(issue: ValidationIssue): string {
  const severity =
    issue.severity === 'error'
      ? `${colors.red}❌${colors.reset}`
      : `${colors.yellow}⚠️${colors.reset}`;

  const path = issue.path ? `${colors.dim}${issue.path}${colors.reset}: ` : '';
  const line =
    issue.line !== undefined ? ` ${colors.dim}(line ${issue.line})${colors.reset}` : '';

  return `     ${severity} ${path}${issue.message}${line}`;
}

/**
 * Format dataset validation result for console output
 */
function formatDatasetResult(
  result: DatasetValidationResult,
  options: CLIOptions
): string {
  const lines: string[] = [];

  // Dataset header
  const icon = result.valid
    ? `${colors.green}✅${colors.reset}`
    : `${colors.red}❌${colors.reset}`;
  lines.push(`\n${colors.bold}📁 ${result.datasetId}/${colors.reset} ${icon}`);

  if (result.aborted) {
    lines.push(`   ${colors.red}Validation aborted due to critical error${colors.reset}`);
  }

  // Group issues by file
  const issuesByFile = new Map<string, ValidationIssue[]>();
  for (const issue of result.issues) {
    const existing = issuesByFile.get(issue.file) || [];
    existing.push(issue);
    issuesByFile.set(issue.file, existing);
  }

  // Output issues by file
  for (const [file, issues] of issuesByFile) {
    const errors = issues.filter((i) => i.severity === 'error');
    const warnings = issues.filter((i) => i.severity === 'warning');

    if (errors.length === 0 && warnings.length === 0) {
      if (!options.quiet) {
        lines.push(`   ${colors.green}✅${colors.reset} ${file} - valid`);
      }
    } else if (errors.length > 0) {
      lines.push(
        `   ${colors.red}❌${colors.reset} ${file} - ${errors.length} error(s)${warnings.length > 0 ? `, ${warnings.length} warning(s)` : ''}`
      );
      for (const issue of errors) {
        lines.push(formatIssue(issue));
      }
      if (!options.quiet) {
        for (const issue of warnings) {
          lines.push(formatIssue(issue));
        }
      }
    } else {
      lines.push(
        `   ${colors.yellow}⚠️${colors.reset}  ${file} - ${warnings.length} warning(s)`
      );
      if (!options.quiet) {
        for (const issue of warnings) {
          lines.push(formatIssue(issue));
        }
      }
    }
  }

  // Node/edge counts
  if (!options.quiet && !result.aborted) {
    lines.push(
      `   ${colors.dim}${result.nodeCount} nodes, ${result.edgeCount} edges${colors.reset}`
    );
  }

  return lines.join('\n');
}

/**
 * Format the final summary
 */
function formatSummary(result: ValidationResult, options: CLIOptions): string {
  const lines: string[] = [];

  lines.push(`\n${colors.bold}📊 Summary:${colors.reset}`);
  lines.push(
    `   Datasets: ${result.totalDatasets} checked, ${colors.green}${result.passedDatasets} passed${colors.reset}, ${result.failedDatasets > 0 ? colors.red : ''}${result.failedDatasets} failed${colors.reset}`
  );
  lines.push(
    `   Errors: ${result.totalErrors > 0 ? colors.red : colors.green}${result.totalErrors}${colors.reset}`
  );
  lines.push(
    `   Warnings: ${result.totalWarnings > 0 ? colors.yellow : colors.green}${result.totalWarnings}${colors.reset}`
  );

  if (options.strict && result.totalWarnings > 0) {
    lines.push(
      `   ${colors.dim}(--strict mode: warnings treated as errors)${colors.reset}`
    );
  }

  lines.push('');

  if (result.success) {
    lines.push(`${colors.green}${colors.bold}✅ Validation passed${colors.reset}`);
  } else {
    lines.push(`${colors.red}${colors.bold}❌ Validation failed${colors.reset}`);
  }

  return lines.join('\n');
}

/**
 * Report validation results to console
 */
export function reportResults(result: ValidationResult, options: CLIOptions): void {
  if (options.json) {
    // JSON output mode
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // Human-readable output
  console.log(`\n${colors.bold}🔍 Validating datasets...${colors.reset}`);

  for (const datasetResult of result.datasets) {
    console.log(formatDatasetResult(datasetResult, options));
  }

  console.log(formatSummary(result, options));
}

/**
 * Log a progress message (only in non-quiet, non-JSON mode)
 */
export function logProgress(message: string, options: CLIOptions): void {
  if (!options.quiet && !options.json) {
    console.log(`${colors.dim}${message}${colors.reset}`);
  }
}

/**
 * Log an error message
 */
export function logError(message: string): void {
  console.error(`${colors.red}Error: ${message}${colors.reset}`);
}
