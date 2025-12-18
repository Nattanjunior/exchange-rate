export interface ExchangeEventPublisher {
  publish(currency: string): Promise<void>;
}
