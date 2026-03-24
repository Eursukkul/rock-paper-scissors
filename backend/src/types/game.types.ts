export type Action = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw';

export interface PlayRoundResponse {
  botAction: Action;
  result: GameResult;
  playerScore: number;
}
