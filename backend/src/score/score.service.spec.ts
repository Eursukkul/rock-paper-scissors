import { Test, TestingModule } from '@nestjs/testing';
import { ScoreService } from './score.service';
import { GameGateway } from '../game/game.gateway';

describe('ScoreService', () => {
  let service: ScoreService;
  let gameGateway: jest.Mocked<GameGateway>;

  const mockGameGateway = {
    broadcastHighScore: jest.fn(),
    server: {} as any,
    handleConnection: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        {
          provide: GameGateway,
          useValue: mockGameGateway,
        },
      ],
    }).compile();

    service = module.get<ScoreService>(ScoreService);
    gameGateway = module.get(GameGateway);
  });

  describe('getHighScore', () => {
    it('should return 0 initially', () => {
      expect(service.getHighScore()).toBe(0);
    });
  });

  describe('tryUpdateHighScore', () => {
    it('should update high score when new score is higher', () => {
      const result = service.tryUpdateHighScore(10);
      expect(result).toEqual({ highScore: 10, updated: true });
      expect(service.getHighScore()).toBe(10);
    });

    it('should not update high score when new score is lower', () => {
      service.tryUpdateHighScore(10);
      const result = service.tryUpdateHighScore(5);
      expect(result).toEqual({ highScore: 10, updated: false });
      expect(service.getHighScore()).toBe(10);
    });

    it('should not update high score when new score is equal', () => {
      service.tryUpdateHighScore(10);
      const result = service.tryUpdateHighScore(10);
      expect(result).toEqual({ highScore: 10, updated: false });
    });

    it('should call broadcastHighScore when score is updated', () => {
      service.tryUpdateHighScore(15);
      expect(mockGameGateway.broadcastHighScore).toHaveBeenCalledWith(15);
      expect(mockGameGateway.broadcastHighScore).toHaveBeenCalledTimes(1);
    });

    it('should not call broadcastHighScore when score is not updated (lower)', () => {
      service.tryUpdateHighScore(10);
      jest.clearAllMocks();

      service.tryUpdateHighScore(5);
      expect(mockGameGateway.broadcastHighScore).not.toHaveBeenCalled();
    });

    it('should not call broadcastHighScore when score is not updated (equal)', () => {
      service.tryUpdateHighScore(10);
      jest.clearAllMocks();

      service.tryUpdateHighScore(10);
      expect(mockGameGateway.broadcastHighScore).not.toHaveBeenCalled();
    });

    it('should track the highest score across multiple updates', () => {
      service.tryUpdateHighScore(5);
      service.tryUpdateHighScore(12);
      service.tryUpdateHighScore(8);
      service.tryUpdateHighScore(20);
      service.tryUpdateHighScore(15);

      expect(service.getHighScore()).toBe(20);
    });

    it('should broadcast each time the score increases', () => {
      service.tryUpdateHighScore(5);
      service.tryUpdateHighScore(10);
      service.tryUpdateHighScore(15);

      expect(mockGameGateway.broadcastHighScore).toHaveBeenCalledTimes(3);
      expect(mockGameGateway.broadcastHighScore).toHaveBeenNthCalledWith(1, 5);
      expect(mockGameGateway.broadcastHighScore).toHaveBeenNthCalledWith(2, 10);
      expect(mockGameGateway.broadcastHighScore).toHaveBeenNthCalledWith(3, 15);
    });

    it('should return updated: false for score of 0 initially when no score set', () => {
      const result = service.tryUpdateHighScore(0);
      // 0 is NOT greater than 0 (initial), so no update
      expect(result).toEqual({ highScore: 0, updated: false });
    });

    it('should return correct highScore in response even when not updated', () => {
      service.tryUpdateHighScore(20);
      const result = service.tryUpdateHighScore(1);
      expect(result.highScore).toBe(20);
      expect(result.updated).toBe(false);
    });
  });
});
