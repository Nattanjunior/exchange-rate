import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { PRISMA_EXCHANGE_REPOSITORY } from './domain/prisma-repository';
import { EXCHANGE_EVENT_PUBLISHER } from './domain/exchange-event.repository';
import { ExchangeDB } from 'src/infra/database/exchange/exchange.repository';
import { searchCurrencyHistoryUseCase } from './application/searchCurrencyHistoryUseCase';
import { FindLatestExchangeRateUseCase } from './application/FindLatestExchangeRateUseCase';
import { RedisService } from 'src/infra/cache/redis.service';
import { QueueModule } from 'src/infra/queue/queue.module';
import { ExchangeEventHandler } from './application/ExchangeEventHandler';
import { ExchangeEventModule } from './event.module';
import { RedisModule } from 'src/infra/cache/redis.module';
import { PrismaModule } from 'src/infra/database/prisma/prisma.module';
import { RabbitmqPublisher } from 'src/infra/queue/rabbitmq.publisher';

import { ExchangeApiClient } from 'src/infra/http/api-exchange-rate/api-client';
import { EXCHANGE_API_REPOSITORY } from './domain/ExchangerateAPI.repository';
import { FetchExchangeRateUseCase } from './application/FetchExchangeRateUseCase';

@Module({
  imports: [QueueModule, RedisModule, PrismaModule],
  controllers: [ExchangeController],
  providers: [
    FindLatestExchangeRateUseCase,
    searchCurrencyHistoryUseCase,
    FetchExchangeRateUseCase,
    {
      provide: EXCHANGE_EVENT_PUBLISHER,
      useClass: RabbitmqPublisher,
    },
    {
      provide: PRISMA_EXCHANGE_REPOSITORY,
      useClass: ExchangeDB,
    },
    {
      provide: EXCHANGE_API_REPOSITORY,
      useClass: ExchangeApiClient,
    },
  ],
  exports: [FindLatestExchangeRateUseCase, PRISMA_EXCHANGE_REPOSITORY, searchCurrencyHistoryUseCase, FetchExchangeRateUseCase],
})
export class ExchangeModule {}
