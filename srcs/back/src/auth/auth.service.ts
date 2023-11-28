import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { UsersService } from 'src/users/users.service'
import { IMe } from './42/42-oauth.types'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async getUser(user: IMe | User, accessToken: string, refreshToken: string) {
    if ('id' in user) return this.userService.find({ id: user.id })
    return this.userService.findOrCreate(
      { email: user.email },
      {
        email: user.email,
        username: user.login,
        image: user.image.link,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    )
  }
}
