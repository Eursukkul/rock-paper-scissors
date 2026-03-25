'use client';

import styles from './ScoreBoard.module.scss';

interface ScoreBoardProps {
  yourScore: number;
  highScore: number;
  onReset: () => void;
}

export default function ScoreBoard({ yourScore, highScore, onReset }: ScoreBoardProps) {
  return (
    <div className={styles.scoreBoard}>
      <div className={styles.scores}>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Your Score</span>
          <span className={styles.scoreValue} data-testid="your-score">{yourScore}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>High Score</span>
          <span className={`${styles.scoreValue} ${styles.highScore}`} data-testid="high-score">{highScore}</span>
        </div>
      </div>
      <button className={styles.resetButton} onClick={onReset} aria-label="Reset your score">
        Reset Your Score
      </button>
    </div>
  );
}
