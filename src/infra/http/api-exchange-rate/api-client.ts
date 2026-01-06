import type { ExchangeRateApiRepository } from 'src/modules/exchange/domain/ExchangerateAPI.repository';
// import type { ExchangeApiResponse } from 'src/types/responseAPI';

export class ExchangeApiClient implements ExchangeRateApiRepository {
  private options = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  async FindtheLatestExchangeRate(
    currency: string,
  ): Promise<{ timestamp: number; rates: Record<string, number> }> {
    try {
      const responseAPI = await fetch(
        `https://api.frankfurter.app/latest?from=${currency}`,
        this.options,
      );
      const data = await responseAPI.json();

      // Frankfurter returns date string (YYYY-MM-DD), convert to timestamp
      const timestamp = new Date(data.date).getTime() / 1000;

      return {
        timestamp,
        rates: data.rates,
      };
    } catch (error) {
      console.error('Error fetching latest exchange rate:', error);
      throw error;
    }
  }

  async SearchCurrencyHistory(
    currency: string,
    date: string,
  ): Promise<{ timestamp: number; rates: Record<string, number> }> {
    try {
      const responseAPI = await fetch(
        `https://api.frankfurter.app/${date}?from=${currency}`,
        this.options,
      );
      const data = await responseAPI.json();

      const timestamp = new Date(data.date).getTime() / 1000;

      return {
        timestamp,
        rates: data.rates,
      };
    } catch (error) {
      console.error('Error fetching history exchange rate:', error);
      throw error;
    }
  }
}
