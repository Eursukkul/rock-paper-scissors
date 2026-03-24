'use client';
import { useState, useCallback, useRef } from 'react';
import { api } from '@/services/api';
import { useWebSocket } from './useWebSocket';
import { BOT_REVEAL_DELAY_MS } from '@/constants/game';
import { Action, GamePhase, GameResult } from '@/types/game';

interface GameState {
  phase: GamePhase;
  playerScore: number;
  highScore: number;
  botAction: Action | null;
  lastResult: GameResult | null;
}

export function useGame(initialHighScore: number) {
  const [state, setState] = useState<GameState>({
    phase: 'idle',
    playerScore: 0,
    highScore: initialHighScore,
    botAction: null,
    lastResult: null,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const handleHighScoreUpdate = useCallback((score: number) => {
    setState(prev => ({ ...prev, highScore: score }));
  }, []);

  useWebSocket(handleHighScoreUpdate);

  const handlePlayerAction = useCallback(async (action: Action) => {
    if (stateRef.current.phase !== 'idle') return;
    setState(prev => ({ ...prev, phase: 'revealing', lastResult: null }));
    try {
      const res = await api.playRound(action) as any;
      const { botAction, result, playerScore } = res;
      setState(prev => ({ ...prev, botAction, lastResult: result, playerScore }));
      setTimeout(async () => {
        const currentState = stateRef.current;
        if (result === 'win' && playerScore > currentState.highScore) {
          try {
            const hsRes = await api.submitHighScore(playerScore) as any;
            setState(prev => ({ ...prev, botAction: null, phase: 'idle', highScore: hsRes.highScore }));
          } catch {
            setState(prev => ({ ...prev, botAction: null, phase: 'idle' }));
          }
        } else {
          setState(prev => ({ ...prev, botAction: null, phase: 'idle' }));
        }
      }, BOT_REVEAL_DELAY_MS);
    } catch {
      setState(prev => ({ ...prev, phase: 'idle' }));
    }
  }, []);

  const handleReset = useCallback(async () => {
    try {
      await api.resetScore();
      setState(prev => ({ ...prev, playerScore: 0 }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { state, handlePlayerAction, handleReset };
}
