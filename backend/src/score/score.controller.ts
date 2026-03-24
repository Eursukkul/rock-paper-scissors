import { Controller, Get, Post, Body } from '@nestjs/common';
import { ScoreService } from './score.service';
import { UpdateHighScoreDto } from '../dto/update-score.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('high-score')
  getHighScore() {
    return { highScore: this.scoreService.getHighScore() };
  }

  @Post('high-score')
  updateHighScore(@Body() dto: UpdateHighScoreDto) {
    return this.scoreService.tryUpdateHighScore(dto.score);
  }
}
