'use client';

import type { Action, GameResult } from '@/types/game';
import styles from './BotDisplay.module.scss';

interface BotDisplayProps {
  botAction: Action | null;
  lastResult: GameResult;
  isAnimating: boolean;
}

const ACTION_EMOJI: Record<Action, string> = {
  ROCK: '🪨',
  PAPER: '📄',
  SCISSORS: '✂️',
};

const RESULT_CONFIG: Record<NonNullable<GameResult>, { label: string; className: string }> = {
  WIN: { label: 'You Win!', className: styles.win },
  LOSE: { label: 'You Lose!', className: styles.lose },
  DRAW: { label: "It's a Draw!", className: styles.draw },
};

export default function BotDisplay({ botAction, lastResult, isAnimating }: BotDisplayProps) {
  const resultConfig = lastResult ? RESULT_CONFIG[lastResult] : null;

  return (
    <div className={styles.botDisplay}>
      <p className={styles.label}>Bot&apos;s Choice</p>
      <div
        className={`${styles.actionDisplay} ${isAnimating && botAction ? styles.revealed : ''}`}
        data-testid="bot-action"
      >
        {botAction ? (
          <span className={styles.emoji}>{ACTION_EMOJI[botAction]}</span>
        ) : (
          <span className={styles.unknown}>???</span>
        )}
      </div>
      {botAction && (
        <p className={styles.actionName}>{botAction}</p>
      )}
      {!isAnimating && resultConfig && (
        <div className={`${styles.result} ${resultConfig.className}`}>
          {resultConfig.label}
        </div>
      )}
    </div>
  );
}
