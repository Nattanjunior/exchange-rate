export interface ExchangeEventHandler {
  handle(event: any): Promise<void>;
}
