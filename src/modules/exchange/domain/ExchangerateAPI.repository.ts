export const EXCHANGE_API_REPOSITORY = 'EXCHANGE_API_REPOSITORY';

export interface ExchangeRateApiRepository {
  FindtheLatestExchangeRate(currency: string): Promise<any>;
  SearchCurrencyHistory(currency: string, date: string): Promise<any>;
}
