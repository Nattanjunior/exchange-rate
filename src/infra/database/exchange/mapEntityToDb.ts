import type { ExchangeCreateInput } from '../../../types/ExchangeCreateInput';

export function mapEntityToDb(data: ExchangeCreateInput) {
  return {
    currency: data.currency,
    rate: data.rate,
    quotedAt: data.quotedAt,
  };
}
