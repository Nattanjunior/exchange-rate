import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infra/cache/redis.service';
import type { ExchangeEventPublisher } from '../domain/exchange-event.repository';
import type { PrismaExchangeRepository } from '../domain/prisma-repository';

@Injectable()
export class searchCurrencyHistory {
  private readonly repository: PrismaExchangeRepository;
  private readonly redisService: RedisService;
  private readonly exchangeEventPublisher: ExchangeEventPublisher;

  constructor(
    repository: PrismaExchangeRepository,
    redisService: RedisService,
    exchangeEventPublisher: ExchangeEventPublisher,
  ) {
    this.repository = repository;
    this.redisService = redisService;
    this.exchangeEventPublisher = exchangeEventPublisher;
  }

  async execute(currency: string, date: string): Promise<{}> {
    const redis = this.redisService.redis();
    const cacheKey = `exchange:${currency}`;

    const cacheData = await redis.get(cacheKey);
    if (cacheData) {
      return {
        status: 'SUCCESS',
        data: JSON.parse(cacheData),
      };
    }

    await this.exchangeEventPublisher.publish(`${currency}:${date}`);

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
