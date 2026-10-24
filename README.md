# Learn Russian

A free, static Russian course for beginners (A1–B1). Everything runs in the browser: a 10-step
roadmap, an interactive alphabet, a full grammar reference, six dialogues with bundled audio,
a 734-entry dictionary, and a two-mode trainer.

Created and built by **fishy/birdy** — concept, curriculum, dictionary, dialogues, trainer, and
audio pipeline.

## Features

- **10-step roadmap** from the alphabet to independent conversation, with a first-week schedule
  and a checkpoint for every step.
- **Alphabet and phonology**: 33 letters with sounds, hard/soft pairs, vowel reduction, devoicing,
  stress.
- **Grammar**: six cases with a case explorer, gender/number, adjectives, verb aspect and
  conjugation, pronouns, numerals, word order, negation, pragmatics, typography.
- **Six dialogues** (A1–B1) with stress-marked transliteration, English translation, grammar notes,
  key phrases, and one MP3 per line (47 recordings).
- **Dictionary**: 734 entries, searchable by Cyrillic, transliteration, or English; accent- and
  `ё`-folding; part-of-speech filter; paged rendering.
- **Trainer**: four scripted offline role-plays with answer checking, hints, and corrections;
  optional chat against any OpenAI-compatible endpoint.
- **No build step**, no accounts, no analytics. All assets are local except the optional API call.

## Structure

```
index.html            page structure and prose
css/styles.css        themes, responsive layout, print styles
js/conversations.js   six dialogues, translations, notes, key phrases
js/dict-function.js   pronouns, prepositions, conjunctions, particles, adverbs
js/dict-verbs.js      verbs with aspect partners and conjugation notes
js/dict-nouns.js      nouns, adjectives, numerals, conversational tokens
js/trainer.js         scripted trainer, answer checking, API chat client
js/app.js             dictionary, dialogues, alphabet, case explorer, theme, audio
audio/*.mp3           47 recordings, one per dialogue line
favicon.svg           site icon
.nojekyll             tells GitHub Pages not to run Jekyll
robots.txt            allow all crawlers
LICENSE               MIT
```

## Local preview

Open `index.html` directly, or serve the folder:

```sh
python -m http.server 8765
# http://127.0.0.1:8765/
```

Serving is recommended when using the API trainer: some providers reject `file://` origins during
CORS preflight.

## Deploy to GitHub Pages

The repository root is the site root; there is no build step.

1. Create a repository and push these files so that `index.html` sits at the repository root.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
4. Choose the `main` branch and the `/ (root)` folder, then save.
5. The site appears at `https://<user>.github.io/<repo>/` within a minute or two.

All links, scripts, audio paths, and the icon are relative, so project pages work under a
subpath. `.nojekyll` is included to keep the asset folders untouched.

## Dictionary data model

```js
{
  ru: "принято",          // headword, stress unmarked
  tr: "prínyato",         // practical transliteration, acute = stress
  pos: "particle",        // verb | noun | adj | adv | pron | prep | conj |
                          // particle | num | predicative | interj
  en: "acknowledged, roger, received",
  note: "…",              // optional grammar/usage note
  ex: { r: "Принято, выезжаю.", e: "Roger, on my way." }   // optional
}
```

Entries are merged and de-duplicated by `ru + "|" + pos` at runtime. Search folds case, Latin
accents, and `ё → е`, so `prinyato` finds `prínyato`.

## Audio

Each dialogue line maps to `audio/<dialogue-id>-<line-number>.mp3`. The recordings were generated
with edge-tts neural voices — Microsoft Svetlana for the tutor and learner lines, Dmitry for the
male-coded roles — at −5% rate. The player uses `Audio`, stops the previous line when a new one
starts, toggles on a second tap, and falls back to `speechSynthesis` if a file is missing.

## Trainer API

The API chat sends `POST {base}/chat/completions` with `stream: true`, parses SSE chunks, and
renders the reply. Any OpenAI-compatible endpoint works. No key is embedded; the key field is a
password input, stored in `localStorage` only when «Запомнить ключ» is checked. Local endpoints
(`localhost`, `127.0.0.1`, `::1`) may use an empty key.

## License

MIT. See [LICENSE](LICENSE).

## Verified

- Load: 33 letter tiles, 6 dialogues / 47 lines / 47 play buttons, 10 roadmap steps, 734 dictionary
  entries, 6 case-explorer rows, computed stat counters; no console errors.
- Search by Cyrillic, accent-folded transliteration, and English returns expected entries; the verb
  filter returns 261 matches; paging reaches all 734.
- Trainer: wrong answers produce hints, correct answers advance with notes, three misses advance a
  step, a full lesson reaches «готово».
- API chat: streamed replies from a local mock endpoint; unreachable endpoint produces an error
  bubble.
- Audio: all 47 MP3s load with finite durations; playback advances `currentTime`, ends cleanly, and
  stops on a second click.
- Mobile: no horizontal overflow at 320–1280 px; menu, 16 px inputs, 44 px targets, instant anchor
  jumps, safe-area padding, stacked dictionary cards.
- GitHub Pages: relative asset paths, `.nojekyll` present, `LICENSE` and `favicon.svg` linked.
