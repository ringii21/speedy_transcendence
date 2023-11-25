import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard'

@Controller()
export class AppController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async root() {
    return 'ok'
  }
}
