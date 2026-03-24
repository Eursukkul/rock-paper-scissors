import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GameGateway } from '../game/game.gateway';

@Injectable()
export class ScoreService {
  private highScore: number = 0;

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
  ) {}

  getHighScore(): number {
    return this.highScore;
  }

  tryUpdateHighScore(score: number): { highScore: number; updated: boolean } {
    if (score > this.highScore) {
      this.highScore = score;
      this.gameGateway.broadcastHighScore(this.highScore);
      return { highScore: this.highScore, updated: true };
    }
    return { highScore: this.highScore, updated: false };
  }
}
