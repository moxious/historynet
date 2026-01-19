# M16: Network Verification

**Status**: ✅ Complete (2026-01-18)
**Track**: Post-MVP Polish
**Depends on**: M15 (Stable Resource URLs)

## Goal

Implement build-time CLI validation tools that verify all datasets conform to the graph schema before deployment. Invalid or malformed datasets should fail the build, preventing broken data from reaching production.

**Architecture**: TypeScript CLI scripts executed via npm, integrated into the GitHub Actions workflow after the build step. Validation runs against the JSON files in `public/datasets/`.

**Key Principle**: This is **build-time only** validation. No validation code should be shipped to the runtime bundle. The CLI tools live in a separate `scripts/` directory and are excluded from the production build.

## Tasks

### CLI Tool Architecture

- [x] Create `scripts/validate-datasets/` directory structure
- [x] Implement JSON syntax validator
- [x] Implement manifest schema validator
- [x] Implement node schema validator with type-specific rules
- [x] Implement edge schema validator
- [x] Implement cross-reference validator
- [x] Implement reporter with colored output and summary
- [x] Add CLI argument parsing (--strict, --dataset, --quiet, --json)
- [x] Add npm scripts to package.json
- [x] Update GitHub Actions workflow to run validation before build
- [x] Add validation documentation to AGENTS.md
- [x] Test against all existing datasets, fix any discovered issues

## Validation Checks

| Check | Severity | Description |
|-------|----------|-------------|
| JSON syntax | Error | Files must be valid JSON |
| Required fields | Error | `id`, `type`, `title` for nodes; `id`, `source`, `target`, `relationship` for edges |
| Node types | Error | Must be `person`, `object`, `location`, or `entity` |
| Date formats | Error | ISO 8601 (YYYY-MM-DD) or year-only (YYYY) |
| URL formats | Error | Valid HTTP/HTTPS URLs for `imageUrl`, `evidenceUrl`, external links |
| Duplicate IDs | Error | Node and edge IDs must be unique |
| Broken references | Error | Edge `source`/`target` must exist in nodes |
| Missing evidence | Warning | Edges should have `evidence`, `evidenceNodeId`, or `evidenceUrl` |
| Missing recommended fields | Warning | Type-specific fields like `biography`, `objectType` |
| Non-standard IDs | Warning | IDs should follow `{type}-{slug}` pattern |
| Unknown relationship types | Warning | Consider adding to `manifest.customRelationshipTypes` |

## npm Scripts

```json
{
  "scripts": {
    "validate:datasets": "npx tsx scripts/validate-datasets/index.ts",
    "validate:datasets:strict": "npx tsx scripts/validate-datasets/index.ts --strict"
  }
}
```

**Options**:
- `--strict` - Treat warnings as errors
- `--dataset <id>` - Validate single dataset
- `--quiet` - Suppress progress output
- `--json` - Output JSON for CI/parsing

## Directory Structure

```
scripts/
└── validate-datasets/
    ├── index.ts           # Main entry point
    ├── validators/
    │   ├── json-syntax.ts    # JSON parsing validation
    │   ├── manifest.ts       # Manifest schema validation
    │   ├── nodes.ts          # Node schema validation
    │   ├── edges.ts          # Edge schema validation
    │   └── cross-references.ts # Referential integrity
    ├── types.ts           # Validation types and interfaces
    └── reporter.ts        # Output formatting (errors, warnings, summary)
```
