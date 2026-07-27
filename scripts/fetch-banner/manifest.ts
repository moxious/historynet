/**
 * Format-preserving manifest updater for banner fields.
 *
 * Rather than re-serialize the whole manifest (which would reorder keys and
 * churn formatting), this splices the banner keys in as text, anchored on the
 * required `bannerImage` line. Existing license/attribution/source lines are
 * removed first so re-running the tool is idempotent.
 */

/** The banner-related fields written into a manifest. */
export interface BannerFields {
  /** Relative path, e.g. "img/banners/enlightenment.jpg". */
  bannerImage: string;
  /** Short license name, e.g. "CC BY-SA 4.0" or "Public domain". */
  bannerImageLicense: string;
  /** Plain-text author/attribution. */
  bannerImageAttribution: string;
  /** Commons file description page URL (provenance). */
  bannerImageSource?: string;
}

const EXTRA_KEYS = [
  'bannerImageLicense',
  'bannerImageAttribution',
  'bannerImageSource',
] as const;

/**
 * Return a new manifest text with the banner fields set/updated, preserving the
 * surrounding formatting. Throws if the input is not valid JSON, if it has no
 * `bannerImage` field to anchor on, or if the result would not parse.
 */
export function updateManifestText(text: string, fields: BannerFields): string {
  JSON.parse(text); // validate input up front

  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  const hadTrailingNewline = /\r?\n$/.test(text);
  let lines = text.replace(/\r?\n$/, '').split(/\r?\n/);

  // Drop existing extra-key lines so re-runs don't accumulate duplicates.
  const keyLineRe = (k: string) => new RegExp(`^\\s*"${k}"\\s*:`);
  lines = lines.filter((l) => !EXTRA_KEYS.some((k) => keyLineRe(k).test(l)));

  const biIdx = lines.findIndex((l) => /^\s*"bannerImage"\s*:/.test(l));
  if (biIdx === -1) {
    throw new Error(
      'manifest has no "bannerImage" field to anchor banner updates'
    );
  }

  const indent = /^(\s*)/.exec(lines[biIdx])?.[1] ?? '  ';

  // Is bannerImage currently the last property (next real line is the "}")?
  let nextIdx = biIdx + 1;
  while (nextIdx < lines.length && lines[nextIdx].trim() === '') nextIdx++;
  const isLastProperty =
    nextIdx >= lines.length || lines[nextIdx].trim().startsWith('}');

  const entries: Array<[string, string]> = [
    ['bannerImage', fields.bannerImage],
    ['bannerImageLicense', fields.bannerImageLicense],
    ['bannerImageAttribution', fields.bannerImageAttribution],
  ];
  if (fields.bannerImageSource) {
    entries.push(['bannerImageSource', fields.bannerImageSource]);
  }

  const block = entries.map(([k, v], i) => {
    const isLastInBlock = i === entries.length - 1;
    const comma = isLastProperty && isLastInBlock ? '' : ',';
    return `${indent}${JSON.stringify(k)}: ${JSON.stringify(v)}${comma}`;
  });

  lines.splice(biIdx, 1, ...block);

  let result = lines.join(newline);
  if (hadTrailingNewline) result += newline;

  JSON.parse(result); // guard against corrupting the file
  return result;
}
