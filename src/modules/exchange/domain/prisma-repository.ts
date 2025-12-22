export interface PrismaExchangeRepository {
  findLatest(currency: string): Promise<{
    id: string;
    currency: string;
    rate: number;
    quotedAt: Date;
    createdAt: Date;
  }>;
  findHistory(currency: string): Promise<{
    id: string;
    currency: string;
    rate: number;
    quotedAt: Date;
    createdAt: Date;
  }>;
  save(): void;
  delete(): void;
}
