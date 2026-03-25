'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useSocket(onHighScoreUpdate: (highScore: number) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
    });

    socket.on('highScore:updated', (data: { highScore: number }) => {
      onHighScoreUpdate(data.highScore);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [onHighScoreUpdate]);

  return socketRef;
}
