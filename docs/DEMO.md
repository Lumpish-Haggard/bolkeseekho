# Demo walkthrough and 3-minute video script

## Before you record

1. Run `docker compose up` and open http://localhost:8080 in **Microsoft Edge**. Edge has natural Hindi, Tamil and Bengali voices.
2. Click once anywhere on the page, so the browser allows it to speak.
3. Start **Wispr Flow** with Hindi and English enabled. Its hotkey types into the box at the bottom of the screen.
4. Open ⚙ **Settings → Reset progress**, so the video starts on the language screen.
5. Record the screen **with system audio**, so the spoken replies are heard, and with your microphone.

If you need to cut a reply short, say "ruko" or "stop", or press Esc.

## Shot list (about 2 min 50 s)

| Time | Say (hold your Flow key) | What the viewer sees and hears |
|---|---|---|
| 0:00–0:15 | *(voice-over)* "Lakhs of students in India learned science in Hindi or Tamil, then reach college and every textbook is in English. BolkeSeekho lets them learn by speaking in the language they think in." | Language screen |
| 0:15–0:22 | "Hinglish" | The chapters screen. From here on, there are no taps. |
| 0:22–0:45 | "Open thermodynamics", then "Explain this paragraph in simple Hindi" | Section 1, then a spoken Hindi explanation built around a pressure cooker |
| 0:45–0:55 | "Hinglish mein bolo", then "entropy kya hai?" | The language switches and the definition is spoken in Hinglish |
| 0:55–1:05 | "What does entrophy mean?" | It answers about *entropy* and notes "I heard 'entrophy'": mishearings are handled |
| 1:05–1:50 | "Test me", then explain section 1 in your own words for about 20 seconds (script below), then "haan" | The key terms it heard are read back. Then 10/10, what you got right, and English notes saved beside your original words |
| 1:50–2:15 | "Section 3", "test me", tap **Sample answer use karo** | The read-back says: "Not sure about: 'adiabetic', did you mean adiabatic?" |
| | "nahi", then "adiabatic" | It grades with the corrected word. Unclear words never cost marks |
| 2:15–2:35 | "Tamil mein bolo", then "விளக்கு" | A spoken Tamil explanation (cycle pump example) |
| 2:35–2:50 | "My notes" | English revision notes, your own words, the re-check date, and the voice-first metrics: % spoken, % understood first time, 0 taps |
| 2:50–3:00 | *(voice-over)* "One command, `docker compose up`, no keys needed. With a Claude key it also answers open questions and grades with AI." | Header: *Offline · key not set* |

### Something to say for section 1, in Hinglish

> Dekho, thermodynamics mein jis cheez ko hum study karte hain use system bolte hain, jaise pressure cooker, aur baaki sab surroundings hai. First law kehta hai ki energy na create hoti hai na destroy hoti hai, bas ek form se doosre form mein badalti hai. Closed system mein energy aa ja sakti hai par matter bahar nahi jaata, aur isolated system mein kuch bhi exchange nahi hota.

## Quick checks for judges

You don't need a microphone for any of these: type each line and press Enter. The suggestion chips are labelled in the current reply language. For example, after `explain in simple Hindi`, **Use a sample answer** reads *सैंपल जवाब इस्तेमाल करो*. Typing the English label works in every language.

- `Hinglish` → `open thermodynamics` → `explain in simple Hindi` → `entropy kya hai?` → `test me`. Then tap **Use a sample answer** → `haan` → `my notes`.
- **Misconception:** on section 2, tap **Sample with a mistake**. The answer says ΔU = Q + W, and the app catches the sign error.
- **Mishearing:** on section 3, the sample says "adiabetic". Answer `nahi`, then `adiabatic`.
- **Mixed scripts:** `இதை தமிழில் விளக்கு`, `এনট্রপি কী?`, `अगला section`, `phir se bolo`, `dheere bolo`.
- **Noise and nonsense:** `umm`, then `the weather is nice today`, twice.
- **Your own text:** `add text`, paste a paragraph, then `test me`.
