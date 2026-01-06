import type { PrismaExchangeRepository } from 'src/modules/exchange/domain/prisma-repository';
import { PrismaService } from '../prisma/prisma.service';
import type { ExchangeEntity } from 'src/types/responseBD';
import type { ExchangeCreateInput } from '../../../types/ExchangeCreateInput';

import { mapEntityToDb } from './mapEntityToDb';
import { mapDbToEntity } from './mapDbToEntity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeDB implements PrismaExchangeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findLatest(currency: string): Promise<ExchangeEntity | null> {
    const data = await this.prisma.exchangeRate.findFirst({
      where: { currency },
      orderBy: { quotedAt: 'desc' },
    });

    if (!data) {
      return null;
    }

    return mapDbToEntity(data);
  }

  async findHistory(currency: string): Promise<ExchangeEntity[]> {
    const data = await this.prisma.exchangeRate.findMany({
      where: { currency },
      orderBy: { quotedAt: 'desc' },
    });

    return data.map(mapDbToEntity);
  }

  async save(props: ExchangeCreateInput): Promise<void> {
    await this.prisma.exchangeRate.create({
      data: mapEntityToDb(props),
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.exchangeRate.delete({
      where: { id },
    });
  }
}
