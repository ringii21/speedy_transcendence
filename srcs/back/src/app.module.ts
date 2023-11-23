import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { OAuth2Module } from './oauth2/oauth2.module'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [ConfigModule.forRoot(), OAuth2Module, UsersModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
