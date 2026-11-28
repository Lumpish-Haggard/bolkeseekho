// BolkeSeekho: voice-first study companion. App controller: state, voice loop, screens.
import { CHAPTERS, findChapter, allGlossary, totalSections } from './engine/content.js';
import { parseIntent, parseListenCommand } from './engine/intents.js';
import { analyze, grade, readbackParts, PASS_SCORE } from './engine/grader.js';
import { t, chipsFor, LANG_META, LANG_ORDER } from './engine/i18n.js';
import { buildCustomChapter, splitSentences } from './engine/custom.js';
import { escapeRegExp, wordCount } from './engine/text.js';
import { Speaker, MicInput, DictationInput } from './voice.js';
import * as store from './store.js';
import * as api from './api.js';

// ---------- helpers ----------
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const plain = (title) => String(title).replace(/[?.!]+$/, ''); // titles sit inside sentences in every language
const pad = (n) => String(n).padStart(2, '0');
const localDay = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
const HTML_LANG = { hinglish: 'hi-Latn', hi: 'hi', ta: 'ta', bn: 'bn', en: 'en' };
const RATES = [0.7, 0.85, 1, 1.15, 1.3];
const NAV_FROM_AI = { next: 'next', back: 'back', repeat: 'repeat', test: 'test', notes: 'notes', read: 'read', explain: 'explain', help: 'help' };
const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches;

// ---------- state ----------
const saved = store.load();
const state = {
  lang: LANG_META[saved.lang] ? saved.lang : null,
  screen: 'onboarding',
  chapterId: saved.chapterId || null,
  sectionIdx: Number.isInteger(saved.sectionIdx) ? saved.sectionIdx : 0,
  explainText: null,
  highlight: null,
  feynman: null,
  notes: Array.isArray(saved.notes) ? saved.notes : [],
  mastery: saved.mastery && typeof saved.mastery === 'object' ? saved.mastery : {},
  streak: saved.streak || { count: 0, last: null },
  settings: { rate: 1, sendDelay: 2, confirmTerms: true, voiceOn: true, ...(saved.settings || {}) },
  custom: Array.isArray(saved.custom) ? saved.custom : [],
  totals: { voice: 0, typed: 0, chips: 0, understood: 0, missed: 0, sessions: 0, handsFreeSessions: 0, ...(saved.totals || {}) },
  session: { voice: 0, typed: 0, chips: 0, understood: 0, missed: 0, taps: 0 },
  ai: { enabled: false },
  reply: null,
  you: null,
  lastSpoken: null,
  pending: null,
  missStreak: 0,
  busy: false,
  interim: '',
  listening: false,
  speaking: false,
  handsFree: false,
  noSpeech: 0,
  warnedVoices: new Set(),
};
if (state.lang) state.screen = 'library';
if (state.chapterId && !findChapter(state.chapterId, state.custom)) state.chapterId = null;

const L = () => state.lang || 'en';
const chapters = () => [...CHAPTERS, ...state.custom];
const currentChapter = () => (state.chapterId ? findChapter(state.chapterId, state.custom) : null);
const currentSection = () => currentChapter()?.sections[clamp(state.sectionIdx, 0, currentChapter().sections.length - 1)] || null;

function mode() {
  if (state.screen === 'onboarding') return 'onboarding';
  if (state.screen === 'feynman') return state.feynman?.phase || 'listen';
  return state.screen;
}

function persist() {
  store.save({
    lang: state.lang, chapterId: state.chapterId, sectionIdx: state.sectionIdx, notes: state.notes, mastery: state.mastery,
    streak: state.streak, settings: state.settings, custom: state.custom, totals: state.totals,
  });
}

function glossaryContext() {
  const ch = currentChapter();
  const all = allGlossary(state.custom);
  return ch ? [...ch.glossary, ...all.filter((g) => g.chapterId !== ch.id)] : all;
}

function findTerm(term) {
  return glossaryContext().find((g) => g.term === term) || null;
}

function progress() {
  const sections = chapters().flatMap((c) => c.sections);
  const mastered = sections.filter((s) => (state.mastery[s.id]?.best ?? 0) >= PASS_SCORE).length;
  return { mastered, total: totalSections(state.custom) };
}

// ---------- elements & services ----------
const els = {
  screen: $('#screen'), replyText: $('#replyText'), you: $('#you'), chips: $('#chips'),
  input: $('#voiceInput'), mic: $('#micBtn'), sendFill: $('#sendFill'), interim: $('#interim'), langPill: $('#langPill'),
  aiPill: $('#aiPill'), streakPill: $('#streakPill'), progressFill: $('#progressFill'), progressLabel: $('#progressLabel'),
  settings: $('#settings'), settingsBody: $('#settingsBody'), toast: $('#toast'),
};

const speaker = new Speaker({
  onState: (on) => { state.speaking = on; document.body.classList.toggle('is-speaking', on); },
});

const mic = new MicInput({
  onResult: ({ text, confidence }) => {
    state.interim = '';
    state.noSpeech = 0;
    renderInterim();
    handleInput(text, { source: 'mic', confidence });
  },
  onInterim: (text) => { state.interim = text; renderInterim(); },
  onState: (s, info) => {
    state.listening = s === 'listening';
    document.body.classList.toggle('is-listening', state.listening);
    renderMic();
    renderInterim();
    if (mode() === 'listen') renderScreen();
    if (s === 'idle') onMicIdle(info);
  },
  onError: onMicError,
});

const dictation = new DictationInput(els.input, {
  onSubmit: (text, meta) => handleInput(text, meta),
  delay: () => Math.round((state.settings.sendDelay + (mode() === 'listen' ? 1.5 : 0)) * 1000),
  onPending: showSendTimer,
});

// ---------- speaking ----------
async function say(text, opts = {}) {
  const lang = opts.lang || L();
  const voiceLang = opts.voiceLang || lang;
  state.reply = { text, lang, kind: opts.kind || 'reply' };
  document.body.classList.remove('is-busy');
  if (opts.kind !== 'status') state.lastSpoken = { text, opts: { ...opts, lang, voiceLang } };
  renderReply();
  if (state.settings.voiceOn === false || opts.silent) { maybeListen(); return { spoken: false, reason: 'muted' }; }
  mic.abort(); // also stops a session that is still opening, so the mic never hears the reply
  const res = await speaker.speak(opts.sentences || text, voiceLang, { rate: state.settings.rate, onChunk: opts.onChunk });
  opts.onDone?.(res);
  if (res.reason === 'no-voice') warnNoVoice(voiceLang);
  if (res.reason !== 'cancelled') maybeListen();
  return res;
}

function showThinking() {
  state.reply = { text: t('thinking', L()), lang: L(), kind: 'status' };
  document.body.classList.add('is-busy');
  renderReply();
}

function warnNoVoice(lang) {
  if (state.warnedVoices.has(lang)) return;
  state.warnedVoices.add(lang);
  toast(t('noVoice', 'en', { lang: LANG_META[lang]?.label || lang }));
}

function stopTalking() {
  speaker.stop();
  highlightSentence(-1);
}

function bumpRate(dir) {
  let i = RATES.findIndex((r) => Math.abs(r - state.settings.rate) < 0.01);
  if (i < 0) i = 2;
  state.settings.rate = RATES[clamp(i + dir, 0, RATES.length - 1)];
  persist();
}

function changeRate(dir) {
  bumpRate(dir);
  toast(t(dir < 0 ? 'slower' : 'faster', L()));
  return repeatLast();
}

function repeatLast() {
  const last = state.lastSpoken;
  if (!last) return say(t('help', L()));
  return say(last.text, last.opts);
}

// ---------- listening ----------
function maybeListen() {
  if (!state.handsFree || mic.listening || speaker.speaking || state.busy || document.visibilityState !== 'visible') return;
  mic.start(LANG_META[L()].speech);
}

// Every session end re-arms hands-free listening. maybeListen() waits while a reply is
// spoken or graded, and say() listens again when the reply ends. (Waiting only for say()
// left the mic off for good when a reply was not spoken: no voice installed, or voice off.)
function onMicIdle() {
  if (!state.handsFree) return;
  if (state.noSpeech >= 6) {
    state.handsFree = false;
    renderMic();
    toast('Listening paused. Tap the mic, or use Wispr Flow, to continue.');
    return;
  }
  setTimeout(maybeListen, 300);
}

function onMicError(err) {
  if (err === 'no-speech') { state.noSpeech += 1; return; }
  if (err === 'aborted') return;
  state.handsFree = false;
  if (err === 'not-allowed' || err === 'service-not-allowed') toast(t('micDenied'));
  else if (err === 'network') toast(t('micNetwork'));
  else if (err === 'audio-capture') toast('No microphone was found. Wispr Flow or typing still work.');
  else toast(`Speech recognition stopped (${err}).`);
  renderMic();
}

function toggleMic() {
  if (!mic.supported) { toast(t('micUnsupported')); return; }
  if (state.handsFree || mic.listening) {
    state.handsFree = false;
    mic.abort();
    renderMic();
    return;
  }
  state.handsFree = true;
  state.noSpeech = 0;
  speaker.stop();
  renderMic();
  maybeListen();
}

// ---------- metrics ----------
function countInput(source) {
  const key = source === 'mic' || source === 'dictation' ? 'voice' : source === 'chip' ? 'chips' : 'typed';
  state.session[key] += 1;
  state.totals[key] += 1;
}
function understood() {
  state.missStreak = 0;
  state.session.understood += 1;
  state.totals.understood += 1;
}
function countMiss() {
  state.session.missed += 1;
  state.totals.missed += 1;
}

// ---------- input routing ----------
async function handleInput(text, meta = {}) {
  const clean = String(text ?? '').trim();
  if (!clean) return;
  speaker.stop();
  highlightSentence(-1);
  countInput(meta.source || 'keyboard');
  state.you = { text: clean, source: meta.source || 'keyboard' };
  renderYou();
  if (state.busy) return;
  const m = mode();

  if (state.pending?.kind === 'asr') {
    const pending = state.pending;
    state.pending = null;
    const yn = parseIntent(clean, { mode: 'confirm' }).intent;
    if (yn === 'yes') { understood(); return route(pending.text, { ...pending.meta, confidence: 1 }); }
    if (yn === 'no') { understood(); return say(t('noise', L())); }
  }
  // Low-confidence recognition from the browser mic: confirm before acting on it.
  if (meta.source === 'mic' && meta.confidence > 0 && meta.confidence < 0.45 && !['listen', 'onboarding', 'confirm', 'fix'].includes(m)) {
    state.pending = { kind: 'asr', text: clean, meta };
    return say(t('confirmAsr', L(), { heard: clean }));
  }
  return route(clean, meta);
}

async function route(text, meta = {}) {
  const m = mode();
  if (m === 'onboarding') return onboarding(text);
  if (m === 'listen') return feynmanListen(text, meta);
  if (m === 'confirm') return feynmanConfirm(text);
  if (m === 'fix') return feynmanFix(text);
  if (m === 'grading') return undefined;
  const intent = parseIntent(text, {
    mode: m === 'feynman' ? 'result' : m,
    chapters: chapters(),
    glossary: glossaryContext(),
    currentChapterId: state.chapterId,
  });
  return dispatch(intent, text);
}

function onboarding(text) {
  const intent = parseIntent(text, { mode: 'onboarding' });
  if (intent.intent === 'setLanguage') { understood(); return setLanguage(intent.lang); }
  countMiss();
  return say(t('askLanguage', 'en'), { lang: 'en' });
}

const NEEDS_CHAPTER = new Set(['explain', 'explainDifferent', 'read', 'next', 'back', 'goto', 'test', 'tryAgain', 'sample']);

async function dispatch(intent, text) {
  const kind = intent.intent;
  if (kind !== 'unknown' && kind !== 'noise') understood();
  if (NEEDS_CHAPTER.has(kind) && !currentChapter()) {
    if (kind === 'back' && state.screen !== 'library') return goLibrary();
    return say(t('noChapter', L()));
  }
  switch (kind) {
    case 'noise': countMiss(); return say(t('noise', L()));
    case 'unknown': return unknown(text);
    case 'help': return say(t('help', L()));
    case 'setLanguage': return setLanguage(intent.lang);
    case 'library': return goLibrary();
    case 'open': return openChapter(intent.chapterId);
    case 'notes': return goNotes();
    case 'readNotes': return readNotes();
    case 'addText': return goPaste();
    case 'progress': return sayProgress();
    case 'stop': return stopTalking();
    case 'cancel': return backToStudy(true);
    case 'slower': return changeRate(-1);
    case 'faster': return changeRate(1);
    case 'repeat': return repeatLast();
    case 'explain': return explain(intent);
    case 'explainDifferent': return explain({ ...intent, different: true });
    case 'define': return define(intent);
    case 'question': return question(intent.text || text, intent.term);
    case 'read': return readSection();
    case 'next': return state.screen === 'notes' ? backToStudy() : gotoSection(state.sectionIdx + 1);
    case 'back': return state.screen === 'notes' || state.screen === 'feynman' ? backToStudy() : gotoSection(state.sectionIdx - 1);
    case 'goto': return gotoSection(intent.index);
    case 'test':
    case 'tryAgain': return startFeynman();
    case 'sample': return useSample(intent.weak);
    default: return nudge();
  }
}

function nudge() {
  if (state.screen === 'library') return say(t('library', L()));
  if (state.screen === 'notes') return goNotes();
  const ch = currentChapter();
  const sec = currentSection();
  if (!ch) return say(t('library', L()));
  return say(t('opened', L(), { chapter: ch.title, n: state.sectionIdx + 1, total: ch.sections.length, title: plain(sec.title) }));
}

function unknown(text) {
  if (state.ai.enabled && currentSection() && state.screen !== 'library') return question(text);
  countMiss();
  state.missStreak += 1;
  return say(t(state.missStreak >= 2 ? 'notUnderstoodAgain' : 'notUnderstood', L()));
}

// ---------- navigation ----------
function setLanguage(lang) {
  const first = !state.lang || state.screen === 'onboarding';
  state.lang = lang;
  persist();
  if (first) {
    state.screen = 'library';
    state.totals.sessions += 1;
    persist();
    render();
    return say(t('welcome', lang));
  }
  render();
  return say(t('languageSwitched', lang, { lang: LANG_META[lang].native }));
}

function goLibrary() {
  state.screen = 'library';
  state.feynman = null;
  render();
  return say(t('library', L()));
}

function openChapter(id) {
  const ch = findChapter(id, state.custom);
  if (!ch) return unknown(id);
  const firstOpen = ch.sections.findIndex((s) => (state.mastery[s.id]?.best ?? 0) < PASS_SCORE);
  state.chapterId = id;
  state.sectionIdx = firstOpen < 0 ? 0 : firstOpen;
  state.screen = 'study';
  state.feynman = null;
  state.explainText = null;
  persist();
  render();
  const sec = currentSection();
  return say(t('opened', L(), { chapter: ch.title, n: state.sectionIdx + 1, total: ch.sections.length, title: plain(sec.title) }));
}

function gotoSection(i) {
  const ch = currentChapter();
  if (i >= ch.sections.length) { backToStudy(false, true); return say(t('lastSection', L())); }
  if (i < 0) { backToStudy(false, true); return say(t('firstSection', L())); }
  state.sectionIdx = i;
  state.screen = 'study';
  state.feynman = null;
  state.explainText = null;
  persist();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return say(t('section', L(), { n: i + 1, total: ch.sections.length, title: plain(currentSection().title) }));
}

function backToStudy(announce = false, quiet = false) {
  if (!currentChapter()) return goLibrary();
  state.screen = 'study';
  state.feynman = null;
  render();
  if (quiet) return undefined;
  if (announce) return say(t('cancelled', L()));
  const ch = currentChapter();
  return say(t('section', L(), { n: state.sectionIdx + 1, total: ch.sections.length, title: plain(currentSection().title) }));
}

function goNotes() {
  state.screen = 'notes';
  state.feynman = null;
  render();
  return say(state.notes.length ? t('notes', L(), { count: state.notes.length }) : t('noNotes', L()));
}

function readNotes() {
  if (state.screen !== 'notes') { state.screen = 'notes'; state.feynman = null; render(); }
  if (!state.notes.length) return say(t('noNotes', L()));
  const text = state.notes.slice(0, 3).map((n) => `${n.sectionTitle}. ${n.bullets.join(' ')}`).join(' ');
  return say(text, { lang: 'en' });
}

function goPaste() {
  state.screen = 'paste';
  state.feynman = null;
  render();
  setTimeout(() => $('#customTitle')?.focus(), 50);
  return say('Paste English text from your book or notes, give it a title, then press “Add chapter”.', { lang: 'en', silent: true });
}

function sayProgress() {
  const { mastered, total } = progress();
  return say(t('progress', L(), { mastered, total, streak: state.streak.count || 0 }));
}

// ---------- studying ----------
async function explain(intent = {}) {
  const sec = currentSection();
  if (intent.lang && intent.lang !== state.lang) { state.lang = intent.lang; persist(); }
  if (intent.slower) bumpRate(-1);
  const lang = L();
  state.screen = 'study';
  state.feynman = null;
  const stock = sec.explain?.[lang];
  const show = (text, by) => { state.explainText = { text, lang, by }; render(); scrollToExplain(); };

  if (stock && !intent.different) { show(stock, 'built-in'); return say(stock); }
  if (state.ai.enabled) {
    render();
    showThinking();
    const r = await api.ai('explain', { lang, chapterTitle: currentChapter().title, sectionTitle: sec.title, sectionText: sec.text, fresh: Boolean(intent.different) });
    if (r.ok && r.data?.reply) { show(r.data.reply, 'ai'); return say(r.data.reply); }
    if (stock) { show(stock, 'built-in'); return say(`${t('aiFailed', lang)} ${stock}`); }
    return say(t('aiQuestionFailed', lang));
  }
  if (stock) { show(stock, 'built-in'); return say(`${t('needsKeyDifferent', lang)} ${stock}`); }
  render();
  return say(t('needsKeyExplain', lang));
}

function define(intent) {
  const entry = findTerm(intent.term);
  if (!entry) return unknown(intent.term);
  if (intent.lang && intent.lang !== state.lang) { state.lang = intent.lang; persist(); }
  const lang = L();
  const def = entry.def[lang] || entry.def.en;
  const heard = intent.heard ? ` ${t('heardAs', lang, { heard: intent.heard })}` : '';
  state.highlight = entry.term;
  if (state.screen === 'study') render();
  return say(`${cap(entry.term)}: ${def}${heard}`);
}

async function question(text, term = null) {
  const lang = L();
  const sec = currentSection();
  if (!state.ai.enabled) {
    return say(t('keyNotSet', lang, { example: term || sec?.askTerm || 'entropy' }));
  }
  showThinking();
  const r = await api.ai('answer', {
    lang, chapterTitle: currentChapter()?.title || '', sectionTitle: sec?.title || '', sectionText: sec?.text || '', question: text,
  });
  if (r.ok && r.data) {
    const nav = NAV_FROM_AI[r.data.intent];
    if (nav) { understood(); return dispatch({ intent: nav }, text); }
    if (r.data.reply) { understood(); return say(r.data.reply); }
  }
  countMiss();
  return say(t('aiQuestionFailed', lang));
}

function readSection() {
  const sec = currentSection();
  state.screen = 'study';
  state.feynman = null;
  render();
  return say(t('reading', L(), { n: state.sectionIdx + 1 }), {
    voiceLang: 'en',
    sentences: splitSentences(sec.text),
    onChunk: highlightSentence,
    onDone: () => highlightSentence(-1),
  });
}

function highlightSentence(i) {
  document.querySelectorAll('#passage .s.reading').forEach((el) => el.classList.remove('reading'));
  if (i < 0) return;
  const el = document.querySelector(`#passage .s[data-s="${i}"]`);
  if (el) { el.classList.add('reading'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
}

function scrollToExplain() {
  requestAnimationFrame(() => $('#explainCard')?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
}

// ---------- Spoken Feynman Check ----------
function startFeynman({ silent = false } = {}) {
  const sec = currentSection();
  const prev = state.feynman;
  state.feynman = {
    phase: 'listen', sectionId: sec.id, transcript: '', analysis: null, result: null, extra: [],
    attempt: prev?.sectionId === sec.id ? prev.attempt + 1 : (state.mastery[sec.id]?.attempts || 0) + 1,
  };
  state.screen = 'feynman';
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (!silent) return say(t('feynmanPrompt', L(), { title: plain(sec.title) }));
  return undefined;
}

function useSample(weak = false) {
  const sec = currentSection();
  const pool = weak ? sec.weakSamples : sec.samples;
  if (state.screen !== 'feynman' || state.feynman?.phase !== 'listen') startFeynman({ silent: true });
  if (!pool) return say(t('noSample', L()));
  const text = pool[L()] || pool.hinglish || pool.en;
  state.feynman.transcript = '';
  state.you = { text, source: 'sample' };
  renderYou();
  return feynmanListen(text, { source: 'sample' });
}

function feynmanListen(text, meta = {}) {
  const f = state.feynman;
  const cmd = meta.source === 'sample' ? null : parseListenCommand(text);
  if (cmd) {
    if (cmd.intent === 'noise') { countMiss(); return say(t('noise', L())); }
    understood();
    switch (cmd.intent) {
      case 'sample': return useSample(cmd.weak);
      case 'stop': return stopTalking();
      case 'cancel': return backToStudy(true);
      case 'help':
      case 'repeat': return say(t('feynmanPrompt', L(), { title: plain(currentSection().title) }));
      case 'explain': return explain({});
      case 'next': return gotoSection(state.sectionIdx + 1);
      case 'notes': return goNotes();
      case 'library': return goLibrary();
      default: break;
    }
  }
  if (meta.source !== 'sample') understood();
  f.transcript = f.transcript ? `${f.transcript} ${text}` : text;
  if (wordCount(f.transcript) < 6) { render(); return say(t('tooShort', L())); }
  f.analysis = analyze(f.transcript, currentChapter().glossary);
  if (!state.settings.confirmTerms) return gradeNow({ acceptLow: true });
  f.phase = 'confirm';
  render();
  return say(readbackText(f.analysis));
}

function readbackText(analysis) {
  const lang = L();
  const { sure, unsure } = readbackParts(analysis);
  if (!sure.length && !unsure.length) return t('readbackNone', lang);
  const parts = [];
  if (sure.length) parts.push(t('readbackHeard', lang, { terms: sure.join(', ') }));
  if (unsure.length) parts.push(t('unsure', lang, { unsure: unsure.map((u) => t('unsureItem', lang, { heard: u.heard, term: u.term })).join(' ') }));
  parts.push(t('readbackAsk', lang));
  return parts.join(' ');
}

function feynmanConfirm(text) {
  const f = state.feynman;
  const intent = parseIntent(text, { mode: 'confirm' });
  if (intent.intent === 'yes' || intent.intent === 'grade') { understood(); return gradeNow({ acceptLow: true }); }
  if (intent.intent === 'no') { understood(); f.phase = 'fix'; render(); return say(t('fixPrompt', L())); }
  const cmd = parseListenCommand(text);
  if (cmd && ['cancel', 'stop', 'sample', 'help', 'repeat'].includes(cmd.intent)) {
    understood();
    if (cmd.intent === 'stop') return stopTalking();
    if (cmd.intent === 'cancel') return backToStudy(true);
    if (cmd.intent === 'sample') return useSample(cmd.weak);
    return say(readbackText(f.analysis));
  }
  if (wordCount(text) >= 6) {
    understood();
    f.transcript = `${f.transcript} ${text}`;
    f.analysis = analyze(f.transcript, currentChapter().glossary);
    render();
    return say(readbackText(f.analysis));
  }
  countMiss();
  return say(t('readbackAsk', L()));
}

function feynmanFix(text) {
  const f = state.feynman;
  understood();
  const intent = parseIntent(text, { mode: 'fix' });
  if (intent.intent === 'grade' || intent.intent === 'yes') return gradeNow({ acceptLow: false });
  const found = [...new Set(analyze(text, currentChapter().glossary).terms.map((x) => x.term))];
  if (found.length) {
    f.extra.push(...found);
    return gradeNow({ acceptLow: false, extra: f.extra, prefix: t('fixed', L(), { terms: found.join(', ') }) });
  }
  return gradeNow({ acceptLow: false, prefix: t('fixNone', L()) });
}

function fromRubric(rubric, lang) {
  const gap = rubric.misconception ? null : rubric.missing[0] || null;
  return {
    score: rubric.score,
    passed: rubric.passed,
    right: rubric.covered.map((c) => c.label),
    gap: gap?.label || null,
    hint: gap ? gap.hint?.[lang] || gap.hint?.en || null : null,
    fix: rubric.misconception ? rubric.misconception.fix[lang] || rubric.misconception.fix.en : null,
    notes: rubric.notes,
    copied: rubric.copied,
    tooShort: rubric.tooShort,
    gradedBy: 'rubric',
  };
}

function fromAi(data, rubric) {
  let score = clamp(Math.round(Number(data.score) || 0), 0, 10);
  if (rubric.copied) score = Math.min(score, 4);
  if (rubric.tooShort) score = Math.min(score, 3);
  const notes = (data.notes || []).map((n) => String(n).replace(/^[-•*\s]+/, '').trim()).filter(Boolean).slice(0, 5);
  return {
    score,
    passed: score >= PASS_SCORE,
    right: (data.right || []).filter(Boolean).slice(0, 3),
    gap: data.misconception ? null : data.gap || null,
    hint: data.misconception ? null : data.hint || null,
    fix: data.misconception ? [data.gap, data.hint].filter(Boolean).join(' ') : null,
    notes: notes.length ? notes : rubric.notes,
    copied: rubric.copied,
    tooShort: rubric.tooShort,
    gradedBy: 'ai',
  };
}

function feedbackText(result, lang) {
  const right = result.right.length ? result.right.join(', ') : t('nothingYet', lang);
  const gap = result.fix
    ? t('checkThis', lang, { fix: result.fix })
    : result.gap ? t('gapLine', lang, { gap: result.gap, hint: result.hint || '' }) : t('allCovered', lang);
  const lead = result.copied ? `${t('copied', lang)} ` : result.tooShort ? `${t('tooShort', lang)} ` : '';
  return lead + t(result.passed ? 'pass' : 'fail', lang, { score: result.score, right, gap });
}

async function gradeNow({ acceptLow, extra = [], prefix = '' }) {
  const f = state.feynman;
  const ch = currentChapter();
  const sec = currentSection();
  const lang = L();
  f.phase = 'grading';
  state.busy = true;
  render();
  state.reply = { text: t('grading', lang), lang, kind: 'status' };
  document.body.classList.add('is-busy');
  renderReply();

  const rubric = grade(f.analysis, sec, { acceptLow, extraTerms: extra });
  let result = fromRubric(rubric, lang);
  let note = '';
  if (state.ai.enabled) {
    const { sure, unsure } = readbackParts(f.analysis);
    const r = await api.ai('grade', {
      lang,
      chapterTitle: ch.title,
      sectionTitle: sec.title,
      sectionText: sec.text,
      concepts: sec.concepts.map((c) => `${c.label}: ${c.note}`.slice(0, 400)), // server limit; pasted texts can have long sentences
      transcript: f.transcript,
      confirmedTerms: [...sure, ...(acceptLow ? unsure.map((u) => u.term) : []), ...extra],
      unsureTerms: acceptLow ? [] : unsure.map((u) => u.heard),
    });
    if (r.ok && r.data) result = fromAi(r.data, rubric);
    else note = t('aiFailed', lang);
  }
  state.busy = false;
  f.result = result;
  f.phase = 'result';
  recordAttempt(ch, sec, result, f.transcript);
  render();
  return say([prefix, note, feedbackText(result, lang)].filter(Boolean).join(' '));
}

function recordAttempt(ch, sec, result, transcript) {
  const m = state.mastery[sec.id] || { best: 0, attempts: 0 };
  m.attempts += 1;
  m.last = result.score;
  m.best = Math.max(m.best, result.score);
  if (result.passed) {
    m.passedAt = m.passedAt || new Date().toISOString();
    const now = Date.now();
    const note = {
      id: `${sec.id}-${now.toString(36)}`,
      chapterId: ch.id,
      sectionId: sec.id,
      chapterTitle: ch.title,
      sectionTitle: sec.title,
      score: result.score,
      bullets: result.notes,
      original: transcript,
      lang: L(),
      gradedBy: result.gradedBy,
      createdAt: new Date(now).toISOString(),
      recheckAt: new Date(now + 7 * 864e5).toISOString(),
    };
    state.notes = [note, ...state.notes.filter((n) => n.sectionId !== sec.id)];
    bumpStreak();
  }
  state.mastery[sec.id] = m;
  persist();
}

function bumpStreak() {
  const today = localDay();
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = localDay(y);
  if (state.streak.last === today) return;
  state.streak = { count: state.streak.last === yesterday ? (state.streak.count || 0) + 1 : 1, last: today };
}

// ---------- custom text ----------
function saveCustom() {
  const title = $('#customTitle')?.value || '';
  const text = $('#customText')?.value || '';
  try {
    const ch = buildCustomChapter(title, text);
    state.custom.push(ch);
    persist();
    openChapter(ch.id);
    say(t('customSaved', L(), { title: plain(ch.title), n: ch.sections.length }));
  } catch (err) {
    toast(err.message);
  }
}

function deleteCustom(id) {
  state.custom = state.custom.filter((c) => c.id !== id);
  if (state.chapterId === id) state.chapterId = null;
  persist();
  render();
}

function exportNotes() {
  if (!state.notes.length) { toast('No notes yet.'); return; }
  const body = state.notes.map((n) => [
    `${n.chapterTitle}: ${n.sectionTitle} (${n.score}/10, ${fmtDate(n.createdAt)})`,
    ...n.bullets.map((b) => `  • ${b}`),
    '',
    `  In my words (${LANG_META[n.lang]?.label || n.lang}): ${n.original}`,
  ].join('\n')).join('\n\n----\n\n');
  const blob = new Blob([`BolkeSeekho revision notes\n\n${body}\n`], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'bolkeseekho-notes.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- rendering ----------
function render() {
  renderTop();
  renderScreen();
  renderChips();
  renderMic();
  document.documentElement.lang = HTML_LANG[L()] || 'en';
}

function renderTop() {
  els.langPill.textContent = state.lang ? LANG_META[state.lang].native : 'Language';
  els.aiPill.innerHTML = state.ai.enabled ? 'AI: Claude' : 'Offline<span class="ai-extra"> · key not set</span>';
  els.aiPill.classList.toggle('on', Boolean(state.ai.enabled));
  els.aiPill.title = state.ai.enabled
    ? `Open questions, fresh explanations and grading use ${state.ai.model || 'Claude'}.`
    : 'ANTHROPIC_API_KEY is not set. Commands, built-in explanations, glossary answers and rubric grading all work offline.';
  els.streakPill.textContent = `🔥 ${state.streak.count || 0}`;
  const { mastered, total } = progress();
  els.progressFill.style.width = `${total ? Math.round((100 * mastered) / total) : 0}%`;
  els.progressLabel.textContent = `${mastered} / ${total} sections mastered`;
}

function renderScreen() {
  const keep = state.screen === 'paste' ? { title: $('#customTitle')?.value, text: $('#customText')?.value } : null;
  const views = { onboarding: viewOnboarding, library: viewLibrary, study: viewStudy, feynman: viewFeynman, notes: viewNotes, paste: viewPaste };
  els.screen.innerHTML = (views[state.screen] || viewLibrary)();
  els.screen.dataset.screen = state.screen;
  if (keep) {
    if (keep.title != null) $('#customTitle').value = keep.title;
    if (keep.text != null) $('#customText').value = keep.text;
  }
  if (state.screen === 'feynman' && ['confirm', 'fix', 'result'].includes(state.feynman?.phase)) {
    requestAnimationFrame(() => els.screen.querySelector('[data-focus]')?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
  }
}

function viewOnboarding() {
  const langs = [
    ['Hinglish', 'Hinglish', 'Hindi + English, Roman script'],
    ['हिंदी', 'हिंदी', 'Hindi'],
    ['தமிழ்', 'தமிழ்', 'Tamil'],
    ['বাংলা', 'বাংলা', 'Bengali'],
    ['English', 'English', 'Simple English'],
  ];
  return `
  <section class="onboard">
    <p class="eyebrow">Bolke seekho · learn by speaking</p>
    <h1>Which language do you think in?</h1>
    <div class="multi">
      <p lang="hi">आप किस भाषा में सोचते हैं?</p>
      <p lang="ta">நீங்கள் எந்த மொழியில் யோசிக்கிறீர்கள்?</p>
      <p lang="bn">তুমি কোন ভাষায় ভাবো?</p>
    </div>
    <div class="lang-grid">
      ${langs.map(([say, big, small]) => `<button class="lang-card" data-say="${esc(say)}"><b>${esc(big)}</b><span>${esc(small)}</span></button>`).join('')}
    </div>
    <div class="card howto">
      <h2>Three ways to talk to it</h2>
      <ol>
        <li><b>Wispr Flow (best):</b> hold your Flow hotkey and speak. The box at the bottom always has focus, so your words land there and send themselves after a short pause.</li>
        <li><b>Mic button:</b> tap it once for hands-free mode in Chrome or Edge. It listens again after every reply.</li>
        <li><b>Keyboard:</b> type and press Enter.</li>
      </ol>
      <p class="muted">Answer now: say “Hinglish”, “தமிழ்”, “বাংলা”…</p>
    </div>
  </section>`;
}

function viewLibrary() {
  const cards = chapters().map((c) => {
    const done = c.sections.filter((s) => (state.mastery[s.id]?.best ?? 0) >= PASS_SCORE).length;
    const pct = Math.round((100 * done) / c.sections.length);
    return `
      <div class="chapter-card${c.custom ? ' custom' : ''}">
        <button class="chapter-open" data-say="open ${esc(c.title)}">
          <span class="subject">${esc(c.subject)}</span>
          <b>${esc(c.title)}</b>
          <span class="meter" aria-hidden="true"><span style="width:${pct}%"></span></span>
          <span class="meta">${done} / ${c.sections.length} sections mastered</span>
        </button>
        ${c.custom ? `<button class="icon-btn small" data-action="deleteCustom" data-id="${esc(c.id)}" aria-label="Delete ${esc(c.title)}">✕</button>` : ''}
      </div>`;
  }).join('');
  return `
  <section class="library">
    <h1>Chapters</h1>
    <p class="muted">The textbook stays in English. Explanations, hints and feedback come in ${esc(LANG_META[L()].native)}.</p>
    <div class="chapter-list">
      ${cards}
      <button class="chapter-card add" data-action="paste"><b>＋ Add your own text</b><span class="meta">Paste a page from your notes or textbook</span></button>
    </div>
  </section>`;
}

function passageHtml(sec, glossary) {
  const terms = glossary.map((g) => g.term).filter(Boolean).sort((a, b) => b.length - a.length);
  const re = terms.length ? new RegExp(`\\b(${terms.map(escapeRegExp).join('|')})(s|es)?\\b`, 'gi') : null;
  return splitSentences(sec.text).map((s, i) => {
    let h = esc(s);
    if (re) h = h.replace(re, (m) => `<mark class="term${state.highlight && m.toLowerCase().startsWith(state.highlight) ? ' hot' : ''}">${m}</mark>`);
    return `<span class="s" data-s="${i}">${h}</span>`;
  }).join(' ');
}

function viewStudy() {
  const ch = currentChapter();
  if (!ch) return viewLibrary();
  const sec = currentSection();
  const lower = sec.text.toLowerCase();
  const terms = ch.glossary.filter((g) => lower.includes(g.term.toLowerCase()));
  const tabs = ch.sections.map((s, i) => {
    const best = state.mastery[s.id]?.best;
    const cls = [i === state.sectionIdx ? 'current' : '', best >= PASS_SCORE ? 'mastered' : ''].join(' ');
    return `<button class="tab ${cls}" data-say="section ${i + 1}" aria-current="${i === state.sectionIdx}">${i + 1}${best >= PASS_SCORE ? ' ✓' : ''}</button>`;
  }).join('');
  const ex = state.explainText;
  return `
  <section class="study">
    <nav class="crumbs"><button class="link" data-say="chapters">Chapters</button><span>/</span><span>${esc(ch.title)}</span></nav>
    <div class="tabs" role="tablist" aria-label="Sections">${tabs}</div>
    <h1 class="sec-title">${esc(sec.title)}</h1>
    <article class="passage" id="passage" lang="en">${passageHtml(sec, ch.glossary)}</article>
    ${terms.length ? `<div class="terms"><span class="label">Key terms</span>${terms.map((g) => `<button class="term-chip" data-say="What is ${esc(g.term)}?">${esc(g.term)}</button>`).join('')}</div>` : ''}
    ${ex ? `<div class="card explain" id="explainCard" data-focus><div class="badge">${esc(LANG_META[ex.lang]?.native || ex.lang)} · ${ex.by === 'ai' ? 'Claude' : 'built-in explanation'}</div><p lang="${HTML_LANG[ex.lang] || 'en'}">${esc(ex.text)}</p></div>` : ''}
    <div class="actions">
      <button class="primary" data-say="test me">Spoken Feynman Check</button>
      <button class="ghost" data-say="explain">Explain in ${esc(LANG_META[L()].native)}</button>
    </div>
  </section>`;
}

function ring(score) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const off = c * (1 - score / 10);
  return `<svg viewBox="0 0 100 100" class="ring" role="img" aria-label="Score ${score} out of 10">
    <circle cx="50" cy="50" r="${r}" class="ring-bg"/>
    <circle cx="50" cy="50" r="${r}" class="ring-fg ${score >= PASS_SCORE ? 'pass' : 'fail'}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 50 50)"/>
    <text x="50" y="57" text-anchor="middle" class="ring-num">${score}</text><text x="50" y="74" text-anchor="middle" class="ring-of">/ 10</text>
  </svg>`;
}

function viewFeynman() {
  const ch = currentChapter();
  const sec = currentSection();
  const f = state.feynman;
  const lang = L();
  let body = '';
  if (f.phase === 'listen') {
    body = `
      <div class="listen-orb" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="big">${state.listening ? 'Listening…' : 'Hold your Wispr Flow key and explain for 20–40 seconds.'}</p>
      <p class="muted">Mix languages freely. Pauses are fine: it waits ${state.settings.sendDelay + 1.5} seconds before sending.</p>
      ${f.transcript ? `<blockquote class="transcript">${esc(f.transcript)}</blockquote>` : ''}`;
  } else if (f.phase === 'confirm' || f.phase === 'fix') {
    const { sure, unsure } = readbackParts(f.analysis);
    body = `
      <div class="card" data-focus>
        <h3>You said</h3>
        <blockquote class="transcript">${esc(f.transcript)}</blockquote>
        <h3>Key terms I heard</h3>
        <div class="heard">
          ${sure.map((s) => `<span class="heard-term ok">✓ ${esc(s)}</span>`).join('')}
          ${unsure.map((u) => `<span class="heard-term unsure">? “${esc(u.heard)}” → ${esc(u.term)}</span>`).join('')}
          ${!sure.length && !unsure.length ? '<span class="muted">none yet</span>' : ''}
        </div>
        <p class="big">${f.phase === 'fix' ? 'Say the word I got wrong, or “grade”.' : 'Say “yes” to grade, or “no” to fix a word.'}</p>
        <p class="muted">Words I was unsure about can only earn marks. They never cost you any.</p>
      </div>`;
  } else if (f.phase === 'grading') {
    body = '<div class="grading"><span class="spinner" aria-hidden="true"></span><p class="big">Checking your explanation…</p></div>';
  } else if (f.phase === 'result') {
    const r = f.result;
    body = `
      <div class="card result" data-focus>
        ${ring(r.score)}
        <div class="result-body">
          <h3>You got right</h3>
          ${r.right.length ? `<ul>${r.right.map((x) => `<li lang="${HTML_LANG[lang]}">${esc(x)}</li>`).join('')}</ul>` : `<p class="muted">${esc(t('nothingYet', lang))}</p>`}
          ${r.fix ? `<h3>Check this</h3><p lang="${HTML_LANG[lang]}">${esc(r.fix)}</p>` : ''}
          ${r.gap ? `<h3>One gap</h3><p>${esc(r.gap)}</p>` : ''}
          ${r.hint ? `<h3>Hint</h3><p lang="${HTML_LANG[lang]}">${esc(r.hint)}</p>` : ''}
          ${r.copied ? `<p class="flag">${esc(t('copied', lang))}</p>` : ''}
        </div>
      </div>
      ${r.passed ? `<div class="card notes-preview"><h3>Saved exam-ready English notes</h3><ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>` : ''}
      <p class="graded-by">Graded by ${r.gradedBy === 'ai' ? `Claude (${esc(state.ai.model || 'AI')}), with the rubric's copy and length checks` : 'the offline rubric: key concepts, misconceptions, copy check'}.</p>`;
  }
  return `
  <section class="feynman">
    <nav class="crumbs"><button class="link" data-say="chapters">Chapters</button><span>/</span><button class="link" data-say="go back">${esc(ch.title)}</button></nav>
    <span class="badge">Spoken Feynman Check · attempt ${f.attempt}</span>
    <h1>Explain “${esc(sec.title)}” in your own words</h1>
    <p class="muted">As if teaching a friend, in Hinglish, Hindi, Tamil, Bengali or English.</p>
    ${body}
  </section>`;
}

function metricsCard() {
  const s = state.session;
  const T = state.totals;
  const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '–');
  const inputs = s.voice + s.typed + s.chips;
  const totalInputs = T.voice + T.typed + T.chips;
  return `
  <section class="card metrics">
    <h2>Voice-first check</h2>
    <p class="muted">The pilot targets: 80% of sessions with no screen taps, and 90% of commands understood first time.</p>
    <div class="stats">
      <div class="stat"><b>${pct(s.voice, inputs)}</b><span>of this session's inputs were spoken (${s.voice} of ${inputs})</span></div>
      <div class="stat"><b>${pct(s.understood, s.understood + s.missed)}</b><span>understood the first time (${s.understood} of ${s.understood + s.missed})</span></div>
      <div class="stat"><b>${s.taps}</b><span>screen taps since onboarding (the mic switch excluded)</span></div>
    </div>
    <p class="muted small">All sessions on this device: ${pct(T.voice, totalInputs)} spoken, ${pct(T.understood, T.understood + T.missed)} understood first time, ${T.handsFreeSessions} of ${T.sessions} sessions completely hands-free.</p>
  </section>`;
}

function viewNotes() {
  const notes = state.notes.map((n) => `
    <article class="card note">
      <header><b>${esc(n.sectionTitle)}</b><span class="score ${n.score >= PASS_SCORE ? 'pass' : ''}">${n.score}/10</span></header>
      <p class="meta">${esc(n.chapterTitle)} · ${fmtDate(n.createdAt)} · re-check on ${fmtDate(n.recheckAt)} · ${n.gradedBy === 'ai' ? 'AI-graded' : 'rubric-graded'}</p>
      <ul>${n.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      <details><summary>In your words (${esc(LANG_META[n.lang]?.native || n.lang)})</summary><blockquote lang="${HTML_LANG[n.lang] || 'en'}">${esc(n.original)}</blockquote></details>
    </article>`).join('');
  return `
  <section class="notes">
    <nav class="crumbs"><button class="link" data-say="chapters">Chapters</button><span>/</span><span>Notes</span></nav>
    <h1>Revision notes</h1>
    ${notes || `<div class="card empty"><p>${esc(t('noNotes', L()))}</p></div>`}
    ${state.notes.length ? '<div class="actions"><button class="ghost" data-action="exportNotes">Download notes (.txt)</button></div>' : ''}
    ${metricsCard()}
  </section>`;
}

function viewPaste() {
  const mine = state.custom.map((c) => `<li>${esc(c.title)} · ${c.sections.length} sections <button class="link" data-action="deleteCustom" data-id="${esc(c.id)}">delete</button></li>`).join('');
  return `
  <section class="paste">
    <nav class="crumbs"><button class="link" data-say="chapters">Chapters</button><span>/</span><span>Add text</span></nav>
    <h1>Add your own text</h1>
    <p class="muted">Paste English text from a textbook, a PDF or your class notes. Offline, BolkeSeekho reads it aloud and quizzes you on its key words. With an AI key it also explains it in ${esc(LANG_META[L()].native)} and grades properly.</p>
    <label class="field-label" for="customTitle">Title</label>
    <input id="customTitle" maxlength="80" placeholder="e.g. Kirchhoff’s laws" autocomplete="off">
    <label class="field-label" for="customText">Text</label>
    <textarea id="customText" rows="10" maxlength="12000" placeholder="Paste at least a few sentences…"></textarea>
    <div class="actions"><button class="primary" data-action="saveCustom">Add chapter</button></div>
    ${mine ? `<h2>Your texts</h2><ul class="mine">${mine}</ul>` : ''}
  </section>`;
}

function renderChips() {
  const m = mode();
  const sec = currentSection();
  let list = m === 'grading' ? [] : chipsFor(m === 'feynman' ? 'result' : m, L(), { term: sec?.askTerm || 'entropy' });
  if (m === 'listen') list = list.filter((_, i) => (i === 0 ? Boolean(sec?.samples) : i === 1 ? Boolean(sec?.weakSamples) : true));
  if (m === 'study' && !sec?.askTerm) list = list.filter((c) => !c.includes('?'));
  els.chips.innerHTML = list.map((c) => `<button class="chip" data-say="${esc(c)}">${esc(c)}</button>`).join('');
}

function renderReply() {
  const r = state.reply;
  els.replyText.textContent = r?.text || '';
  els.replyText.lang = HTML_LANG[r?.lang] || 'en';
  els.replyText.classList.toggle('status', r?.kind === 'status');
  els.replyText.classList.toggle('long', (r?.text || '').length > 200);
  els.replyText.parentElement.scrollTop = 0;
}

function renderYou() {
  const y = state.you;
  if (!y) { els.you.innerHTML = ''; return; }
  const via = { dictation: 'dictated', mic: 'mic', keyboard: 'typed', chip: 'tapped', sample: 'sample answer' }[y.source] || '';
  els.you.innerHTML = `<span class="who">You${via ? ` · ${via}` : ''}</span> ${esc(y.text.length > 240 ? `${y.text.slice(0, 240)}…` : y.text)}`;
}

function renderInterim() {
  els.interim.textContent = state.listening ? state.interim || 'Listening…' : '';
  els.interim.classList.toggle('show', state.listening);
}

function renderMic() {
  els.mic.classList.toggle('on', state.handsFree);
  els.mic.setAttribute('aria-pressed', String(state.handsFree));
  els.mic.title = mic.supported
    ? state.handsFree ? 'Hands-free is on: tap to stop listening' : 'Tap once for hands-free listening'
    : 'This browser has no speech recognition: use Wispr Flow or type';
  els.input.placeholder = state.listening ? 'Listening… speak now' : 'Hold your Wispr Flow key and speak, or tap the mic';
}

let sendTimer = null;
function showSendTimer(ms) {
  const bar = els.sendFill;
  bar.style.transition = 'none';
  bar.style.width = '0%';
  clearTimeout(sendTimer);
  if (!ms) return;
  void bar.offsetWidth;
  bar.style.transition = `width ${ms}ms linear`;
  bar.style.width = '100%';
  sendTimer = setTimeout(() => { bar.style.transition = 'none'; bar.style.width = '0%'; }, ms + 50);
}

let toastTimer = null;
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 5000);
}

// ---------- settings ----------
function openSettings() {
  const voices = speaker.voiceReport();
  const status = [
    `<li><b>AI:</b> ${state.ai.enabled ? `on (${esc(state.ai.model || 'Claude')})` : 'off. ANTHROPIC_API_KEY is not set, so the offline engine runs everything except open questions.'}</li>`,
    `<li><b>Speech recognition (mic button):</b> ${mic.supported ? 'available' : 'not available in this browser. Use Wispr Flow or Chrome/Edge.'}</li>`,
    `<li><b>Voices:</b> ${voices.map((v) => `${esc(LANG_META[v.lang].label)} ${v.voice ? '✓' : '✗'}`).join(' · ')}</li>`,
  ].join('');
  els.settingsBody.innerHTML = `
    <label class="field-label" for="setLang">Reply language</label>
    <select id="setLang">${LANG_ORDER.map((k) => `<option value="${k}" ${k === state.lang ? 'selected' : ''}>${esc(LANG_META[k].native)} (${esc(LANG_META[k].label)})</option>`).join('')}</select>
    <label class="field-label" for="setRate">Speaking speed: <span id="rateVal">${state.settings.rate}×</span></label>
    <input id="setRate" type="range" min="0.7" max="1.3" step="0.15" value="${state.settings.rate}">
    <label class="field-label" for="setDelay">Send after a pause of</label>
    <select id="setDelay">${[1.5, 2, 3, 4].map((s) => `<option value="${s}" ${s === state.settings.sendDelay ? 'selected' : ''}>${s} seconds</option>`).join('')}</select>
    <label class="check"><input type="checkbox" id="setConfirm" ${state.settings.confirmTerms ? 'checked' : ''}> Read key terms back before grading</label>
    <label class="check"><input type="checkbox" id="setVoice" ${state.settings.voiceOn ? 'checked' : ''}> Speak replies aloud</label>
    <ul class="status-list">${status}</ul>`;
  els.settingsBody.querySelector('#setLang').addEventListener('change', (e) => { setLanguage(e.target.value); });
  els.settingsBody.querySelector('#setRate').addEventListener('input', (e) => {
    state.settings.rate = Number(e.target.value);
    $('#rateVal').textContent = `${state.settings.rate}×`;
    persist();
  });
  els.settingsBody.querySelector('#setDelay').addEventListener('change', (e) => { state.settings.sendDelay = Number(e.target.value); persist(); });
  els.settingsBody.querySelector('#setConfirm').addEventListener('change', (e) => { state.settings.confirmTerms = e.target.checked; persist(); });
  els.settingsBody.querySelector('#setVoice').addEventListener('change', (e) => { state.settings.voiceOn = e.target.checked; if (!e.target.checked) speaker.stop(); persist(); });
  if (typeof els.settings.showModal === 'function') els.settings.showModal();
  else els.settings.setAttribute('open', '');
}

let resetting = false;
function resetProgress() {
  if (!window.confirm('Delete all notes, scores, streaks and pasted texts on this device?')) return;
  resetting = true; // stop the pagehide handler from saving the old state straight back
  store.clear();
  window.location.reload();
}

// ---------- focus: keep the dictation field ready for Wispr Flow ----------
function focusInput() {
  if (coarsePointer || els.settings.open) return;
  const ae = document.activeElement;
  if (ae && ae !== els.input && ae.matches?.('input, textarea, select, [contenteditable="true"]')) return;
  els.input.focus({ preventScroll: true });
}

// ---------- events ----------
function bindEvents() {
  document.addEventListener('click', (e) => {
    const sayEl = e.target.closest('[data-say]');
    if (sayEl) { e.preventDefault(); handleInput(sayEl.dataset.say, { source: 'chip' }); return; }
    const act = e.target.closest('[data-action]');
    if (!act) return;
    const actions = {
      settings: openSettings,
      paste: goPaste,
      saveCustom,
      deleteCustom: () => deleteCustom(act.dataset.id),
      exportNotes,
      mic: toggleMic,
      reset: resetProgress,
      closeSettings: () => els.settings.close?.(),
    };
    actions[act.dataset.action]?.();
  });
  document.addEventListener('pointerdown', (e) => {
    if (state.screen === 'onboarding' || !e.isPrimary) return;
    if (e.target.closest?.('#micBtn')) return; // the mic switch is the push-to-talk, not a screen tap
    state.session.taps += 1;
  }, { capture: true });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !els.settings.open) stopTalking();
  });
  els.input.addEventListener('blur', () => setTimeout(focusInput, 0));
  window.addEventListener('focus', focusInput);
  document.addEventListener('click', () => setTimeout(focusInput, 0));
  els.settings.addEventListener('close', () => { render(); focusInput(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') mic.abort();
    else maybeListen();
  });
  window.addEventListener('pagehide', () => {
    if (resetting) return;
    if (state.lang && state.session.voice >= 3 && state.session.taps === 0) state.totals.handsFreeSessions += 1;
    persist();
  });
}

async function boot() {
  bindEvents();
  const dock = document.querySelector('.dock');
  if (dock && 'ResizeObserver' in window) {
    new ResizeObserver(() => document.documentElement.style.setProperty('--dock-h', `${dock.offsetHeight + 12}px`)).observe(dock);
  }
  render();
  state.reply = state.lang
    ? { text: t('welcomeBack', state.lang), lang: state.lang }
    : { text: t('askLanguage', 'en'), lang: 'en' };
  if (state.lang) { state.totals.sessions += 1; persist(); }
  renderReply();
  focusInput();
  const cfg = await api.getConfig();
  state.ai = cfg.ai || { enabled: false };
  render();
}

boot();
