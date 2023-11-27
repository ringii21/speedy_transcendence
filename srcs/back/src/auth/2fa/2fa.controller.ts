import {
  Controller,
  Post,
  Res,
  UseGuards,
  Req,
  Body,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { TwoFaAuthService } from './2fa.service'
import { JwtAuthGuard } from '../jwt/jwt-auth.guard'
import { TwoFaAuthCodeDto } from './dto/2fa.dto'
import { UsersService } from 'src/users/users.service'
import { JwtAuthService } from '../jwt/jwt-auth.service'
import { User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

type RequestWithUser = Request & { user: User }

@Controller('2fa')
export class TwoFaController {
  constructor(
    private readonly twoFaAuthService: TwoFaAuthService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } = await this.twoFaAuthService.generate2faSecret({
      id: request.user.id,
      email: request.user.email,
    })

    return this.twoFaAuthService.pipeQrCodeStream(response, otpauthUrl)
  }

  @Post('enable')
  @UseGuards(JwtAuthGuard)
  async enable2fa(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() { code }: TwoFaAuthCodeDto,
  ) {
    const isValid = await this.twoFaAuthService.is2FaCodeValid(req.user, code)
    if (!isValid) throw new UnauthorizedException('Invalid 2FA code')
    await this.userService.enable2fa(req.user)
    const jwt = await this.jwtAuthService.login(req.user, true)
    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.json({ message: '2FA enabled' })
  }

  @Post('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() { code }: TwoFaAuthCodeDto,
  ) {
    const isValid = await this.twoFaAuthService.is2FaCodeValid(req.user, code)
    if (!isValid) throw new UnauthorizedException('Invalid 2FA code')

    const jwt = await this.jwtAuthService.login(req.user, true)
    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.status(200).json({ message: '2FA passed' })
  }

  // add route to disable 2fa
  // add route to check if 2fa is enabled for user
}
