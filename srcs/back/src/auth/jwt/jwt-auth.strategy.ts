import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UsersService } from 'src/users/users.service'

export type JwtPayload = { sub: number }

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const extractJwtFromCookie = (req: any) => {
      let token = null
      if (req && req.cookies) token = req.cookies['jwt']
      return token
    }
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.find({ id: payload.sub })
    if (!user) return null
    return user
  }
}
