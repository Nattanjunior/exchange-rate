export interface ExchangeRepository {
  FindtheLatestExchangeRate(currency: string): Promise<{}>;
  SearchCurrencyHistory(currency: string, date: string): Promise<{}>;
}
