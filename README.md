# Луч × Яндекс Алиса — Квиз-бриф

Адаптивный квиз для сбора вводных по задачам на дизайн: **Блог Алисы** и **Дайджест**.

## Стек

- **Next.js 14** (Pages Router)
- **TypeScript**
- **SCSS Modules**
- **Inter** (Google Fonts)
- Хранение ответов в локальном JSON-файле (`data/submissions.json`)

---

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

---

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Квиз (публичный) |
| `/admin` | Просмотр всех заполненных брифов |

---

## Структура проекта

```
alice-quiz/
├── components/
│   ├── AchievementToast.tsx   # Тост с ачивкой
│   └── QuestionBlock.tsx      # Рендер одного вопроса
├── lib/
│   ├── questions.ts           # Все вопросы + типы
│   ├── storage.ts             # Чтение/запись JSON (сервер)
│   └── uuid.ts                # UUID без зависимостей
├── pages/
│   ├── api/
│   │   ├── submit.ts          # POST /api/submit
│   │   └── submissions.ts     # GET /api/submissions
│   ├── _app.tsx
│   ├── index.tsx              # Квиз
│   └── admin.tsx              # Просмотр ответов
├── styles/
│   ├── globals.scss           # Переменные + сброс
│   ├── quiz.module.scss       # Стили квиза
│   └── admin.module.scss      # Стили админки
└── data/
    └── submissions.json       # Создаётся автоматически
```

---

## Вопросы

### Блок 1 — Блог Алисы (7 вопросов)
- Что должно быть в блоге (multi-select)
- Формат материалов (single)
- Частота публикаций (single)
- Аудитория (multi)
- Тон голоса (single)
- Свободное описание задачи (textarea)
- Референсы (textarea)

### Блок 2 — Дайджест (6 вопросов)
- Формат дайджеста (single)
- Содержание (multi)
- Периодичность (single)
- Аудитория (multi)
- Свободное описание (textarea)
- Дизайн-требования (multi + textarea)
- Тайминг (single)

---

## Ачивки

За каждый заполненный вопрос — тост-уведомление с эмодзи и названием ачивки.
На финальном экране показываются все заработанные ачивки.

---

## Деплой на Vercel

```bash
npx vercel
```

### Подключить Vercel KV (хранилище ответов)

1. Открой [vercel.com](https://vercel.com) → твой проект → вкладка **Storage**
2. Нажми **Create Database** → выбери **KV**
3. Vercel автоматически добавит все нужные env-переменные в проект
4. Для локальной разработки: **Storage → твоя база → .env.local** → скачай и положи в корень проекта

Всё — ответы будут прилетать в KV и отображаться на `/admin`.

---
