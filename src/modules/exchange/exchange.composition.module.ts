import { Module } from '@nestjs/common';
import { ExchangeEventModule } from './event.module';
import { QueueModule } from 'src/infra/queue/queue.module';

@Module({
  imports: [
    ExchangeEventModule,
    QueueModule,
  ],
})
export class ExchangeCompositionModule {}
