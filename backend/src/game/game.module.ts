import { Module, forwardRef } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [forwardRef(() => ScoreModule)],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameGateway],
})
export class GameModule {}
