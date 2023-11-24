import { Injectable, Logger } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly logger: Logger = new Logger(AuthService.name),
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string) {
    return this.usersService.user({ email })
  }

  async login(user: { username: string; id: number }) {
    const payload = { username: user.username, sub: user.id }
    return this.jwtService.signAsync(payload)
  }
}
