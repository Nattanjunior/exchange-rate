import { Controller, Get, Param } from '@nestjs/common';
import { FindLatestExchangeRateUseCase } from './application/FindLatestExchangeRateUseCase';
import { searchCurrencyHistoryUseCase } from './application/searchCurrencyHistoryUseCase';

@Controller('exchange')
export class ExchangeController {
  constructor(
    private readonly findLatestExchangeRateUseCase: FindLatestExchangeRateUseCase,
    private readonly searchCurrencyHistory: searchCurrencyHistoryUseCase,
  ) {}
  @Get('/:currency')
  async getRecentilyCurrent(@Param('currency') currency: string) {
    return await this.findLatestExchangeRateUseCase.execute(currency);
  }

  @Get('history/:currency/:date')
  async getHistoryCurrent(
    @Param('currency') currency: string,
    @Param('date') date: string,
  ) {
    return await this.searchCurrencyHistory.execute(currency, date);
  }
}
