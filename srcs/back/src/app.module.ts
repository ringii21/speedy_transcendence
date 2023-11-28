import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { LoggerMiddleware } from './logger/logger.middleware'
import { AuthController } from './auth/auth.controller'
import { FortyTwoOAuthController } from './auth/42/42-oauth.controller'
import { UsersController } from './users/users.controller'
import { TwoFaController } from './auth/2fa/2fa.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AppController)
    consumer.apply(LoggerMiddleware).forRoutes(AuthController)
    consumer.apply(LoggerMiddleware).forRoutes(FortyTwoOAuthController)
    consumer.apply(LoggerMiddleware).forRoutes(TwoFaController)
    consumer.apply(LoggerMiddleware).forRoutes(UsersController)
  }
}
