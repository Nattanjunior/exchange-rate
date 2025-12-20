import { Injectable } from '@nestjs/common';
import type { ExchangeRepository } from '../domain/exchange.repository';
import { RedisService } from 'src/infra/cache/redis.service';
import type { ExchangeEventPublisher } from '../domain/exchange-event.repository';

@Injectable()
export class FindLatestExchangeRateUseCase {
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

  async findTheLatestExchangeRate(currency: string): Promise<{}> {
    const cache = this.redisService;
    const cacheData = await cache.redis().get(`exchange:${currency}`);

    if (cacheData) {
      return {
        status: 'SUCCESS',
        data: JSON.parse(cacheData),
      };
    }

    await this.exchangeEventPublisher.publish(currency);

    return {
      status: 'PROCESSING',
    };
  }
}
