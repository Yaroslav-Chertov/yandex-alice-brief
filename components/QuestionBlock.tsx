import { Question, QuizAnswers } from '../lib/questions';
import styles from '../styles/quiz.module.scss';

interface QuestionBlockProps {
  question: Question;
  answers: QuizAnswers;
  onChange: (questionId: string, value: string | string[]) => void;
  index: number;
}

export default function QuestionBlock({ question, answers, onChange, index }: QuestionBlockProps) {
  const currentAnswer = answers[question.id];
  const isAnswered = currentAnswer !== undefined && currentAnswer !== '' &&
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  const handleOptionClick = (optionId: string) => {
    if (question.type === 'single') {
      onChange(question.id, optionId);
    } else if (question.type === 'multi' || question.type === 'multi_with_text') {
      const current = (currentAnswer as string[] | undefined) || [];
      if (current.includes(optionId)) {
        onChange(question.id, current.filter(id => id !== optionId));
      } else {
        onChange(question.id, [...current, optionId]);
      }
    }
  };

  const isSelected = (optionId: string) => {
    if (question.type === 'single') return currentAnswer === optionId;
    return ((currentAnswer as string[] | undefined) || []).includes(optionId);
  };

  const textValue = () => {
    if (question.type === 'text') return (currentAnswer as string) || '';
    if (question.type === 'multi_with_text') {
      const arr = (currentAnswer as string[] | undefined) || [];
      return arr.find(v => !question.options?.find(o => o.id === v)) || '';
    }
    return '';
  };

  const handleTextChange = (val: string) => {
    if (question.type === 'text') {
      onChange(question.id, val);
    } else if (question.type === 'multi_with_text') {
      const current = (currentAnswer as string[] | undefined) || [];
      const withoutText = current.filter(v => question.options?.find(o => o.id === v));
      if (val) {
        onChange(question.id, [...withoutText, val]);
      } else {
        onChange(question.id, withoutText);
      }
    }
  };

  const display = question.display || 'pills';

  return (
    <div className={styles.questionCard} style={{ animationDelay: `${index * 0.05}s` }}>
      <div className={styles.questionCard__label}>
        Вопрос {index + 1}
        {isAnswered && (
          <span className={styles.questionCard__achieved}> · ✓ Отвечено</span>
        )}
      </div>
      <div className={styles.questionCard__question}>{question.question}</div>
      {question.hint && (
        <div className={styles.questionCard__hint}>{question.hint}</div>
      )}

      {/* CARDS display — grid of larger clickable tiles */}
      {display === 'cards' && question.options && (
        <div className={styles.optionsCards}>
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`${styles.optionsCards__item} ${isSelected(option.id) ? styles['optionsCards__item--selected'] : ''}`}
              onClick={() => handleOptionClick(option.id)}
              type="button"
            >
              {isSelected(option.id) && (
                <span className={styles.optionsCards__check}>✓</span>
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* RADIO display — full-width stacked rows with indicator */}
      {display === 'radio' && question.options && (
        <div className={styles.optionsRadio}>
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`${styles.optionsRadio__item} ${isSelected(option.id) ? styles['optionsRadio__item--selected'] : ''}`}
              onClick={() => handleOptionClick(option.id)}
              type="button"
            >
              <span className={`${styles.optionsRadio__dot} ${isSelected(option.id) ? styles['optionsRadio__dot--active'] : ''}`} />
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* PILLS display — default chip buttons */}
      {display === 'pills' && (question.type === 'single' || question.type === 'multi' || question.type === 'multi_with_text') && question.options && (
        <div className={styles.options}>
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`${styles.options__item} ${isSelected(option.id) ? styles['options__item--selected'] : ''}`}
              onClick={() => handleOptionClick(option.id)}
              type="button"
            >
              {isSelected(option.id) && <span>✓</span>}
              {option.label}
            </button>
          ))}
        </div>
      )}

      {(question.type === 'text' || question.type === 'multi_with_text') && (
        <textarea
          className={styles.textInput}
          placeholder={question.textPlaceholder}
          value={textValue()}
          onChange={(e) => handleTextChange(e.target.value)}
          style={{ marginTop: question.type === 'multi_with_text' ? '12px' : '0' }}
        />
      )}
    </div>
  );
}
