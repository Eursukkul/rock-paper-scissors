import { Injectable } from '@nestjs/common';
import { Action, GameResult, PlayRoundResponse } from '../types/game.types';

@Injectable()
export class GameService {
  private readonly ACTIONS: Action[] = ['rock', 'paper', 'scissors'];

  pickBotAction(): Action {
    const idx = Math.floor(Math.random() * this.ACTIONS.length);
    return this.ACTIONS[idx];
  }

  determineResult(playerAction: Action, botAction: Action): GameResult {
    if (playerAction === botAction) return 'draw';
    const wins: Record<Action, Action> = {
      rock: 'scissors',
      scissors: 'paper',
      paper: 'rock',
    };
    return wins[playerAction] === botAction ? 'win' : 'lose';
  }

  playRound(playerAction: Action, currentScore: number): PlayRoundResponse {
    const botAction = this.pickBotAction();
    const result = this.determineResult(playerAction, botAction);
    const playerScore = result === 'win' ? currentScore + 1 : currentScore;
    return { botAction, result, playerScore };
  }
}
