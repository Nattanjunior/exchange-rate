import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { RabbitmqPublisher } from 'src/infra/queue/rabbitmq.publisher';

@Module({
   providers: [
    {
      provide: 'ExchangeEventPublisher',
      useClass: RabbitmqPublisher,
    },
  ],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
