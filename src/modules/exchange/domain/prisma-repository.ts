import type { ExchangeEntity } from 'src/types/responseBD';

export interface PrismaExchangeRepository {
  findLatest(currency: string): Promise<ExchangeEntity>;
  findHistory(currency: string): Promise<ExchangeEntity[]>;
  save(props: ExchangeEntity): Promise<void>;
  delete(id: number): Promise<void>;
}
