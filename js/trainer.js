/* Trainer: a scripted offline tutor plus an optional OpenAI-compatible chat. */

const LESSONS = [
  {
    id: "intro",
    title: "Знакомство",
    level: "A1",
    goal: "Поздороваться, назвать имя, сказать, откуда родом, и назвать профессию.",
    opening: "Привет! Меня зовут Аня. Давай познакомимся.",
    openingEn: "Hi! My name is Anya. Let's get acquainted.",
    steps: [
      {
        prompt: "Как тебя зовут?",
        en: "What's your name?",
        accept: /меня зовут|я\s+[а-яе-]+/u,
        hint: "Скажи: «Меня зовут …». Имя остаётся в именительном падеже.",
        model: "Меня зовут Алекс.",
        note: "После «меня зовут» имя не склоняется: Меня зовут Алекс, а не Алекса."
      },
      {
        prompt: "Очень приятно! Откуда ты?",
        en: "Nice to meet you! Where are you from?",
        accept: /я из|я живу|^из\s+[а-яе-]+/u,
        hint: "«Я из …» + страна в родительном падеже: из Канады, из России.",
        model: "Я из Канады.",
        note: "Предлог из требует родительного падежа: Канада → Канады, Россия → России."
      },
      {
        prompt: "Чем ты занимаешься?",
        en: "What do you do?",
        accept: /я\s+[а-яе-]+|работаю|учусь/u,
        hint: "«Я программист» или «Я работаю с …».",
        model: "Я программист. Работаю с данными.",
        note: "Профессия без артикля и без связки: «Я программист»."
      },
      {
        prompt: "Почему ты учишь русский?",
        en: "Why are you learning Russian?",
        accept: /хочу|потому|работ|коллег|читать|говорить|интерес/u,
        hint: "«Хочу говорить с коллегами» — хочу + инфинитив.",
        model: "Хочу говорить с коллегами.",
        note: "«С» + творительный падеж для людей: с коллегами, с друзьями."
      }
    ],
    closing: "Отлично! Сценарий пройден. Скажи «заново» или выбери другой сценарий."
  },
  {
    id: "cafe",
    title: "В кафе",
    level: "A1–A2",
    goal: "Заказать кофе, уточнить детали, спросить счёт и оплату.",
    opening: "Сцена: кафе. Официант начинает разговор.",
    openingEn: "Scene: a café. The waiter starts the conversation.",
    steps: [
      {
        prompt: "Добрый день! Что будете заказывать?",
        en: "Good afternoon! What will you order?",
        accept: /кофе|чай|воду|сок|бутерброд|заказ/u,
        hint: "«Один кофе, пожалуйста».",
        model: "Один кофе, пожалуйста.",
        note: "После «один» существительное мужского рода остаётся в именительном: один кофе."
      },
      {
        prompt: "С молоком или без?",
        en: "With milk or without?",
        accept: /с молоком|без молока|^без$|с сахаром/u,
        hint: "«С молоком» — предлог с + творительный падеж.",
        model: "С молоком, спасибо.",
        note: "с + творительный: с молоком, с сахаром; без + родительный: без молока."
      },
      {
        prompt: "Что-нибудь ещё?",
        en: "Anything else?",
        accept: /нет|всё|спасибо|достаточно/u,
        hint: "«Нет, это всё».",
        model: "Нет, это всё. Спасибо.",
        note: "«Это всё» — готовая формула «that's all»."
      },
      {
        prompt: "С вас четыреста рублей. Как будете платить?",
        en: "That'll be four hundred roubles. How will you pay?",
        accept: /картой|карта|наличными|можно/u,
        hint: "«Можно картой?» — можно + творительный падеж.",
        model: "Можно картой?",
        note: "Инструмент платежа — творительный: картой, наличными."
      }
    ],
    closing: "Готово! Заказ сделан. «Заново» — повторить."
  },
  {
    id: "work",
    title: "Созвон по работе",
    level: "A2",
    goal: "Понять проблему, сообщить статус, предложить срок.",
    opening: "Сцена: созвон с тимлидом.",
    openingEn: "Scene: a call with the team lead.",
    steps: [
      {
        prompt: "Привет! Есть минутка?",
        en: "Hi! Got a minute?",
        accept: /да|конечно|есть|минут/u,
        hint: "«Да, конечно. Что случилось?»",
        model: "Да, конечно. Что случилось?",
        note: "«Что случилось?» — вопрос о произошедшем; «что случится?» — о будущем."
      },
      {
        prompt: "Тесты падают на сборке. Посмотри лог, пожалуйста.",
        en: "The tests are failing in the build. Take a look at the log, please.",
        accept: /смотрю|посмотрю|уже|хорошо|ок/u,
        hint: "«Уже смотрю» или «Хорошо, посмотрю».",
        model: "Уже смотрю.",
        note: "«Уже» + настоящее время = «I'm on it already»."
      },
      {
        prompt: "Что там?",
        en: "What's there?",
        accept: /ошибка|конфиг|лог|кажется|проблема/u,
        hint: "«Кажется, ошибка в конфиге».",
        model: "Кажется, ошибка в конфиге.",
        note: "«Кажется» — вводное слово: «it seems»."
      },
      {
        prompt: "Можешь исправить сегодня?",
        en: "Can you fix it today?",
        accept: /да|могу|через час|сегодня|будет/u,
        hint: "«Да, через час будет пул-реквест».",
        model: "Да, через час будет пул-реквест.",
        note: "«Через» + винительный падеж для срока: через час, через день."
      }
    ],
    closing: "Созвон закончен. Тимлид доволен. «Заново» — ещё раз."
  },
  {
    id: "directions",
    title: "Как добраться",
    level: "A2",
    goal: "Спросить дорогу, уточнить расстояние и поблагодарить.",
    opening: "Сцена: улица. Нужно спросить дорогу.",
    openingEn: "Scene: the street. Directions need to be asked.",
    steps: [
      {
        prompt: "Начни разговор: спроси, как добраться до вокзала.",
        en: "Start the conversation: ask how to get to the station.",
        accept: /как добраться|где вокзал|извините|подскажите/u,
        hint: "«Извините, как добраться до вокзала?»",
        model: "Извините, как добраться до вокзала?",
        note: "«До» + родительный падеж: до вокзала, до метро."
      },
      {
        prompt: "Идите прямо, потом налево. Спроси, далеко ли это.",
        en: "Go straight, then left. Ask whether it's far.",
        accept: /далеко/u,
        hint: "«Это далеко?»",
        model: "Это далеко?",
        note: "Короткий вопрос без инверсии: «Это далеко?»"
      },
      {
        prompt: "Минут десять пешком. Спроси, быстрее ли на метро.",
        en: "About ten minutes on foot. Ask whether the metro is faster.",
        accept: /метро|быстрее/u,
        hint: "«А на метро быстрее?»",
        model: "А на метро быстрее?",
        note: "«А» здесь противопоставляет варианты: пешком / на метро."
      },
      {
        prompt: "Быстрее, но придётся пересаживаться. Поблагодари.",
        en: "Faster, but you'll have to change lines. Say thanks.",
        accept: /спасибо|благодар/u,
        hint: "«Спасибо большое!»",
        model: "Спасибо большое!",
        note: "«Большое спасибо» и «спасибо большое» оба нормальны."
      }
    ],
    closing: "Вокзал найден. «Заново» — повторить маршрут."
  }
];

const TRAINER = {
  mode: "lesson",
  lesson: 0,
  step: 0,
  attempts: 0,
  waiting: false,
  history: [],
  lastEn: "",
  api: { base: "https://api.openai.com/v1", model: "gpt-4o-mini", key: "", level: "A2", remember: false }
};

const PRAISE = ["Отлично!", "Верно!", "Хорошо!", "Точно!", "Так и говорят!"];

const log = document.getElementById("chat-log");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const statusEl = document.getElementById("tutor-status");

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scrollLog() {
  log.scrollTop = log.scrollHeight;
}

function addMessage(role, text, options) {
  const opts = options || {};
  const wrap = document.createElement("div");
  wrap.className = "msg msg--" + role;
  if (opts.error) wrap.classList.add("msg--error");
  if (opts.who) {
    const who = document.createElement("div");
    who.className = "msg__who";
    who.textContent = opts.who;
    wrap.appendChild(who);
  }
  const body = document.createElement("div");
  body.className = "msg__text";
  body.textContent = text;
  wrap.appendChild(body);
  if (opts.en) {
    const en = document.createElement("div");
    en.className = "msg__en";
    en.textContent = opts.en;
    wrap.appendChild(en);
  }
  log.appendChild(wrap);
  scrollLog();
  return body;
}

function bot(text, options) {
  return addMessage("bot", text, Object.assign({ who: "Аня" }, options || {}));
}

function user(text) {
  addMessage("user", text, { who: "Ученик" });
}

function systemLine(text) {
  addMessage("system", text, {});
}

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function clearLog() {
  log.innerHTML = "";
  log.classList.remove("show-en");
}

/* ------------------------------ lessons ------------------------------ */

function startLesson(index) {
  TRAINER.mode = "lesson";
  TRAINER.lesson = Number(index) || 0;
  TRAINER.step = 0;
  TRAINER.attempts = 0;
  TRAINER.lastEn = "";
  clearLog();
  updateModeUI();
  const lesson = LESSONS[TRAINER.lesson];
  bot(lesson.opening, { en: lesson.openingEn });
  bot(lesson.steps[0].prompt, { en: lesson.steps[0].en });
  updateLessonStatus();
  renderLessonPicker();
  input.focus();
}

function updateLessonStatus() {
  const lesson = LESSONS[TRAINER.lesson];
  if (TRAINER.step >= lesson.steps.length) {
    setStatus(`${lesson.level} · ${lesson.title} · готово`);
  } else {
    setStatus(`${lesson.level} · ${lesson.title} · шаг ${TRAINER.step + 1} из ${lesson.steps.length}`);
  }
}

function nextStep() {
  TRAINER.step += 1;
  TRAINER.attempts = 0;
  const lesson = LESSONS[TRAINER.lesson];
  if (TRAINER.step < lesson.steps.length) {
    const step = lesson.steps[TRAINER.step];
    bot(step.prompt, { en: step.en });
    TRAINER.lastEn = step.en;
    updateLessonStatus();
  } else {
    bot(lesson.closing);
    setStatus(`${lesson.level} · ${lesson.title} · готово`);
  }
}

function handleLesson(text) {
  const lesson = LESSONS[TRAINER.lesson];
  const step = lesson.steps[TRAINER.step];
  user(text);

  if (!step) {
    bot("Сценарий уже закончен. Скажи «заново» или выбери другой сценарий.");
    return;
  }

  const normalized = normalize(text);

  if (!/[а-яе]/u.test(text) && !/^(hint|translate|skip|restart|help)$/u.test(normalized)) {
    bot("Давай по-русски. " + step.hint);
    return;
  }

  if (step.accept.test(normalized)) {
    TRAINER.attempts = 0;
    const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    bot(step.note ? `${praise} ${step.note}` : praise);
    nextStep();
    return;
  }

  TRAINER.attempts += 1;
  if (TRAINER.attempts === 1) {
    bot("Почти. " + step.hint);
  } else if (TRAINER.attempts === 2) {
    bot(`Смотри: «${step.model}». Попробуй ещё раз.`);
  } else {
    bot(`Ладно, идём дальше. Вот как это звучит: «${step.model}».`);
    nextStep();
  }
}

function showHint() {
  const step = LESSONS[TRAINER.lesson].steps[TRAINER.step];
  if (!step) {
    bot("Подсказок больше нет: сценарий закончен.");
    return;
  }
  bot("Подсказка: " + step.hint);
}

function skipStep() {
  const step = LESSONS[TRAINER.lesson].steps[TRAINER.step];
  if (!step) {
    bot("Сценарий закончен. Скажи «заново».");
    return;
  }
  bot(`Пропускаем. Образец: «${step.model}».`);
  nextStep();
}

/* ------------------------------ API mode ------------------------------ */

function levelLabel() {
  return TRAINER.api.level || "A2";
}

function systemPrompt() {
  return [
    "Ты — Аня, терпеливый преподаватель русского языка.",
    `Уровень ученика: ${levelLabel()}.`,
    "Правила:",
    "- Пиши только по-русски, 1–3 коротких предложения.",
    "- Задавай ровно один вопрос в конце.",
    "- Если ученик ошибся, сначала дай правильный вариант, затем очень короткое объяснение в скобках по-английски.",
    "- Не читай лекции и не перечисляй правила без просьбы.",
    "- Темы: знакомство, кафе, работа в IT, повседневная жизнь.",
    "- Если ученик просит объяснить по-английски, объясни и вернись к русскому.",
    "- Не утверждай, что ты человек."
  ].join("\n");
}

function isLocalEndpoint(base) {
  return /localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]/i.test(base);
}

function readConfig() {
  const base = (document.getElementById("api-base").value || "").trim().replace(/\/+$/, "");
  const model = (document.getElementById("api-model").value || "").trim();
  const key = (document.getElementById("api-key").value || "").trim();
  const level = document.getElementById("api-level").value || "A2";
  TRAINER.api = { base, model, key, level, remember: document.getElementById("api-remember").checked };
  return TRAINER.api;
}

async function callApi(text) {
  const cfg = readConfig();
  if (!cfg.base || !cfg.model) {
    bot("Укажи base URL и модель в настройках ниже.", { error: true });
    openSettings();
    return;
  }
  if (!cfg.key && !isLocalEndpoint(cfg.base)) {
    bot("Нужен API-ключ. Открой настройки ниже и вставь ключ — или оставь поле пустым для локальной модели.", { error: true });
    openSettings();
    return;
  }

  TRAINER.history.push({ role: "user", content: text });
  const bubble = bot("…", { who: "Аня" });
  TRAINER.waiting = true;
  if (form.querySelector("button")) form.querySelector("button").disabled = true;

  try {
    const headers = { "Content-Type": "application/json" };
    if (cfg.key) headers.Authorization = "Bearer " + cfg.key;

    const response = await fetch(cfg.base + "/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: cfg.model,
        messages: TRAINER.history,
        temperature: 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 400);
      throw new Error(`HTTP ${response.status}. ${detail}`);
    }

    const type = response.headers.get("content-type") || "";
    if (type.includes("text/event-stream") && response.body) {
      await readStream(response, bubble);
    } else {
      const data = await response.json();
      bubble.textContent = data.choices?.[0]?.message?.content || "(пустой ответ)";
    }

    if (!bubble.textContent.trim() || bubble.textContent === "…") {
      bubble.textContent = "(пустой ответ)";
    }
    TRAINER.history.push({ role: "assistant", content: bubble.textContent });
  } catch (error) {
    bubble.closest(".msg").classList.add("msg--error");
    bubble.textContent = "Ошибка запроса: " + error.message;
    systemLine("Проверь base URL, модель, ключ и CORS на стороне провайдера.");
  } finally {
    TRAINER.waiting = false;
    if (form.querySelector("button")) form.querySelector("button").disabled = false;
    scrollLog();
  }
}

async function readStream(response, bubble) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") {
        bubble.textContent = text;
        return;
      }
      try {
        const chunk = JSON.parse(payload);
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          text += delta;
          bubble.textContent = text;
          scrollLog();
        }
      } catch (error) {
        /* keep-alive or malformed chunk */
      }
    }
  }
  bubble.textContent = text;
}

function switchMode(mode) {
  if (mode === TRAINER.mode) return;
  TRAINER.mode = mode;
  clearLog();
  updateModeUI();
  if (mode === "api") {
    TRAINER.history = [{ role: "system", content: systemPrompt() }];
    const cfg = readConfig();
    bot("Свободный чат. Напиши по-русски — я отвечу и поправлю. Уровень: " + cfg.level + ".", {
      en: "Free chat. Write in Russian; I'll reply and correct. Level: " + cfg.level + "."
    });
    if (!cfg.key && !isLocalEndpoint(cfg.base)) {
      systemLine("Ключ не указан. Для локальной модели (Ollama, LM Studio) ключ можно оставить пустым.");
      openSettings();
    }
  } else {
    startLesson(TRAINER.lesson);
  }
}

function updateModeUI() {
  document.querySelectorAll("#mode-lesson, #mode-api").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.id === "mode-" + TRAINER.mode));
  });
  const picker = document.getElementById("lesson-picker");
  if (picker) {
    picker.hidden = TRAINER.mode !== "lesson";
    if (TRAINER.mode !== "lesson") {
      picker.querySelectorAll(".chip").forEach((chip) => chip.setAttribute("aria-pressed", "false"));
    }
  }
  const hint = document.getElementById("tutor-hint");
  if (hint) hint.hidden = TRAINER.mode !== "lesson";
  const translate = document.getElementById("tutor-translate");
  if (translate) translate.hidden = false;
}

function openSettings() {
  const details = document.getElementById("api-settings");
  if (details) details.open = true;
}

/* ------------------------------ settings ------------------------------ */

const STORE_KEY = "ru-trainer-api";

function loadSettings() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {};
  } catch (error) {
    saved = {};
  }
  const base = document.getElementById("api-base");
  const model = document.getElementById("api-model");
  const key = document.getElementById("api-key");
  const level = document.getElementById("api-level");
  const remember = document.getElementById("api-remember");
  if (saved.base) base.value = saved.base;
  if (saved.model) model.value = saved.model;
  if (saved.key) key.value = saved.key;
  if (saved.level) level.value = saved.level;
  remember.checked = Boolean(saved.key);
  TRAINER.api = {
    base: base.value,
    model: model.value,
    key: key.value,
    level: level.value,
    remember: remember.checked
  };
}

function saveSettings() {
  const cfg = readConfig();
  const payload = { base: cfg.base, model: cfg.model, level: cfg.level };
  if (cfg.remember && cfg.key) payload.key = cfg.key;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(payload));
    if (!cfg.remember) {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      delete stored.key;
      localStorage.setItem(STORE_KEY, JSON.stringify(stored));
    }
    systemLine("Настройки сохранены в этом браузере.");
  } catch (error) {
    systemLine("Не удалось сохранить настройки: " + error.message);
  }
  if (TRAINER.mode === "api") {
    TRAINER.history = [{ role: "system", content: systemPrompt() }];
    systemLine("История чата сброшена под новый уровень.");
  }
}

/* ------------------------------ wiring ------------------------------ */

function renderLessonPicker() {
  const picker = document.getElementById("lesson-picker");
  if (!picker) return;
  picker.innerHTML = "";
  LESSONS.forEach((lesson, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = `${lesson.title} · ${lesson.level}`;
    button.setAttribute("aria-pressed", String(index === TRAINER.lesson && TRAINER.mode === "lesson"));
    button.addEventListener("click", () => startLesson(index));
    picker.appendChild(button);
  });
}

function handleCommand(text) {
  const cmd = normalize(text);
  if (cmd === "подсказка" || cmd === "hint") { showHint(); return true; }
  if (cmd === "перевод" || cmd === "translate") {
    log.classList.toggle("show-en");
    return true;
  }
  if (cmd === "дальше" || cmd === "skip") { skipStep(); return true; }
  if (cmd === "заново" || cmd === "restart") { startLesson(TRAINER.lesson); return true; }
  if (cmd === "помощь" || cmd === "help") {
    bot("Команды: «подсказка», «перевод», «дальше», «заново». В режиме сценария отвечай по-русски.");
    return true;
  }
  if (cmd === "вопрос") {
    bot("Вопросы принимаются в API-режиме. Здесь я проверяю ответы по сценарию.");
    return true;
  }
  return false;
}

function init() {
  if (!log || !form || !input) return;

  loadSettings();
  renderLessonPicker();

  document.querySelectorAll("#mode-lesson, #mode-api").forEach((button) => {
    button.addEventListener("click", () => switchMode(button.id === "mode-api" ? "api" : "lesson"));
  });

  document.getElementById("tutor-hint").addEventListener("click", showHint);
  document.getElementById("tutor-translate").addEventListener("click", () => {
    log.classList.toggle("show-en");
    document.getElementById("tutor-translate").setAttribute(
      "aria-pressed",
      String(log.classList.contains("show-en"))
    );
  });
  document.getElementById("tutor-restart").addEventListener("click", () => startLesson(TRAINER.lesson));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || TRAINER.waiting) return;
    input.value = "";

    if (TRAINER.mode === "api") {
      user(text);
      callApi(text);
      return;
    }

    if (handleCommand(text)) return;
    handleLesson(text);
  });

  input.addEventListener("focus", () => {
    if (window.matchMedia("(max-width: 720px)").matches) {
      window.setTimeout(() => input.scrollIntoView({ block: "center", behavior: "smooth" }), 300);
    }
  });

  document.getElementById("api-save").addEventListener("click", saveSettings);
  document.getElementById("api-key").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveSettings();
    }
  });

  startLesson(0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
