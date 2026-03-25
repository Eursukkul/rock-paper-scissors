import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MessagingService } from '../messaging/messaging.service';

const DATA_FILE = path.join(process.cwd(), 'data', 'score.json');

@Injectable()
export class ScoreService implements OnModuleInit {
  private highScore: number = 0;

  constructor(private readonly messagingService: MessagingService) {}

  onModuleInit() {
    this.loadFromFile();
  }

  private loadFromFile(): void {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        this.highScore = data.highScore ?? 0;
      }
    } catch {
      this.highScore = 0;
    }
  }

  private saveToFile(): void {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify({ highScore: this.highScore }));
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  }

  getHighScore(): number {
    return this.highScore;
  }

  async updateHighScore(newScore: number): Promise<{ updated: boolean; highScore: number }> {
    if (newScore > this.highScore) {
      this.highScore = newScore;
      this.saveToFile();
      await this.messagingService.publish('score.highscore.updated', { highScore: this.highScore, timestamp: new Date().toISOString() });
      return { updated: true, highScore: this.highScore };
    }
    return { updated: false, highScore: this.highScore };
  }
}
