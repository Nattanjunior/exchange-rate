import { Inject, Injectable } from '@nestjs/common';
import { EXCHANGE_API_REPOSITORY, ExchangeRateApiRepository } from '../domain/ExchangerateAPI.repository';
import { PRISMA_EXCHANGE_REPOSITORY, PrismaExchangeRepository } from '../domain/prisma-repository';
import { RedisService } from 'src/infra/cache/redis.service';

@Injectable()
export class FetchExchangeRateUseCase {
  constructor(
    @Inject(EXCHANGE_API_REPOSITORY)
    private readonly apiRepository: ExchangeRateApiRepository,
    @Inject(PRISMA_EXCHANGE_REPOSITORY)
    private readonly dbRepository: PrismaExchangeRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(currency: string) {
    try {
      const data = await this.apiRepository.FindtheLatestExchangeRate(currency);
      
      if (!data || !data.rates) {
          console.error('Invalid API response', data);
          return;
      }

      const redis = this.redisService.redis();
      const timestamp = new Date(data.timestamp * 1000);

      // Process in parallel to speed up
      const promises = Object.entries(data.rates).map(async ([code, rate]) => {
          // Save to DB
          await this.dbRepository.save({
              currency: code,
              rate: Number(rate),
              quotedAt: timestamp,
          });

          // Save to Redis
          const cacheKey = `exchange:${code}`;
          await redis.set(cacheKey, JSON.stringify({
              currency: code,
              rate: rate,
              quotedAt: timestamp,
          }), 'EX', 60 * 60); // 1 hour expiration
      });

      await Promise.all(promises);

    } catch (error) {
      console.error('Error in FetchExchangeRateUseCase', error);
      throw error;
    }
  }

  async fetchHistory(currency: string, date: string) {
    try {
      const data = await this.apiRepository.SearchCurrencyHistory(currency, date);
      
      if (!data || !data.rates) {
          console.error('Invalid API response for history', data);
          return;
      }

      const redis = this.redisService.redis();
      const timestamp = new Date(data.timestamp * 1000);

      const promises = Object.entries(data.rates).map(async ([code, rate]) => {
          // Save to DB
          await this.dbRepository.save({
              currency: code,
              rate: Number(rate),
              quotedAt: timestamp,
          });

          // Save to Redis with date key
          // Format date as YYYY-MM-DD to match the request
          const dateStr = timestamp.toISOString().split('T')[0];
          const cacheKey = `exchange:${code}:${dateStr}`;
          
          await redis.set(cacheKey, JSON.stringify({
              currency: code,
              rate: rate,
              quotedAt: timestamp,
          }), 'EX', 24 * 60 * 60); // 24 hours expiration for history
      });

      await Promise.all(promises);

    } catch (error) {
      console.error('Error in fetchHistory', error);
      throw error;
    }
  }
}
