export interface ExchangeRepository {
  FindtheLatestExchangeRate(): Promise<{}>;
  SearchCurrencyHistory(): Promise<[]>;
  save(): void;
  delete(): void;
}
