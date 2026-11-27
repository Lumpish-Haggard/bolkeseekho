// Turn pasted English text into a chapter. Offline, we can split it into sections,
// read it aloud and quiz the student on its key terms; with an AI key the server adds
// simple-language explanations and real grading.
import { tokenize } from './text.js';

const STOPWORDS = new Set(`a an the and or but if then so of to in on at by for with from as is are was were be been being it its this that these those
there their they them we our you your he she his her him i me my not no yes can could will would should may might must do does did done has have had
having than which who whom whose what when where why how all any each every some such only own same other into over under again further once also very just
more most less least about above below up down out off between through during before after while because until both either neither nor per via etc using
used use one two three four five first second third many much well like make makes made called often usually there here eg ie shall upon onto within without`
  .split(/\s+/));

const MAX_WORDS_PER_SECTION = 120;
const MAX_SECTIONS = 8;

export function splitSentences(text) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.match(/[^.!?।]+(?:[.!?।]+["”’)]?|$)/g)?.map((s) => s.trim()).filter(Boolean) || [];
}

export function splitSections(text) {
  const sentences = splitSentences(text);
  const sections = [];
  let current = [];
  let words = 0;
  for (const s of sentences) {
    const w = s.split(' ').length;
    if (words + w > MAX_WORDS_PER_SECTION && current.length) {
      sections.push(current.join(' '));
      current = [];
      words = 0;
    }
    current.push(s);
    words += w;
  }
  if (current.length) sections.push(current.join(' '));
  return sections.slice(0, MAX_SECTIONS);
}

/** Frequent, longer, non-stopword words: a rough stand-in for "key terms". */
export function keyTerms(text, max = 4) {
  const words = tokenize(text).filter((w) => /^[a-z][a-z]{3,}$/.test(w) && !STOPWORDS.has(w));
  const freq = new Map();
  for (const w of words) {
    const base = w.endsWith('s') && words.includes(w.slice(0, -1)) ? w.slice(0, -1) : w;
    freq.set(base, (freq.get(base) || 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] * Math.log(b[0].length) - a[1] * Math.log(a[0].length) || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([w]) => w);
}

const hintFor = (term) => ({
  en: `Mention “${term}” and what it means here.`,
  hinglish: `“${term}” ka zikr karo aur batao yahan uska matlab kya hai.`,
  hi: `“${term}” का ज़िक्र कीजिए और बताइए यहाँ उसका मतलब क्या है।`,
  ta: `“${term}” பற்றிச் சொல்லுங்கள், இங்கே அதன் அர்த்தம் என்ன என்றும்.`,
  bn: `“${term}”-এর কথা বলো, আর এখানে তার মানে কী।`,
});

const sameInAll = (text) => ({ en: text, hinglish: text, hi: text, ta: text, bn: text });

export function buildCustomChapter(title, text, now = Date.now()) {
  const sectionsText = splitSections(text);
  if (!sectionsText.length || tokenize(text).length < 25) {
    throw new Error('Paste at least a few sentences (about 25 words or more).');
  }
  const id = `custom-${now.toString(36)}`;
  const cleanTitle = String(title || '').trim().slice(0, 80) || 'My text';
  const glossary = new Map();
  const sections = sectionsText.map((body, i) => {
    const sentences = splitSentences(body);
    const terms = keyTerms(body);
    const used = new Set();
    // Each concept's revision note is a different sentence from the text, so notes never repeat.
    const noteFor = (term) => {
      const s = sentences.find((x) => !used.has(x) && x.toLowerCase().includes(term));
      if (!s) return `Key term: ${term}.`;
      used.add(s);
      return s;
    };
    for (const term of terms) if (!glossary.has(term)) glossary.set(term, sentences.find((s) => s.toLowerCase().includes(term)) || sentences[0]);
    return {
      id: `${id}-${i + 1}`,
      title: sectionsText.length > 1 ? `${cleanTitle}, part ${i + 1}` : cleanTitle,
      text: body,
      custom: true,
      askTerm: terms[0] || '',
      concepts: terms.map((term) => ({
        label: term,
        groups: [[term]],
        note: noteFor(term),
        hint: hintFor(term),
      })),
      misconceptions: [],
      examTip: '',
    };
  });
  return {
    id,
    title: cleanTitle,
    subject: 'Your own text',
    custom: true,
    aliases: [cleanTitle],
    glossary: [...glossary.entries()].map(([term, sentence]) => ({ term, aliases: [term], def: sameInAll(sentence) })),
    sections,
  };
}
