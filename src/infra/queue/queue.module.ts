import { Module } from '@nestjs/common';
import { RabbitMQConnection } from './rabbitmq.connection';
import { RabbitmqPublisher } from './rabbitmq.publisher';
import { RabbitmqWorker } from './rabbitmq.worker';
import { EXCHANGE_EVENT_PUBLISHER } from 'src/modules/exchange/domain/exchange-event.repository';
import { ExchangeEventModule } from 'src/modules/exchange/event.module';

@Module({
  providers: [
    RabbitmqPublisher,
    RabbitMQConnection,
    {
      provide: EXCHANGE_EVENT_PUBLISHER,
      useClass: RabbitmqPublisher,
    },
  ],
  exports: [EXCHANGE_EVENT_PUBLISHER, RabbitMQConnection],
})
export class QueueModule {}
