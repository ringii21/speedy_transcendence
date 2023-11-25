import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-auth.strategy'
import { UsersService } from 'src/users/users.service'
import { IMe } from '../42/42-oauth.types'

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login({
    user,
    accessToken,
    refreshToken,
  }: {
    user: IMe
    accessToken: string
    refreshToken: string
  }) {
    const dbuser = await this.userService.findOrCreate(
      { email: user.email },
      {
        email: user.email,
        username: user.login,
        image: user.image.link,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    )
    const payload: JwtPayload = {
      sub: dbuser.id,
    }
    return this.jwtService.signAsync(payload)
  }
}
