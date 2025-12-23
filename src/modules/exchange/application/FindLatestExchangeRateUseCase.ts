import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infra/cache/redis.service';
import type { ExchangeEventPublisher } from '../domain/exchange-event.repository';
import type { PrismaExchangeRepository } from '../domain/prisma-repository';
import type { DomainEvent } from 'src/types/DomainEvent';

@Injectable()
export class FindLatestExchangeRateUseCase {
  constructor(
    private readonly redisService: RedisService,
    private readonly exchangeEventPublisher: ExchangeEventPublisher,
    private readonly repository: PrismaExchangeRepository,
  ) {}

  async execute(currency: string) {
    const redis = this.redisService.redis();
    const cacheKey = `exchange:${currency}`;

    const cacheData = await redis.get(cacheKey);
    if (cacheData) {
      return {
        status: 'SUCCESS',
        data: JSON.parse(cacheData),
      };
    }

    await this.exchangeEventPublisher.publish({
      type: 'FIND_LATEST_EXCHANGE_RATE',
      payload: { currency: currency },
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
