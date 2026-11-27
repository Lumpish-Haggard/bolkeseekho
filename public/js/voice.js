// Voice I/O.
//   DictationInput: the always-focused field that Wispr Flow types into. Auto-sends after a pause.
//   MicInput:       browser speech recognition (Chrome/Edge) as a hands-free fallback.
//   Speaker:        text-to-speech with the best installed voice for each Indian language.
import { LANG_META } from './engine/i18n.js';

/** Make formulas and symbols pronounceable. */
export function speakable(text) {
  return String(text)
    .replace(/ΔU/g, 'delta U')
    .replace(/Δ/g, 'delta ')
    .replace(/(\d+)\s?J\b/g, '$1 joules')
    .replace(/(\d)!/g, '$1 factorial')
    .replace(/([a-zA-Z]+)\(([^()]{1,24})\)/g, '$1 of $2')
    .replace(/\s[−–-]\s(?=[A-Za-z0-9](?![A-Za-z]))/g, ' minus ') // "Q − W", "n − 1"
    .replace(/−(?=[A-Za-z0-9])/g, 'minus ') // "−W"
    .replace(/\s[–—]\s/g, ', ')
    .replace(/\s=\s/g, ' equals ')
    .replace(/×/g, ' times ')
    .replace(/↑/g, ' up ')
    .replace(/↓/g, ' down ')
    .replace(/→/g, ', so ')
    .replace(/\s>\s/g, ' greater than ')
    .replace(/\s<\s/g, ' less than ')
    .replace(/…/g, ', ')
    .replace(/[“”"*_#`]/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Sentence-sized chunks: Chrome cuts off utterances longer than about 15 seconds. */
export function splitForSpeech(text, max = 220) {
  const parts = String(text).split(/(?<=[.!?।॥])\s+/).map((s) => s.trim()).filter(Boolean);
  const out = [];
  for (const p of parts) {
    if (p.length <= max) { out.push(p); continue; }
    let buf = '';
    for (const piece of p.split(/(?<=[,;:])\s+/)) {
      if (buf && (buf + ' ' + piece).length > max) { out.push(buf); buf = piece; } else buf = buf ? `${buf} ${piece}` : piece;
    }
    if (buf) out.push(buf);
  }
  return out;
}

export class Speaker {
  constructor({ onState } = {}) {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.voices = [];
    this.onState = onState || (() => {});
    this.session = 0;
    this.speaking = false;
    this.current = null;
    if (this.synth) {
      const load = () => { this.voices = this.synth.getVoices() || []; };
      load();
      this.synth.addEventListener?.('voiceschanged', load);
      setTimeout(load, 400);
      setTimeout(load, 1500);
    }
  }

  get supported() { return Boolean(this.synth); }

  voiceFor(langKey) {
    const prefs = LANG_META[langKey]?.voices || [langKey];
    const quality = (v) => (/natural|neural/i.test(v.name) ? 4 : 0) + (/online|google/i.test(v.name) ? 2 : 0) + (v.default ? 1 : 0);
    for (const code of prefs) {
      const want = code.toLowerCase();
      const matches = this.voices.filter((v) => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        return want.includes('-') ? lang === want : lang === want || lang.startsWith(`${want}-`);
      });
      if (matches.length) return matches.sort((a, b) => quality(b) - quality(a))[0];
    }
    return null;
  }

  voiceReport() {
    return Object.keys(LANG_META).map((k) => ({ lang: k, voice: this.voiceFor(k)?.name || null }));
  }

  setSpeaking(on) {
    if (this.speaking !== on) { this.speaking = on; this.onState(on); }
  }

  stop() {
    this.session++;
    if (this.synth && (this.synth.speaking || this.synth.pending)) this.synth.cancel();
    this.setSpeaking(false);
  }

  /**
   * Speak a string, or an array of sentences (onChunk reports the sentence index,
   * which the passage view uses to highlight the line being read).
   * Resolves { spoken, reason } when finished, cancelled or impossible.
   */
  speak(input, langKey, { rate = 1, onChunk } = {}) {
    if (!this.synth) return Promise.resolve({ spoken: false, reason: 'unsupported' });
    const voice = this.voiceFor(langKey);
    if (!voice) return Promise.resolve({ spoken: false, reason: 'no-voice' });
    this.stop();
    const session = this.session;
    const sentences = Array.isArray(input) ? input : [input];
    const chunks = sentences.flatMap((s, idx) => splitForSpeech(speakable(s)).map((text) => ({ text, idx })));
    if (!chunks.length) return Promise.resolve({ spoken: false, reason: 'empty' });

    return new Promise((resolve) => {
      let i = 0;
      const finish = (result) => {
        if (session === this.session) this.setSpeaking(false);
        resolve(result);
      };
      const next = () => {
        if (session !== this.session) return resolve({ spoken: false, reason: 'cancelled' });
        if (i >= chunks.length) return finish({ spoken: true });
        const { text, idx } = chunks[i];
        const u = new SpeechSynthesisUtterance(text);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = rate;
        u.onstart = () => onChunk?.(idx);
        u.onend = () => { i++; next(); };
        u.onerror = (e) => {
          if (e.error === 'interrupted' || e.error === 'canceled') return resolve({ spoken: false, reason: 'cancelled' });
          if (e.error === 'not-allowed') return finish({ spoken: false, reason: 'not-allowed' });
          i++;
          next();
        };
        this.current = u; // keep a reference: Chrome can garbage-collect utterances mid-speech
        this.synth.resume?.();
        this.synth.speak(u);
      };
      this.setSpeaking(true);
      next();
    });
  }
}

export class MicInput {
  constructor({ onResult, onInterim, onState, onError } = {}) {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    this.SR = SR || null;
    this.rec = null;
    this.listening = false;
    this.handlers = { onResult, onInterim, onState, onError };
  }

  get supported() { return Boolean(this.SR); }

  start(lang) {
    if (!this.SR || this.listening) return false;
    const rec = new this.SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.continuous = false;
    let gotFinal = false;
    rec.onstart = () => { this.listening = true; this.handlers.onState?.('listening'); };
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          gotFinal = true;
          this.handlers.onResult?.({ text: r[0].transcript, confidence: r[0].confidence || 0, alternatives: Array.from(r, (a) => a.transcript) });
        } else {
          interim += r[0].transcript;
        }
      }
      if (interim) this.handlers.onInterim?.(interim);
    };
    rec.onerror = (e) => this.handlers.onError?.(e.error || 'unknown');
    rec.onend = () => {
      this.listening = false;
      this.rec = null;
      this.handlers.onState?.('idle', { gotFinal });
    };
    try {
      rec.start();
      this.rec = rec;
      return true;
    } catch {
      this.handlers.onError?.('start-failed');
      return false;
    }
  }

  stop() { try { this.rec?.stop(); } catch { /* already stopped */ } }
  abort() { try { this.rec?.abort(); } catch { /* already stopped */ } }
}

/**
 * The bottom text field. Wispr Flow (or any dictation tool) inserts text here; we
 * auto-send once the speaker pauses, so nobody has to tap Send. Bulk or machine-speed
 * insertions are counted as dictated speech for the hands-free metric.
 */
export class DictationInput {
  constructor(el, { onSubmit, delay = () => 2000, onPending } = {}) {
    this.el = el;
    this.onSubmit = onSubmit;
    this.delay = delay;
    this.onPending = onPending;
    this.timer = null;
    this.dictated = false;
    this.lastAt = 0;
    this.fast = 0;
    el.addEventListener('input', (e) => this.handleInput(e));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); this.submit(); }
    });
    this.autosize();
  }

  handleInput(e) {
    const now = performance.now();
    const type = e.inputType || '';
    const added = typeof e.data === 'string' ? e.data.length : 0;
    if (/^insertFrom(Paste|Drop|Dictation)|insertReplacementText/.test(type) || added > 3) this.dictated = true;
    else if (type === 'insertText') {
      this.fast = now - this.lastAt < 30 ? this.fast + 1 : 0;
      if (this.fast >= 8) this.dictated = true;
    }
    this.lastAt = now;
    this.autosize();
    clearTimeout(this.timer);
    if (!this.el.value.trim()) { this.onPending?.(0); return; }
    const ms = this.delay(this.dictated);
    this.onPending?.(ms);
    this.timer = setTimeout(() => this.submit(), ms);
  }

  submit() {
    clearTimeout(this.timer);
    this.onPending?.(0);
    const text = this.el.value.trim();
    if (!text) return;
    const source = this.dictated ? 'dictation' : 'keyboard';
    this.el.value = '';
    this.dictated = false;
    this.fast = 0;
    this.autosize();
    this.onSubmit?.(text, { source });
  }

  cancel() { clearTimeout(this.timer); this.onPending?.(0); }

  autosize() {
    const el = this.el;
    const max = 168;
    el.style.height = 'auto';
    const border = el.offsetHeight - el.clientHeight; // border-box: scrollHeight excludes borders
    const wanted = el.scrollHeight + border;
    el.style.height = `${Math.min(wanted, max)}px`;
    el.style.overflowY = wanted > max ? 'auto' : 'hidden';
  }
}
