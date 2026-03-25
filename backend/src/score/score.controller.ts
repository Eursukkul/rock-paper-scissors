import { Controller, Get, Post, Body } from '@nestjs/common';
import { ScoreService } from './score.service';
import { EventsGateway } from '../events/events.gateway';
import { MetricsService } from '../metrics/metrics.service';

@Controller('score')
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly eventsGateway: EventsGateway,
    private readonly metricsService: MetricsService,
  ) {}

  @Get('high-score')
  getHighScore() {
    return { highScore: this.scoreService.getHighScore() };
  }

  @Post('high-score')
  async updateHighScore(@Body() body: { score: number }) {
    const result = await this.scoreService.updateHighScore(body.score);
    if (result.updated) {
      this.eventsGateway.broadcastHighScore(result.highScore);
      this.metricsService.highScoreGauge.set(result.highScore);
    }
    return result;
  }
}
