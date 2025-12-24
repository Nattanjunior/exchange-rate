import type { ExchangeRateApiRepository } from 'src/modules/exchange/domain/ExchangerateAPI.repository';
import type { ExchangeApiResponse } from 'src/types/responseAPI';

export class ExchangeApiClient implements ExchangeRateApiRepository {
  private options = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  async FindtheLatestExchangeRate(currency: string) {
    try {
      const responseAPI = await fetch(
        `https://openexchangerates.org/api/latest.json?app_id=${process.env.APP_ID}&base=${currency}`,
        this.options,
      );
      return responseAPI;
    } catch (error) {
      throw new Error('Error fetching latest exchange rate');
    }
  }

  async SearchCurrencyHistory(currency: string, date: string) {
    try {
      const responseAPI = await fetch(
        `https://openexchangerates.org/api/historical/${date}.json?app_id=${process.env.APP_ID}&base=${currency}`,
        this.options,
      );
      return responseAPI;
    } catch (error) {
      throw new Error('Error fetching currency history');
    }
  }
}
