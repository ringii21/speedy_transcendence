import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common'

import { ChannelService } from 'src/channel/channel.service'
import { RequestWithDbUser } from 'src/types/Request'

@Injectable()
export class UserIsNotBanFromChannelGuard implements CanActivate {
  logger = new Logger('UserIsNotBanFromChannelGuard')

  constructor(private readonly channelService: ChannelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    switch (context.getType()) {
      case 'ws':
        return this.canActivateWs(context)
      case 'http':
        return this.canActivateHttp(context)
      default:
        return false
    }
  }

  async canActivateWs(context: ExecutionContext) {
    const request: RequestWithDbUser = context.switchToWs().getClient()

    const isUserIsBan = await this.channelService.checkIfUserIsBan(
      request.body.channelId,
      request.user.id,
    )

    return !isUserIsBan
  }

  async canActivateHttp(context: ExecutionContext) {
    const request: RequestWithDbUser = context.switchToHttp().getRequest()

    const isUserIsBan = await this.channelService.checkIfUserIsBan(
      request.body.channelId,
      request.user.id,
    )

    return !isUserIsBan
  }
}
