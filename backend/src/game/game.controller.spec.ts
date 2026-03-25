import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a bot action', () => {
    const result = controller.getBotAction();
    expect(result).toHaveProperty('action');
    expect(['ROCK', 'PAPER', 'SCISSORS']).toContain(result.action);
  });

  it('should return random actions', () => {
    const actions = new Set<string>();
    for (let i = 0; i < 100; i++) {
      actions.add(controller.getBotAction().action);
    }
    expect(actions.size).toBeGreaterThan(1);
  });
});
