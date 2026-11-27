// Offline intent parser for code-switched commands. Runs on-device in well under a
// millisecond, so only open-ended questions ever need the AI model.
import { tokenize, normalize, hasAny, compileList } from './text.js';
import { LEX, NUMBERS, LANGUAGES } from './lexicon.js';
import { detectTerms } from './grader.js';

const FILLERS = new Set(['um', 'umm', 'uh', 'uhh', 'hmm', 'hm', 'mm', 'ah', 'er', 'erm', 'oh', 'ugh', 'hmmm']);
const THIS_SECTION = compileList(['this', 'paragraph', 'section', 'passage', 'para', '=yeh', '=ye', '=ise', '=isko', 'इसे', 'इसको', '=यह', '=इस', 'पैराग्राफ',
  'இதை', 'இந்த', 'பத்தி', 'এটা', '=এই', 'অনুচ্ছেদ']);
const WEAK_SAMPLE = /mistake|galti|wrong|weak|गलती|ग़लती|தவறு|ভুল/;
// Words that carry no topic of their own, so "entropy kya hai?" counts as a pure definition request.
const GLUE = new Set(['is', 'are', 'was', 'the', 'a', 'an', 'of', 'does', 'do', 'did', 'in', 'on', 'for', 'to', 'and', 'me', 'please', 'plz', 'tell', 'about',
  'simple', 'simply', 'short', 'again', 'word', 'term', 'means', 'meaning', 'mean', 'what', 'whats', 'define', 'explain', 'it', 'this', 'that',
  'kya', 'hai', 'hain', 'hota', 'hoti', 'hote', 'ka', 'ki', 'ke', 'ko', 'se', 'mein', 'matlab', 'batao', 'bataiye', 'samjhao', 'yeh', 'ye', 'kise', 'kehte',
  'क्या', 'है', 'हैं', 'होता', 'होती', 'का', 'की', 'के', 'को', 'में', 'से', 'मतलब', 'बताओ', 'समझाओ', 'यह', 'किसे', 'कहते',
  'என்ன', 'என்றால்', 'என்றால', 'அது', 'இது', 'ஒரு', 'அர்த்தம்', 'விளக்கு',
  'কী', 'কি', 'হয', 'কাকে', 'বলে', 'মানে', 'এর', 'টা', 'এটা', 'ও', 'বোঝাও']);

/** Content words left once the term and the question glue are removed. */
function leftoverWords(tokens, term, chapters) {
  const termTokens = new Set(tokenize(term.term));
  const chapterWords = new Set(chapters.flatMap((c) => tokenize([c.title, ...(c.aliases || [])].join(' '))));
  const span = new Set(Array.from({ length: term.length }, (_, k) => term.index + k));
  return tokens.filter((tok, i) => !span.has(i) && !termTokens.has(tok) && !GLUE.has(tok) && !chapterWords.has(tok)
    && !hasAny([tok], LEX.question) && tok.length > 1).length;
}

/** A question about a glossary term: a definition, or something bigger that needs the AI. */
function termQuestion(tokens, term, ctx, raw, lang) {
  const entry = (ctx.glossary || []).find((g) => g.term === term.term);
  const rest = leftoverWords(tokens, term, ctx.chapters || []);
  if ((entry?.generic && rest > 0) || rest > 2) return { intent: 'question', text: raw, term: term.term };
  return { intent: 'define', term: term.term, heard: term.low ? term.heard : null, lang };
}

const chapterCache = new WeakMap();
function chapterKeywords(chapter) {
  let c = chapterCache.get(chapter);
  if (!c) { c = compileList([chapter.title, ...(chapter.aliases || [])]); chapterCache.set(chapter, c); }
  return c;
}

export function detectLanguage(tokens) {
  for (const { code, compiled } of LANGUAGES) if (hasAny(tokens, compiled)) return code;
  return null;
}

export function detectChapter(tokens, chapters) {
  for (const ch of chapters) if (hasAny(tokens, chapterKeywords(ch))) return ch.id;
  return null;
}

function detectNumber(tokens) {
  for (const { n, compiled } of NUMBERS) if (hasAny(tokens, compiled)) return n;
  return null;
}

/**
 * @param {string} text   what the student said (any script, any mix)
 * @param {object} ctx    { mode, chapters, glossary, currentChapterId }
 *   mode: onboarding | library | study | listen | confirm | fix | result | notes
 * @returns {{intent: string, [k: string]: any}}
 */
export function parseIntent(text, ctx = {}) {
  const raw = String(text ?? '');
  const tokens = tokenize(raw);
  const mode = ctx.mode || 'study';
  const chapters = ctx.chapters || [];
  const glossary = ctx.glossary || [];

  if (!tokens.length || tokens.join('').length < 2 || tokens.every((t) => FILLERS.has(t))) return { intent: 'noise' };

  const has = (key) => hasAny(tokens, LEX[key]);
  const n = tokens.length;
  const lang = detectLanguage(tokens);
  const isQuestion = /[?？]/.test(raw) || has('question');

  if (mode === 'onboarding') return lang ? { intent: 'setLanguage', lang } : { intent: 'unknown', text: raw };

  if (mode === 'confirm' || mode === 'fix') {
    if (has('no')) return { intent: 'no' };
    if (has('yes')) return { intent: 'yes' };
    if (has('grade') || has('skip')) return { intent: 'grade' };
  }

  if (n <= 3 && has('stop')) return { intent: 'stop' };
  if (n <= 3 && has('cancel')) return { intent: 'cancel' };
  if (has('help')) return { intent: 'help' };
  if (has('sample')) return { intent: 'sample', weak: WEAK_SAMPLE.test(normalize(raw)) };
  if (lang && n <= 5 && !has('explain') && !has('read') && !isQuestion) return { intent: 'setLanguage', lang };
  if (has('tryAgain')) return { intent: 'tryAgain' };
  if (has('test')) return { intent: mode === 'result' ? 'tryAgain' : 'test' };
  if (has('notes')) return { intent: has('read') ? 'readNotes' : 'notes' };
  if (has('library')) return { intent: 'library' };
  if (has('addText')) return { intent: 'addText' };

  const chapterId = detectChapter(tokens, chapters);
  if (chapterId && (has('open') || mode === 'library' || (n <= 2 && chapterId !== ctx.currentChapterId))) {
    return { intent: 'open', chapterId };
  }
  if (has('section')) {
    const num = detectNumber(tokens);
    if (num) return { intent: 'goto', index: num - 1 };
  }
  if (has('explainDifferent')) return { intent: 'explainDifferent', lang };

  const slower = has('slower');
  if (has('explain')) {
    const term = detectTerms(tokens, glossary).find((t) => !t.low);
    if (term && !hasAny(tokens, THIS_SECTION)) return termQuestion(tokens, term, ctx, raw, lang);
    return { intent: 'explain', lang, slower };
  }
  if (isQuestion) {
    const terms = detectTerms(tokens, glossary);
    const term = terms.find((t) => !t.low) || terms[0];
    if (term) return termQuestion(tokens, term, ctx, raw, lang);
    return { intent: 'question', text: raw };
  }
  if (n <= 3) {
    const term = detectTerms(tokens, glossary)[0];
    if (term) return { intent: 'define', term: term.term, heard: term.low ? term.heard : null };
  }
  if (has('read')) return { intent: 'read' };
  if (slower) return { intent: 'slower' };
  if (has('faster')) return { intent: 'faster' };
  if (has('next')) return { intent: 'next' };
  if (has('back')) return { intent: 'back' };
  if (has('repeat')) return { intent: 'repeat' };
  if (has('progress')) return { intent: 'progress' };
  if (has('no')) return { intent: 'no' };
  if (has('yes')) return { intent: 'yes' };
  if (has('grade')) return { intent: 'grade' };
  if (has('skip')) return { intent: 'next' };
  if (has('stop')) return { intent: 'stop' };
  if (chapterId) return { intent: 'open', chapterId };
  return { intent: 'unknown', text: raw };
}

/** During a Feynman Check almost everything is the explanation; only short commands escape. */
export function parseListenCommand(text) {
  const tokens = tokenize(text);
  if (!tokens.length || tokens.every((t) => FILLERS.has(t))) return { intent: 'noise' };
  if (tokens.length > 4) return null;
  const has = (key) => hasAny(tokens, LEX[key]);
  if (has('sample')) return { intent: 'sample', weak: WEAK_SAMPLE.test(normalize(text)) };
  if (has('stop')) return { intent: 'stop' };
  if (has('cancel') || has('back')) return { intent: 'cancel' };
  if (has('help')) return { intent: 'help' };
  if (has('repeat')) return { intent: 'repeat' };
  if (has('explain')) return { intent: 'explain' };
  if (has('skip') || has('next')) return { intent: 'next' };
  if (has('notes')) return { intent: 'notes' };
  if (has('library')) return { intent: 'library' };
  return null;
}
