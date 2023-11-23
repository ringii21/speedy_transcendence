import { Logger, Module } from '@nestjs/common'
import { OAuth2Controller } from './oauth2.controller'
import { OAuth2Service } from './oauth2.service'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'

@Module({
  controllers: [OAuth2Controller],
  providers: [OAuth2Service, Logger],
  imports: [HttpModule, ConfigModule],
  exports: [OAuth2Service],
})
export class OAuth2Module {}
