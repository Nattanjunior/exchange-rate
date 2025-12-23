import type { PrismaExchangeRepository } from 'src/modules/exchange/domain/prisma-repository';

export class PrismaService implements PrismaExchangeRepository {
  findLatest(
    currency: string,
  ): Promise<{
    id: string;
    currency: string;
    rate: number;
    quotedAt: Date;
    createdAt: Date;
  }> {
    throw new Error('Method not implemented.');
  }
  findHistory(
    currency: string,
  ): Promise<{
    id: string;
    currency: string;
    rate: number;
    quotedAt: Date;
    createdAt: Date;
  }> {
    throw new Error('Method not implemented.');
  }
  save(): void {}

  delete(): void {}
}
