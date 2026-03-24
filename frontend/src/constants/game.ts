import { Action } from '@/types/game';

export const BOT_REVEAL_DELAY_MS = 2000;
export const ACTIONS: Action[] = ['rock', 'paper', 'scissors'];
export const ACTION_EMOJI: Record<Action, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
};
