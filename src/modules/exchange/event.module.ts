import { Module } from '@nestjs/common';
import { ExchangeEventHandler, FIND_LATEST_USE_CASE, SEARCH_HISTORY_USE_CASE } from './application/ExchangeEventHandler';
import { EXCHANGE_EVENT_HANDLER } from './domain/index';
import { searchCurrencyHistoryUseCase } from './application/searchCurrencyHistoryUseCase';
import { FindLatestExchangeRateUseCase } from './application/FindLatestExchangeRateUseCase';
import { EXCHANGE_EVENT_PUBLISHER } from './domain/exchange-event.repository';
import { RabbitmqPublisher } from 'src/infra/queue/rabbitmq.publisher';
import { ExchangeModule } from './exchange.module';
import { QueueModule } from 'src/infra/queue/queue.module';
import { RabbitmqWorker } from 'src/infra/queue/rabbitmq.worker';

@Module({
  imports: [ExchangeModule, QueueModule],
  providers: [
    RabbitmqWorker,
    ExchangeEventHandler,
    {
      provide: EXCHANGE_EVENT_HANDLER,
      useExisting: ExchangeEventHandler,
    },
    {
      provide: EXCHANGE_EVENT_PUBLISHER,
      useClass: RabbitmqPublisher,
    },
    {
      provide: FIND_LATEST_USE_CASE,
      useExisting: FindLatestExchangeRateUseCase,
    },
    {
      provide: SEARCH_HISTORY_USE_CASE,
      useExisting: searchCurrencyHistoryUseCase,
    },
  ],
  exports: [EXCHANGE_EVENT_HANDLER],
})
export class ExchangeEventModule {}
