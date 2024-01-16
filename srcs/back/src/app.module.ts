import { Logger, Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { GameModule } from './game/game.module'
import { GameController } from './game/game.controller'
import { LoggerMiddleware } from './logger/logger.middleware'
import { AuthController } from './auth/auth.controller'
import { FortyTwoOAuthController } from './auth/42/42-oauth.controller'
import { UsersController } from './users/users.controller'
import { TwoFaController } from './auth/2fa/2fa.controller'
import { ChatModule } from './chat/chat.module'
import { ChatController } from './chat/chat.controller'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { LoggerModule } from 'nestjs-pino'

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
    GameModule,
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
      'BACKEND_URL',
    ]
    envs.forEach((env) => configService.getOrThrow(env))
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController)
    consumer.apply(LoggerMiddleware).forRoutes(FortyTwoOAuthController)
    consumer.apply(LoggerMiddleware).forRoutes(TwoFaController)
    consumer.apply(LoggerMiddleware).forRoutes(UsersController)
    consumer.apply(LoggerMiddleware).forRoutes(ChatController)
    consumer.apply(LoggerMiddleware).forRoutes(GameController)
  }
}
