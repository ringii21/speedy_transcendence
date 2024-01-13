import { Logger, Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { LoggerModule } from 'nestjs-pino'
import { EventEmitterModule } from '@nestjs/event-emitter'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      },
    }),
    UsersModule,
    AuthModule,
    ChatModule,
  ],
  providers: [Logger],
})
export class AppModule {
  constructor(configService: ConfigService) {
    const envs = [
      'DATABASE_URL',
      'CLIENT_ID',
      'CLIENT_SECRET',
      'FRONT_URL',
      'CALLBACK_URL',
      'AUTHORIZE_URL',
      'TOKEN_URL',
      'BASE_URL',
      'JWT_SECRET',
      '2FA_APP_NAME',
      'BACKEND_URL',
    ]
    envs.forEach((env) => configService.getOrThrow(env))
  }
}
