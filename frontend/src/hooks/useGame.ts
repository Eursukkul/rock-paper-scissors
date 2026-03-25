'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import type { Action, GameResult } from '@/types/game';
import { getBotAction, getHighScore, updateHighScore } from '@/services/api';

const SCORE_COOKIE = 'rps_your_score';
const ANIMATION_DURATION = 2000;

function determineResult(playerAction: Action, botAction: Action): GameResult {
  if (playerAction === botAction) return 'DRAW';

  const winConditions: Record<Action, Action> = {
    ROCK: 'SCISSORS',
    PAPER: 'ROCK',
    SCISSORS: 'PAPER',
  };

  return winConditions[playerAction] === botAction ? 'WIN' : 'LOSE';
}

export function useGame() {
  const [yourScore, setYourScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [botAction, setBotAction] = useState<Action | null>(null);
  const [lastResult, setLastResult] = useState<GameResult>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Use a ref to avoid stale closure in useSocket callback
  const yourScoreRef = useRef(yourScore);
  yourScoreRef.current = yourScore;

  // Load score from cookie on mount
  useEffect(() => {
    const savedScore = Cookies.get(SCORE_COOKIE);
    if (savedScore) {
      const parsed = parseInt(savedScore, 10);
      if (!isNaN(parsed)) {
        setYourScore(parsed);
      }
    }
  }, []);

  // Load high score from server on mount
  useEffect(() => {
    getHighScore()
      .then((data) => {
        setHighScore(data.highScore);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Persist score to cookie whenever it changes
  useEffect(() => {
    Cookies.set(SCORE_COOKIE, String(yourScore), { expires: 365 });
  }, [yourScore]);

  const handleHighScoreUpdate = useCallback((newHighScore: number) => {
    setHighScore(newHighScore);
  }, []);

  const handlePlay = useCallback(async (playerAction: Action) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setLastResult(null);
    setBotAction(null);

    try {
      const { action: botChoice } = await getBotAction();
      setBotAction(botChoice);

      const result = determineResult(playerAction, botChoice);

      setTimeout(async () => {
        setLastResult(result);
        setBotAction(null);

        if (result === 'WIN') {
          const newScore = yourScoreRef.current + 1;
          setYourScore(newScore);

          // Check if new score beats high score
          try {
            const updateResult = await updateHighScore(newScore);
            if (updateResult.updated) {
              setHighScore(updateResult.highScore);
            }
          } catch (err) {
            console.error('Failed to update high score:', err);
          }
        }

        setIsAnimating(false);
      }, ANIMATION_DURATION);
    } catch (err) {
      console.error('Failed to get bot action:', err);
      setIsAnimating(false);
    }
  }, [isAnimating]);

  const resetScore = useCallback(() => {
    setYourScore(0);
    setLastResult(null);
    Cookies.set(SCORE_COOKIE, '0', { expires: 365 });
  }, []);

  return {
    yourScore,
    highScore,
    botAction,
    lastResult,
    isAnimating,
    isLoading,
    handlePlay,
    resetScore,
    handleHighScoreUpdate,
  };
}
