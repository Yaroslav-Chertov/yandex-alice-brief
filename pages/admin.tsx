import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { getSubmissions } from '../lib/storage';
import { QuizSubmission, QUESTIONS } from '../lib/questions';
import styles from '../styles/admin.module.scss';

interface AdminProps {
  submissions: QuizSubmission[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getAnswerLabel(questionId: string, value: string | string[]): string {
  const q = QUESTIONS.find(q => q.id === questionId);
  if (!q) return String(value);

  const resolveId = (id: string) => {
    const opt = q.options?.find(o => o.id === id);
    return opt ? opt.label : id;
  };

  if (Array.isArray(value)) {
    return value.map(v => {
      const opt = q.options?.find(o => o.id === v);
      return opt ? opt.label : v; // free text stays as-is
    }).join(', ');
  }

  return resolveId(value);
}

function SubmissionCard({ submission }: { submission: QuizSubmission }) {
  const [open, setOpen] = useState(false);
  const blogAnswers = Object.entries(submission.answers).filter(([id]) =>
    QUESTIONS.find(q => q.id === id)?.block === 'blog'
  );
  const digestAnswers = Object.entries(submission.answers).filter(([id]) =>
    QUESTIONS.find(q => q.id === id)?.block === 'digest'
  );

  const name = submission.contact?.name || 'Аноним';
  const company = submission.contact?.company;

  return (
    <div className={styles.submissionCard}>
      <div className={styles.submissionCard__header} onClick={() => setOpen(!open)}>
        <div className={styles.submissionCard__meta}>
          <div className={styles.submissionCard__name}>
            {name}{company ? ` · ${company}` : ''}
          </div>
          <div className={styles.submissionCard__date}>{formatDate(submission.submittedAt)}</div>
        </div>
        <span className={styles.submissionCard__toggle}>{open ? '↑' : '↓'}</span>
      </div>

      {open && (
        <div className={styles.submissionCard__body}>
          {submission.contact?.email && (
            <div style={{ fontSize: 14, color: '#999', marginBottom: 20 }}>
              📧 {submission.contact.email}
            </div>
          )}

          {blogAnswers.length > 0 && (
            <div className={styles.submissionCard__section}>
              <div className={styles.submissionCard__sectionTitle}>📖 Блог Алисы</div>
              {blogAnswers.map(([id, val]) => {
                const q = QUESTIONS.find(q => q.id === id);
                return (
                  <div key={id} className={styles.submissionCard__item}>
                    <div className={styles.submissionCard__itemQ}>{q?.question}</div>
                    <div className={styles.submissionCard__itemA}>
                      {Array.isArray(val) ? (
                        val.map((v, i) => {
                          const opt = q?.options?.find(o => o.id === v);
                          if (opt) {
                            return <span key={i} className={styles.submissionCard__tag}>{opt.label}</span>;
                          }
                          return <span key={i} style={{ display: 'block' }}>{v}</span>;
                        })
                      ) : (
                        getAnswerLabel(id, val)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {digestAnswers.length > 0 && (
            <div className={styles.submissionCard__section}>
              <div className={styles.submissionCard__sectionTitle}>📬 Дайджест</div>
              {digestAnswers.map(([id, val]) => {
                const q = QUESTIONS.find(q => q.id === id);
                return (
                  <div key={id} className={styles.submissionCard__item}>
                    <div className={styles.submissionCard__itemQ}>{q?.question}</div>
                    <div className={styles.submissionCard__itemA}>
                      {Array.isArray(val) ? (
                        val.map((v, i) => {
                          const opt = q?.options?.find(o => o.id === v);
                          if (opt) {
                            return <span key={i} className={styles.submissionCard__tag}>{opt.label}</span>;
                          }
                          return <span key={i} style={{ display: 'block' }}>{v}</span>;
                        })
                      ) : (
                        getAnswerLabel(id, val)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage({ submissions }: AdminProps) {
  return (
    <>
      <Head>
        <title>Админка — Бриф Алисы</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.admin}>
        <div className={styles.admin__header}>
          <div>
            <h1 className={styles.admin__title}>Заполненные брифы</h1>
            <div className={styles.admin__count}>{submissions.length} ответов</div>
          </div>
          <Link href="/" className={styles.admin__back}>← На квиз</Link>
        </div>

        {submissions.length === 0 ? (
          <div className={styles.admin__empty}>Брифов пока нет</div>
        ) : (
          submissions.map(s => (
            <SubmissionCard key={s.id} submission={s} />
          ))
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const submissions = await getSubmissions();
    return { props: { submissions } };
  } catch {
    return { props: { submissions: [] } };
  }
};
