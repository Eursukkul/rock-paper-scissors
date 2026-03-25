import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { ScoreModule } from './score/score.module';
import { MessagingModule } from './messaging/messaging.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [MessagingModule, MetricsModule, GameModule, ScoreModule],
})
export class AppModule {}
