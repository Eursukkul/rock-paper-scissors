import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { BotActionResponse } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('bot-action')
  getBotAction(): BotActionResponse {
    return this.gameService.getRandomBotAction();
  }
}
