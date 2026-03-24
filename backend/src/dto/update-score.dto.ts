import { IsInt, Min } from 'class-validator';

export class UpdateHighScoreDto {
  @IsInt()
  @Min(0)
  score: number;
}
