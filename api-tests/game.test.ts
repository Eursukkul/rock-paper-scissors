import { get } from './helpers/client.js';

describe('GET /api/game/bot-action', () => {
  it('should return 200 with an action', async () => {
    const res = await get('/game/bot-action');
    expect(res.status).toBe(200);

    const data = await res.json() as { action: string };
    expect(data).toHaveProperty('action');
    expect(['ROCK', 'PAPER', 'SCISSORS']).toContain(data.action);
  });

  it('should return a valid Content-Type', async () => {
    const res = await get('/game/bot-action');
    expect(res.headers.get('content-type')).toContain('application/json');
  });

  it('should return random actions over multiple calls', async () => {
    const actions = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const res = await get('/game/bot-action');
      const data = await res.json() as { action: string };
      actions.add(data.action);
    }
    expect(actions.size).toBeGreaterThan(1);
  });

  it('should always return one of three valid actions', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await get('/game/bot-action');
      const data = await res.json() as { action: string };
      expect(['ROCK', 'PAPER', 'SCISSORS']).toContain(data.action);
    }
  });
});
