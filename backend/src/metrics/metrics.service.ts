import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry = new client.Registry();
  readonly botActionCounter: client.Counter;
  readonly highScoreGauge: client.Gauge;
  readonly httpRequestDuration: client.Histogram;

  constructor() {
    client.collectDefaultMetrics({ register: this.registry });

    this.botActionCounter = new client.Counter({
      name: 'rps_bot_actions_total',
      help: 'Total number of bot actions generated',
      labelNames: ['action'],
      registers: [this.registry],
    });

    this.highScoreGauge = new client.Gauge({
      name: 'rps_high_score',
      help: 'Current high score',
      registers: [this.registry],
    });

    this.httpRequestDuration = new client.Histogram({
      name: 'rps_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1],
      registers: [this.registry],
    });
  }

  onModuleInit() {}

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
