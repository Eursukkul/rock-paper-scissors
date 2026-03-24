import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Action } from '../types/game.types';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  describe('determineResult', () => {
    // Draw cases
    it('should return draw when rock vs rock', () => {
      expect(service.determineResult('rock', 'rock')).toBe('draw');
    });

    it('should return draw when paper vs paper', () => {
      expect(service.determineResult('paper', 'paper')).toBe('draw');
    });

    it('should return draw when scissors vs scissors', () => {
      expect(service.determineResult('scissors', 'scissors')).toBe('draw');
    });

    // Rock win/lose
    it('should return win when rock vs scissors', () => {
      expect(service.determineResult('rock', 'scissors')).toBe('win');
    });

    it('should return lose when rock vs paper', () => {
      expect(service.determineResult('rock', 'paper')).toBe('lose');
    });

    // Paper win/lose
    it('should return win when paper vs rock', () => {
      expect(service.determineResult('paper', 'rock')).toBe('win');
    });

    it('should return lose when paper vs scissors', () => {
      expect(service.determineResult('paper', 'scissors')).toBe('lose');
    });

    // Scissors win/lose
    it('should return win when scissors vs paper', () => {
      expect(service.determineResult('scissors', 'paper')).toBe('win');
    });

    it('should return lose when scissors vs rock', () => {
      expect(service.determineResult('scissors', 'rock')).toBe('lose');
    });
  });

  describe('pickBotAction', () => {
    it('should return a valid action', () => {
      const validActions: Action[] = ['rock', 'paper', 'scissors'];
      const action = service.pickBotAction();
      expect(validActions).toContain(action);
    });

    it('should return different actions over multiple calls (not always the same)', () => {
      const results = new Set<string>();
      for (let i = 0; i < 30; i++) {
        results.add(service.pickBotAction());
      }
      // With 30 random picks from 3 options, we expect more than 1 unique value
      expect(results.size).toBeGreaterThan(1);
    });

    it('should only return rock, paper, or scissors', () => {
      for (let i = 0; i < 20; i++) {
        const action = service.pickBotAction();
        expect(['rock', 'paper', 'scissors']).toContain(action);
      }
    });
  });

  describe('playRound', () => {
    it('should increment score by 1 on a win', () => {
      // Force a win: rock beats scissors
      jest.spyOn(service, 'pickBotAction').mockReturnValue('scissors');
      const response = service.playRound('rock', 5);
      expect(response.result).toBe('win');
      expect(response.playerScore).toBe(6);
      expect(response.botAction).toBe('scissors');
    });

    it('should keep score the same on a loss', () => {
      // Force a loss: rock loses to paper
      jest.spyOn(service, 'pickBotAction').mockReturnValue('paper');
      const response = service.playRound('rock', 5);
      expect(response.result).toBe('lose');
      expect(response.playerScore).toBe(5);
      expect(response.botAction).toBe('paper');
    });

    it('should keep score the same on a draw', () => {
      // Force a draw: rock vs rock
      jest.spyOn(service, 'pickBotAction').mockReturnValue('rock');
      const response = service.playRound('rock', 5);
      expect(response.result).toBe('draw');
      expect(response.playerScore).toBe(5);
      expect(response.botAction).toBe('rock');
    });

    it('should start from 0 score correctly on a win', () => {
      jest.spyOn(service, 'pickBotAction').mockReturnValue('scissors');
      const response = service.playRound('rock', 0);
      expect(response.playerScore).toBe(1);
    });

    it('should return botAction in the response', () => {
      jest.spyOn(service, 'pickBotAction').mockReturnValue('paper');
      const response = service.playRound('scissors', 3);
      expect(response.botAction).toBe('paper');
    });

    it('should return result in the response', () => {
      jest.spyOn(service, 'pickBotAction').mockReturnValue('rock');
      const response = service.playRound('paper', 0);
      expect(response.result).toBe('win');
    });
  });
});
