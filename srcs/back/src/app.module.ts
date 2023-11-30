import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { LoggerMiddleware } from './logger/logger.middleware'
import { AuthController } from './auth/auth.controller'
import { FortyTwoOAuthController } from './auth/42/42-oauth.controller'
import { UsersController } from './users/users.controller'
import { TwoFaController } from './auth/2fa/2fa.controller'
import { ChatModule } from './chat/chat.module'
import { ChatController } from './chat/chat.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    ChatModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController)
    consumer.apply(LoggerMiddleware).forRoutes(FortyTwoOAuthController)
    consumer.apply(LoggerMiddleware).forRoutes(TwoFaController)
    consumer.apply(LoggerMiddleware).forRoutes(UsersController)
    consumer.apply(LoggerMiddleware).forRoutes(ChatController)
  }
}
