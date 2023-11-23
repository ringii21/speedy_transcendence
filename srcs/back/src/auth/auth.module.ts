import { Logger, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [AuthService, Logger],
  controllers: [AuthController],
  imports: [UsersModule, HttpModule, ConfigModule],
})
export class AuthModule {}
