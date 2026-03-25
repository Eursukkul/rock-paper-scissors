'use client';

import type { Action } from '@/types/game';
import styles from './ActionButtons.module.scss';

interface ActionButtonsProps {
  onPlay: (action: Action) => void;
  disabled: boolean;
}

const ACTIONS: { action: Action; emoji: string; label: string }[] = [
  { action: 'ROCK', emoji: '🪨', label: 'Rock' },
  { action: 'PAPER', emoji: '📄', label: 'Paper' },
  { action: 'SCISSORS', emoji: '✂️', label: 'Scissors' },
];

export default function ActionButtons({ onPlay, disabled }: ActionButtonsProps) {
  return (
    <div className={styles.actionButtons}>
      <p className={styles.hint}>Choose your move</p>
      <div className={styles.buttons}>
        {ACTIONS.map(({ action, emoji, label }) => (
          <button
            key={action}
            className={`${styles.button} ${disabled ? styles.disabled : ''}`}
            onClick={() => onPlay(action)}
            disabled={disabled}
            aria-label={label}
          >
            <span className={styles.emoji}>{emoji}</span>
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
