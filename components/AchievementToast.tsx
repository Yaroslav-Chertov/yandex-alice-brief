import { useEffect, useState, useRef } from 'react';
import { Achievement } from '../lib/questions';
import styles from '../styles/quiz.module.scss';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDone: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
}

const CONFETTI_COLORS = [
  '#5B4FE8', '#E85B8A', '#22C55E', '#F59E0B', '#06B6D4',
  '#8B5CF6', '#EC4899', '#10B981', '#F97316', '#3B82F6',
];

function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 9999;
  `;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  const particles: Particle[] = [];

  // Spawn from bottom-right (where toast is)
  const originX = window.innerWidth - 170;
  const originY = window.innerHeight - 80;

  for (let i = 0; i < 90; i++) {
    const angle = (Math.random() * Math.PI * 1.4) - Math.PI * 1.1;
    const speed = Math.random() * 14 + 5;
    particles.push({
      x: originX + (Math.random() - 0.5) * 60,
      y: originY + (Math.random() - 0.5) * 30,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 7 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      life: 1,
    });
  }

  let frame = 0;
  let rafId: number;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.97;
      p.rotation += p.rotationSpeed;
      p.life = Math.max(0, 1 - frame / 100);

      if (p.life <= 0) continue;
      alive = true;

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    if (alive && frame < 110) {
      rafId = requestAnimationFrame(animate);
    } else {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };

  rafId = requestAnimationFrame(animate);
  return () => {
    cancelAnimationFrame(rafId);
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };
}

export default function AchievementToast({ achievement, onDone }: AchievementToastProps) {
  const [leaving, setLeaving] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!achievement) return;
    setLeaving(false);

    // Launch confetti
    cleanupRef.current = launchConfetti();

    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDoneRef.current(), 260);
    }, 2800);

    return () => {
      clearTimeout(timer);
      cleanupRef.current?.();
    };
  }, [achievement]); // onDone намеренно исключён — используем ref

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
