/* Rendering and interaction: dictionary, dialogues, alphabet, paradigms, theme, audio. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Utilities                                                          */
  /* ------------------------------------------------------------------ */

  const $ = (sel, root) => (root || document).querySelector(sel);

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  /* Fold accents and case so "prinyato" finds "prínyato" and "еще" finds "ещё". */
  function fold(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ё/g, "е")
      .replace(/Ё/g, "Е")
      .toLowerCase();
  }

  function highlight(text, query) {
    const safe = esc(text);
    if (!query) return safe;
    const plain = fold(query);
    if (!plain) return safe;
    const hay = fold(text);
    const at = hay.indexOf(plain);
    if (at === -1) return safe;
    /* Only highlight when folding preserved length (ASCII accent folding does). */
    if (hay.length !== text.length) return safe;
    return esc(text.slice(0, at)) + "<mark>" + esc(text.slice(at, at + plain.length)) + "</mark>" + esc(text.slice(at + plain.length));
  }

  /* ------------------------------------------------------------------ */
  /* Dictionary                                                         */
  /* ------------------------------------------------------------------ */

  const ALL_ENTRIES = (() => {
    const raw = [].concat(
      typeof DICT_FUNCTION !== "undefined" ? DICT_FUNCTION : [],
      typeof DICT_VERBS !== "undefined" ? DICT_VERBS : [],
      typeof DICT_NOUNS !== "undefined" ? DICT_NOUNS : []
    );
    const seen = new Set();
    const out = [];
    for (const entry of raw) {
      const key = entry.ru + "|" + entry.pos;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(entry);
    }
    return out;
  })();

  const PAGE = 100;
  const dictState = { q: "", pos: "", sort: "ru", shown: PAGE };

  const dictBody = $("#dict-body");
  const dictCount = $("#dict-count");
  const dictEmpty = $("#dict-empty");
  const dictMore = $("#dict-more");
  const dictQ = $("#dict-q");
  const dictPos = $("#dict-pos");
  const dictSort = $("#dict-sort");

  function filteredEntries() {
    const q = fold(dictState.q.trim());
    let rows = ALL_ENTRIES.filter((entry) => {
      if (dictState.pos && entry.pos !== dictState.pos) return false;
      if (!q) return true;
      return fold(entry.ru).includes(q) ||
        fold(entry.tr || "").includes(q) ||
        fold(entry.en || "").includes(q) ||
        fold(entry.note || "").includes(q);
    });
    rows = rows.slice();
    if (dictState.sort === "en") {
      rows.sort((a, b) => a.en.localeCompare(b.en, "en") || a.ru.localeCompare(b.ru, "ru"));
    } else {
      /* Clitics like -то and -ка sort under their base letter, not under the hyphen. */
      const key = (value) => fold(value).replace(/^[-–—\s]+/, "");
      rows.sort((a, b) => key(a.ru).localeCompare(key(b.ru), "ru"));
    }
    return rows;
  }

  function renderDictionary() {
    const rows = filteredEntries();
    const visible = rows.slice(0, dictState.shown);
    const q = dictState.q.trim();

    dictBody.innerHTML = visible.map((e) => {
      const ex = e.ex ? `<br><em lang="ru">${highlight(e.ex.r, q)}</em> — ${esc(e.ex.e)}` : "";
      const note = e.note ? `${esc(e.note)}` : "";
      const detail = [note, ex].filter(Boolean).join("");
      return `<tr>
        <td class="w" data-label="Russian">${highlight(e.ru, q)}</td>
        <td class="tr" data-label="Translit.">${highlight(e.tr || "", q)}</td>
        <td class="pos" data-label="POS">${esc(e.pos)}</td>
        <td class="en" data-label="English">${highlight(e.en, q)}</td>
        <td class="note" data-label="Notes">${detail}${detail ? "" : "—"}</td>
      </tr>`;
    }).join("");

    dictEmpty.hidden = rows.length !== 0;

    const total = ALL_ENTRIES.length;
    if (!rows.length) {
      dictCount.textContent = `0 of ${total} entries`;
    } else if (q || dictState.pos) {
      dictCount.textContent = `${rows.length} ${rows.length === 1 ? "match" : "matches"} · ${visible.length} shown · ${total} entries total`;
    } else {
      dictCount.textContent = `${total} entries · ${visible.length} shown`;
    }

    dictMore.hidden = visible.length >= rows.length;
    dictMore.textContent = `Show ${Math.min(PAGE, rows.length - visible.length)} more`;
  }

  function resetPaging() {
    dictState.shown = PAGE;
  }

  if (dictQ) {
    dictQ.addEventListener("input", () => {
      dictState.q = dictQ.value;
      resetPaging();
      renderDictionary();
    });
  }

  if (dictPos) {
    dictPos.addEventListener("change", () => {
      dictState.pos = dictPos.value;
      resetPaging();
      renderDictionary();
    });
  }

  if (dictSort) {
    dictSort.addEventListener("change", () => {
      dictState.sort = dictSort.value;
      renderDictionary();
    });
  }

  if (dictMore) {
    dictMore.addEventListener("click", () => {
      dictState.shown += PAGE;
      renderDictionary();
    });
  }

  const dictReset = $("#dict-reset");
  if (dictReset) {
    dictReset.addEventListener("click", () => {
      dictState.q = "";
      dictState.pos = "";
      dictState.sort = "ru";
      dictState.shown = PAGE;
      dictQ.value = "";
      dictPos.value = "";
      dictSort.value = "ru";
      renderDictionary();
      dictQ.focus();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Dialogues                                                          */
  /* ------------------------------------------------------------------ */

  function renderDialogues() {
    const list = $("#dialogue-list");
    if (!list || typeof DIALOGUES === "undefined") return;

    list.innerHTML = DIALOGUES.map((dialogue) => {
      const lines = dialogue.lines.map((line, index) => {
        const file = `audio/${dialogue.id}-${String(index + 1).padStart(2, "0")}.mp3`;
        return `
        <div class="line">
          <div class="line__who">${esc(line.who)}</div>
          <div class="line__body">
            <p class="line__ru" lang="ru">${esc(line.ru)}</p>
            <p class="line__tr">${esc(line.tr)}</p>
            <p class="line__en">${esc(line.en)}</p>
            ${line.note ? `<p class="line__note">${esc(line.note)}</p>` : ""}
          </div>
          <button class="speak" type="button" data-audio="${file}" data-say="${esc(line.ru)}" aria-label="Прослушать фразу" title="Прослушать">▶</button>
        </div>`;
      }).join("");

      const phrases = dialogue.phrases.map((phrase) =>
        `<span lang="ru">${esc(phrase.ru)}</span> — ${esc(phrase.en)}`).join(" · ");

      return `<article class="dialogue">
        <header class="dialogue__head">
          <h3 class="dialogue__title">${esc(dialogue.title)} <span class="badge">${esc(dialogue.level)}</span></h3>
          <p class="dialogue__setting">${esc(dialogue.titleEn)} — ${esc(dialogue.setting)}</p>
        </header>
        <div class="lines">${lines}</div>
        <div class="dialogue__phrases"><strong>Полезные фразы:</strong> ${phrases}</div>
      </article>`;
    }).join("");
  }

  let activeAudio = null;
  let activeButton = null;

  function stopAudio() {
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (error) { /* already detached */ }
      activeAudio = null;
    }
    if (activeButton) {
      activeButton.classList.remove("is-playing");
      activeButton = null;
    }
  }

  function speakWithBrowser(text) {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
    utterance.rate = 0.9;
    const russian = window.speechSynthesis.getVoices().find((voice) => /^ru([-_]|$)/i.test(voice.lang));
    if (russian) utterance.voice = russian;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function playLine(button) {
    const source = button.dataset.audio;
    if (!source) return;

    /* Clicking the playing line again stops it. */
    if (activeButton === button) {
      stopAudio();
      return;
    }

    stopAudio();
    const audio = new Audio(source);
    audio.preload = "auto";
    activeAudio = audio;
    activeButton = button;
    button.classList.add("is-playing");

    let fellBack = false;
    const cleanup = () => {
      button.classList.remove("is-playing");
      if (activeAudio === audio) activeAudio = null;
      if (activeButton === button) activeButton = null;
    };
    const fallback = () => {
      if (fellBack) return;
      fellBack = true;
      cleanup();
      speakWithBrowser(button.dataset.say || "");
    };

    audio.addEventListener("ended", cleanup);
    audio.addEventListener("error", fallback);
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(fallback);
  }

  function initAudio() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".speak");
      if (button) playLine(button);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Alphabet                                                           */
  /* ------------------------------------------------------------------ */

  const LETTERS = [
    { ch: "а", name: "а", ipa: "[a]", type: "vowel", desc: "Open [a]. Unstressed it reduces to [ɐ] or [ə] — аканье, the defining feature of Russian vocalism.", ex: "ма́ма [ˈmamə] — mother" },
    { ch: "б", name: "бэ", ipa: "[b]", type: "consonant", desc: "Voiced [b]. Devoices to [p] at the end of a word: дуб [dup] “oak”.", ex: "быть [bɨtʲ] — to be; дуб [dup] — oak" },
    { ch: "в", name: "вэ", ipa: "[v]", type: "consonant", desc: "Voiced [v], devoiced to [f] before voiceless consonants and finally: вторник [ˈftornʲɪk].", ex: "вода́ [vɐˈda] — water; вторник — Tuesday" },
    { ch: "г", name: "гэ", ipa: "[ɡ]", type: "consonant", desc: "Voiced [ɡ], devoiced to [k]: друг [druk]. In the endings -ого/-его it is pronounced [v]: его́ [jɪˈvo].", ex: "го́род [ˈɡorət] — city; его́ — him/his" },
    { ch: "д", name: "дэ", ipa: "[d]", type: "consonant", desc: "Voiced [d], devoiced to [t] word-finally: сад [sat] “garden”.", ex: "дом [dom] — house; сад [sat] — garden" },
    { ch: "е", name: "е", ipa: "[je] / [e]", type: "vowel", desc: "Pronounced [je] word-initially and after vowels; after a consonant it palatalises it and sounds [e]. Unstressed it reduces toward [ɪ].", ex: "есть [jesʲtʲ] — to eat; нет [nʲet] — no" },
    { ch: "ё", name: "ё", ipa: "[jo]", type: "vowel", desc: "Always stressed, always [o] after a soft consonant. Russians routinely print it as е, so dictionaries mark it.", ex: "ещё [ɪˈɕːo] — still/more; ёлка [ˈjolkə] — fir tree" },
    { ch: "ж", name: "жэ", ipa: "[ʐ]", type: "consonant", desc: "Always hard, even before и/е: жить [ʐɨtʲ]. Devoiced to [ʂ] finally: нож [noʂ].", ex: "жизнь [ʐɨzʲnʲ] — life; нож [noʂ] — knife" },
    { ch: "з", name: "зэ", ipa: "[z]", type: "consonant", desc: "Voiced [z], devoiced to [s] finally: глаз [ɡlas].", ex: "знать [znatʲ] — to know; глаз [ɡlas] — eye" },
    { ch: "и", name: "и", ipa: "[i]", type: "vowel", desc: "Tense [i]; palatalises the preceding consonant: ни [nʲi].", ex: "и́мя [ˈimʲə] — name; ни [nʲi] — neither" },
    { ch: "й", name: "и кра́ткое", ipa: "[j]", type: "consonant", desc: "Semivowel [j], the sound of English “y”. Never stressed, never before a vowel in native words.", ex: "чай [tɕaj] — tea; май [maj] — May" },
    { ch: "к", name: "ка", ipa: "[k]", type: "consonant", desc: "Voiceless [k], unaspirated — closer to Spanish than to English “c” in “cat”.", ex: "код [kot] — code; кот [kot] — cat" },
    { ch: "л", name: "эль", ipa: "[l]", type: "consonant", desc: "Clear [l]. The soft ль is a distinct phoneme [lʲ]: угол vs уголь.", ex: "луна́ [lʊˈna] — moon; боль [bolʲ] — pain" },
    { ch: "м", name: "эм", ipa: "[m]", type: "consonant", desc: "Plain [m], palatalised before soft vowels.", ex: "мир [mʲir] — world/peace" },
    { ch: "н", name: "эн", ipa: "[n]", type: "consonant", desc: "Plain [n]; soft нь is [nʲ], as in нет.", ex: "нос [nos] — nose; нет [nʲet] — no" },
    { ch: "о", name: "о", ipa: "[o]", type: "vowel", desc: "Only stressed syllables have [o]. Unstressed о becomes [ɐ] or [ə]: молоко́ [məlɐˈko].", ex: "он [on] — he; молоко́ — milk" },
    { ch: "п", name: "пэ", ipa: "[p]", type: "consonant", desc: "Voiceless [p], unaspirated.", ex: "путь [putʲ] — path" },
    { ch: "р", name: "эр", ipa: "[r]", type: "consonant", desc: "A rolled trill, never the English approximant. Soft рь is [rʲ].", ex: "рука́ [rʊˈka] — hand; речь [rʲetɕ] — speech" },
    { ch: "с", name: "эс", ipa: "[s]", type: "consonant", desc: "Voiceless [s]; palatalised to [sʲ] before soft vowels.", ex: "сайт [sajt] — website; сеть [sʲetʲ] — network" },
    { ch: "т", name: "тэ", ipa: "[t]", type: "consonant", desc: "Voiceless [t], unaspirated. Soft ть is [tʲ].", ex: "тип [tʲip] — type; тот [tot] — that" },
    { ch: "у", name: "у", ipa: "[u]", type: "vowel", desc: "Rounded [u]. Unstressed it is shorter but keeps its quality.", ex: "у́тро [ˈutrə] — morning" },
    { ch: "ф", name: "эф", ipa: "[f]", type: "consonant", desc: "Voiceless [f]; rare in native words, common in loans.", ex: "файл [fajl] — file" },
    { ch: "х", name: "ха", ipa: "[x]", type: "consonant", desc: "Voiceless velar fricative, as in Scottish “loch”.", ex: "хлеб [xlʲep] — bread" },
    { ch: "ц", name: "цэ", ipa: "[ts]", type: "consonant", desc: "Always hard [ts], never palatalised, even before и: цена́ [tsɨˈna].", ex: "цель [tsɛlʲ] — goal; цена́ — price" },
    { ch: "ч", name: "че", ipa: "[tɕ]", type: "consonant", desc: "Always soft [tɕ], like English “ch” but palatalised.", ex: "час [tɕas] — hour; речь — speech" },
    { ch: "ш", name: "ша", ipa: "[ʂ]", type: "consonant", desc: "Always hard [ʂ], a Retroflex-ish “sh”.", ex: "шаг [ʂak] — step; шум [ʂum] — noise" },
    { ch: "щ", name: "ща", ipa: "[ɕː]", type: "consonant", desc: "Long soft [ɕː], distinct from ш. Often transliterated shch.", ex: "щу́ка [ˈɕːukə] — pike; ещё — still" },
    { ch: "ъ", name: "твёрдый знак", ipa: "—", type: "sign", desc: "Hard sign: no sound. Separates a prefix from a palatalising vowel: объект, съезд.", ex: "объе́кт [ɐbˈjekt] — object" },
    { ch: "ы", name: "ы", ipa: "[ɨ]", type: "vowel", desc: "A centralised vowel between [i] and [u]; never word-initial in native words.", ex: "быть [bɨtʲ] — to be; ты [tɨ] — you" },
    { ch: "ь", name: "мя́гкий знак", ipa: "—", type: "sign", desc: "Soft sign: no sound. Palatalises the preceding consonant (уголь vs угол) and marks feminine nouns and infinitives.", ex: "уголь [ˈuɡəlʲ] — coal; ночь [notɕ] — night" },
    { ch: "э", name: "э", ipa: "[e]", type: "vowel", desc: "The plain [e] vowel, used word-initially and after hard consonants in loans.", ex: "эта́ж [ɪˈtaʂ] — floor; мэр [mɛr] — mayor" },
    { ch: "ю", name: "ю", ipa: "[ju]", type: "vowel", desc: "[ju] initially and after vowels; after a consonant it palatalises it: люк [lʲuk].", ex: "юг [juk] — south; люк [lʲuk] — hatch" },
    { ch: "я", name: "я", ipa: "[ja]", type: "vowel", desc: "[ja] initially and after vowels; otherwise it palatalises the consonant. The letter is also the pronoun “I”.", ex: "я [ja] — I; пять [pʲatʲ] — five" }
  ];

  const alphabetGrid = $("#alphabet-grid");
  const letterPanel = $("#letter-panel");

  function showLetter(letter, button) {
    document.querySelectorAll(".letter").forEach((b) => b.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    letterPanel.innerHTML = `
      <div class="letter-panel__head">
        <span class="letter-panel__glyph" lang="ru">${esc(letter.ch)}</span>
        <span class="letter-panel__name">${esc(letter.name)} ${esc(letter.ipa)}</span>
        <span class="letter-panel__tag">${esc(letter.type)}</span>
      </div>
      <p>${esc(letter.desc)}</p>
      <p class="letter-panel__examples" lang="ru">${esc(letter.ex)}</p>`;
  }

  function renderAlphabet() {
    if (!alphabetGrid) return;
    alphabetGrid.innerHTML = LETTERS.map((l, i) => `
      <button class="letter" type="button" data-index="${i}" aria-pressed="false" aria-label="${esc(l.ch)} — ${esc(l.name)}">
        <span class="letter__glyph" lang="ru">${esc(l.ch)}</span>
        <span class="letter__name">${esc(l.name)}</span>
      </button>`).join("");
    alphabetGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".letter");
      if (!button) return;
      showLetter(LETTERS[Number(button.dataset.index)], button);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Paradigms                                                          */
  /* ------------------------------------------------------------------ */

  const CASE_NAMES = [
    ["Nominative", "именительный"],
    ["Genitive", "родительный"],
    ["Dative", "дательный"],
    ["Accusative", "винительный"],
    ["Instrumental", "творительный"],
    ["Prepositional", "предложный"]
  ];

  const PARADIGMS = [
    {
      word: "стол", label: "стол — masculine, inanimate", pl: "столы",
      note: "Hard-stem masculine. The accusative copies the nominative because the noun is inanimate.",
      cases: [
        ["стол", "Это стол.", "This is a table."],
        ["стола", "Нет стола.", "There is no table."],
        ["столу", "Иду к столу.", "I'm walking to the table."],
        ["стол", "Вижу стол.", "I see a table."],
        ["столом", "Пишу за столом.", "I'm writing at the table."],
        ["столе", "Говорю о столе.", "I'm talking about the table."]
      ]
    },
    {
      word: "книга", label: "книга — feminine, inanimate", pl: "книги",
      note: "Feminine -а stem. Accusative -у is the only form that differs from the nominative stem.",
      cases: [
        ["книга", "Это книга.", "This is a book."],
        ["книги", "Нет книги.", "There is no book."],
        ["книге", "Я рад книге.", "I'm glad about the book."],
        ["книгу", "Вижу книгу.", "I see a book."],
        ["книгой", "Доволен книгой.", "I'm pleased with the book."],
        ["книге", "Говорю о книге.", "I'm talking about the book."]
      ]
    },
    {
      word: "окно", label: "окно — neuter", pl: "окна",
      note: "Neuter -о stem. Genitive plural is окно → окон, with a fleeting vowel.",
      cases: [
        ["окно", "Это окно.", "This is a window."],
        ["окна", "Нет окна.", "There is no window."],
        ["окну", "Подхожу к окну.", "I'm walking up to the window."],
        ["окно", "Вижу окно.", "I see a window."],
        ["окном", "Перед окном.", "In front of the window."],
        ["окне", "Говорю об окне.", "I'm talking about the window."]
      ]
    },
    {
      word: "день", label: "день — masculine, soft stem", pl: "дни",
      note: "Soft-stem masculine. The ь is not a vowel and not a separate sound; the stem ends in a soft н.",
      cases: [
        ["день", "Это день.", "This is a day."],
        ["дня", "Нет дня.", "There is no day."],
        ["дню", "Ко дню рождения.", "By one's birthday."],
        ["день", "Жду этот день.", "I'm waiting for this day."],
        ["днём", "Доволен днём.", "Pleased with the day."],
        ["дне", "Говорю о дне.", "I'm talking about the day."]
      ]
    },
    {
      word: "ночь", label: "ночь — feminine, soft stem", pl: "ночи",
      note: "Feminine ь-noun: looks like the soft masculine pattern but takes feminine endings (genitive ночи, not ночя).",
      cases: [
        ["ночь", "Это ночь.", "This is night."],
        ["ночи", "Нет ночи.", "There is no night."],
        ["ночи", "К ночи.", "By nightfall."],
        ["ночь", "Всю ночь.", "All night."],
        ["ночью", "Перед ночью.", "Before night."],
        ["ночи", "Говорю о ночи.", "I'm talking about the night."]
      ]
    },
    {
      word: "путь", label: "путь — masculine, irregular", pl: "пути",
      note: "One of the few nouns that mixes declension patterns: feminine instrumental -ью but masculine genitive -и.",
      cases: [
        ["путь", "Это путь.", "This is a path."],
        ["пути", "Нет пути.", "There is no way."],
        ["пути", "Иду по пути.", "I'm walking along the path."],
        ["путь", "Вижу путь.", "I see a path."],
        ["путём", "Следую путём.", "I follow the path."],
        ["пути", "Говорю о пути.", "I'm talking about the path."]
      ]
    },
    {
      word: "время", label: "время — neuter, -мя", pl: "времена",
      note: "A small irregular class: время, имя, знамя. Every oblique form is built on времени-.",
      cases: [
        ["время", "Это время.", "This is the time."],
        ["времени", "Нет времени.", "There is no time."],
        ["времени", "Ко времени.", "On time."],
        ["время", "Провожу время.", "I spend time."],
        ["временем", "Со временем.", "Over time."],
        ["времени", "Говорю о времени.", "I'm talking about time."]
      ]
    },
    {
      word: "человек", label: "человек — masculine, animate", pl: "люди",
      note: "Irregular plural люди. Animate accusative equals the genitive: вижу человека.",
      cases: [
        ["человек", "Это человек.", "This is a person."],
        ["человека", "Нет человека.", "There is no person."],
        ["человеку", "Помогаю человеку.", "I help the person."],
        ["человека", "Вижу человека.", "I see the person."],
        ["человеком", "Говорю с человеком.", "I'm talking with the person."],
        ["человеке", "Думаю о человеке.", "I'm thinking about the person."]
      ]
    },
    {
      word: "кот", label: "кот — masculine, animate", pl: "коты",
      note: "Animate accusative copies the genitive: вижу кота, not вижу кот.",
      cases: [
        ["кот", "Это кот.", "This is a cat."],
        ["кота", "Нет кота.", "There is no cat."],
        ["коту", "Даю еду коту.", "I give food to the cat."],
        ["кота", "Вижу кота.", "I see the cat."],
        ["котом", "Играю с котом.", "I play with the cat."],
        ["коте", "Думаю о коте.", "I'm thinking about the cat."]
      ]
    },
    {
      word: "мышь", label: "мышь — feminine, soft stem", pl: "мыши",
      note: "Feminine ь-noun, same class as ночь; instrumental ends in -ью.",
      cases: [
        ["мышь", "Это мышь.", "This is a mouse."],
        ["мыши", "Нет мыши.", "There is no mouse."],
        ["мыши", "Даю сыр мыши.", "I give cheese to the mouse."],
        ["мышь", "Вижу мышь.", "I see the mouse."],
        ["мышью", "Доволен мышью.", "Pleased with the mouse."],
        ["мыши", "Думаю о мыши.", "I'm thinking about the mouse."]
      ]
    }
  ];

  const paradigmSelect = $("#paradigm-select");
  const paradigmBody = $("#paradigm-body");
  const paradigmNote = $("#paradigm-note");

  function renderParadigm(index) {
    const p = PARADIGMS[index];
    if (!p) return;
    paradigmBody.innerHTML = p.cases.map((row, i) => `
      <tr>
        <td>${CASE_NAMES[i][0]}<br><span lang="ru">${CASE_NAMES[i][1]}</span></td>
        <td lang="ru">${esc(row[0])}</td>
        <td lang="ru">${esc(row[1])}</td>
        <td>${esc(row[2])}</td>
      </tr>`).join("");
    paradigmNote.textContent = `${p.label} · nominative plural: ${p.pl}. ${p.note}`;
  }

  function initParadigms() {
    if (!paradigmSelect || !paradigmBody) return;
    paradigmSelect.innerHTML = PARADIGMS.map((p, i) =>
      `<option value="${i}">${esc(p.word)} — ${esc(p.label.split("—")[1].trim())}</option>`).join("");
    paradigmSelect.addEventListener("change", () => renderParadigm(Number(paradigmSelect.value)));
    renderParadigm(0);
  }

  /* ------------------------------------------------------------------ */
  /* Theme                                                              */
  /* ------------------------------------------------------------------ */

  function initTheme() {
    const root = document.documentElement;
    const button = $("#theme-toggle");
    let stored = null;
    try { stored = localStorage.getItem("ru-explainer-theme"); } catch (err) { /* private mode */ }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    root.setAttribute("data-theme", initial);

    const syncThemeColor = () => {
      const meta = document.getElementById("theme-color");
      if (meta) {
        meta.setAttribute("content", root.getAttribute("data-theme") === "dark" ? "#121317" : "#f7f5f0");
      }
    };
    syncThemeColor();

    if (button) {
      button.setAttribute("aria-pressed", String(initial === "dark"));
      button.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        button.setAttribute("aria-pressed", String(next === "dark"));
        syncThemeColor();
        try { localStorage.setItem("ru-explainer-theme", next); } catch (err) { /* ignore */ }
      });
    }
  }

  function initNav() {
    const header = $(".topbar");
    const toggle = $("#nav-toggle");
    const nav = $("#site-nav");
    if (!header || !toggle || !nav) return;

    const isOpen = () => header.getAttribute("data-nav-open") === "true";
    const setOpen = (open) => {
      header.setAttribute("data-nav-open", String(open));
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", () => setOpen(!isOpen()));
    header.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (isOpen() && !event.target.closest(".topbar")) setOpen(false);
    });
    const desktop = window.matchMedia("(min-width: 861px)");
    if (desktop.addEventListener) {
      desktop.addEventListener("change", () => setOpen(false));
    }
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                               */
  /* ------------------------------------------------------------------ */

  function initStats() {
    const entries = $("#stat-entries");
    const dialogues = $("#stat-dialogues");
    const recordings = $("#stat-recordings");
    if (entries) entries.textContent = String(ALL_ENTRIES.length);
    if (dialogues) dialogues.textContent = String(typeof DIALOGUES !== "undefined" ? DIALOGUES.length : 0);
    if (recordings) {
      const lines = typeof DIALOGUES !== "undefined"
        ? DIALOGUES.reduce((total, dialogue) => total + dialogue.lines.length, 0)
        : 0;
      recordings.textContent = String(lines);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    renderDialogues();
    initAudio();
    renderAlphabet();
    renderDictionary();
    initParadigms();
    initStats();
  });
})();
