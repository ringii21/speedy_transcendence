import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  async auth(@Res() res: Response) {
    return res.redirect('/auth/42')
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('jwt')
    res.json({ message: 'Logged out' })
  }
}
