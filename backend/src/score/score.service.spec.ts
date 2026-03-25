import { Test, TestingModule } from '@nestjs/testing';
import { ScoreService } from './score.service';
import { MessagingService } from '../messaging/messaging.service';
import * as fs from 'fs';

jest.mock('fs');

const mockMessagingService = {
  publish: jest.fn().mockResolvedValue(undefined),
};

describe('ScoreService', () => {
  let service: ScoreService;

  beforeEach(async () => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        { provide: MessagingService, useValue: mockMessagingService },
      ],
    }).compile();

    service = module.get<ScoreService>(ScoreService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 0 as initial high score', () => {
    expect(service.getHighScore()).toBe(0);
  });

  it('should update high score when new score is higher', async () => {
    const result = await service.updateHighScore(10);
    expect(result.updated).toBe(true);
    expect(result.highScore).toBe(10);
    expect(service.getHighScore()).toBe(10);
  });

  it('should not update high score when new score is equal', async () => {
    await service.updateHighScore(10);
    const result = await service.updateHighScore(10);
    expect(result.updated).toBe(false);
    expect(result.highScore).toBe(10);
  });

  it('should not update high score when new score is lower', async () => {
    await service.updateHighScore(10);
    const result = await service.updateHighScore(5);
    expect(result.updated).toBe(false);
    expect(result.highScore).toBe(10);
  });
});
