/* Example dialogues for the site. Six scenes, A1 to B1.
   Stress is marked in the transliteration, not in the Cyrillic. */

const DIALOGUES = [
  {
    id: "intro",
    title: "Знакомство",
    titleEn: "Meeting someone",
    level: "A1",
    setting: "Два человека знакомятся на конференции.",
    lines: [
      { who: "Аня", ru: "Привет! Как тебя зовут?", tr: "Privét! Kak tebyá zovút?", en: "Hi! What's your name?" },
      { who: "Ученик", ru: "Привет! Меня зовут Алекс.", tr: "Privét! Menyá zovút Aleks.", en: "Hi! My name is Alex.", note: "«Меня зовут…» is the standard formula; the name stays in the nominative." },
      { who: "Аня", ru: "Очень приятно, Алекс. Откуда ты?", tr: "Óchen' priyátno, Aleks. Otkúda ty?", en: "Nice to meet you, Alex. Where are you from?" },
      { who: "Ученик", ru: "Я из Канады, но живу в Берлине.", tr: "Ya iz Kanády, no zhivú v Berlíne.", en: "I'm from Canada, but I live in Berlin.", note: "After из the country goes into the genitive: Канада → Канады." },
      { who: "Аня", ru: "Понятно. Чем ты занимаешься?", tr: "Ponyátno. Chem ty zanimáyesh'sya?", en: "I see. What do you do?" },
      { who: "Ученик", ru: "Я программист. Работаю с данными.", tr: "Ya programmíst. Rabótayu s dánnymi.", en: "I'm a programmer. I work with data.", note: "No article and no copula: «Я программист», never «Я есть программист»." },
      { who: "Аня", ru: "Здорово! А я учу русский язык.", tr: "Zdórovo! A ya uchú rússkiy yazýk.", en: "Cool! And I'm learning Russian." },
      { who: "Ученик", ru: "У тебя хорошо получается!", tr: "U tebyá khoroshó polucháyetsya!", en: "You're doing well!" }
    ],
    phrases: [
      { ru: "Как тебя зовут?", en: "What's your name?" },
      { ru: "Очень приятно.", en: "Nice to meet you." },
      { ru: "Откуда ты?", en: "Where are you from?" },
      { ru: "Чем ты занимаешься?", en: "What do you do?" }
    ]
  },
  {
    id: "cafe",
    title: "В кафе",
    titleEn: "At a café",
    level: "A1–A2",
    setting: "Заказ кофе. Вежливые формулы и счёт.",
    lines: [
      { who: "Официант", ru: "Добрый день! Что будете заказывать?", tr: "Dóbryy den'! Shto búdete zakázyvat'?", en: "Good afternoon! What will you order?" },
      { who: "Ученик", ru: "Здравствуйте. Один кофе, пожалуйста.", tr: "Zdrávstvuyte. Odín kófe, pozháluysta.", en: "Hello. One coffee, please." },
      { who: "Официант", ru: "С молоком или без?", tr: "S molokóm íli bez?", en: "With milk or without?" },
      { who: "Ученик", ru: "С молоком, спасибо.", tr: "S molokóm, spasíbo.", en: "With milk, thanks.", note: "«С» + instrumental: с молоком, с сахаром." },
      { who: "Официант", ru: "Что-нибудь ещё?", tr: "Shtó-nibud' yeshchó?", en: "Anything else?" },
      { who: "Ученик", ru: "Нет, это всё. Сколько с меня?", tr: "Net, éto vsyo. Skól'ko s menyá?", en: "No, that's all. How much do I owe?" },
      { who: "Официант", ru: "Четыреста рублей.", tr: "Chetýresta rubley.", en: "Four hundred roubles." },
      { who: "Ученик", ru: "Можно картой?", tr: "Mózhno kártoy?", en: "Can I pay by card?", note: "Можно + instrumental: картой, наличными." },
      { who: "Официант", ru: "Конечно. Вот терминал.", tr: "Konéchno. Vot terminál.", en: "Of course. Here's the terminal." }
    ],
    phrases: [
      { ru: "Что будете заказывать?", en: "What will you have?" },
      { ru: "Сколько с меня?", en: "How much do I owe?" },
      { ru: "Можно картой?", en: "Can I pay by card?" },
      { ru: "Это всё, спасибо.", en: "That's all, thanks." }
    ]
  },
  {
    id: "work",
    title: "Созвон по работе",
    titleEn: "A work call",
    level: "A2",
    setting: "Тимлид сообщает о падающих тестах.",
    lines: [
      { who: "Тимлид", ru: "Привет! Есть минутка?", tr: "Privét! Yest' minútka?", en: "Hi! Got a minute?" },
      { who: "Ученик", ru: "Да, конечно. Что случилось?", tr: "Da, konéchno. Shto sluchílos'?", en: "Yes, of course. What happened?" },
      { who: "Тимлид", ru: "Тесты падают на сборке. Посмотри лог, пожалуйста.", tr: "Tésty pádayut na sbórke. Posmotrí log, pozháluysta.", en: "The tests are failing in the build. Take a look at the log, please." },
      { who: "Ученик", ru: "Уже смотрю. Кажется, ошибка в конфиге.", tr: "Uzhé smotryú. Kázhetsya, oshíbka v konfíge.", en: "Already looking. It seems the error is in the config.", note: "«Кажется» is a parenthetical: “it seems / apparently”." },
      { who: "Тимлид", ru: "Можешь исправить сегодня?", tr: "Mózhesh' isprávit' segódnya?", en: "Can you fix it today?" },
      { who: "Ученик", ru: "Да, через час будет пул-реквест.", tr: "Da, chérez chas búdet pul-rekvést.", en: "Yes, there'll be a pull request in an hour." },
      { who: "Тимлид", ru: "Отлично. Спасибо!", tr: "Otlíchno. Spasíbo!", en: "Great. Thanks!" }
    ],
    phrases: [
      { ru: "Есть минутка?", en: "Got a minute?" },
      { ru: "Что случилось?", en: "What happened?" },
      { ru: "Уже смотрю.", en: "I'm already on it." },
      { ru: "Через час будет готово.", en: "It'll be ready in an hour." }
    ]
  },
  {
    id: "directions",
    title: "Как добраться",
    titleEn: "Finding the way",
    level: "A2",
    setting: "Вопрос прохожему на улице.",
    lines: [
      { who: "Ученик", ru: "Извините, как добраться до вокзала?", tr: "Izviníte, kak dobrát'sya do vokzála?", en: "Excuse me, how do I get to the station?" },
      { who: "Прохожий", ru: "Идите прямо, потом налево.", tr: "Idíte pryámo, potóm nalévo.", en: "Go straight, then left.", note: "Imperative plural is polite: идите, поверните." },
      { who: "Ученик", ru: "Это далеко?", tr: "Éto dalekó?", en: "Is it far?" },
      { who: "Прохожий", ru: "Минут десять пешком.", tr: "Minút désyat' peshkóm.", en: "About ten minutes on foot." },
      { who: "Ученик", ru: "А на метро быстрее?", tr: "A na metró býstreye?", en: "Is it faster by metro?" },
      { who: "Прохожий", ru: "Быстрее, но придётся пересаживаться.", tr: "Býstreye, no pridótsya peresázhivat'sya.", en: "Faster, but you'll have to change lines." },
      { who: "Ученик", ru: "Понял. Спасибо большое!", tr: "Pónyal. Spasíbo bol'shóye!", en: "Got it. Thanks a lot!" },
      { who: "Прохожий", ru: "Не за что. Удачи!", tr: "Né za shto. Udáchi!", en: "Don't mention it. Good luck!" }
    ],
    phrases: [
      { ru: "Как добраться до…?", en: "How do I get to…?" },
      { ru: "Это далеко?", en: "Is it far?" },
      { ru: "Идите прямо.", en: "Go straight." },
      { ru: "Не за что.", en: "Don't mention it." }
    ]
  },
  {
    id: "standup",
    title: "Стендап",
    titleEn: "Stand-up",
    level: "B1",
    setting: "Обсуждение бага с кэшем и интеграционного теста.",
    lines: [
      { who: "Коллега", ru: "Как продвигается задача с кэшем?", tr: "Kak prodvigáyetsya zadácha s késhem?", en: "How's the cache task going?" },
      { who: "Ученик", ru: "Вчера нашёл узкое место. Инвалидация работала неверно.", tr: "Vcherá nashól úzkoye mésto. Invalidátsiya rabótala nevérno.", en: "Yesterday I found the bottleneck. Invalidation was working incorrectly." },
      { who: "Коллега", ru: "Это объясняет скачки latency?", tr: "Éto ob'yasnyáyet skachkí latency?", en: "Does that explain the latency spikes?" },
      { who: "Ученик", ru: "Да, после исправления график выровнялся.", tr: "Da, pósle ispravléniya gráfik výrovnyalsya.", en: "Yes, after the fix the graph levelled out.", note: "«После» + genitive: после исправления." },
      { who: "Коллега", ru: "Нужна помощь с тестами?", tr: "Nuzhná pómoshch' s téstami?", en: "Do you need help with the tests?" },
      { who: "Ученик", ru: "Было бы здорово. Я как раз пишу интеграционный тест.", tr: "Býlo by zdórovo. Ya kak raz pishú integratsiónnyy test.", en: "That would be great. I'm writing an integration test right now.", note: "«Было бы» is the conditional: “it would be”." },
      { who: "Коллега", ru: "Давай после обеда посмотрим вместе.", tr: "Daváy pósle obéda posmótrim vméste.", en: "Let's look at it together after lunch." },
      { who: "Ученик", ru: "Договорились.", tr: "Dogovorílis'.", en: "Agreed." }
    ],
    phrases: [
      { ru: "Как продвигается…?", en: "How is … going?" },
      { ru: "Нашёл узкое место.", en: "Found the bottleneck." },
      { ru: "Нужна помощь?", en: "Need help?" },
      { ru: "Договорились.", en: "Agreed / deal." }
    ]
  },
  {
    id: "language",
    title: "Разговор о языке",
    titleEn: "Talking about the language",
    level: "B1",
    setting: "Почему ты учишь русский и как это даётся.",
    lines: [
      { who: "Аня", ru: "Почему ты учишь русский?", tr: "Pochemú ty úchish' rússkiy?", en: "Why are you learning Russian?" },
      { who: "Ученик", ru: "Хочу читать документацию и говорить с коллегами.", tr: "Khochú chitát' dokumentátsiyu i govorít' s kollégami.", en: "I want to read documentation and talk to colleagues.", note: "«Хочу» + infinitive; «с» + instrumental for people." },
      { who: "Аня", ru: "Русский сложный. Шесть падежей!", tr: "Rússkiy slózhnyy. Shest' padézhey!", en: "Russian is hard. Six cases!" },
      { who: "Ученик", ru: "Зато порядок слов свободный.", tr: "Zató poryádok slov svobódnyy.", en: "But word order is free, at least." },
      { who: "Аня", ru: "Это правда. Но ошибки всё равно заметны.", tr: "Éto právda. No oshíbki vsyo ravnó zamétny.", en: "True. But mistakes are still noticeable." },
      { who: "Ученик", ru: "Поэтому я много слушаю и повторяю.", tr: "Poétomu ya mnógo slúshayu i povtoryáyu.", en: "That's why I listen a lot and repeat." },
      { who: "Аня", ru: "Хороший подход. Давай попробуем ещё раз.", tr: "Khoróshiy podkhód. Daváy popróbuyem yeshchó raz.", en: "Good approach. Let's try once more." }
    ],
    phrases: [
      { ru: "Почему ты учишь русский?", en: "Why are you learning Russian?" },
      { ru: "Зато…", en: "But on the other hand…" },
      { ru: "Всё равно", en: "Still, all the same" },
      { ru: "Давай попробуем.", en: "Let's try." }
    ]
  }
];
