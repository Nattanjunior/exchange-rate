import { RabbitMQConnection } from './rabbitmq.connection';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  EXCHANGE_EVENT_HANDLER,
  type ExchangeEventHandler,
} from 'src/modules/exchange/domain';

@Injectable()
export class RabbitmqWorker implements OnModuleInit {
  constructor(
    @Inject(EXCHANGE_EVENT_HANDLER)
    private readonly handler: ExchangeEventHandler,
    private readonly rabbit: RabbitMQConnection,
  ) {}

  async onModuleInit() {
    console.log('RabbitmqWorker initializing...');
    await this.start();
    console.log('RabbitmqWorker started.');
  }

  async start() {
    try {
      const channel = await this.rabbit.getChannel();
      const exchange = 'exchange.request';
      const queue = 'exchange.queue';
      const routingKey = 'exchange.currency';

      await channel.assertExchange(exchange, 'direct', { durable: true });
      await channel.assertQueue(queue, { durable: true });

      await channel.bindQueue(queue, exchange, routingKey);

      console.log('Waiting for messages in %s', queue);

      channel.consume(queue, async (msg) => {
        if (!msg) return;
        

        const data = JSON.parse(msg.content.toString());

        try {
          await this.handler.handle(data);
          channel.ack(msg);
        } catch (err) {
          channel.nack(msg); 
        }
      });
    } catch (err) {
      console.error('Error starting RabbitmqWorker:', err);
    }
  }
}
