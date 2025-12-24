import type { ExchangeApiResponse } from 'src/types/responseAPI';

export interface ExchangeRateApiRepository {
  FindtheLatestExchangeRate(currency: string);
  SearchCurrencyHistory(currency: string, date: string);
}
