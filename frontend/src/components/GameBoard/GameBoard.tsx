'use client';

import { useGame } from '@/hooks/useGame';
import { useSocket } from '@/hooks/useSocket';
import ScoreBoard from '@/components/ScoreBoard/ScoreBoard';
import BotDisplay from '@/components/BotDisplay/BotDisplay';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import styles from './GameBoard.module.scss';

export default function GameBoard() {
  const {
    yourScore,
    highScore,
    botAction,
    lastResult,
    isAnimating,
    isLoading,
    handlePlay,
    resetScore,
    handleHighScoreUpdate,
  } = useGame();

  useSocket(handleHighScoreUpdate);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading game...</p>
      </div>
    );
  }

  return (
    <div className={styles.gameBoard}>
      <ScoreBoard
        yourScore={yourScore}
        highScore={highScore}
        onReset={resetScore}
      />

      <BotDisplay
        botAction={botAction}
        lastResult={lastResult}
        isAnimating={isAnimating}
      />

      <ActionButtons
        onPlay={handlePlay}
        disabled={isAnimating}
      />
    </div>
  );
}
