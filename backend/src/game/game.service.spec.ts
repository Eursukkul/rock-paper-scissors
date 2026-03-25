import { Test, TestingModule } from '@nestjs/testing';
import { GameService, Action } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomBotAction', () => {
    it('should return a valid action', () => {
      const result = service.getRandomBotAction();
      expect(['ROCK', 'PAPER', 'SCISSORS']).toContain(result.action);
    });

    it('should return all actions over many calls', () => {
      const actions = new Set<string>();
      for (let i = 0; i < 100; i++) {
        actions.add(service.getRandomBotAction().action);
      }
      expect(actions.size).toBe(3);
    });
  });

  describe('determineResult', () => {
    const winCases: [Action, Action][] = [
      ['ROCK', 'SCISSORS'],
      ['PAPER', 'ROCK'],
      ['SCISSORS', 'PAPER'],
    ];

    const loseCases: [Action, Action][] = [
      ['SCISSORS', 'ROCK'],
      ['ROCK', 'PAPER'],
      ['PAPER', 'SCISSORS'],
    ];

    const drawCases: Action[] = ['ROCK', 'PAPER', 'SCISSORS'];

    test.each(winCases)('player %s beats bot %s', (player, bot) => {
      expect(service.determineResult(player, bot)).toBe('WIN');
    });

    test.each(loseCases)('player %s loses to bot %s', (player, bot) => {
      expect(service.determineResult(player, bot)).toBe('LOSE');
    });

    test.each(drawCases)('player %s draws with bot %s', (action) => {
      expect(service.determineResult(action, action)).toBe('DRAW');
    });
  });
});
