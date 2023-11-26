import { Controller, Get, UseGuards } from '@nestjs/common'
import JwtTwoFaGuard from './auth/jwt/jwt-2fa.guard'

@Controller()
export class AppController {
  constructor() {}

  @UseGuards(JwtTwoFaGuard)
  @Get()
  async root() {
    return 'ok'
  }
}
