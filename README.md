# Learn Russian

A free, static Russian course for beginners (A1–B1). Everything runs in the browser: a 10-step
roadmap, an interactive alphabet, a full grammar reference, six dialogues with bundled audio,
a 734-entry dictionary, a searchable phrasebook of 114 greetings and practical sentences, and a
two-mode trainer.

Created and built by **fishy/birdy** — concept, curriculum, dictionary, dialogues, trainer, and
audio pipeline.

https://arrogantcoder.github.io/russian/

## Features

- **10-step roadmap** from the alphabet to independent conversation, with a first-week schedule
  and a checkpoint for every step.
- **Alphabet and phonology**: 33 letters with sounds, hard/soft pairs, vowel reduction, devoicing,
  stress.
- **Grammar**: six cases with a case explorer, gender/number, adjectives, verb aspect and
  conjugation, pronouns, numerals, word order, negation, pragmatics, typography.
- **Six dialogues** (A1–B1) with stress-marked transliteration, English translation, grammar notes,
  key phrases, and one MP3 per line (47 recordings).
- **Greetings and practical phrases**: 114 stress-marked phrases in eight categories, searchable
  by Cyrillic, transliteration, or English, with a category filter, browser TTS, and one-tap
  copying without stress marks.
- **Dictionary**: 734 entries, searchable by Cyrillic, transliteration, or English; accent- and
  `ё`-folding; part-of-speech filter; paged rendering.
- **Trainer**: four scripted offline role-plays with answer checking, hints, and corrections;
  optional chat against any OpenAI-compatible endpoint.
- **Fluid loading and navigation**: a short branded loader, staggered reveal-on-scroll, a reading
  progress bar, active section navigation, and a back-to-top control. Pages open at the top on
  first visit and reload; section links are re-anchored after the dictionary and phrasebook render.
- **Fixed purple dark theme**: deep purple-black surfaces, lavender text, violet accents; no theme
  switch and no light mode.
- **No build step**, no accounts, no analytics. All assets are local except the optional API call.

## Structure

```
index.html            page structure and prose
css/styles.css        fixed theme, responsive layout, motion, print styles
js/conversations.js   six dialogues, translations, notes, key phrases
js/phrases.js         greetings and practical phrases, categories
js/dict-function.js   pronouns, prepositions, conjunctions, particles, adverbs
js/dict-verbs.js      verbs with aspect partners and conjugation notes
js/dict-nouns.js      nouns, adjectives, numerals, conversational tokens
js/trainer.js         scripted trainer, answer checking, API chat client
js/app.js             dictionary, dialogues, alphabet, phrasebook, loading/scroll UI, audio
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
  entries, 114 phrase cards, 6 case-explorer rows, computed stat counters.
- Search by Cyrillic, accent-folded transliteration, and English returns expected entries; the verb
  filter returns 261 matches; paging reaches all 734.
- Phrasebook: 114 phrases across eight categories; `coffee` returns one match, the café filter
  returns ten, and the two combine correctly; copy produces clean Russian without stress marks;
  play/copy states reset.
- Scroll: a first visit and a reload both land at `scrollY` 0 (tested from 9000 px) with no trainer
  focus; a `#phrases` deep link lands 96 px from the top on desktop and 76 px on mobile after the
  dynamic sections render. Progress, active nav, and back-to-top update while scrolling.
- Mobile: no horizontal overflow at 320–1280 px; 44 px menu toggle, 16 px inputs, 44 px targets,
  safe-area padding, stacked dictionary cards, and single-column phrase cards at 390 px.
- Trainer: wrong answers produce hints, correct answers advance with notes, three misses advance a
  step, a full lesson reaches «готово».
- API chat: streamed replies from a local mock endpoint; unreachable endpoint produces an error
  bubble.
- Audio: all 47 MP3s load with finite durations; playback advances `currentTime`, ends cleanly, and
  stops on a second click.
- Theme: fixed dark palette only; no toggle and no light-mode code path. Measured contrast:
  text/background 16.5:1, muted text 7.6:1, links 9.9:1, button text on accent 11.2:1.
- Loading and motion: the loader clears after its minimum display time, with a 2.6 s inline
  fallback; reveal-on-scroll, hero entrance, card/link transitions, and the progress bar respect
  `prefers-reduced-motion`.
- GitHub Pages: relative asset paths, `.nojekyll` present, `LICENSE` and `favicon.svg` linked.
