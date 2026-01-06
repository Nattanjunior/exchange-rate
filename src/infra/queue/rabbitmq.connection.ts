import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQConnection implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL as string;

    if (!url) {
      throw new Error('RABBITMQ_URL não definida');
    }

    console.log('Connecting to RabbitMQ:', url.replace(/:([^:@]+)@/, ':***@'));

    // Parse URL to object to avoid parsing issues
    const urlObj = new URL(url);
    const opts = {
      protocol: urlObj.protocol.replace(':', ''),
      hostname: urlObj.hostname,
      port: Number(urlObj.port),
      username: urlObj.username,
      password: urlObj.password,
      vhost: urlObj.pathname.replace(/^\//, '') || '/',
    };
    console.log('Connection options:', { ...opts, password: '***' });

    this.connection = await amqp.connect(opts);
    this.channel = await this.connection.createChannel();
  }

  getChannel() {
    return this.channel;
  }
}
