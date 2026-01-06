type PayloadProps = {
  currency: string;
  date?: string;
};

export interface DomainEvent<T = PayloadProps> {
  type: string;
  payload: T;
}
