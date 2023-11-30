import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { extractJwtFromCookie } from './utils/jwt-extrator'
import { JwtPayload } from './jwt-auth.strategy'
import { UsersService } from 'src/users/users.service'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.find({ id: payload.sub })
    if (!user) return null
    if (!user.twoFaEnabled) return user
    if (!payload.otp) throw new WsException({ code: '2FA_REQUIRED' })
    return user
  }
}
