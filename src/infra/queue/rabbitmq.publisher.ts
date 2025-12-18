import type { ExchangeEventPublisher } from 'src/modules/exchange/domain/exchange-event.repository';
import { RabbitMQConnection } from './rabbitmq.connection';

export class RabbitmqPublisher implements ExchangeEventPublisher {
  async publish(currency: string) {
    const channel = await RabbitMQConnection.getChannel();

    const exchange = 'exchange.request';
    const routingKey = 'exchange.currency';

    await channel.assertExchange(exchange, 'direct', { durable: true });

    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify({ currency })),
    );
  }
}
