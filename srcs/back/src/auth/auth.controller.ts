import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('42'))
  @Get('42')
  async auth() {}

  @UseGuards(AuthGuard('42'))
  @Get('42/callback')
  async callback(@Req() req: any, @Res() res: Response) {
    try {
      console.log(req.user)
      const jwt = await this.authService.login(req.user)
      res.cookie('jwt', jwt, {
        httpOnly: true,
        sameSite: 'strict',
      })
      res.redirect('http://localhost:3001')
    } catch (error) {
      console.error(error)
    }
  }
}
