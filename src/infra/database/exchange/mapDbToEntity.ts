import type { ExchangeEntity } from 'src/types/responseBD'

export function mapDbToEntity(data: any): ExchangeEntity {
  return {
    id: data.id,
    currency: data.currency,
    rate: Number(data.rate),
    quotedAt: data.quotedAt,
    createdAt: data.createdAt,
  }
}
