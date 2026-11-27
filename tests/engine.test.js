// Offline engine: intents across five languages, the Feynman grader, and content integrity.
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIntent, parseListenCommand } from '../public/js/engine/intents.js';
import { analyze, grade, readbackParts } from '../public/js/engine/grader.js';
import { CHAPTERS, allGlossary, LANG_CODES } from '../public/js/engine/content.js';
import { t, chipsFor, TEMPLATE_KEYS, templateLangs } from '../public/js/engine/i18n.js';
import { buildCustomChapter } from '../public/js/engine/custom.js';
import { normalize, tokenize, levenshtein } from '../public/js/engine/text.js';

const byId = (id) => CHAPTERS.find((c) => c.id === id);
const section = (id) => CHAPTERS.flatMap((c) => c.sections).find((s) => s.id === id);
const chapterOf = (sectionId) => CHAPTERS.find((c) => c.sections.some((s) => s.id === sectionId));
const ctx = (mode = 'study', chapter = byId('thermo')) => ({
  mode,
  chapters: CHAPTERS,
  glossary: [...chapter.glossary, ...allGlossary().filter((g) => g.chapterId !== chapter.id)],
  currentChapterId: chapter.id,
});

// ---------- text utilities ----------
test('normalize folds nukta, chandrabindu and punctuation', () => {
  assert.equal(normalize('हाँ!'), normalize('हां'));
  assert.equal(normalize('ज़्यादा'), normalize('ज्यादा'));
  assert.equal(normalize('What does Entropy mean?'), 'what does entropy mean');
  assert.deepEqual(tokenize('ΔU = Q − W'), ['δu', 'q', 'w']);
});

test('levenshtein', () => {
  assert.equal(levenshtein('entrophy', 'entropy'), 1);
  assert.equal(levenshtein('equilibirum', 'equilibrium'), 2);
  assert.ok(levenshtein('supply', 'simply', 1) > 1);
});

// ---------- intents ----------
const INTENTS = [
  ['Explain this thermodynamics paragraph in simple Hindi', 'explain', { lang: 'hi' }],
  ['simple Hindi mein samjhao', 'explain', { lang: 'hi' }],
  ['isko samjhao', 'explain'],
  ['समझाओ', 'explain'],
  ['இதை தமிழில் விளக்கு', 'explain', { lang: 'ta' }],
  ['এটা বাংলায় বুঝিয়ে দাও', 'explain', { lang: 'bn' }],
  ['samajh nahi aaya', 'explain'],
  ['explain slowly', 'explain', { slower: true }],
  ['What does entropy mean?', 'define', { term: 'entropy' }],
  ['entropy kya hai', 'define', { term: 'entropy' }],
  ['एन्ट्रॉपी क्या है?', 'define', { term: 'entropy' }],
  ['entropy என்றால் என்ன', 'define', { term: 'entropy' }],
  ['এনট্রপি কী', 'define', { term: 'entropy' }],
  ['entrophy kya hota hai', 'define', { term: 'entropy', heard: 'entrophy' }],
  ['closed system kya hai?', 'define', { term: 'closed system' }],
  ['What is equilibrium?', 'define', { term: 'equilibrium' }],
  ['entropy', 'define', { term: 'entropy' }],
  ['explain adiabatic', 'define', { term: 'adiabatic' }],
  ['how does a refrigerator work', 'question'],
  ['why is the sky blue?', 'question'],
  ['Next section', 'next'],
  ['aage chalo', 'next'],
  ['अगला', 'next'],
  ['அடுத்து', 'next'],
  ['পরেরটা', 'next'],
  ['go back', 'back'],
  ['peeche jao', 'back'],
  ['Repeat that', 'repeat'],
  ['phir se bolo', 'repeat'],
  ['மறுபடியும் சொல்லு', 'repeat'],
  ['Slower please', 'slower'],
  ['dheere bolo', 'slower'],
  ['আস্তে বলো', 'slower'],
  ['thoda tez bolo', 'faster'],
  ['Test me', 'test'],
  ['mera test lo', 'test'],
  ['என்னை test பண்ணு', 'test'],
  ['Show my notes', 'notes'],
  ['read my notes', 'readNotes'],
  ['open recursion', 'open', { chapterId: 'recursion' }],
  ['recursion kholo', 'open', { chapterId: 'recursion' }],
  ['supply and demand chapter kholo', 'open', { chapterId: 'supply' }],
  ['section 2', 'goto', { index: 1 }],
  ['teesra section', 'goto', { index: 2 }],
  ['switch to Tamil', 'setLanguage', { lang: 'ta' }],
  ['বাংলা', 'setLanguage', { lang: 'bn' }],
  ['help', 'help'],
  ['what can I say', 'help'],
  ['ruko', 'stop'],
  ['chapters', 'library'],
  ['another example please', 'explainDifferent'],
  ['read it aloud', 'read'],
  ['padh ke sunao', 'read'],
  ['um', 'noise'],
  ['', 'noise'],
  ['the weather is nice today', 'unknown'],
];

for (const [utterance, intent, extra = {}] of INTENTS) {
  test(`intent: "${utterance}" -> ${intent}`, () => {
    const r = parseIntent(utterance, ctx());
    assert.equal(r.intent, intent, JSON.stringify(r));
    for (const [k, v] of Object.entries(extra)) assert.equal(r[k], v, `${k} in ${JSON.stringify(r)}`);
  });
}

test('library mode opens a chapter by name alone', () => {
  assert.deepEqual(parseIntent('recursion', ctx('library')), { intent: 'open', chapterId: 'recursion' });
  assert.equal(parseIntent('supply and demand', ctx('library')).chapterId, 'supply');
});

test('onboarding understands language names in every script', () => {
  for (const [said, lang] of [['Hinglish', 'hinglish'], ['hindi', 'hi'], ['हिंदी', 'hi'], ['தமிழ்', 'ta'], ['Tamil please', 'ta'], ['বাংলা', 'bn'], ['English', 'en']]) {
    assert.equal(parseIntent(said, { mode: 'onboarding' }).lang, lang, said);
  }
  assert.equal(parseIntent('banana', { mode: 'onboarding' }).intent, 'unknown');
});

test('confirm mode: yes, no and grade in every language', () => {
  for (const s of ['yes', 'haan', 'हाँ', 'ஆமா', 'হ্যাঁ', 'theek hai', 'sahi hai']) assert.equal(parseIntent(s, { mode: 'confirm' }).intent, 'yes', s);
  for (const s of ['no', 'nahi', 'नहीं', 'இல்லை', 'না', 'nahi, ek word theek karo']) assert.equal(parseIntent(s, { mode: 'confirm' }).intent, 'no', s);
  for (const s of ['grade it', 'grade karo', 'जाँचो']) assert.equal(parseIntent(s, { mode: 'confirm' }).intent, 'grade', s);
});

test('during a Feynman Check, long speech is never mistaken for a command', () => {
  assert.equal(parseListenCommand('the next thing is that energy is conserved and never destroyed'), null);
  assert.equal(parseListenCommand('cancel').intent, 'cancel');
  assert.equal(parseListenCommand('repeat the question').intent, 'repeat');
  assert.equal(parseListenCommand('use a sample answer').intent, 'sample');
  assert.equal(parseListenCommand('sample with a mistake').weak, true);
});

// Every suggestion chip is real input: it must parse to the intended action.
const CHIP_EXPECT = {
  library: ['open', 'open', 'open', 'notes', 'help'],
  study: ['explain', 'read', 'define', 'next', 'test'],
  result: ['tryAgain', 'explain', 'next', 'notes'],
  notes: ['readNotes', 'back', 'library'],
};
for (const [m, expected] of Object.entries(CHIP_EXPECT)) {
  for (const lang of LANG_CODES) {
    test(`chips ${m}/${lang} parse to their actions`, () => {
      const chips = chipsFor(m, lang, { term: 'entropy' });
      assert.equal(chips.length, expected.length);
      chips.forEach((c, i) => assert.equal(parseIntent(c, ctx(m)).intent, expected[i], `${lang}: "${c}"`));
    });
  }
}
test('listen, confirm and onboarding chips', () => {
  for (const lang of LANG_CODES) {
    const [s, weak, rep, cancel] = chipsFor('listen', lang);
    assert.equal(parseListenCommand(s).intent, 'sample', s);
    assert.equal(parseListenCommand(weak).weak, true, weak);
    assert.equal(parseListenCommand(rep).intent, 'repeat', rep);
    assert.equal(parseListenCommand(cancel).intent, 'cancel', cancel);
    assert.deepEqual(chipsFor('confirm', lang).map((c) => parseIntent(c, { mode: 'confirm' }).intent), ['yes', 'no', 'grade']);
  }
  for (const c of chipsFor('onboarding', 'en')) assert.equal(parseIntent(c, { mode: 'onboarding' }).intent, 'setLanguage', c);
});

// ---------- grader ----------
const gradeText = (id, text, opts) => {
  const sec = section(id);
  return grade(analyze(text, chapterOf(id).glossary), sec, opts);
};

for (const ch of CHAPTERS) {
  for (const sec of ch.sections) {
    for (const [lang, sample] of Object.entries(sec.samples)) {
      test(`sample answer passes: ${sec.id} (${lang})`, () => {
        const r = gradeText(sec.id, sample);
        assert.ok(r.score >= 7, `score ${r.score}, missing ${r.missing.map((c) => c.label)}`);
        assert.equal(r.misconception, null);
        assert.equal(r.copied, false);
        assert.ok(r.notes.length >= 3 && r.notes.length <= 5);
      });
    }
    for (const [lang, sample] of Object.entries(sec.weakSamples || {})) {
      test(`weak sample is caught: ${sec.id} (${lang})`, () => {
        const r = gradeText(sec.id, sample);
        assert.ok(r.misconception, 'misconception should be detected');
        assert.ok(r.score < 7, `score ${r.score}`);
      });
    }
  }
}

test('negation is respected: correct statements are not flagged', () => {
  for (const s of ['energy cannot be created or destroyed, it only changes form in a system and surroundings',
    'energy na create hoti hai na destroy, system aur surroundings ke beech sirf form badalta hai',
    'শক্তি তৈরি করা যায় না, ধ্বংসও করা যায় না, system আর surroundings এর মধ্যে শুধু রূপ বদলায়']) {
    assert.equal(gradeText('thermo-1', s).misconception, null, s);
  }
  assert.ok(gradeText('thermo-1', 'energy can be created when we burn gas in the system and the surroundings').misconception);
});

test('read-back flags a misheard term and confirmation decides the credit', () => {
  const sample = section('thermo-3').samples.hinglish; // says "adiabetic"
  const a = analyze(sample, byId('thermo').glossary);
  const { unsure } = readbackParts(a);
  assert.deepEqual(unsure.map((u) => [u.heard, u.term]), [['adiabetic', 'adiabatic']]);
  const accepted = grade(a, section('thermo-3'), { acceptLow: true });
  const rejected = grade(a, section('thermo-3'), { acceptLow: false });
  assert.ok(accepted.score > rejected.score);
  assert.ok(accepted.covered.some((c) => c.label.startsWith('Adiabatic')));
  const fixed = grade(a, section('thermo-3'), { acceptLow: false, extraTerms: ['adiabatic'] });
  assert.equal(fixed.score, accepted.score);
});

test('low-confidence words never cost marks', () => {
  // "adiabatic means constant temperature" is a misconception, but here "adiabatic" was misheard.
  const text = 'adiabetic means constant temperature, and isothermal means temperature constant with heat, like a cycle pump';
  const a = analyze(text, byId('thermo').glossary);
  assert.ok(readbackParts(a).unsure.length === 1);
  assert.equal(grade(a, section('thermo-3'), { acceptLow: false }).misconception, null);
});

test('reading the textbook aloud is not an explanation', () => {
  const r = gradeText('thermo-1', section('thermo-1').text);
  assert.equal(r.copied, true);
  assert.ok(r.score <= 4);
});

test('very short answers are capped', () => {
  const r = gradeText('thermo-1', 'energy is conserved');
  assert.equal(r.tooShort, true);
  assert.ok(r.score <= 3);
});

test('feedback templates render in every language', () => {
  for (const lang of LANG_CODES) {
    const s = t('pass', lang, { score: 8, right: 'x', gap: 'y' });
    assert.ok(s.includes('8') && !s.includes('{'), `${lang}: ${s}`);
  }
});

// ---------- content integrity ----------
test('every section is complete in all five languages', () => {
  for (const ch of CHAPTERS) {
    for (const g of ch.glossary) for (const l of LANG_CODES) assert.ok(g.def[l], `${ch.id} glossary ${g.term} ${l}`);
    for (const sec of ch.sections) {
      for (const l of LANG_CODES) assert.ok(sec.explain[l], `${sec.id} explain ${l}`);
      assert.ok(sec.concepts.length >= 3, sec.id);
      for (const c of sec.concepts) {
        assert.ok(c.note && c.groups.length, `${sec.id} ${c.label}`);
        for (const l of LANG_CODES) assert.ok(c.hint[l], `${sec.id} ${c.label} hint ${l}`);
      }
      for (const m of sec.misconceptions) for (const l of LANG_CODES) assert.ok(m.fix[l], `${sec.id} misconception ${l}`);
      assert.ok(ch.glossary.some((g) => g.term === sec.askTerm), `${sec.id} askTerm ${sec.askTerm}`);
      assert.ok(sec.samples?.hinglish && sec.samples?.en, `${sec.id} samples`);
    }
  }
});

test('every reply template exists in all five languages (except English-only system notices)', () => {
  const englishOnly = new Set(['askLanguage', 'noVoice', 'micDenied', 'micUnsupported', 'micNetwork']);
  for (const key of TEMPLATE_KEYS) {
    if (englishOnly.has(key)) continue;
    assert.deepEqual(templateLangs(key).sort(), [...LANG_CODES].sort(), key);
  }
});

// ---------- custom text ----------
test('pasted text becomes a gradeable chapter', () => {
  const text = 'Kirchhoff current law states that the total current entering a junction equals the total current leaving it. '
    + 'This follows from conservation of charge, because charge cannot pile up at a junction. '
    + 'Kirchhoff voltage law states that the sum of voltage drops around any closed loop equals the sum of the voltage sources in that loop. '
    + 'Together these laws let us solve circuits with several loops and junctions. '
    + 'To apply the voltage law, walk around a loop in one direction and add every voltage rise and drop you meet. '
    + 'A resistor crossed in the direction of the current gives a drop equal to the current times the resistance. '
    + 'A battery crossed from its negative to its positive terminal gives a rise equal to its voltage. '
    + 'Writing one equation for each junction and each independent loop gives enough equations to find every unknown current. '
    + 'Engineers use these laws every day to design power supplies, chargers and the wiring inside your phone.';
  const ch = buildCustomChapter('Kirchhoff laws', text);
  assert.equal(ch.sections.length, 2);
  assert.ok(ch.glossary.length >= 4);
  const sec = ch.sections[0];
  const terms = sec.concepts.map((c) => c.label);
  const good = grade(analyze(`Ek junction par jitna ${terms.join(' aur ')} aata hai utna hi jaata hai, kyunki charge jama nahi ho sakta`, ch.glossary), sec);
  assert.ok(good.score >= 7, `${good.score} for ${terms}`);
  assert.throws(() => buildCustomChapter('x', 'too short'), /few sentences/);
});
