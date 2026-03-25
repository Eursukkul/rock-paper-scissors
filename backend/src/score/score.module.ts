import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { EventsModule } from '../events/events.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [EventsModule, MetricsModule],
  controllers: [ScoreController],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
