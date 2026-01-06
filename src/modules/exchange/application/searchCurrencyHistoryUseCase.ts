import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/infra/cache/redis.service';
import { EXCHANGE_EVENT_PUBLISHER, type ExchangeEventPublisher } from '../domain/exchange-event.repository';
import { PRISMA_EXCHANGE_REPOSITORY, type PrismaExchangeRepository } from '../domain/prisma-repository';
import type { DomainEvent } from 'src/types/DomainEvent';

@Injectable()
export class searchCurrencyHistoryUseCase {
  constructor(
    @Inject(PRISMA_EXCHANGE_REPOSITORY)
    private readonly repository: PrismaExchangeRepository,
    @Inject(EXCHANGE_EVENT_PUBLISHER)
    private readonly exchangeEventPublisher: ExchangeEventPublisher,
    private readonly redisService: RedisService,
  ) {}

  async execute(currency: string, date: string): Promise<{}> {
    const redis = this.redisService.redis();
    const cacheKey = `exchange:${currency}:${date}`;

    const cacheData = await redis.get(cacheKey);
    if (cacheData) {
      return {
        status: 'SUCCESS',
        data: JSON.parse(cacheData),
      };
    }

    await this.exchangeEventPublisher.publish({
      type: 'SEARCH_CURRENCY_HISTORY',
      payload: { currency: currency, date: date },
    } as DomainEvent);

    const latest = await this.repository.findLatest(currency);
    if (latest) {
      return {
        status: 'SUCCESS',
        data: latest,
      };
    }

    return {
      status: 'PROCESSING',
    };
  }
}
