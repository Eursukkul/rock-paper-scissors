import { test, expect } from '@playwright/test';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

test.describe('API Integration via Browser', () => {
  test('GET /api/game/bot-action returns valid action', async ({ request }) => {
    const res = await request.get(`${API_URL}/game/bot-action`);
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(['ROCK', 'PAPER', 'SCISSORS']).toContain(data.action);
  });

  test('GET /api/score/high-score returns a number', async ({ request }) => {
    const res = await request.get(`${API_URL}/score/high-score`);
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(typeof data.highScore).toBe('number');
    expect(data.highScore).toBeGreaterThanOrEqual(0);
  });

  test('POST /api/score/high-score updates score correctly', async ({ request }) => {
    // First get current
    const current = await request.get(`${API_URL}/score/high-score`);
    const { highScore } = await current.json();

    const newScore = highScore + 999;
    const res = await request.post(`${API_URL}/score/high-score`, {
      data: { score: newScore },
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data.updated).toBe(true);
    expect(data.highScore).toBe(newScore);
  });
});
