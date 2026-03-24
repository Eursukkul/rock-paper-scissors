import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameGateway],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);

    // Mock the WebSocket server
    gateway.server = {
      emit: jest.fn(),
    } as any;
  });

  describe('broadcastHighScore', () => {
    it('should emit highScoreUpdated event with the correct high score', () => {
      gateway.broadcastHighScore(42);
      expect(gateway.server.emit).toHaveBeenCalledWith('highScoreUpdated', {
        highScore: 42,
      });
    });

    it('should emit highScoreUpdated event with score of 0', () => {
      gateway.broadcastHighScore(0);
      expect(gateway.server.emit).toHaveBeenCalledWith('highScoreUpdated', {
        highScore: 0,
      });
    });

    it('should emit highScoreUpdated event with large score', () => {
      gateway.broadcastHighScore(9999);
      expect(gateway.server.emit).toHaveBeenCalledWith('highScoreUpdated', {
        highScore: 9999,
      });
    });

    it('should call server.emit exactly once per broadcastHighScore call', () => {
      gateway.broadcastHighScore(10);
      expect(gateway.server.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit multiple times when called multiple times', () => {
      gateway.broadcastHighScore(5);
      gateway.broadcastHighScore(10);
      gateway.broadcastHighScore(15);
      expect(gateway.server.emit).toHaveBeenCalledTimes(3);
      expect(gateway.server.emit).toHaveBeenNthCalledWith(1, 'highScoreUpdated', { highScore: 5 });
      expect(gateway.server.emit).toHaveBeenNthCalledWith(2, 'highScoreUpdated', { highScore: 10 });
      expect(gateway.server.emit).toHaveBeenNthCalledWith(3, 'highScoreUpdated', { highScore: 15 });
    });
  });

  describe('handleConnection', () => {
    it('should log when a client connects', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockClient = { id: 'test-client-id' };
      gateway.handleConnection(mockClient);
      expect(consoleSpy).toHaveBeenCalledWith('Client connected: test-client-id');
      consoleSpy.mockRestore();
    });
  });
});
