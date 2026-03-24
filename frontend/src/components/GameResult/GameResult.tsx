import styles from './GameResult.module.scss';
import { GameResult as Result } from '@/types/game';

interface Props {
  result: Result | null;
}

const MESSAGES: Record<Result, string> = {
  win: '🎉 You Win!',
  lose: '😔 You Lose',
  draw: '🤝 Draw',
};

export function GameResult({ result }: Props) {
  if (!result) return null;
  return (
    <div className={`${styles.container} ${styles[result]}`}>
      {MESSAGES[result]}
    </div>
  );
}
