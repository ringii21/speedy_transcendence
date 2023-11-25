import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtAuthModule } from './jwt/jwt-auth.module'
import { AuthController } from './auth.controller'
import { FortyTwoOAuthModule } from './42/42-oauth.module'

@Module({
  controllers: [AuthController],
  imports: [UsersModule, PassportModule, JwtAuthModule, FortyTwoOAuthModule],
})
export class AuthModule {}
