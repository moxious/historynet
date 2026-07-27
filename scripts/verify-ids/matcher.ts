/**
 * Name-matching heuristics for deciding whether a Wikidata entity actually
 * corresponds to a dataset node. Deliberately conservative: used both to detect
 * wrong ids and to accept re-resolved ones, so a false "match" would let a
 * wrong id through. When in doubt these return false (flag for review).
 */

import type { NodeType } from './types.js';

/** Lowercase, accent-free, alphanumeric tokens; drops parenthetical asides. */
export function nameTokens(s: string): string[] {
  return s
    .replace(/\s*\([^)]*\)/g, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
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

function surnameToken(tokens: string[]): string {
  const t = [...tokens];
  while (t.length > 1 && NAME_SUFFIXES.has(t[t.length - 1])) t.pop();
  return t[t.length - 1];
}

/** Equal, or sharing a >=4-char prefix (tolerates transliteration variants). */
export function tokensMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i >= 4;
}

/** A person node matches if its surname appears among the entity's names. */
export function personMatches(title: string, names: string[]): boolean {
  const titleTokens = nameTokens(title);
  if (titleTokens.length === 0) return true;
  const surname = surnameToken(titleTokens);

  const usable = names.map(nameTokens).filter((t) => t.length > 0);
  if (usable.length === 0) return false; // can't verify a person -> don't trust

  return usable.some((tokens) =>
    tokens.some((token) => tokensMatch(token, surname))
  );
}

/**
 * A non-person node matches if a majority of its significant title tokens
 * (length >= 3) appear among the entity's names. Titles like "GPT-4" or
 * "Generative Adversarial Networks" should overlap strongly with the real
 * entity's label; a random unrelated entity will not.
 */
export function genericMatches(title: string, names: string[]): boolean {
  const titleTokens = nameTokens(title).filter((t) => t.length >= 3);
  if (titleTokens.length === 0) {
    // Very short/symbolic titles: require an exact full-title token match.
    const t = nameTokens(title);
    const usable = names.map(nameTokens);
    return t.length > 0 && usable.some((n) => t.every((tok) => n.includes(tok)));
  }

  const usable = names.map(nameTokens).filter((t) => t.length > 0);
  if (usable.length === 0) return false;

  const hit = (token: string) =>
    usable.some((tokens) => tokens.some((x) => tokensMatch(x, token)));
  const matched = titleTokens.filter(hit).length;
  return matched / titleTokens.length >= 0.5;
}

/** Type-appropriate match check. */
export function nodeMatches(
  type: NodeType,
  title: string,
  names: string[]
): boolean {
  return type === 'person'
    ? personMatches(title, names)
    : genericMatches(title, names);
}
