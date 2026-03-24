import { Test, TestingModule } from '@nestjs/testing';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { UpdateHighScoreDto } from '../dto/update-score.dto';

describe('ScoreController', () => {
  let controller: ScoreController;
  let scoreService: jest.Mocked<ScoreService>;

  const mockScoreService = {
    getHighScore: jest.fn(),
    tryUpdateHighScore: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [
        {
          provide: ScoreService,
          useValue: mockScoreService,
        },
      ],
    }).compile();

    controller = module.get<ScoreController>(ScoreController);
    scoreService = module.get(ScoreService);
  });

  describe('getHighScore', () => {
    it('should return the current high score', () => {
      mockScoreService.getHighScore.mockReturnValue(42);

      const result = controller.getHighScore();

      expect(result).toEqual({ highScore: 42 });
      expect(mockScoreService.getHighScore).toHaveBeenCalledTimes(1);
    });

    it('should return 0 as the initial high score', () => {
      mockScoreService.getHighScore.mockReturnValue(0);

      const result = controller.getHighScore();

      expect(result).toEqual({ highScore: 0 });
    });

    it('should delegate to scoreService.getHighScore', () => {
      mockScoreService.getHighScore.mockReturnValue(100);

      controller.getHighScore();

      expect(mockScoreService.getHighScore).toHaveBeenCalled();
    });
  });

  describe('updateHighScore', () => {
    it('should call scoreService.tryUpdateHighScore with the provided score', () => {
      const dto: UpdateHighScoreDto = { score: 50 };
      const mockResult = { highScore: 50, updated: true };
      mockScoreService.tryUpdateHighScore.mockReturnValue(mockResult);

      const result = controller.updateHighScore(dto);

      expect(mockScoreService.tryUpdateHighScore).toHaveBeenCalledWith(50);
      expect(result).toEqual(mockResult);
    });

    it('should return updated: true when score is a new high score', () => {
      const dto: UpdateHighScoreDto = { score: 100 };
      const mockResult = { highScore: 100, updated: true };
      mockScoreService.tryUpdateHighScore.mockReturnValue(mockResult);

      const result = controller.updateHighScore(dto);

      expect(result).toEqual({ highScore: 100, updated: true });
    });

    it('should return updated: false when score is not a new high score', () => {
      const dto: UpdateHighScoreDto = { score: 5 };
      const mockResult = { highScore: 100, updated: false };
      mockScoreService.tryUpdateHighScore.mockReturnValue(mockResult);

      const result = controller.updateHighScore(dto);

      expect(result).toEqual({ highScore: 100, updated: false });
    });

    it('should delegate to scoreService.tryUpdateHighScore', () => {
      const dto: UpdateHighScoreDto = { score: 30 };
      mockScoreService.tryUpdateHighScore.mockReturnValue({
        highScore: 30,
        updated: true,
      });

      controller.updateHighScore(dto);

      expect(mockScoreService.tryUpdateHighScore).toHaveBeenCalledTimes(1);
      expect(mockScoreService.tryUpdateHighScore).toHaveBeenCalledWith(30);
    });

    it('should return the exact response from scoreService', () => {
      const dto: UpdateHighScoreDto = { score: 75 };
      const serviceResponse = { highScore: 75, updated: true };
      mockScoreService.tryUpdateHighScore.mockReturnValue(serviceResponse);

      const result = controller.updateHighScore(dto);

      expect(result).toBe(serviceResponse);
    });
  });
});
