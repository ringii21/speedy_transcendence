import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { UserEntity } from 'src/users/entity/user.entity'
import JwtTwoFaGuard from './jwt/jwt-2fa.guard'

type RequestWithUser = Request & { user: User }

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  async auth(@Res() res: Response) {
    return res.redirect('/auth/42')
  }

  @Get('login')
  @UseGuards(JwtTwoFaGuard)
  async login(@Req() req: RequestWithUser) {
    console.log(req.user)
    return new UserEntity(req.user)
  }

  @Get('logout')
  @UseGuards(JwtTwoFaGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('jwt')
    res.json({ message: 'Logged out' })
  }
}
