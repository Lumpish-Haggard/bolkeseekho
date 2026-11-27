# BolkeSeekho

**Bolke seekho: learn by speaking.** BolkeSeekho is a voice-first study companion for Indian college students who study from English textbooks but think in Hindi, Hinglish, Tamil or Bengali.

You talk to it with [Wispr Flow](https://wisprflow.ai) or the mic button. It explains a textbook section in your language with an everyday Indian example and answers questions about key terms. Then it runs a **Spoken Feynman Check**: you explain the idea aloud in your own words. The app reads back the key terms it heard, grades your understanding and turns your explanation into exam-ready English notes.

## Run it: one command, no keys

```bash
git clone https://github.com/Lumpish-Haggard/bolkeseekho.git
cd bolkeseekho
docker compose up
```

Open **http://localhost:8080** in Chrome or Edge. No API keys and no account are needed. Without a key the app runs its offline engine, and the header shows *Offline · key not set*.

- **Port 8080 already in use?** Run `HOST_PORT=8090 docker compose up` and open http://localhost:8090.
- **Without Docker:** with Node.js 18 or later, run `npm ci && npm start`.

## Try it in two minutes

Say these, or type them and press Enter:

1. **"Hinglish"**, or हिंदी, தமிழ், বাংলা, English
2. **"open thermodynamics"**
3. **"explain this paragraph in simple Hindi"**: a Hindi explanation built around a pressure cooker
4. **"entropy kya hai?"**: the definition, in your language
5. **"test me"**: the Spoken Feynman Check. Explain the section aloud, or tap **Use a sample answer**.
6. **"haan"**: a score out of 10, what you got right, one gap, a hint, and saved English notes
7. **"my notes"**

Two more things to try:

- On section 2, **Sample with a mistake** shows misconception detection.
- Section 3's sample says "adiabetic", which shows the misheard-word read-back.

## How you talk to it

| Way | How | Notes |
|---|---|---|
| **Wispr Flow** (primary) | Hold your Flow hotkey and speak | The box at the bottom always has focus, so Flow's text lands there. It sends itself after a 2-second pause, or 3.5 seconds during a Feynman Check. You never tap Send. |
| **Mic button** | Tap once for hands-free mode | Browser speech recognition in Chrome and Edge. It listens again after every reply and pauses while the app is speaking. |
| **Keyboard** | Type and press Enter | Always works. |

Every reply is spoken with the device's text-to-speech in your language and shown in large text.

- Microsoft Edge includes Hindi, Tamil and Bengali voices.
- Chrome on Windows and Mac has Hindi.
- Android has all three.
- If a voice is missing, the reply is shown as text only.

## When things go wrong

- **Mixed languages.** Commands and explanations are understood in Roman Hinglish, Devanagari, Tamil and Bengali script, including switches mid-sentence. For example, "thermodynamics wala para simple Hindi mein samjhao" works.
- **Misheard key terms.** Near-misses such as "entrophy", "bass case" and "equilibirum", and known mishearings, are matched to the chapter glossary. They're **read back before grading**: *"Not sure about: 'adiabetic', did you mean adiabatic? Say yes, or no to fix it."* Words the app wasn't sure about can earn marks, but they **never cost marks**.
- **Noise.** Empty or filler-only input ("umm") gets: *"I could not hear that clearly… a little closer to the mic."* Low-confidence browser recognition is confirmed before the app acts on it: *"Did you say: …?"*
- **Not understood.** The app replies with example commands. After a second miss, it points to the on-screen suggestions.
- **Reading the textbook aloud instead of explaining.** This is detected by word-trigram overlap and capped at 4/10.
- **Negation.** "Energy *cannot* be created" isn't flagged as the misconception "energy can be created", in any of the four scripts.
- **AI unavailable.** Every AI feature falls back to the offline engine and says so.

## What works without a key

| Feature | Offline (no key) | With `ANTHROPIC_API_KEY` |
|---|---|---|
| Voice commands in 5 languages | ✓ on-device parser | ✓ same parser |
| Explanations for the 9 built-in sections | ✓ written in 5 languages | ✓ plus "another example" from Claude |
| Key-term questions ("what is entropy?") | ✓ 23-term glossary | ✓ |
| Open questions ("why does a pressure cooker cook faster?") | "AI key not set" message | ✓ answered by Claude, grounded in the section |
| Spoken Feynman Check | ✓ rubric grading with misconception and copy checks | ✓ graded by Claude, with the same checks |
| Your own pasted text | ✓ read aloud, quiz on key words | ✓ explanations and grading too |
| English revision notes, streak, progress, voice-first metrics | ✓ | ✓ |

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | empty | Optional. Turns on open questions, fresh examples and AI grading. |
| `AI_MODEL` | `claude-opus-5-5` | Any Claude model. For example, `claude-haiku-5-5` costs less and answers faster. |
| `HOST_PORT` | `8080` | Host port for `docker compose`. |
| `PORT` | `8080` | Server port inside the container, and for `npm start`. |
| `AI_RATE_LIMIT_PER_MIN` | `20` | Per-IP limit on AI calls, to protect a public demo key. |

With Docker, either run `ANTHROPIC_API_KEY=sk-ant-... docker compose up`, or copy `.env.example` to `.env` and fill it in.

## How it is built

```
Browser: plain ES modules, no build step
  DictationInput  <- Wispr Flow or keyboard (always-focused box, auto-send after a pause)
  MicInput        <- Web Speech API, hands-free loop
  Speaker         -> speechSynthesis, best voice per language, sentence-by-sentence
        |
  Offline engine (public/js/engine), runs on the device in under a millisecond
    text.js      normalisation for four scripts, prefix and fuzzy matching
    lexicon.js   commands in Hinglish, Hindi, Tamil, Bengali and English
    intents.js   mode-aware intent parser
    grader.js    key-term read-back, rubric grading, misconceptions, copy check
    content.js   3 chapters x 3 sections, explained in 5 languages
    i18n.js      every spoken reply in 5 languages
        |  only for open questions, fresh examples and grading
Node.js server (server/)  -- POST /api/ai -->  Claude (official Anthropic SDK)
```

- **Server.** It serves the static app. If a key is set, it calls Claude through the official Anthropic SDK with structured JSON outputs (zod schemas), effort tuned per task, and server-side refusal fallbacks. Without a key, `/api/ai` answers `503 key_not_set` and the app keeps working offline.
- **Where data lives.** Progress, notes and settings stay in the browser (localStorage). There are no accounts and no database.

## Tests

`npm test` runs 133 tests with Node's built-in test runner. They cover:

- intents in five languages, and every on-screen suggestion
- the grader: negation, misconceptions, misheard terms and the copy check
- that the content is complete in all five languages
- the server with no keys, including path-traversal attempts
- the Claude call path, against a local mock of the Messages API

CI also runs `docker compose up` and checks that the main screen loads and reports "key not set".

## Project structure

```
docker-compose.yml   one-command start
Dockerfile           node:22-alpine, non-root user, health check
server/              HTTP server, AI task validation, prompts
public/              the app (index.html, styles.css, js/)
public/js/engine/    offline language engine and chapter content
tests/               node --test suites
docs/DEMO.md         demo walkthrough and video script
pitch/               pitch deck (HTML source and PDF)
```

## Privacy

Nothing leaves the browser except two things:

- **Speech recognition.** The audio goes to whichever recognition service you use: Wispr Flow, or the browser's own service when you use the mic button.
- **AI calls, only when a key is configured.** The current section text and what you said go to Anthropic.

## License

Copyright (c) 2026 Tarun Rankawat. **All rights reserved.** This is not open-source software.

The code is public only so that hackathon organisers and judges can review it, and build and run it to evaluate the submission. Any other use needs written permission. That includes copying, modifying, redistributing, hosting, building products on its code or content, and commercial use. See [LICENSE](LICENSE). For a commercial licence or partnership, contact [@Lumpish-Haggard](https://github.com/Lumpish-Haggard).
