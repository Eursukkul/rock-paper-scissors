const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  playRound: (playerAction: string) =>
    request('/game/play', { method: 'POST', body: JSON.stringify({ playerAction }) }),
  resetScore: () =>
    request('/game/reset-score', { method: 'POST' }),
  getHighScore: () =>
    request('/score/high-score'),
  submitHighScore: (score: number) =>
    request('/score/high-score', { method: 'POST', body: JSON.stringify({ score }) }),
};
