import { Controller, Get } from '@nestjs/common';

@Controller('exchange')

export class ExchangeController {

  @Get('/:id')
  async getRecentilyCurrent(){
  }

  @Get('history/:id')
  async getHistoryCurrent (){

  }
}
