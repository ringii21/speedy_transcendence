import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import JwtTwoFaGuard from '../auth/jwt/jwt-2fa.guard'
import { RequestWithDbUser } from 'src/types/Request'
import { ChannelService } from 'src/channel/channel.service'
import { ChannelEntity } from 'src/channel/entity/channel.entity'
import { CreateChannelDto } from './dto/create-channel.dto'

@Controller('chat')
@UseGuards(JwtTwoFaGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('/channels')
  async getNotJoinedChannels(@Req() req: RequestWithDbUser) {
    const channels = await this.channelService.getNotJoinedPublicChannels(
      req.user.id,
    )
    if (!channels) return []
    return channels.map((channel) => new ChannelEntity(channel))
  }

  @Get('/channels/mine')
  async getChannels(@Req() req: RequestWithDbUser) {
    const channels = await this.channelService.getMyChannels(req.user.id, {
      withMembers: true,
    })
    return channels.map((channel) => new ChannelEntity(channel))
  }

  @Get('/channels/:id')
  async getChannel(
    @Req() req: RequestWithDbUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!(await this.channelService.isUserInChannel(req.user.id, id)))
      throw new BadRequestException('You are not in this channel')
    const channel = await this.channelService.getChannel(id, req.user.id, {
      withMembers: true,
      withMessages: true,
      withActions: true,
    })
    if (!channel) throw new NotFoundException('Channel not found')
    return new ChannelEntity(channel)
  }

  @Post('/channels')
  async createChannel(
    @Req() req: RequestWithDbUser,
    @Body() createChannel: CreateChannelDto,
  ) {
    const channel = await this.channelService.createChannel({
      name: createChannel.name,
      channelType: createChannel.channelType,
      userId: req.user.id,
      password: createChannel.password,
    })
    return new ChannelEntity(channel)
  }

  @Post('/channels/:id/join')
  async joinChannel(
    @Req() req: RequestWithDbUser,
    @Param('id', ParseIntPipe) id: number,
    @Body('password') password?: string,
  ) {
    const channel = await this.channelService.joinChannel(
      req.user.id,
      id,
      password,
    )
    return new ChannelEntity(channel)
  }
}
