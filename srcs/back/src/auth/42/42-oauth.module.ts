import { Module } from '@nestjs/common'
import { FortyTwoOAuthController } from './42-oauth.controller'
import { UsersModule } from 'src/users/users.module'
import { HttpModule } from '@nestjs/axios'
import { FortyTwoOAuthStrategy } from './42-oauth.strategy'
import { JwtAuthModule } from '../jwt/jwt-auth.module'

@Module({
  imports: [UsersModule, HttpModule, JwtAuthModule],
  controllers: [FortyTwoOAuthController],
  providers: [FortyTwoOAuthStrategy],
})
export class FortyTwoOAuthModule {}
