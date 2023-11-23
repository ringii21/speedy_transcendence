import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { SignInDto } from './dto/signin.dto'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom, map } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { IMe } from './auth.types'
import { AxiosError } from 'axios'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: Logger = new Logger(AuthService.name),
  ) {}

  async signin(signInDto: SignInDto) {
    const { access_token } = signInDto
    const baseUrl = this.configService.getOrThrow('BASE_URL')
    const url = new URL(baseUrl)
    url.pathname = '/v2/me'
    const { email, image, login } = await firstValueFrom(
      this.httpService
        .get<IMe>(url.toString(), {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .pipe(
          map((res) => res.data),
          catchError((err: AxiosError) => {
            this.logger.error(JSON.stringify(err.response?.data))
            const errorResponse = {
              status: err.response?.status,
              message: err.message,
            }
            throw new HttpException(errorResponse, HttpStatus.UNAUTHORIZED)
          }),
        ),
    )
    const userExists = await this.usersService.user({ email })
    if (!userExists) {
      const newUser = await this.usersService.create({
        email,
        image: image.link,
        username: login,
      })
      return { user: newUser, access_token: access_token }
    }

    return { user: userExists, access_token: access_token }
  }

  async signout() {
    throw new Error('Not implemented')
  }
}
