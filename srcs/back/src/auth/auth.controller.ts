import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  @Get()
  async auth(@Res() res: Response) {
    return res.redirect('/auth/42')
  }
}
