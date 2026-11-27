// Text utilities for code-switched Indian speech (Hindi, Hinglish, Tamil, Bengali, English).
// Shared by the browser app and the Node test suite, so: no DOM, no dependencies.

const VIRAMA_AT_END = /[्্்]$/u; // Devanagari, Bengali, Tamil virama
const LATIN_WORD = /^[a-z0-9]+$/;

/**
 * Normalise text so the same word matches whatever produced it: Wispr Flow,
 * the browser recogniser, or a keyboard, in any script.
 */
export function normalize(input) {
  return String(input ?? '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[​-‍﻿]/g, '') // zero-width joiners common in Indic text
    .replace(/ँ/g, 'ं') // Devanagari chandrabindu -> anusvara (हाँ == हां)
    .replace(/[़়]/g, '') // Devanagari and Bengali nukta (ज़ == ज, য় == য)
    .replace(/[’'`´]/g, '')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
    .trim();
}

export function tokenize(input) {
  const norm = normalize(input);
  return norm ? norm.split(' ') : [];
}

export const isLatin = (s) => /^[a-z0-9 ]+$/.test(s);

/**
 * Compile a lexicon entry.
 *   "=word"  exact token match
 *   "~word"  a known mishearing: matches, but is flagged as low confidence
 *   default  prefix match per token, so Tamil/Bengali/Hindi suffixes still match
 *            (ஆற்றல் matches ஆற்றலை, শক্তি matches শক্তির, price matches prices)
 * mode "phrase": every token exact except the last (used for misconception phrases).
 */
export function compileKeyword(raw, mode = 'prefix') {
  let kw = String(raw);
  let exact = mode === 'exact';
  let low = false;
  if (kw.startsWith('=')) { exact = true; kw = kw.slice(1); }
  if (kw.startsWith('~')) { low = true; kw = kw.slice(1); }
  const parts = normalize(kw).split(' ').filter(Boolean).map((p) => p.replace(VIRAMA_AT_END, ''));
  return { raw, parts, exact, low, phrase: mode === 'phrase' };
}

export function compileList(list, mode) {
  return list.map((kw) => compileKeyword(kw, mode)).filter((ck) => ck.parts.length);
}

function partMatches(token, part, exact) {
  if (!token) return false;
  if (exact) return token === part || token === part + '्' || token === part + '্' || token === part + '்';
  if (part.length <= 2 && LATIN_WORD.test(part)) return token === part; // "do", "ok", "q" stay exact
  return token.startsWith(part);
}

export function matchAt(tokens, i, ck) {
  if (i + ck.parts.length > tokens.length) return false;
  for (let j = 0; j < ck.parts.length; j++) {
    const exact = ck.exact || (ck.phrase && j < ck.parts.length - 1);
    if (!partMatches(tokens[i + j], ck.parts[j], exact)) return false;
  }
  return true;
}

/** First match of any compiled keyword: { index, length, ck } or null. */
export function findFirst(tokens, compiled) {
  for (let i = 0; i < tokens.length; i++) {
    for (const ck of compiled) {
      if (matchAt(tokens, i, ck)) return { index: i, length: ck.parts.length, ck };
    }
  }
  return null;
}

export const hasAny = (tokens, compiled) => findFirst(tokens, compiled) !== null;

export function countMatches(tokens, compiled) {
  let n = 0;
  for (const ck of compiled) {
    for (let i = 0; i < tokens.length; i++) if (matchAt(tokens, i, ck)) { n++; break; }
  }
  return n;
}

/** Levenshtein distance with an early exit once it must exceed `max`. */
export function levenshtein(a, b, max = Infinity) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** How many edits we forgive in a Latin-script term of this length. */
export function fuzzBudget(length) {
  if (length >= 9) return 2;
  if (length >= 6) return 1;
  return 0;
}

/**
 * Look for a near-miss of `phrase` (Latin only) in the tokens, e.g. "entrophy"
 * for "entropy" or "bass case" for "base case". Returns { index, length, heard } or null.
 */
export function fuzzyFind(tokens, phrase, used = []) {
  const target = normalize(phrase);
  if (!isLatin(target)) return null;
  const budget = fuzzBudget(target.replace(/ /g, '').length);
  if (!budget) return null;
  const words = target.split(' ').length;
  for (let i = 0; i < tokens.length; i++) {
    for (const span of [words, words + 1, words - 1]) {
      if (span < 1 || i + span > tokens.length) continue;
      const slice = tokens.slice(i, i + span);
      if (slice.some((t, k) => used[i + k] || !LATIN_WORD.test(t))) continue;
      const spaced = slice.join(' ');
      const joined = slice.join('');
      const d = Math.min(levenshtein(spaced, target, budget), levenshtein(joined, target.replace(/ /g, ''), budget));
      if (d > 0 && d <= budget) return { index: i, length: span, heard: spaced };
    }
  }
  return null;
}

export function wordCount(input) {
  return tokenize(input).length;
}

/** Share of the student's word trigrams that appear verbatim in the source text. */
export function copyRatio(studentTokens, sourceText) {
  const grams = (toks) => {
    const s = new Set();
    for (let i = 0; i + 2 < toks.length; i++) s.add(`${toks[i]} ${toks[i + 1]} ${toks[i + 2]}`);
    return s;
  };
  const source = grams(tokenize(sourceText));
  const student = grams(studentTokens);
  if (!student.size) return 0;
  let hits = 0;
  for (const g of student) if (source.has(g)) hits++;
  return hits / student.size;
}

export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
