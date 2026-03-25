import { get, post } from './helpers/client.js';

describe('GET /api/score/high-score', () => {
  it('should return 200 with a highScore number', async () => {
    const res = await get('/score/high-score');
    expect(res.status).toBe(200);

    const data = await res.json() as { highScore: number };
    expect(data).toHaveProperty('highScore');
    expect(typeof data.highScore).toBe('number');
    expect(data.highScore).toBeGreaterThanOrEqual(0);
  });

  it('should return valid Content-Type', async () => {
    const res = await get('/score/high-score');
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});

describe('POST /api/score/high-score', () => {
  it('should update high score when new score is higher', async () => {
    // Get current high score
    const currentRes = await get('/score/high-score');
    const { highScore: current } = await currentRes.json() as { highScore: number };

    const newScore = current + 100;
    const res = await post('/score/high-score', { score: newScore });
    expect(res.status).toBe(201);

    const data = await res.json() as { updated: boolean; highScore: number };
    expect(data).toHaveProperty('updated', true);
    expect(data).toHaveProperty('highScore', newScore);
  });

  it('should not update when score is lower', async () => {
    const res = await post('/score/high-score', { score: 0 });
    expect(res.status).toBe(201);

    const data = await res.json() as { updated: boolean; highScore: number };
    expect(data).toHaveProperty('updated', false);
  });

  it('should handle same score as current', async () => {
    const currentRes = await get('/score/high-score');
    const { highScore: current } = await currentRes.json() as { highScore: number };

    const res = await post('/score/high-score', { score: current });
    const data = await res.json() as { updated: boolean };
    expect(data.updated).toBe(false);
  });
});
