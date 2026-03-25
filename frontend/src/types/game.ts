export type Action = 'ROCK' | 'PAPER' | 'SCISSORS';
export type GameResult = 'WIN' | 'LOSE' | 'DRAW' | null;

export interface BotActionResponse {
  action: Action;
}

export interface HighScoreResponse {
  highScore: number;
}

export interface UpdateHighScoreResponse {
  updated: boolean;
  highScore: number;
}

export interface GameState {
  yourScore: number;
  highScore: number;
  botAction: Action | null;
  lastResult: GameResult;
  isAnimating: boolean;
}
