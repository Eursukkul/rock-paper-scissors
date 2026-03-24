export type Action = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw';
export type GamePhase = 'idle' | 'revealing' | 'result';

export interface PlayRoundResponse {
  botAction: Action;
  result: GameResult;
  playerScore: number;
}

export interface HighScoreResponse {
  highScore: number;
}

export interface UpdateHighScoreResponse {
  highScore: number;
  updated: boolean;
}

export interface GameState {
  phase: GamePhase;
  playerScore: number;
  highScore: number;
  botAction: Action | null;
  lastResult: GameResult | null;
}
