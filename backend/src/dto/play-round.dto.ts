import { IsIn } from 'class-validator';
import { Action } from '../types/game.types';

export class PlayRoundDto {
  @IsIn(['rock', 'paper', 'scissors'])
  playerAction: Action;
}
