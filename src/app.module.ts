import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './infra/cache/redis.module';
import { ExchangeModule } from './modules/exchange/exchange.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    ExchangeModule,
  ],
})
export class AppModule {}