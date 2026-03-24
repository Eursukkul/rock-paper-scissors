import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PlayRoundDto } from '../dto/play-round.dto';
import { Request, Response } from 'express';

describe('GameController', () => {
  let controller: GameController;
  let gameService: jest.Mocked<GameService>;

  const mockGameService = {
    playRound: jest.fn(),
    pickBotAction: jest.fn(),
    determineResult: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    gameService = module.get(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('play', () => {
    it('should read playerScore from cookie and call gameService.playRound', () => {
      const dto: PlayRoundDto = { playerAction: 'rock' };
      const mockReq = {
        cookies: { playerScore: '5' },
      } as unknown as Request;
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const mockResult = { botAction: 'scissors', result: 'win', playerScore: 6 };
      mockGameService.playRound.mockReturnValue(mockResult);

      const result = controller.play(dto, mockReq, mockRes);

      expect(mockGameService.playRound).toHaveBeenCalledWith('rock', 5);
      expect(result).toEqual(mockResult);
    });

    it('should set playerScore cookie with the updated score', () => {
      const dto: PlayRoundDto = { playerAction: 'scissors' };
      const mockReq = {
        cookies: { playerScore: '3' },
      } as unknown as Request;
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const mockResult = { botAction: 'paper', result: 'win', playerScore: 4 };
      mockGameService.playRound.mockReturnValue(mockResult);

      controller.play(dto, mockReq, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith('playerScore', '4', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });
    });

    it('should default to score 0 when no cookie is set', () => {
      const dto: PlayRoundDto = { playerAction: 'paper' };
      const mockReq = {
        cookies: {},
      } as unknown as Request;
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const mockResult = { botAction: 'rock', result: 'win', playerScore: 1 };
      mockGameService.playRound.mockReturnValue(mockResult);

      controller.play(dto, mockReq, mockRes);

      expect(mockGameService.playRound).toHaveBeenCalledWith('paper', 0);
    });

    it('should default to score 0 when cookies is undefined', () => {
      const dto: PlayRoundDto = { playerAction: 'rock' };
      const mockReq = {
        cookies: undefined,
      } as unknown as Request;
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const mockResult = { botAction: 'scissors', result: 'win', playerScore: 1 };
      mockGameService.playRound.mockReturnValue(mockResult);

      controller.play(dto, mockReq, mockRes);

      expect(mockGameService.playRound).toHaveBeenCalledWith('rock', 0);
    });

    it('should default to score 0 when cookie value is invalid', () => {
      const dto: PlayRoundDto = { playerAction: 'rock' };
      const mockReq = {
        cookies: { playerScore: 'not-a-number' },
      } as unknown as Request;
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const mockResult = { botAction: 'scissors', result: 'win', playerScore: 1 };
      mockGameService.playRound.mockReturnValue(mockResult);

      controller.play(dto, mockReq, mockRes);

      expect(mockGameService.playRound).toHaveBeenCalledWith('rock', 0);
    });

    it('should return the result from gameService.playRound', () => {
      const dto: PlayRoundDto = { playerAction: 'paper' };
      const mockReq = {
        cookies: { playerScore: '0' },
      } as unknown as Request;
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const mockResult = { botAction: 'rock', result: 'win', playerScore: 1 };
      mockGameService.playRound.mockReturnValue(mockResult);

      const result = controller.play(dto, mockReq, mockRes);

      expect(result).toEqual(mockResult);
    });
  });

  describe('reset-score', () => {
    it('should set playerScore cookie to 0', () => {
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      controller.resetScore(mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith('playerScore', '0', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });
    });

    it('should return playerScore as 0', () => {
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = controller.resetScore(mockRes);

      expect(result).toEqual({ playerScore: 0 });
    });

    it('should not call gameService.playRound', () => {
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      controller.resetScore(mockRes);

      expect(mockGameService.playRound).not.toHaveBeenCalled();
    });
  });
});
