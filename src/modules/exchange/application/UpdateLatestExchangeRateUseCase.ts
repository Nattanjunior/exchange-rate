import type { RedisService } from 'src/infra/cache/redis.service';
import type { ExchangeRateApiRepository } from '../domain/ExchangerateAPI.repository';
import type { PrismaExchangeRepository } from '../domain/prisma-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateLatestExchangeRateUseCase {
  constructor(
    private readonly repository: ExchangeRateApiRepository,
    private readonly cache: RedisService,
    private readonly repositoryPrisma: PrismaExchangeRepository,
  ) {}

  async execute(currency: string) {
    const data = await this.repository.FindtheLatestExchangeRate(currency);
    const rate = data.rates[currency];
    if (!rate)
      return {
        status: 'FAILED',
        message: 'No rate found for the specified currency',
      };

    const quotedAt = new Date(data.timestamp * 1000);
    await this.repositoryPrisma.save({
      currency,
      rate,
      quotedAt,
    });

    await this.cache
      .redis()
      .set(`exchange:${currency}`, JSON.stringify(data), 'EX', 300);
  }
}
