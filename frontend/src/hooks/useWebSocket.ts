'use client';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useWebSocket(onHighScoreUpdate: (score: number) => void) {
  useEffect(() => {
    const socket = io(WS_URL, { transports: ['websocket'] });
    socket.on('highScoreUpdated', ({ highScore }: { highScore: number }) => {
      onHighScoreUpdate(highScore);
    });
    return () => {
      socket.disconnect();
    };
  }, []); // eslint-disable-line
}
