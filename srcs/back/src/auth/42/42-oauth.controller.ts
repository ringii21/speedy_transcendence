import {
  Controller,
  Get,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { FortyTwoOAuthGuard } from './42-oauth.guard'
import { JwtAuthService } from 'src/auth/jwt/jwt-auth.service'
import { UnauthorizedExceptionFilter } from './42-oauth.exceptionfilter'
import { ConfigService } from '@nestjs/config'

@Controller('auth/42')
export class FortyTwoOAuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly configService: ConfigService,
  ) {}
  @UseGuards(FortyTwoOAuthGuard)
  @Get()
  async auth() {}

  @UseGuards(FortyTwoOAuthGuard)
  @UseFilters(UnauthorizedExceptionFilter)
  @Get('callback')
  async callback(@Req() req: any, @Res() res: Response) {
    const jwt = await this.jwtAuthService.login(req.user)
    res.cookie('jwt', jwt, {
      httpOnly: true,
      sameSite: 'strict',
    })
    res.redirect(this.configService.getOrThrow<string>('FRONT_URL'))
  }
}
