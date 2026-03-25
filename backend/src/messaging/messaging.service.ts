import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

export const EXCHANGE_NAME = 'rps.events';
export const ROUTING_KEY_HIGH_SCORE = 'score.highscore.updated';

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessagingService.name);
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly url = process.env.RABBITMQ_URL || 'amqp://rps_user:rps_password@localhost:5672/rps_vhost';

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
      this.logger.log('Connected to RabbitMQ');
    } catch (err) {
      this.logger.warn(`RabbitMQ not available, running without messaging: ${err.message}`);
      this.connection = null;
      this.channel = null;
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch {}
  }

  async publish(routingKey: string, message: object): Promise<void> {
    if (!this.channel) return;
    try {
      const buffer = Buffer.from(JSON.stringify(message));
      this.channel.publish(EXCHANGE_NAME, routingKey, buffer, { persistent: true });
      this.logger.debug(`Published to ${routingKey}: ${JSON.stringify(message)}`);
    } catch (err) {
      this.logger.error(`Failed to publish message: ${err.message}`);
    }
  }
}
