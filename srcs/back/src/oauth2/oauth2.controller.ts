import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common'
import { OAuth2Service } from './oauth2.service'
import { ExchangeCodeDto } from './dto/exchange-code.dto'

@Controller('oauth2')
export class OAuth2Controller {
  constructor(private readonly oauth2Service: OAuth2Service) {}

  @Get('authorize')
  async authorize() {
    return this.oauth2Service.authorize()
  }

  @Post('exchange')
  async exchange(@Body(new ValidationPipe()) exchangeCodeDto: ExchangeCodeDto) {
    return this.oauth2Service.exchange(exchangeCodeDto)
  }
}
