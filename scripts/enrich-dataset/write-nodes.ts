/**
 * Format-preserving writer for nodes.json.
 *
 * enrich only ever *adds* missing fields, so rewriting the whole file with
 * JSON.stringify would reflow untouched nodes whose hand-authored formatting
 * differs from the serializer (e.g. inline vs. expanded arrays). That buries a
 * handful of real changes under hundreds of noise lines.
 *
 * Instead we splice the new keys directly into the original text, leaving every
 * untouched byte identical. The result is a minimal diff: one comma added to
 * each affected node's previously-last property, plus the new lines.
 */

import type { EnrichableField, NodeEnrichmentResult } from './types.js';

/** [start, end] char offsets of each top-level object (end = its `}`). */
export function topLevelObjectSpans(text: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  let i = 0;
  const n = text.length;

  // Advance to the opening bracket of the top-level array.
  while (i < n && text[i] !== '[') i++;
  i++; // step past '['

  let inStr = false;
  let esc = false;
  let depth = 0; // brace/bracket depth *inside* the top-level array
  let objStart = -1;

  for (; i < n; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
    } else if (c === '{') {
      if (depth === 0) objStart = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && objStart >= 0) {
        spans.push([objStart, i]);
        objStart = -1;
      }
    } else if (c === '[') {
      depth++;
    } else if (c === ']') {
      if (depth === 0) break; // closing bracket of the top-level array
      depth--;
    }
  }

  return spans;
}

/** The leading whitespace of an object's property lines (e.g. "    "). */
function propertyIndent(objText: string): string {
  const m = /\n(\s+)"/.exec(objText);
  return m ? m[1] : '    ';
}

/** Extract a node's `"id"` value from its raw object text. */
function objectId(objText: string): string | undefined {
  const m = /"id"\s*:\s*"([^"]+)"/.exec(objText);
  return m ? m[1] : undefined;
}

/**
 * Serialize a value at a given indent. Strings become a quoted scalar; arrays
 * and objects expand across lines, each continuation line indented to match.
 */
function serializeValue(value: string | string[], indent: string): string {
  const json = JSON.stringify(value, null, 2);
  // Re-indent every line after the first to sit under `indent`.
  return json.replace(/\n/g, '\n' + indent);
}

/**
 * A field that is present but holds a "missing" value: null, "", or an empty
 * array. enrich's isMissing treats these as fillable, so when it fills one we
 * must REPLACE that value in place — appending would create a duplicate key
 * (e.g. after nulling a wrong id and re-enriching).
 */
function missingValueRegExp(field: string): RegExp {
  return new RegExp(`("${field}"\\s*:\\s*)(null|""|\\[\\s*\\])`);
}

/**
 * Apply enrichment fills to the original nodes.json text without disturbing the
 * formatting of untouched content. `results` must be in the same order as the
 * nodes in `originalText`; we additionally match on node id as a safety check
 * and throw rather than risk writing a corrupted file.
 *
 * For each filled field: if the node already carries the key with a missing
 * value (null/""/[]), its value is replaced in place; otherwise the key is
 * appended before the closing brace.
 */
export function applyFills(
  originalText: string,
  results: NodeEnrichmentResult[]
): string {
  const spans = topLevelObjectSpans(originalText);
  if (spans.length !== results.length) {
    throw new Error(
      `Node count mismatch: text has ${spans.length} objects but ${results.length} results`
    );
  }

  const pieces: string[] = [];
  let cursor = 0;

  for (let i = 0; i < spans.length; i++) {
    const result = results[i];
    const filledFields = Object.keys(result.filled) as EnrichableField[];
    if (filledFields.length === 0) continue;

    const [start, end] = spans[i];
    let objText = originalText.slice(start, end + 1);

    const id = objectId(objText);
    if (id && id !== result.nodeId) {
      throw new Error(
        `Node order mismatch at index ${i}: text id "${id}" != result id "${result.nodeId}"`
      );
    }

    const indent = propertyIndent(objText);
    const toAppend: string[] = [];

    for (const field of filledFields) {
      const value = result.filled[field];
      if (value === undefined) continue;
      if (Array.isArray(value) && value.length === 0) continue;
      const serialized = serializeValue(value, indent);

      const existing = missingValueRegExp(field);
      if (existing.test(objText)) {
        // Replace the present-but-empty value in place (no duplicate key).
        objText = objText.replace(existing, (_m, prefix: string) => `${prefix}${serialized}`);
      } else {
        toAppend.push(`,\n${indent}${JSON.stringify(field)}: ${serialized}`);
      }
    }

    if (toAppend.length > 0) {
      // Insert after the object's last property value (before the closing brace).
      let insertAt = objText.length - 2; // step past the closing '}'
      while (insertAt > 0 && /\s/.test(objText[insertAt])) insertAt--;
      insertAt += 1;
      objText = objText.slice(0, insertAt) + toAppend.join('') + objText.slice(insertAt);
    }

    pieces.push(originalText.slice(cursor, start));
    pieces.push(objText);
    cursor = end + 1;
  }

  pieces.push(originalText.slice(cursor));
  return pieces.join('');
}
