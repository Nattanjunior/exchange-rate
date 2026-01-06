import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './infra/cache/redis.module';
import { ExchangeModule } from './modules/exchange/exchange.module';
import { QueueModule } from './infra/queue/queue.module';
import { ExchangeEventModule } from './modules/exchange/event.module';
import { ExchangeCompositionModule } from './modules/exchange/exchange.composition.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    ExchangeModule,
    ExchangeCompositionModule,
  ],
})
export class AppModule {}
