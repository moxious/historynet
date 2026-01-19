/**
 * Wikipedia Service
 *
 * Wraps the wikipedia npm package to fetch summaries and images
 * from Wikipedia for node enrichment.
 *
 * Features:
 * - Fetches page summaries and thumbnails
 * - Handles disambiguation pages with automatic retry
 * - Graceful error handling (returns null, doesn't throw)
 * - Request timeout (5 seconds)
 */

import wiki from 'wikipedia';

/**
 * Wikipedia thumbnail data
 */
export interface WikipediaThumbnail {
  source: string;
  width: number;
  height: number;
}

/**
 * Structured data returned from Wikipedia API
 */
export interface WikipediaData {
  /** Page title as returned by Wikipedia */
  title: string;
  /** Plain text extract/summary */
  extract: string;
  /** Thumbnail image if available */
  thumbnail?: WikipediaThumbnail;
  /** Full URL to the Wikipedia article */
  pageUrl: string;
  /** Wikidata item ID if available (e.g., "Q9312") */
  wikidataId?: string;
}

/**
 * Node type hints for disambiguation retry
 */
export type NodeTypeHint = 'person' | 'object' | 'location' | 'entity';

/**
 * Map node types to common Wikipedia disambiguation suffixes
 */
const DISAMBIGUATION_SUFFIXES: Record<NodeTypeHint, string[]> = {
  person: ['philosopher', 'mathematician', 'scientist', 'writer', 'artist', 'composer', 'politician', 'historian'],
  object: ['book', 'painting', 'work', 'treatise', 'manuscript', 'film'],
  location: ['city', 'place', 'region', 'country', 'town'],
  entity: ['organization', 'company', 'institution', 'movement', 'group'],
};

/**
 * Timeout wrapper for async operations
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Check if a response indicates a disambiguation page
 */
function isDisambiguation(response: unknown): boolean {
  if (typeof response === 'object' && response !== null) {
    const r = response as Record<string, unknown>;
    // Wikipedia API returns type: "disambiguation" for disambiguation pages
    return r.type === 'disambiguation';
  }
  return false;
}

/**
 * Fetch Wikipedia summary for a given title
 *
 * @param title - Exact Wikipedia page title (e.g., "Geoffrey_Hinton")
 * @param nodeType - Optional node type hint for disambiguation retry
 * @returns Wikipedia data or null if page not found / error occurred
 */
export async function fetchWikipediaSummary(
  title: string,
  nodeType?: NodeTypeHint
): Promise<WikipediaData | null> {
  const TIMEOUT_MS = 5000;

  try {
    // Attempt to fetch the page summary
    const page = await withTimeout(wiki.page(title, { autoSuggest: false }), TIMEOUT_MS);
    const summary = await withTimeout(page.summary(), TIMEOUT_MS);

    // Check for disambiguation page
    if (isDisambiguation(summary)) {
      // Try retry with type hint if available
      if (nodeType) {
        const retryResult = await retryWithDisambiguation(title, nodeType, TIMEOUT_MS);
        if (retryResult) {
          return retryResult;
        }
      }
      // Disambiguation page and couldn't resolve
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Wikipedia] Disambiguation page detected for "${title}", could not resolve`);
      }
      return null;
    }

    // Extract the data we need
    const result: WikipediaData = {
      title: summary.title,
      extract: summary.extract || '',
      pageUrl: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };

    // Add thumbnail if available
    if (summary.thumbnail) {
      result.thumbnail = {
        source: summary.thumbnail.source,
        width: summary.thumbnail.width,
        height: summary.thumbnail.height,
      };
    }

    // Add Wikidata ID if available
    if (summary.wikibase_item) {
      result.wikidataId = summary.wikibase_item;
    }

    return result;
  } catch (error) {
    // Handle specific error cases
    if (error instanceof Error) {
      // Page not found - this is expected for some nodes
      if (error.message.includes('No page found') || error.message.includes('pageError')) {
        return null;
      }
      // Timeout
      if (error.message === 'Request timeout') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Wikipedia] Request timeout for "${title}"`);
        }
        return null;
      }
      // Network error
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Wikipedia] Error fetching "${title}":`, error.message);
      }
    }
    return null;
  }
}

/**
 * Retry disambiguation by appending type-specific suffixes
 */
async function retryWithDisambiguation(
  title: string,
  nodeType: NodeTypeHint,
  timeoutMs: number
): Promise<WikipediaData | null> {
  const suffixes = DISAMBIGUATION_SUFFIXES[nodeType];

  for (const suffix of suffixes) {
    const retryTitle = `${title} (${suffix})`;
    try {
      const page = await withTimeout(wiki.page(retryTitle, { autoSuggest: false }), timeoutMs);
      const summary = await withTimeout(page.summary(), timeoutMs);

      // Skip if this is also a disambiguation page
      if (isDisambiguation(summary)) {
        continue;
      }

      const result: WikipediaData = {
        title: summary.title,
        extract: summary.extract || '',
        pageUrl: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(retryTitle)}`,
      };

      if (summary.thumbnail) {
        result.thumbnail = {
          source: summary.thumbnail.source,
          width: summary.thumbnail.width,
          height: summary.thumbnail.height,
        };
      }

      if (summary.wikibase_item) {
        result.wikidataId = summary.wikibase_item;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Wikipedia] Resolved disambiguation "${title}" to "${retryTitle}"`);
      }

      return result;
    } catch {
      // Try next suffix
      continue;
    }
  }

  return null;
}

/**
 * Fetch Wikipedia data by Wikidata ID (QID)
 *
 * @param wikidataId - Wikidata QID (e.g., "Q9312")
 * @returns Wikipedia data or null if not found
 */
export async function fetchByWikidataId(
  wikidataId: string
): Promise<WikipediaData | null> {
  const TIMEOUT_MS = 5000;

  try {
    // Wikidata API to get Wikipedia page title from QID
    const wikidataUrl = `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`;
    const response = await withTimeout(fetch(wikidataUrl), TIMEOUT_MS);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const entity = data.entities?.[wikidataId];

    if (!entity) {
      return null;
    }

    // Get English Wikipedia title from sitelinks
    const enwikiTitle = entity.sitelinks?.enwiki?.title;

    if (!enwikiTitle) {
      return null;
    }

    // Now fetch the Wikipedia summary using the title
    return fetchWikipediaSummary(enwikiTitle);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Wikipedia] Error fetching Wikidata ID "${wikidataId}":`, error);
    }
    return null;
  }
}
