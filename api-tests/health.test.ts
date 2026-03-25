import { get } from './helpers/client.js';

describe('API Health Checks', () => {
  it('GET /api/score/high-score should respond within 500ms', async () => {
    const start = Date.now();
    const res = await get('/score/high-score');
    const duration = Date.now() - start;

    expect(res.status).toBe(200);
    expect(duration).toBeLessThan(500);
  });

  it('GET /api/game/bot-action should respond within 500ms', async () => {
    const start = Date.now();
    const res = await get('/game/bot-action');
    const duration = Date.now() - start;

    expect(res.status).toBe(200);
    expect(duration).toBeLessThan(500);
  });

  it('should handle concurrent requests', async () => {
    const promises = Array.from({ length: 10 }, () => get('/game/bot-action'));
    const results = await Promise.all(promises);
    results.forEach(res => expect(res.status).toBe(200));
  });
});
