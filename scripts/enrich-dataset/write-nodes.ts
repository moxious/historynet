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
 * Apply enrichment fills to the original nodes.json text without disturbing the
 * formatting of untouched content. `results` must be in the same order as the
 * nodes in `originalText`; we additionally match on node id as a safety check
 * and throw rather than risk writing a corrupted file.
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

  // Build the edits, then apply them back-to-front so earlier offsets stay valid.
  interface Edit {
    at: number;
    insert: string;
  }
  const edits: Edit[] = [];

  for (let i = 0; i < spans.length; i++) {
    const result = results[i];
    const filledFields = Object.keys(result.filled) as EnrichableField[];
    if (filledFields.length === 0) continue;

    const [start, end] = spans[i];
    const objText = originalText.slice(start, end + 1);

    const id = objectId(objText);
    if (id && id !== result.nodeId) {
      throw new Error(
        `Node order mismatch at index ${i}: text id "${id}" != result id "${result.nodeId}"`
      );
    }

    const indent = propertyIndent(objText);

    // Insertion point: just after the object's last property value, which is
    // the last non-whitespace character before the closing brace at `end`.
    let insertAt = end - 1;
    while (insertAt > start && /\s/.test(originalText[insertAt])) insertAt--;
    insertAt += 1;

    const additions = filledFields
      .map((field) => {
        const value = result.filled[field];
        if (value === undefined) return null;
        return `,\n${indent}${JSON.stringify(field)}: ${serializeValue(
          value,
          indent
        )}`;
      })
      .filter((s): s is string => s !== null)
      .join('');

    if (additions) edits.push({ at: insertAt, insert: additions });
  }

  edits.sort((a, b) => b.at - a.at);
  let text = originalText;
  for (const edit of edits) {
    text = text.slice(0, edit.at) + edit.insert + text.slice(edit.at);
  }
  return text;
}
