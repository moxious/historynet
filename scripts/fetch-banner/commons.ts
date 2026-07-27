/**
 * Thin, deterministic client for the Wikimedia Commons API.
 *
 * Searches the File namespace for images matching a themed query and returns
 * candidates with their imageinfo - full URL, dimensions, MIME type and the
 * `extmetadata` block that carries license + attribution. No language model is
 * involved: the LLM/human supplies the search query, this module just fetches.
 *
 * Wikimedia asks that automated clients send a descriptive User-Agent:
 * https://meta.wikimedia.org/wiki/User-Agent_policy
 */

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT =
  'HistoryNet-fetch-banner/1.0 (https://github.com/moxious/historynet; dataset banner tool)';

/** Max attempts before giving up on a request that keeps being throttled. */
const MAX_RETRIES = 7;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * GET a Commons API endpoint with retry/backoff. Honors Retry-After on 429/5xx
 * and otherwise backs off exponentially. Mirrors the approach used by the
 * enrich-dataset Wikidata client.
 */
async function apiGet(
  params: Record<string, string>
): Promise<Record<string, unknown>> {
  const url = new URL(COMMONS_API);
  url.search = new URLSearchParams({ ...params, format: 'json' }).toString();

  let lastError = '';
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    } catch (err) {
      lastError = (err as Error).message;
      await sleep(1000 * 2 ** attempt); // network blip - back off and retry
      continue;
    }

    if (res.status === 429 || res.status >= 500) {
      lastError = `HTTP ${res.status} ${res.statusText}`;
      const retryAfter = Number(res.headers.get('retry-after'));
      const wait =
        Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : 1000 * 2 ** attempt;
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      throw new Error(
        `Commons API returned HTTP ${res.status} ${res.statusText}`
      );
    }
    return (await res.json()) as Record<string, unknown>;
  }

  throw new Error(`Commons API failed after ${MAX_RETRIES} retries: ${lastError}`);
}

/** A single value entry inside an imageinfo `extmetadata` block. */
interface ExtMetaValue {
  value?: string;
  source?: string;
}

interface RawImageInfo {
  url?: string;
  descriptionurl?: string;
  mime?: string;
  width?: number;
  height?: number;
  extmetadata?: Record<string, ExtMetaValue>;
}

interface RawPage {
  pageid?: number;
  title?: string;
  index?: number;
  imageinfo?: RawImageInfo[];
}

/** A Commons image candidate with license + attribution extracted. */
export interface CommonsImage {
  /** File page title, e.g. "File:Some painting.jpg". */
  title: string;
  /** Direct URL to the full-resolution binary. */
  imageUrl: string;
  /** Human-facing Commons file description page URL (provenance). */
  descriptionUrl: string;
  mime: string;
  width: number;
  height: number;
  /** Short license name, e.g. "CC BY-SA 4.0" or "Public domain". */
  license: string;
  /** Machine license code from Commons, e.g. "cc-by-sa-4.0", "pd". */
  licenseCode: string;
  /** Plain-text author/artist (HTML stripped), best-effort. */
  artist: string;
  /** Whether the license requires attribution. */
  attributionRequired: boolean;
  /** True when the license is a free/open one (CC / public domain). */
  isFree: boolean;
  /** Search relevance rank from the API (lower is better). */
  searchIndex: number;
}

/** Strip HTML tags and collapse whitespace from an extmetadata value. */
function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Decide whether an extmetadata License code represents a free/open license.
 * We accept Creative Commons and public-domain variants and reject anything
 * marked non-free (fair use, "used with permission", etc.).
 */
function classifyLicense(meta: Record<string, ExtMetaValue>): {
  isFree: boolean;
  code: string;
  short: string;
} {
  const code = (meta.License?.value ?? '').toLowerCase().trim();
  const shortRaw = stripHtml(meta.LicenseShortName?.value);
  const usage = (meta.UsageTerms?.value ?? '').toLowerCase();

  const pdHints =
    /public domain|cc0|creative commons zero|no known copyright/;

  const isFree =
    code.startsWith('cc0') ||
    code.startsWith('cc-by') ||
    code.startsWith('cc-sa') ||
    code.startsWith('pd') ||
    code.startsWith('public') ||
    code === 'no restrictions' ||
    pdHints.test(shortRaw.toLowerCase()) ||
    pdHints.test(usage);

  // Normalize a display string for public-domain cases that lack a short name.
  let short = shortRaw;
  if (!short) {
    if (/^pd|public/.test(code) || pdHints.test(usage)) short = 'Public domain';
    else if (code) short = code.toUpperCase();
  }

  return { isFree, code, short };
}

/**
 * Search Commons (File namespace) for images matching `query` and return
 * candidates ordered by search relevance, each with license + attribution
 * resolved from its `extmetadata`.
 */
export async function searchImages(
  query: string,
  limit = 15
): Promise<CommonsImage[]> {
  const data = await apiGet({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6', // File namespace
    gsrsearch: query,
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
  });

  const pages =
    (data.query as { pages?: Record<string, RawPage> } | undefined)?.pages ?? {};

  const images: CommonsImage[] = [];
  for (const page of Object.values(pages)) {
    const info = page.imageinfo?.[0];
    if (!info?.url) continue;
    const meta = info.extmetadata ?? {};
    const { isFree, code, short } = classifyLicense(meta);
    const artist =
      stripHtml(meta.Artist?.value) || stripHtml(meta.Credit?.value) || '';
    const attributionRequired =
      (meta.AttributionRequired?.value ?? '').toLowerCase() === 'true';

    images.push({
      title: page.title ?? '(untitled)',
      imageUrl: info.url,
      descriptionUrl: info.descriptionurl ?? '',
      mime: info.mime ?? '',
      width: info.width ?? 0,
      height: info.height ?? 0,
      license: short || '(unknown license)',
      licenseCode: code,
      artist,
      attributionRequired,
      isFree,
      searchIndex: page.index ?? Number.MAX_SAFE_INTEGER,
    });
  }

  images.sort((a, b) => a.searchIndex - b.searchIndex);
  return images;
}

/**
 * Choose the best candidate for a banner: prefer freely-licensed raster images
 * (JPEG/PNG), then fall back to search relevance. Returns null if nothing
 * usable was found.
 */
export function pickBest(images: CommonsImage[]): CommonsImage | null {
  const raster = images.filter(
    (img) => img.mime === 'image/jpeg' || img.mime === 'image/png'
  );
  const pool = raster.length > 0 ? raster : images;

  const free = pool.filter((img) => img.isFree);
  const candidates = free.length > 0 ? free : pool;
  if (candidates.length === 0) return null;

  // Among the acceptable pool, honor search relevance first; the API already
  // orders by how well the file matches the themed query.
  return candidates[0];
}

/** Download a binary image, returning its bytes. */
export async function downloadImage(imageUrl: string): Promise<Buffer> {
  const res = await fetch(imageUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) {
    throw new Error(
      `Failed to download image: HTTP ${res.status} ${res.statusText}`
    );
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
