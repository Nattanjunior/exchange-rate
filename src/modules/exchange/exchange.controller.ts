import { Controller, Get, Param } from '@nestjs/common';

@Controller('exchange')

export class ExchangeController {

  @Get('/:id')
  async getRecentilyCurrent(@Param('id') id: string){
  }

  @Get('history/:id')
  async getHistoryCurrent (@Param('id') id: string){

  }
}
