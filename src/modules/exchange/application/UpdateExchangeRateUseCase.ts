import type { RedisService } from "src/infra/cache/redis.service";
import type { ExchangeRateApiRepository } from "../domain/ExchangerateAPI.repository";
import type { ExchangeApiClient } from "src/infra/http/api-exchange-rate/api-client";
import type { PrismaExchangeRepository } from "../domain/prisma-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateExchangeRateUseCase {
  constructor(
    private readonly repository: ExchangeRateApiRepository,
    private readonly cache: RedisService,
    private readonly repositoryPrisma: PrismaExchangeRepository,
  ) {}

  async execute(currency: string) {
    const data = await this.repository.FindtheLatestExchangeRate(currency);

    await this.repositoryPrisma.save({
      currency,
      rate: data.rate,
      quotedAt: data.timestamp,
    });

    await this.cache.redis().set(
      `exchange:${currency}`,
      JSON.stringify(data),
      'EX',
      300
    );
  }
}
