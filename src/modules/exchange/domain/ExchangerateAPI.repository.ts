import type { TypeResponseApi } from 'src/types/TypeResponseApi';

export interface ExchangeRateApiRepository {
  FindtheLatestExchangeRate(currency: string): Promise<TypeResponseApi>;
  SearchCurrencyHistory(
    currency: string,
    date: string,
  ): Promise<TypeResponseApi>;
}
