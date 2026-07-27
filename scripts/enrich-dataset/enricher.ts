/**
 * Per-dataset enrichment logic.
 *
 * Fills *missing* mechanical fields (IDs, dates, places, occupations, short
 * descriptions) on nodes from Wikidata/Wikipedia. Never overwrites existing
 * values, and never touches curated prose (title, biography). Ambiguous or
 * unverifiable matches are reported, not guessed.
 */

import {
  Q_HUMAN,
  P,
  dateProps,
  getEntities,
  getLabels,
  searchEntities,
  titleToQid,
  claimItemIds,
  claimYear,
  entityDescription,
  entityLabel,
  entityNames,
  entitySitelinkTitle,
  isInstanceOf,
  type WikidataEntity,
} from './wikidata.js';
import type {
  EnrichableField,
  GraphNode,
  MatchCandidate,
  NodeEnrichmentResult,
  ResolvedFacts,
} from './types.js';

/** How a node was linked to a Wikidata QID (drives trust level). */
type Provenance = 'id' | 'title' | 'search';

interface ResolvedTarget {
  node: GraphNode;
  /** Fields the caller asked for that this node is currently missing. */
  missing: EnrichableField[];
  qid?: string;
  provenance?: Provenance;
  /** Terminal status decided during resolution (skips entity fetch). */
  status?: NodeEnrichmentResult['status'];
  candidates?: MatchCandidate[];
  note?: string;
}

/** Trailing tokens that are honorifics/ordinals, not part of a surname. */
const NAME_SUFFIXES = new Set([
  'the',
  'elder',
  'younger',
  'jr',
  'sr',
  'i',
  'ii',
  'iii',
  'iv',
  'v',
]);

/** Normalize a name to lowercase, accent-free, alphabetic tokens. Drops any
 *  parenthetical disambiguator (e.g. "Alex Paterson (The Orb)"). */
function nameTokens(s: string): string[] {
  return s
    .replace(/\s*\([^)]*\)/g, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** The last meaningful token, ignoring trailing honorifics/ordinals. */
function surnameToken(tokens: string[]): string {
  const t = [...tokens];
  while (t.length > 1 && NAME_SUFFIXES.has(t[t.length - 1])) t.pop();
  return t[t.length - 1];
}

/** Two name tokens match if equal or share a >=4-char common prefix
 *  (tolerates transliteration variants like Chalcondyles/Chalkokondyles). */
function tokensMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i >= 4;
}

/**
 * Does a resolved entity plausibly refer to the same *person* as the node?
 * Guards against corrupt/stale wikidataIds that resolve to an unrelated entity
 * (e.g. a node titled "Sam Altman" whose id points at a baseball player). The
 * node's surname must fuzzily appear in the entity's label, an alias, or the
 * Wikipedia sitelink. If the entity has no usable English name we cannot
 * verify, so we trust rather than falsely quarantine.
 */
function personNameMatches(title: string, names: string[]): boolean {
  const titleTokens = nameTokens(title);
  if (titleTokens.length === 0) return true;
  const surname = surnameToken(titleTokens);

  const usable = names.map(nameTokens).filter((t) => t.length > 0);
  if (usable.length === 0) return true; // nothing to check against

  return usable.some((tokens) =>
    tokens.some((token) => tokensMatch(token, surname))
  );
}

/** Is a node field considered absent (and therefore fillable)? */
function isMissing(node: GraphNode, field: EnrichableField): boolean {
  const value = node[field];
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Decide each node's Wikidata target using only cheap, node-local calls
 * (direct id, title->qid, or a search). No bulk entity fetch here.
 */
async function resolveTargets(
  nodes: GraphNode[],
  fields: EnrichableField[]
): Promise<ResolvedTarget[]> {
  const targets: ResolvedTarget[] = [];

  for (const node of nodes) {
    const missing = fields.filter((f) => isMissing(node, f));

    // Resolving the entity still requires *some* anchor even if the only
    // missing fields are wikidataId/wikipediaTitle themselves.
    if (missing.length === 0) {
      targets.push({ node, missing, status: 'complete' });
      continue;
    }

    // 1. Node already carries a Wikidata ID - trust it.
    if (node.wikidataId) {
      targets.push({ node, missing, qid: node.wikidataId, provenance: 'id' });
      continue;
    }

    // 2. Node has a Wikipedia title - resolve it to a QID (deterministic).
    if (node.wikipediaTitle) {
      try {
        const qid = await titleToQid(node.wikipediaTitle);
        if (qid) {
          targets.push({ node, missing, qid, provenance: 'title' });
        } else {
          targets.push({
            node,
            missing,
            status: 'not-found',
            note: `Wikipedia page "${node.wikipediaTitle}" has no linked Wikidata item`,
          });
        }
      } catch (err) {
        targets.push({
          node,
          missing,
          status: 'error',
          note: (err as Error).message,
        });
      }
      continue;
    }

    // 3. No anchor - search Wikidata by title. Only a *single* candidate is
    //    safe to auto-accept; anything ambiguous is quarantined.
    try {
      const candidates = await searchEntities(node.title, 5);
      if (candidates.length === 0) {
        targets.push({
          node,
          missing,
          status: 'not-found',
          note: `No Wikidata search results for "${node.title}"`,
        });
      } else if (candidates.length === 1) {
        targets.push({
          node,
          missing,
          qid: candidates[0].wikidataId,
          provenance: 'search',
          candidates,
        });
      } else {
        targets.push({
          node,
          missing,
          status: 'ambiguous',
          candidates,
          note: `${candidates.length} Wikidata candidates for "${node.title}"`,
        });
      }
    } catch (err) {
      targets.push({
        node,
        missing,
        status: 'error',
        note: (err as Error).message,
      });
    }
  }

  return targets;
}

/** Build the set of facts a node can adopt from its resolved Wikidata entity. */
function extractFacts(
  node: GraphNode,
  entity: WikidataEntity,
  labels: Map<string, string>
): ResolvedFacts {
  const facts: ResolvedFacts = {};

  facts.wikidataId = entity.id;

  const sitelink = entitySitelinkTitle(entity);
  if (sitelink) facts.wikipediaTitle = sitelink.replace(/ /g, '_');

  const { start, end } = dateProps(node.type);
  const dateStart = claimYear(entity, start);
  if (dateStart) facts.dateStart = dateStart;
  if (end) {
    const dateEnd = claimYear(entity, end);
    if (dateEnd) facts.dateEnd = dateEnd;
  }

  const description = entityDescription(entity);
  if (description) facts.shortDescription = description;

  // Person-specific biographical facts.
  if (node.type === 'person') {
    const [birthPlaceId] = claimItemIds(entity, P.birthPlace);
    if (birthPlaceId && labels.has(birthPlaceId)) {
      facts.birthPlace = labels.get(birthPlaceId);
    }
    const [countryId] = claimItemIds(entity, P.country);
    if (countryId && labels.has(countryId)) {
      facts.nationality = labels.get(countryId);
    }
    const occupationIds = claimItemIds(entity, P.occupation);
    const occupations = occupationIds
      .map((id) => labels.get(id))
      .filter((l): l is string => Boolean(l));
    if (occupations.length > 0) facts.occupations = occupations;
  }

  return facts;
}

/**
 * Enrich a dataset's nodes in place (mutates the array's node objects when not
 * a dry run - callers decide whether to persist). Returns per-node results.
 */
export async function enrichDataset(
  nodes: GraphNode[],
  fields: EnrichableField[],
  opts: { dryRun: boolean }
): Promise<NodeEnrichmentResult[]> {
  const targets = await resolveTargets(nodes, fields);

  // Bulk-fetch every entity we resolved to a QID.
  const qids = targets
    .filter((t) => t.qid)
    .map((t) => t.qid as string);
  const entities = await getEntities(qids);

  // Collect the claim-target QIDs (places, countries, occupations) that we'll
  // need English labels for, across all person entities.
  const labelIds = new Set<string>();
  for (const target of targets) {
    if (!target.qid || target.node.type !== 'person') continue;
    const entity = entities.get(target.qid);
    if (!entity) continue;
    for (const prop of [P.birthPlace, P.country, P.occupation]) {
      for (const id of claimItemIds(entity, prop)) labelIds.add(id);
    }
  }
  const labels = await getLabels([...labelIds]);

  const results: NodeEnrichmentResult[] = [];

  for (const target of targets) {
    const { node, missing } = target;
    const base = { nodeId: node.id, title: node.title, type: node.type };

    // Terminal statuses decided during resolution.
    if (target.status === 'complete') {
      results.push({ ...base, status: 'complete', filled: {} });
      continue;
    }
    if (
      target.status === 'not-found' ||
      target.status === 'ambiguous' ||
      target.status === 'error'
    ) {
      results.push({
        ...base,
        status: target.status,
        filled: {},
        candidates: target.candidates,
        note: target.note,
      });
      continue;
    }

    const entity = target.qid ? entities.get(target.qid) : undefined;
    if (!entity) {
      results.push({
        ...base,
        status: 'not-found',
        filled: {},
        note: `Wikidata entity ${target.qid} could not be fetched`,
      });
      continue;
    }

    // Identity guard: a person node's resolved entity must actually name that
    // person. Catches corrupt/stale wikidataIds pointing at unrelated entities.
    if (node.type === 'person' && !personNameMatches(node.title, entityNames(entity))) {
      results.push({
        ...base,
        status: 'id-mismatch',
        filled: {},
        candidates: [
          {
            wikidataId: entity.id,
            label: entityLabel(entity) ?? '(no label)',
            description: entityDescription(entity),
          },
        ],
        note:
          target.provenance === 'id'
            ? `Existing wikidataId ${entity.id} resolves to "${entityLabel(entity) ?? '?'}", not "${node.title}"`
            : `Resolved ${entity.id} ("${entityLabel(entity) ?? '?'}") does not match "${node.title}"`,
      });
      continue;
    }

    // Type guard: a search-matched person must actually be a human.
    if (
      target.provenance === 'search' &&
      node.type === 'person' &&
      !isInstanceOf(entity, Q_HUMAN)
    ) {
      results.push({
        ...base,
        status: 'type-mismatch',
        filled: {},
        candidates: target.candidates,
        note: `Best match ${entity.id} is not an instance of human (Q5)`,
      });
      continue;
    }

    const facts = extractFacts(node, entity, labels);
    const filled: NodeEnrichmentResult['filled'] = {};

    for (const field of missing) {
      const value = facts[field];
      if (value === undefined) continue;
      if (Array.isArray(value) && value.length === 0) continue;
      if (!opts.dryRun) {
        (node as Record<string, unknown>)[field] = value;
      }
      filled[field] = value;
    }

    results.push({
      ...base,
      status: Object.keys(filled).length > 0 ? 'enriched' : 'complete',
      filled,
    });
  }

  return results;
}
