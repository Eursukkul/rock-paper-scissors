import { Injectable } from '@nestjs/common';
import { MetricsService } from '../metrics/metrics.service';

export type Action = 'ROCK' | 'PAPER' | 'SCISSORS';

export interface BotActionResponse {
  action: Action;
}

export type GameResult = 'WIN' | 'LOSE' | 'DRAW';

@Injectable()
export class GameService {
  private readonly actions: Action[] = ['ROCK', 'PAPER', 'SCISSORS'];

  constructor(private readonly metricsService: MetricsService) {}

  getRandomBotAction(): BotActionResponse {
    const randomIndex = Math.floor(Math.random() * this.actions.length);
    const randomAction = this.actions[randomIndex];
    this.metricsService.botActionCounter.inc({ action: randomAction });
    return { action: randomAction };
  }

  determineResult(playerAction: Action, botAction: Action): GameResult {
    if (playerAction === botAction) return 'DRAW';

    const winConditions: Record<Action, Action> = {
      ROCK: 'SCISSORS',
      PAPER: 'ROCK',
      SCISSORS: 'PAPER',
    };

    return winConditions[playerAction] === botAction ? 'WIN' : 'LOSE';
  }
}
