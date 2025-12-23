import type { RedisService } from 'src/infra/cache/redis.service';
import type { ExchangeRateApiRepository } from '../domain/ExchangerateAPI.repository';
import type { PrismaExchangeRepository } from '../domain/prisma-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateCurrencyHistoryUseCase {
  constructor(
    private readonly repository: ExchangeRateApiRepository,
    private readonly cache: RedisService,
    private readonly repositoryPrisma: PrismaExchangeRepository,
  ) {}

  async execute(currency: string, date: string) {
    const data = await this.repository.SearchCurrencyHistory(currency, date);
    const rate = data.rates[currency];
    if (!rate)
      return {
        status: 'FAILED',
        message: 'No rate found for the specified currency and date',
      };

    const quotedAt = new Date(data.timestamp * 1000);
    await this.repositoryPrisma.save({
      currency,
      rates: rate,
      quotedAt,
    });

    await this.cache
      .redis()
      .set(
        `exchange:history:${currency}:${date}`,
        JSON.stringify({ rate, quotedAt }),
        'EX',
        300,
      );
  }
}
