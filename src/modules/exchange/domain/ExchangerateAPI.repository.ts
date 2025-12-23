export interface ExchangeRateApiRepository {
  FindtheLatestExchangeRate(currency: string): Promise<{}>;
  SearchCurrencyHistory(currency: string, date: string): Promise<{}>;
}
