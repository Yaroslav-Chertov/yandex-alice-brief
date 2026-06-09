import { useEffect, useState } from 'react';
import { Achievement } from '../lib/questions';
import styles from '../styles/quiz.module.scss';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDone: () => void;
}

export default function AchievementToast({ achievement, onDone }: AchievementToastProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!achievement) return;
    setLeaving(false);
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(onDone, 260);
    }, 2400);
    return () => clearTimeout(timer);
  }, [achievement, onDone]);

  if (!achievement) return null;

  return (
    <div className={`${styles.achievementToast} ${leaving ? styles['achievementToast--out'] : ''}`}>
      <span className={styles.achievementToast__emoji}>{achievement.emoji}</span>
      <div className={styles.achievementToast__body}>
        <div className={styles.achievementToast__label}>Ачивка разблокирована</div>
        <div className={styles.achievementToast__title}>{achievement.title}</div>
        <div className={styles.achievementToast__desc}>{achievement.description}</div>
      </div>
    </div>
  );
}
