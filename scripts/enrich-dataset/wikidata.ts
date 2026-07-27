/**
 * Thin, deterministic client for the Wikidata and Wikipedia APIs.
 *
 * All lookups here are mechanical - no language model involved. The client
 * fetches structured claims (dates, places, occupations) and resolves the
 * QIDs those claims point at into human-readable English labels.
 *
 * Wikimedia asks that automated clients send a descriptive User-Agent:
 * https://meta.wikimedia.org/wiki/User-Agent_policy
 */

import type { MatchCandidate, NodeType } from './types.js';

const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT =
  'Scenius-enrich/1.0 (https://scenius-seven.vercel.app; dataset enrichment tool)';

/** Wikidata property IDs we read. */
const P = {
  instanceOf: 'P31',
  birthDate: 'P569',
  deathDate: 'P570',
  inception: 'P571',
  dissolved: 'P576',
  publicationDate: 'P577',
  birthPlace: 'P19',
  country: 'P27', // country of citizenship
  occupation: 'P106',
} as const;

/** Wikidata item for "human". Used to sanity-check person matches. */
export const Q_HUMAN = 'Q5';

/** Minimal shape of a Wikidata entity from wbgetentities. */
export interface WikidataEntity {
  id: string;
  labels?: Record<string, { value: string }>;
  descriptions?: Record<string, { value: string }>;
  aliases?: Record<string, Array<{ value: string }>>;
  claims?: Record<string, WikidataClaim[]>;
  sitelinks?: Record<string, { title: string }>;
}

interface WikidataClaim {
  mainsnak?: {
    datavalue?: {
      value?: unknown;
    };
  };
}

/** Small politeness delay between paginated API calls (ms). */
const REQUEST_DELAY_MS = 120;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Max attempts before giving up on a request that keeps being throttled. */
const MAX_RETRIES = 7;

async function apiGet(
  base: string,
  params: Record<string, string>
): Promise<Record<string, unknown>> {
  const url = new URL(base);
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
      // Honor Retry-After when present; otherwise exponential backoff.
      const retryAfter = Number(res.headers.get('retry-after'));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 1000 * 2 ** attempt;
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      throw new Error(`${base} returned HTTP ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as Record<string, unknown>;
  }

  throw new Error(`${base} failed after ${MAX_RETRIES} retries: ${lastError}`);
}

/**
 * Resolve an English Wikipedia page title to its Wikidata QID.
 * Follows redirects. Returns null if the page has no linked Wikidata item.
 *
 * The title may use spaces or underscores; the API accepts either.
 */
export async function titleToQid(title: string): Promise<string | null> {
  const data = await apiGet(WIKIPEDIA_API, {
    action: 'query',
    titles: title.replace(/_/g, ' '),
    prop: 'pageprops',
    ppprop: 'wikibase_item',
    redirects: '1',
  });

  const pages = (data.query as { pages?: Record<string, unknown> } | undefined)
    ?.pages;
  if (!pages) return null;

  for (const page of Object.values(pages)) {
    const pp = (page as { pageprops?: { wikibase_item?: string } }).pageprops;
    if (pp?.wikibase_item) return pp.wikibase_item;
  }
  return null;
}

/**
 * Search Wikidata for items matching a label. Returns ranked candidates.
 * Used when a node has neither a wikidataId nor a wikipediaTitle.
 */
export async function searchEntities(
  query: string,
  limit = 5
): Promise<MatchCandidate[]> {
  const data = await apiGet(WIKIDATA_API, {
    action: 'wbsearchentities',
    search: query,
    language: 'en',
    uselang: 'en',
    type: 'item',
    limit: String(limit),
  });

  const search = (data.search as
    | Array<{ id: string; label?: string; description?: string }>
    | undefined) ?? [];

  return search.map((s) => ({
    wikidataId: s.id,
    label: s.label ?? query,
    description: s.description,
  }));
}

/**
 * Fetch full entities (labels, descriptions, claims, sitelinks) for up to
 * 50 QIDs per request. Batches transparently for larger inputs.
 */
export async function getEntities(
  ids: string[]
): Promise<Map<string, WikidataEntity>> {
  const out = new Map<string, WikidataEntity>();
  const unique = [...new Set(ids)].filter(Boolean);

  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50);
    const data = await apiGet(WIKIDATA_API, {
      action: 'wbgetentities',
      ids: batch.join('|'),
      props: 'labels|descriptions|aliases|claims|sitelinks',
      languages: 'en',
    });
    const entities = (data.entities as
      | Record<string, WikidataEntity>
      | undefined) ?? {};
    for (const [id, entity] of Object.entries(entities)) {
      out.set(id, entity);
    }
    if (i + 50 < unique.length) await sleep(REQUEST_DELAY_MS);
  }
  return out;
}

/**
 * Fetch only English labels for a set of QIDs (used to turn claim targets -
 * birthplaces, occupations, countries - into readable strings).
 */
export async function getLabels(ids: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const unique = [...new Set(ids)].filter(Boolean);
  if (unique.length === 0) return out;

  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50);
    const data = await apiGet(WIKIDATA_API, {
      action: 'wbgetentities',
      ids: batch.join('|'),
      props: 'labels',
      languages: 'en',
    });
    const entities = (data.entities as
      | Record<string, WikidataEntity>
      | undefined) ?? {};
    for (const [id, entity] of Object.entries(entities)) {
      const label = entity.labels?.en?.value;
      if (label) out.set(id, label);
    }
    if (i + 50 < unique.length) await sleep(REQUEST_DELAY_MS);
  }
  return out;
}

// --- Claim extraction helpers -------------------------------------------------

/** Return the QIDs referenced by an item-valued property (e.g. P106). */
export function claimItemIds(entity: WikidataEntity, prop: string): string[] {
  const claims = entity.claims?.[prop];
  if (!claims) return [];
  const ids: string[] = [];
  for (const claim of claims) {
    const value = claim.mainsnak?.datavalue?.value as
      | { id?: string }
      | undefined;
    if (value?.id) ids.push(value.id);
  }
  return ids;
}

/**
 * Extract a year string from the first time-valued claim of `prop`.
 * Wikidata times look like "+1632-08-29T00:00:00Z" (CE) or
 * "-0044-03-15T00:00:00Z" (44 BCE). We emit "1632" / "-44" to match the
 * app's parseYear (/^-?\d+/).
 */
export function claimYear(
  entity: WikidataEntity,
  prop: string
): string | undefined {
  const claims = entity.claims?.[prop];
  if (!claims) return undefined;
  for (const claim of claims) {
    const value = claim.mainsnak?.datavalue?.value as
      | { time?: string }
      | undefined;
    const time = value?.time;
    if (!time) continue;
    const m = /^([+-])0*(\d+)-/.exec(time);
    if (!m) continue;
    const year = m[2];
    return m[1] === '-' ? `-${year}` : year;
  }
  return undefined;
}

/** English label for the entity itself. */
export function entityLabel(entity: WikidataEntity): string | undefined {
  return entity.labels?.en?.value;
}

/** All English names for an entity: label + aliases + Wikipedia sitelink. */
export function entityNames(entity: WikidataEntity): string[] {
  const names: string[] = [];
  const label = entity.labels?.en?.value;
  if (label) names.push(label);
  for (const alias of entity.aliases?.en ?? []) {
    if (alias.value) names.push(alias.value);
  }
  const sitelink = entity.sitelinks?.enwiki?.title;
  if (sitelink) names.push(sitelink);
  return names;
}

/** English one-line description for the entity. */
export function entityDescription(
  entity: WikidataEntity
): string | undefined {
  return entity.descriptions?.en?.value;
}

/** English Wikipedia sitelink title (with spaces), if any. */
export function entitySitelinkTitle(
  entity: WikidataEntity
): string | undefined {
  return entity.sitelinks?.enwiki?.title;
}

/** Does this entity's "instance of" (P31) include the given QID? */
export function isInstanceOf(entity: WikidataEntity, qid: string): boolean {
  return claimItemIds(entity, P.instanceOf).includes(qid);
}

export { P };

/**
 * The date properties that map to dateStart/dateEnd for a given node type.
 * Persons use birth/death; entities use inception/dissolution; objects use
 * publication date; locations use inception.
 */
export function dateProps(type: NodeType): { start: string; end?: string } {
  switch (type) {
    case 'person':
      return { start: P.birthDate, end: P.deathDate };
    case 'entity':
      return { start: P.inception, end: P.dissolved };
    case 'object':
      return { start: P.publicationDate };
    case 'location':
      return { start: P.inception };
  }
}
