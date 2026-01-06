import { Inject, Injectable } from '@nestjs/common';
import { FetchExchangeRateUseCase } from './FetchExchangeRateUseCase';
import type { searchCurrencyHistoryUseCase } from './searchCurrencyHistoryUseCase';
import type { DomainEvent } from 'src/types/DomainEvent';

export const FIND_LATEST_USE_CASE = Symbol('FIND_LATEST_USE_CASE');
export const SEARCH_HISTORY_USE_CASE = Symbol('SEARCH_HISTORY_USE_CASE');

@Injectable()
export class ExchangeEventHandler {
  constructor(
    private readonly fetchExchangeRate: FetchExchangeRateUseCase,

    @Inject(SEARCH_HISTORY_USE_CASE)
    private readonly searchHistory: searchCurrencyHistoryUseCase,
  ) {}

  async handle(event: DomainEvent) {
    switch (event.type) {
      case 'FIND_LATEST_EXCHANGE_RATE':
        return this.fetchExchangeRate.execute(event.payload.currency);

      case 'SEARCH_CURRENCY_HISTORY':
        return this.fetchExchangeRate.fetchHistory(
          event.payload.currency,
          event.payload.date as string,
        );
    }
  }
}
