import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosError } from 'axios'
import { randomBytes } from 'crypto'
import { catchError, firstValueFrom, map } from 'rxjs'
import { URL } from 'url'
import { ExchangeCodeDto } from './dto/exchange-code.dto'
import { OAuth2Token } from './oauth2.types'

@Injectable()
export class OAuth2Service {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: Logger = new Logger(OAuth2Service.name),
  ) {}

  authorize() {
    return { auth_url: this.generateAuthorizeUrl() }
  }

  async exchange({ code, state }: ExchangeCodeDto) {
    const tokenUrl = this.configService.getOrThrow('TOKEN_URL')
    const clientId = this.configService.getOrThrow('CLIENT_ID')
    const clientSecret = this.configService.getOrThrow('CLIENT_SECRET')
    const redirectUri = this.configService.getOrThrow('REDIRECT_URI')
    const url = new URL(tokenUrl)
    url.searchParams.append('client_id', clientId)
    url.searchParams.append('client_secret', clientSecret)
    url.searchParams.append('code', code)
    url.searchParams.append('state', state)
    url.searchParams.append('grant_type', 'authorization_code')
    url.searchParams.append('redirect_uri', redirectUri)

    return firstValueFrom(
      this.httpService.post<OAuth2Token>(url.toString()).pipe(
        map((res) => res.data),
        catchError((err: AxiosError) => {
          this.logger.error(JSON.stringify(err.response?.data))
          const errorResponse = {
            status: err.response?.status,
            message: err.message,
          }
          throw new HttpException(
            errorResponse,
            err.response?.status ?? HttpStatus.BAD_REQUEST,
          )
        }),
      ),
    )
  }

  async refresh() {
    throw new Error('Not implemented')
  }

  private generateAuthorizeUrl() {
    const authUrl = this.configService.getOrThrow('AUTHORIZE_URL')
    const clientId = this.configService.getOrThrow('CLIENT_ID')
    const redirectUri = this.configService.getOrThrow('REDIRECT_URI')
    const state = randomBytes(42).toString('hex')
    const url = new URL(authUrl)
    url.searchParams.append('client_id', clientId)
    url.searchParams.append('redirect_uri', redirectUri)
    url.searchParams.append('response_type', 'code')
    url.searchParams.append('scope', 'public')
    url.searchParams.append('state', state)

    return url.toString()
  }
}
