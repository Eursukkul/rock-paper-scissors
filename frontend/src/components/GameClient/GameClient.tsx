'use client';
import { useGame } from '@/hooks/useGame';
import { ScoreBoard } from '@/components/ScoreBoard/ScoreBoard';
import { BotDisplay } from '@/components/BotDisplay/BotDisplay';
import { ActionButtons } from '@/components/ActionButtons/ActionButtons';
import { GameResult } from '@/components/GameResult/GameResult';
import styles from './GameClient.module.scss';

interface Props {
  initialHighScore: number;
}

export function GameClient({ initialHighScore }: Props) {
  const { state, handlePlayerAction, handleReset } = useGame(initialHighScore);
  const isDisabled = state.phase === 'revealing';

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Rock Paper Scissors</h1>
      <ScoreBoard
        playerScore={state.playerScore}
        highScore={state.highScore}
        onReset={handleReset}
      />
      <div className={styles.gameArea}>
        <BotDisplay botAction={state.botAction} />
        <GameResult result={state.lastResult} />
        <ActionButtons disabled={isDisabled} onAction={handlePlayerAction} />
      </div>
    </main>
  );
}
