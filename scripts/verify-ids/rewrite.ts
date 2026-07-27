/**
 * In-place rewriter for wikidataId / wikipediaTitle values in nodes.json.
 *
 * Unlike enrich (which only appends missing fields), remediation must *replace*
 * existing values - nulling a wrong id or swapping in a re-resolved one. We edit
 * only the targeted key's value within each affected node's span, leaving all
 * other bytes untouched, so the diff shows exactly the ids that changed.
 */

import { topLevelObjectSpans } from '../enrich-dataset/write-nodes.js';

export type IdEdit = {
  wikidataId?: string | null;
  wikipediaTitle?: string | null;
};

function objectId(objText: string): string | undefined {
  const m = /"id"\s*:\s*"([^"]+)"/.exec(objText);
  return m ? m[1] : undefined;
}

/** Replace the value of `key` (a string or null) within one object's text. */
function replaceKeyValue(
  objText: string,
  key: string,
  value: string | null
): string {
  const re = new RegExp(`("${key}"\\s*:\\s*)("(?:[^"\\\\]|\\\\.)*"|null)`);
  const replacement = value === null ? 'null' : JSON.stringify(value);
  return objText.replace(re, (_full, prefix: string) => `${prefix}${replacement}`);
}

/**
 * Apply id/title edits keyed by node id. Nodes without an edit are left byte
 * -for-byte identical. A key that isn't present on a node is skipped (we only
 * ever edit nodes that already carry the field).
 */
export function applyIdEdits(
  originalText: string,
  edits: Map<string, IdEdit>
): string {
  if (edits.size === 0) return originalText;

  const spans = topLevelObjectSpans(originalText);
  const pieces: string[] = [];
  let cursor = 0;

  for (const [start, end] of spans) {
    const objText = originalText.slice(start, end + 1);
    const id = objectId(objText);
    const edit = id ? edits.get(id) : undefined;
    if (!edit) continue;

    let updated = objText;
    if ('wikidataId' in edit) {
      updated = replaceKeyValue(updated, 'wikidataId', edit.wikidataId ?? null);
    }
    if ('wikipediaTitle' in edit) {
      updated = replaceKeyValue(
        updated,
        'wikipediaTitle',
        edit.wikipediaTitle ?? null
      );
    }

    if (updated !== objText) {
      pieces.push(originalText.slice(cursor, start));
      pieces.push(updated);
      cursor = end + 1;
    }
  }

  pieces.push(originalText.slice(cursor));
  return pieces.join('');
}
