// Types
export interface Option {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  block: 'blog' | 'digest';
  type: 'multi' | 'single' | 'text' | 'multi_with_text';
  question: string;
  hint?: string;
  options?: Option[];
  textPlaceholder?: string;
  achievement: Achievement;
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export interface QuizSubmission {
  id: string;
  submittedAt: string;
  answers: QuizAnswers;
  contact?: {
    name: string;
  };
}

// Questions
export const QUESTIONS: Question[] = [
  // === БЛОК: БЛОГ АЛИСЫ ===
  {
    id: 'blog_purpose',
    block: 'blog',
    type: 'multi',
    question: 'Что должно быть в блоге Алисы после нажатия на кнопку в чате?',
    hint: 'Выберите всё, что планируете публиковать',
    options: [
      { id: 'news', label: 'Новости и обновления' },
      { id: 'features', label: 'Новые фичи и возможности' },
      { id: 'team', label: 'Истории команды' },
      { id: 'cases', label: 'Кейсы и сценарии использования' },
      { id: 'events', label: 'События и мероприятия' },
      { id: 'tips', label: 'Советы и лайфхаки' },
    ],
    achievement: {
      id: 'blog_purpose',
      emoji: '📖',
      title: 'Контент-стратег',
      description: 'Знаете, чем наполнить блог',
    },
  },
  {
    id: 'blog_format',
    block: 'blog',
    type: 'single',
    question: 'Какой основной формат материалов в блоге?',
    options: [
      { id: 'articles', label: 'Статьи / лонгриды' },
      { id: 'short', label: 'Короткие посты' },
      { id: 'mix', label: 'Микс форматов' },
      { id: 'tbd', label: 'Ещё не решили' },
    ],
    achievement: {
      id: 'blog_format',
      emoji: '📐',
      title: 'Форматировщик',
      description: 'Определились с форматом',
    },
  },
  {
    id: 'blog_frequency',
    block: 'blog',
    type: 'single',
    question: 'Как часто планируете выходить с публикациями?',
    options: [
      { id: 'daily', label: 'Каждый день' },
      { id: 'weekly', label: 'Несколько раз в неделю' },
      { id: 'biweekly', label: 'Раз в 2 недели' },
      { id: 'monthly', label: 'Раз в месяц' },
      { id: 'irregular', label: 'По событиям, нет расписания' },
    ],
    achievement: {
      id: 'blog_frequency',
      emoji: '📅',
      title: 'Редакционный план',
      description: 'Ритм публикаций намечен',
    },
  },
  {
    id: 'blog_audience',
    block: 'blog',
    type: 'multi',
    question: 'На кого рассчитан блог?',
    options: [
      { id: 'users', label: 'Текущие пользователи Алисы' },
      { id: 'new_users', label: 'Новая аудитория' },
      { id: 'tech', label: 'Технари и разработчики' },
      { id: 'press', label: 'Медиа и журналисты' },
      { id: 'partners', label: 'Партнёры' },
    ],
    achievement: {
      id: 'blog_audience',
      emoji: '🎯',
      title: 'Портрет читателя',
      description: 'ЦА блога очерчена',
    },
  },
  {
    id: 'blog_tone',
    block: 'blog',
    type: 'single',
    question: 'Какой тон голоса у блога?',
    options: [
      { id: 'friendly', label: 'Дружелюбный и живой' },
      { id: 'expert', label: 'Экспертный и серьёзный' },
      { id: 'playful', label: 'Игривый, с юмором' },
      { id: 'tbd', label: 'В процессе определения' },
    ],
    achievement: {
      id: 'blog_tone',
      emoji: '🎤',
      title: 'Голос найден',
      description: 'Тональность определена',
    },
  },
  {
    id: 'blog_free',
    block: 'blog',
    type: 'text',
    question: 'Расскажите подробнее о задаче на блог',
    hint: 'Что должно произойти после клика на кнопку «Блог Алисы» в чате? Какую задачу решает блог?',
    textPlaceholder: 'Например: хотим рассказывать пользователям о новых навыках, делиться историями команды, публиковать релизы...',
    achievement: {
      id: 'blog_free',
      emoji: '✍️',
      title: 'Бриф готов',
      description: 'Основа для задачи есть',
    },
  },
  {
    id: 'blog_references',
    block: 'blog',
    type: 'text',
    question: 'Есть референсы — блоги, которые нравятся?',
    hint: 'Ссылки, названия или просто описание',
    textPlaceholder: 'medium.com/..., блог Яндекса, что-то похожее на...',
    achievement: {
      id: 'blog_references',
      emoji: '🔗',
      title: 'Насмотренность',
      description: 'Ориентиры намечены',
    },
  },

  // === БЛОК: ДАЙДЖЕСТ ===
  {
    id: 'digest_format',
    block: 'digest',
    type: 'single',
    question: 'Дайджест — это что?',
    hint: 'Как вы видите этот формат',
    options: [
      { id: 'email', label: 'Email-рассылка' },
      { id: 'tg', label: 'Пост в Телеграм-канале' },
      { id: 'web', label: 'Страница на сайте / в приложении' },
      { id: 'push', label: 'Push-уведомление' },
      { id: 'mix', label: 'Несколько каналов сразу' },
    ],
    achievement: {
      id: 'digest_format',
      emoji: '📬',
      title: 'Канал выбран',
      description: 'Формат дайджеста понятен',
    },
  },
  {
    id: 'digest_content',
    block: 'digest',
    type: 'multi',
    question: 'Что входит в дайджест?',
    hint: 'Отметьте всё релевантное',
    options: [
      { id: 'releases', label: 'Новые релизы и фичи' },
      { id: 'stats', label: 'Цифры и статистика' },
      { id: 'stories', label: 'Истории пользователей' },
      { id: 'announcements', label: 'Анонсы событий' },
      { id: 'media', label: 'Упоминания в медиа' },
      { id: 'team', label: 'Новости команды' },
    ],
    achievement: {
      id: 'digest_content',
      emoji: '🗂',
      title: 'Контент-план',
      description: 'Начинка дайджеста известна',
    },
  },
  {
    id: 'digest_frequency',
    block: 'digest',
    type: 'single',
    question: 'Как часто выходит дайджест?',
    options: [
      { id: 'weekly', label: 'Еженедельно' },
      { id: 'biweekly', label: 'Раз в 2 недели' },
      { id: 'monthly', label: 'Раз в месяц' },
      { id: 'tbd', label: 'Ещё не решили' },
    ],
    achievement: {
      id: 'digest_frequency',
      emoji: '⏱',
      title: 'Ритм задан',
      description: 'Периодичность дайджеста намечена',
    },
  },
  {
    id: 'digest_audience',
    block: 'digest',
    type: 'multi',
    question: 'Кому отправляется дайджест?',
    options: [
      { id: 'internal', label: 'Внутри команды Яндекса' },
      { id: 'partners', label: 'Партнёрам' },
      { id: 'users', label: 'Пользователям Алисы' },
      { id: 'press', label: 'Медиа и прессе' },
    ],
    achievement: {
      id: 'digest_audience',
      emoji: '👥',
      title: 'Адресат найден',
      description: 'Получатели дайджеста определены',
    },
  },
  {
    id: 'digest_free',
    block: 'digest',
    type: 'text',
    question: 'Расскажите подробнее о задаче на дайджест',
    hint: 'Что должен делать дайджест? Какую проблему решает?',
    textPlaceholder: 'Например: хотим собирать все обновления Алисы за период и доносить их до...',
    achievement: {
      id: 'digest_free',
      emoji: '📝',
      title: 'Задача сформулирована',
      description: 'Суть дайджеста зафиксирована',
    },
  },
  {
    id: 'digest_design',
    block: 'digest',
    type: 'multi_with_text',
    question: 'Какие дизайн-требования к дайджесту?',
    options: [
      { id: 'brand', label: 'Строго в бренд Алисы' },
      { id: 'experiment', label: 'Можно экспериментировать' },
      { id: 'minimal', label: 'Минималистично' },
      { id: 'rich', label: 'Насыщено визуально' },
    ],
    textPlaceholder: 'Доп. комментарий по дизайну...',
    achievement: {
      id: 'digest_design',
      emoji: '🎨',
      title: 'Визия есть',
      description: 'Дизайн-вектор для дайджеста задан',
    },
  },

  // === ФИНАЛ ===
  {
    id: 'timeline',
    block: 'digest',
    type: 'single',
    question: 'Когда нужен первый результат?',
    options: [
      { id: 'asap', label: 'Как можно скорее' },
      { id: '2weeks', label: 'В течение 2 недель' },
      { id: 'month', label: 'В течение месяца' },
      { id: 'flexible', label: 'Гибко, обсудим' },
    ],
    achievement: {
      id: 'timeline',
      emoji: '🚀',
      title: 'Дедлайн известен',
      description: 'Тайминг понятен',
    },
  },
];

export const BLOG_QUESTIONS = QUESTIONS.filter(q => q.block === 'blog');
export const DIGEST_QUESTIONS = QUESTIONS.filter(q => q.block === 'digest');
