import type { BotActionResponse, HighScoreResponse, UpdateHighScoreResponse } from '@/types/game';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getBotAction(): Promise<BotActionResponse> {
  const res = await fetch(`${API_URL}/api/game/bot-action`);
  if (!res.ok) {
    throw new Error('Failed to get bot action');
  }
  return res.json();
}

export async function getHighScore(): Promise<HighScoreResponse> {
  const res = await fetch(`${API_URL}/api/score/high-score`);
  if (!res.ok) {
    throw new Error('Failed to get high score');
  }
  return res.json();
}

export async function updateHighScore(score: number): Promise<UpdateHighScoreResponse> {
  const res = await fetch(`${API_URL}/api/score/high-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score }),
  });
  if (!res.ok) {
    throw new Error('Failed to update high score');
  }
  return res.json();
}
