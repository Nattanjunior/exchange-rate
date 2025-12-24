export interface ExchangeEntity  {
  id?: number;
  currency: string;
  rate: number;
  quotedAt: Date;
  createdAt?: Date;
}
