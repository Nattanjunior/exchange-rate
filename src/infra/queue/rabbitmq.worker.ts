import { FindLatestExchangeRateUseCase } from 'src/modules/exchange/application/FindLatestExchangeRateUseCase';
import { RabbitMQConnection } from './rabbitmq.connection';
import { searchCurrencyHistory } from 'src/modules/exchange/application/searchCurrencyHistory';

export class ExchangeWorker {
  constructor(
    private readonly findLatestExchangeRateUseCase: FindLatestExchangeRateUseCase,
    private readonly searchCurrencyHistory: searchCurrencyHistory,
  ) {}

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

      switch (data.type) {
        case 'FIND_LATEST_EXCHANGE_RATE':
          await this.findLatestExchangeRateUseCase.execute(
            data.payload.currency,
          );
          break;

        case 'SEARCH_CURRENCY_HISTORY':
          await this.searchCurrencyHistory.execute(
            data.payload.currency,
            data.payload.date,
          );
          break;
        default:
          throw new Error('Unknown event type');
      }

      channel.ack(msg);
    });
  }
}
