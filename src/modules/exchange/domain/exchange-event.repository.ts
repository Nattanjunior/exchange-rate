import { DomainEvent } from '../../../types/DomainEvent';

export const EXCHANGE_EVENT_PUBLISHER = 'EXCHANGE_EVENT_PUBLISHER';

export interface ExchangeEventPublisher {
  publish(DomainEvent): Promise<void>;
}
