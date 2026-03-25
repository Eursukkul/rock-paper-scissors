import { Test, TestingModule } from '@nestjs/testing';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { EventsGateway } from '../events/events.gateway';

const mockEventsGateway = {
  broadcastHighScore: jest.fn(),
};

describe('ScoreController', () => {
  let controller: ScoreController;
  let service: ScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [
        ScoreService,
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    controller = module.get<ScoreController>(ScoreController);
    service = module.get<ScoreService>(ScoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get high score', () => {
    const result = controller.getHighScore();
    expect(result).toHaveProperty('highScore');
    expect(result.highScore).toBe(0);
  });

  it('should update high score when new score is higher', () => {
    const result = controller.updateHighScore({ score: 10 });
    expect(result.updated).toBe(true);
    expect(result.highScore).toBe(10);
    expect(mockEventsGateway.broadcastHighScore).toHaveBeenCalledWith(10);
  });

  it('should not update high score when new score is lower', () => {
    controller.updateHighScore({ score: 10 });
    mockEventsGateway.broadcastHighScore.mockClear();
    const result = controller.updateHighScore({ score: 5 });
    expect(result.updated).toBe(false);
    expect(mockEventsGateway.broadcastHighScore).not.toHaveBeenCalled();
  });
});
