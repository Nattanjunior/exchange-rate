import type { ExchangeRepository } from '../domain/exchange.repository';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infra/cache/redis.service';
import type { ExchangeEventPublisher } from '../domain/exchange-event.repository';

@Injectable()
export class searchCurrencyHistory {
  private readonly exchangeRepository: ExchangeRepository;
  private readonly redisService: RedisService;
  private readonly exchangeEventPublisher: ExchangeEventPublisher;

  constructor(
    exchangeRepository: ExchangeRepository,
    redisService: RedisService,
    exchangeEventPublisher: ExchangeEventPublisher,
  ) {
    this.exchangeRepository = exchangeRepository;
    this.redisService = redisService;
    this.exchangeEventPublisher = exchangeEventPublisher;
  }

  async searchCurrencyHistory(currency: string, date: string): Promise<{}> {
    const cacheData = await this.redisService
      .redis()
      .get(`exchange-history:${currency}:${date}`);

    if (cacheData) {
      return {
        status: 'SUCCESS',
        data: JSON.parse(cacheData),
      };
    }

    await this.exchangeEventPublisher.publish(`${currency}:${date}`);

    return {
      status: 'PROCESSING',
    };
  }
}
