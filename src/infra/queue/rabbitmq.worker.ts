import { RabbitMQConnection } from './rabbitmq.connection';

export class ExchangeWorker {
  async start() {
    const channel = await RabbitMQConnection.getChannel();

    const exchange = 'exchange.request';
    const queue = 'exchange.queue';
    const routingKey = 'exchange.currency';

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, exchange, routingKey);

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      console.log('Processando:', data.currency);

      // 🔥 chama API externa
      // 🔥 salva histórico
      // 🔥 atualiza cache

      channel.ack(msg);
    });
  }
}
