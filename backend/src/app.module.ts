import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [GameModule, ScoreModule],
})
export class AppModule {}
