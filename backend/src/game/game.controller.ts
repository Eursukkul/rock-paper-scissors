import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GameService } from './game.service';
import { PlayRoundDto } from '../dto/play-round.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('play')
  play(
    @Body() dto: PlayRoundDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const currentScore = parseInt(req.cookies?.playerScore ?? '0', 10) || 0;
    const result = this.gameService.playRound(dto.playerAction, currentScore);
    res.cookie('playerScore', String(result.playerScore), {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    return result;
  }

  @Post('reset-score')
  resetScore(@Res({ passthrough: true }) res: Response) {
    res.cookie('playerScore', '0', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    return { playerScore: 0 };
  }
}
