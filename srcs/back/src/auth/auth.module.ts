import { Logger, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { FortyTwoStrategy } from './42.strategy'
import { JwtModule } from '@nestjs/jwt'

@Module({
  providers: [AuthService, Logger, FortyTwoStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    HttpModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'test',
      signOptions: { expiresIn: '60s' },
    }),
  ],
})
export class AuthModule {}
