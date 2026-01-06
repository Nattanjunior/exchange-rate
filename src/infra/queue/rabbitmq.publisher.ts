import type { ExchangeEventPublisher } from 'src/modules/exchange/domain/exchange-event.repository';
import { RabbitMQConnection } from './rabbitmq.connection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitmqPublisher implements ExchangeEventPublisher {
  constructor(private readonly rabbit: RabbitMQConnection) {}

  async publish(event: any) {
    const channel = await this.rabbit.getChannel();

    const exchange = 'exchange.request';
    const routingKey = 'exchange.currency';

    await channel.assertExchange(exchange, 'direct', { durable: true });

    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );
  }
}
