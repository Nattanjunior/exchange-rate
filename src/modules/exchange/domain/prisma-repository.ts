type ExchangeProps = {
  id?: string;
  currency: string;
  rates: { currency: string }[];
  quotedAt: Date;
  createdAt?: Date;
};

export interface PrismaExchangeRepository {
  findLatest(currency: string): Promise<ExchangeProps>;
  findHistory(currency: string): Promise<ExchangeProps[]>;
  save(props: ExchangeProps): Promise<void>;
  delete(id: string): Promise<void>;
}
