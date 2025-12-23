type PayloadProps = {
  currency: string;
};

export interface DomainEvent<T = PayloadProps> {
  type: string;
  payload: T;
}
