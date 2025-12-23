import { DomainEvent } from '../../../types/DomainEvent';

export interface ExchangeEventPublisher {
  publish(DomainEvent): Promise<void>;
}
