import Head from 'next/head';
import { useState, useCallback } from 'react';
import { BLOG_QUESTIONS, DIGEST_QUESTIONS, QUESTIONS, QuizAnswers, Achievement } from '../lib/questions';
import QuestionBlock from '../components/QuestionBlock';
import AchievementToast from '../components/AchievementToast';
import styles from '../styles/quiz.module.scss';

type Step = 'intro' | 'blog' | 'digest' | 'contact' | 'done';

interface ContactInfo {
  name: string;
}

export default function QuizPage() {
  const [step, setStep] = useState<Step>('intro');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [contact, setContact] = useState<ContactInfo>({ name: '' });
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.values(answers).filter(v =>
    Array.isArray(v) ? v.length > 0 : v !== ''
  ).length;
  const progress = step === 'done' ? 100 :
    step === 'intro' ? 0 :
    step === 'contact' ? 95 :
    Math.round((answeredCount / totalQuestions) * 90);

  const handleAnswerChange = useCallback((questionId: string, value: string | string[]) => {
    setAnswers(prev => {
      const next = { ...prev, [questionId]: value };

      // Check if achievement should be awarded
      const q = QUESTIONS.find(q => q.id === questionId);
      if (q && !earnedAchievements.has(q.achievement.id)) {
        const isAnswered = Array.isArray(value) ? value.length > 0 : value !== '';
        if (isAnswered) {
          setEarnedAchievements(prev => new Set([...prev, q.achievement.id]));
          setActiveAchievement(q.achievement);
        }
      }

      return next;
    });
  }, [earnedAchievements]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, contact }),
      });
      if (!res.ok) throw new Error('Server error');
      setStep('done');
    } catch {
      setError('Не удалось отправить. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Луч × Яндекс Алиса — Бриф</title>
        <meta name="description" content="Заполните короткий бриф по задачам на блог Алисы и дайджест" />
        <meta name="robots" content="noindex" />
      </Head>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressBar__fill} style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.header__logo}>
          <span>Луч</span> × Яндекс Алиса
        </div>
        {step !== 'intro' && step !== 'done' && (
          <div className={styles.header__step}>
            {earnedAchievements.size} / {totalQuestions} ачивок
          </div>
        )}
      </header>

      <main className={styles.layout}>

        {/* ── INTRO ── */}
        {step === 'intro' && (
          <div style={{ animation: 'none' }}>
            <div style={{ marginBottom: 12 }}>
              <span className={`${styles.blockIntro__badge} ${styles['blockIntro__badge--blog']}`}>
                Бриф · 2 блока
              </span>
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 20 }}>
              Расскажите нам<br />про задачи
            </h1>
            <p style={{ fontSize: 17, color: '#444', lineHeight: 1.7, maxWidth: 520, marginBottom: 40 }}>
              Это займёт 5–10 минут. Просто выбирайте варианты и пишите пару слов — мы потом сделаем оценку.
              За каждый ответ получите ачивку 🏆
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <div style={{ background: '#fff', border: '1px solid #E5E5E2', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>📖</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Блог Алисы</div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>{BLOG_QUESTIONS.length} вопросов</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E5E5E2', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>📬</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Дайджест</div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>{DIGEST_QUESTIONS.length} вопросов</div>
              </div>
            </div>
            <button
              className={styles.nav__next}
              onClick={() => setStep('blog')}
              type="button"
            >
              Начать →
            </button>
          </div>
        )}

        {/* ── BLOG BLOCK ── */}
        {step === 'blog' && (
          <>
            <div className={styles.blockIntro}>
              <span className={`${styles.blockIntro__badge} ${styles['blockIntro__badge--blog']}`}>
                📖 Блок 1 из 2
              </span>
              <h2 className={styles.blockIntro__title}>Блог Алисы</h2>
              <p className={styles.blockIntro__desc}>
                Кнопка «Блог Алисы» в чате — что за ней? Расскажите про контент, аудиторию и формат.
              </p>
            </div>

            {BLOG_QUESTIONS.map((q, i) => (
              <QuestionBlock
                key={q.id}
                question={q}
                answers={answers}
                onChange={handleAnswerChange}
                index={i}
              />
            ))}

            <div className={styles.nav}>
              <button className={styles.nav__back} onClick={() => setStep('intro')} type="button">
                ← Назад
              </button>
              <button className={styles.nav__next} onClick={() => setStep('digest')} type="button">
                Дальше →
              </button>
            </div>
          </>
        )}

        {/* ── DIGEST BLOCK ── */}
        {step === 'digest' && (
          <>
            <div className={styles.blockDivider}>Блок 2 — Дайджест</div>

            <div className={styles.blockIntro}>
              <span className={`${styles.blockIntro__badge} ${styles['blockIntro__badge--digest']}`}>
                📬 Блок 2 из 2
              </span>
              <h2 className={styles.blockIntro__title}>Дайджест</h2>
              <p className={styles.blockIntro__desc}>
                Расскажите про задачу на дайджест — формат, аудиторию, содержание и требования к дизайну.
              </p>
            </div>

            {DIGEST_QUESTIONS.map((q, i) => (
              <QuestionBlock
                key={q.id}
                question={q}
                answers={answers}
                onChange={handleAnswerChange}
                index={i}
              />
            ))}

            <div className={styles.nav}>
              <button className={styles.nav__back} onClick={() => setStep('blog')} type="button">
                ← Назад
              </button>
              <button className={styles.nav__next} onClick={() => setStep('contact')} type="button">
                Почти готово →
              </button>
            </div>
          </>
        )}

        {/* ── CONTACT ── */}
        {step === 'contact' && (
          <>
            <div className={styles.blockIntro}>
              <h2 className={styles.blockIntro__title}>Последний шаг</h2>
              <p className={styles.blockIntro__desc}>
                Представьтесь, чтобы мы понимали, от кого пришёл бриф.
              </p>
            </div>

            <div className={styles.contactForm}>
              <div className={styles.contactForm__title}>Контакт</div>
              <div className={styles.contactForm__subtitle}>Эти данные видит только команда Луча</div>

              <div className={styles.contactForm__group}>
                <label>Ваше имя</label>
                <input
                  className={styles.contactForm__input}
                  type="text"
                  placeholder="Алиса"
                  value={contact.name}
                  onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
                />
              </div>
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: 14, marginBottom: 16 }}>{error}</div>
            )}

            <div className={styles.nav}>
              <button className={styles.nav__back} onClick={() => setStep('digest')} type="button">
                ← Назад
              </button>
              <button
                className={`${styles.nav__next} ${submitting ? styles['nav__next--disabled'] : ''}`}
                onClick={handleSubmit}
                disabled={submitting}
                type="button"
              >
                {submitting ? 'Отправляем...' : 'Отправить бриф →'}
              </button>
            </div>
          </>
        )}

        {/* ── DONE ── */}
        {step === 'done' && (
          <div className={styles.successScreen}>
            <span className={styles.successScreen__emoji}>🎉</span>
            <h2 className={styles.successScreen__title}>
              Бриф получен, спасибо!
            </h2>
            <p className={styles.successScreen__subtitle}>
              Команда Луча получила ваши ответы и скоро вернётся с оценкой.
              {contact.name && ` До связи, ${contact.name}!`}
            </p>

            {earnedAchievements.size > 0 && (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#999', marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Ваши ачивки
                </div>
                <div className={styles.successScreen__achievements}>
                  {QUESTIONS
                    .filter(q => earnedAchievements.has(q.achievement.id))
                    .map(q => (
                      <span key={q.achievement.id} className={styles.successScreen__badge}>
                        {q.achievement.emoji} {q.achievement.title}
                      </span>
                    ))}
                </div>
              </>
            )}

            <p className={styles.successScreen__cta}>
              Вопросы? Пишите{' '}
              <a href="https://t.me/yaroslav_chertov" target="_blank" rel="noopener noreferrer">@yaroslav_chertov</a>
            </p>
          </div>
        )}

      </main>

      {/* Achievement toast */}
      <AchievementToast
        achievement={activeAchievement}
        onDone={() => setActiveAchievement(null)}
      />
    </>
  );
}
