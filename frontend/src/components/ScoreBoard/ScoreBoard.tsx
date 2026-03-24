import styles from './ScoreBoard.module.scss';

interface Props {
  playerScore: number;
  highScore: number;
  onReset: () => void;
}

export function ScoreBoard({ playerScore, highScore, onReset }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.score}>
        <span className={styles.label}>Your Score:</span>
        <span className={styles.value}>{playerScore}</span>
        <span className={styles.unit}>turn</span>
      </div>
      <div className={styles.score}>
        <span className={styles.label}>High Score:</span>
        <span className={styles.value}>{highScore}</span>
        <span className={styles.unit}>turn</span>
      </div>
      <button className={styles.resetBtn} onClick={onReset}>
        Reset Score
      </button>
    </div>
  );
}
