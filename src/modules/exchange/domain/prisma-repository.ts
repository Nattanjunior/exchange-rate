import type { ExchangeEntity } from 'src/types/responseBD';

export const PRISMA_EXCHANGE_REPOSITORY = 'PRISMA_EXCHANGE_REPOSITORY';

export interface PrismaExchangeRepository {
  findLatest(currency: string): Promise<ExchangeEntity | null>;
  findHistory(currency: string): Promise<ExchangeEntity[]>;
  save(props: ExchangeEntity): Promise<void>;
  delete(id: number): Promise<void>;
}
