// Spoken Feynman Check, offline edition.
//   1. analyze(): find the chapter's key terms in what the student said, including
//      near-misses ("entrophy" -> entropy) that are flagged as low confidence.
//   2. The app reads the terms back and asks the student to confirm.
//   3. grade(): score coverage of the section's key concepts. Low-confidence words
//      can earn credit once confirmed, but they never cost marks.
import { tokenize, normalize, compileList, matchAt, hasAny, fuzzyFind, copyRatio } from './text.js';
import { NEGATIONS, NEGATION_SUFFIXES } from './lexicon.js';

export const PASS_SCORE = 7;
const NEG = new Set([...NEGATIONS].map(normalize));
const NEG_SUFFIX = NEGATION_SUFFIXES.map(normalize);

const glossaryCache = new Map();
function compileEntry(entry) {
  const key = `${entry.term}|${entry.aliases.join('|')}`;
  let c = glossaryCache.get(key);
  if (!c) {
    const fuzzTargets = [entry.term, ...entry.aliases.filter((a) => !/^[=~]/.test(a))]
      .map(normalize)
      .filter((s) => /^[a-z ]+$/.test(s));
    c = { term: entry.term, aliases: compileList([entry.term, ...entry.aliases]), fuzzTargets: [...new Set(fuzzTargets)] };
    glossaryCache.set(key, c);
  }
  return c;
}

const groupCache = new WeakMap();
function compiledGroups(concept) {
  let g = groupCache.get(concept);
  if (!g) { g = concept.groups.map((list) => compileList(list)); groupCache.set(concept, g); }
  return g;
}

const phraseCache = new WeakMap();
function compiledPhrases(m) {
  let p = phraseCache.get(m);
  if (!p) { p = compileList(m.phrases, 'phrase'); phraseCache.set(m, p); }
  return p;
}

/**
 * Find glossary terms in a token list.
 * Returns [{ term, heard, low, index, length }] in spoken order; `low` means the words
 * only resembled the term (a known mishearing or a near-miss) and need confirming.
 */
export function detectTerms(tokens, glossary) {
  const entries = glossary.map(compileEntry);
  const used = new Array(tokens.length).fill(false);
  const found = [];
  const seen = new Set();

  const candidates = [];
  for (const e of entries) for (const ck of e.aliases) candidates.push({ e, ck });
  // Confident aliases before mishearings, longer phrases before single words.
  candidates.sort((a, b) => (a.ck.low - b.ck.low) || (b.ck.parts.length - a.ck.parts.length));

  for (const { e, ck } of candidates) {
    if (seen.has(e.term)) continue;
    for (let i = 0; i < tokens.length; i++) {
      const span = ck.parts.length;
      if (used.slice(i, i + span).some(Boolean) || !matchAt(tokens, i, ck)) continue;
      for (let k = 0; k < span; k++) used[i + k] = true;
      found.push({ term: e.term, heard: tokens.slice(i, i + span).join(' '), low: ck.low, index: i, length: span });
      seen.add(e.term);
      break;
    }
  }

  for (const e of entries) {
    if (seen.has(e.term)) continue;
    for (const target of e.fuzzTargets) {
      const hit = fuzzyFind(tokens, target, used);
      if (!hit) continue;
      for (let k = 0; k < hit.length; k++) used[hit.index + k] = true;
      found.push({ term: e.term, heard: hit.heard, low: true, index: hit.index, length: hit.length });
      seen.add(e.term);
      break;
    }
  }
  return found.sort((a, b) => a.index - b.index);
}

export function analyze(text, glossary) {
  const tokens = tokenize(text);
  return { text, tokens, terms: detectTerms(tokens, glossary), words: tokens.length };
}

function isNegation(token) {
  return NEG.has(token) || NEG_SUFFIX.some((s) => s && token.endsWith(s));
}

function misconceptionHit(tokens, m) {
  for (const ck of compiledPhrases(m)) {
    for (let i = 0; i + ck.parts.length <= tokens.length; i++) {
      if (!matchAt(tokens, i, ck)) continue;
      if (m.allowNegation) return true;
      const before = tokens.slice(Math.max(0, i - 2), i);
      const after = tokens.slice(i + ck.parts.length, i + ck.parts.length + 3);
      if (![...before, ...after].some(isNegation)) return true;
    }
  }
  return false;
}

/**
 * Grade an analysed explanation against a section rubric.
 * acceptLow: the student confirmed the low-confidence terms (said "yes" at read-back).
 * extraTerms: terms the student re-said during the "fix a word" step.
 */
export function grade(analysis, section, { acceptLow = true, extraTerms = [] } = {}) {
  const { tokens, terms } = analysis;
  const lowStarts = new Map(terms.filter((t) => t.low).map((t) => [t.index, t]));
  const conceptTokens = [];
  const safeTokens = []; // low-confidence words blanked out: they can never trigger a penalty
  for (let i = 0; i < tokens.length; i++) {
    const low = lowStarts.get(i);
    if (low) {
      if (acceptLow) conceptTokens.push(...tokenize(low.term));
      for (let k = 0; k < low.length; k++) safeTokens.push('');
      i += low.length - 1;
      continue;
    }
    conceptTokens.push(tokens[i]);
    safeTokens.push(tokens[i]);
  }
  for (const term of extraTerms) conceptTokens.push(...tokenize(term));

  const results = section.concepts.map((concept) => {
    const groups = compiledGroups(concept);
    const matched = groups.filter((g) => hasAny(conceptTokens, g)).length;
    return { concept, coverage: groups.length ? matched / groups.length : 0 };
  });

  const total = results.reduce((s, r) => s + (r.concept.weight || 1), 0);
  const earned = results.reduce((s, r) => s + (r.concept.weight || 1) * r.coverage, 0);
  let score = total ? Math.round((10 * earned) / total) : 0;

  const misconception = (section.misconceptions || []).find((m) => misconceptionHit(safeTokens, m)) || null;
  if (misconception) score -= misconception.penalty ?? 2;

  const tooShort = analysis.words < 8;
  const copied = analysis.words >= 12 && copyRatio(tokens, section.text) > 0.45;
  if (tooShort) score = Math.min(score, 3);
  if (copied) score = Math.min(score, 4);
  score = Math.max(0, Math.min(10, score));

  const covered = results.filter((r) => r.coverage >= 0.66).map((r) => r.concept);
  const missing = results.filter((r) => r.coverage < 0.66).map((r) => r.concept);
  const notes = [...new Set([
    ...results.map((r) => (r.coverage >= 0.66 ? r.concept.note : `Revise: ${r.concept.note}`)),
    section.examTip,
  ].filter(Boolean))].slice(0, 5);

  return { score, passed: score >= PASS_SCORE, covered, missing, misconception, tooShort, copied, notes, results, gradedBy: 'rubric' };
}

/** Unique term labels for the read-back, with low-confidence ones marked. */
export function readbackParts(analysis) {
  const sure = [];
  const unsure = [];
  for (const t of analysis.terms) {
    if (t.low) unsure.push(t);
    else if (!sure.includes(t.term)) sure.push(t.term);
  }
  return { sure, unsure };
}
