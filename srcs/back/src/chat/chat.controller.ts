import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
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
import { CreatePmDto } from './dto/create-pm.dto'
import { UserActionDto } from './dto/user-action.dto'
import { UserIsNotBanFromChannelGuard } from './guard/user-ban-from-channel.guard'
import { ChatGateway } from './chat.gateway'

@Controller('chat')
@UseGuards(JwtTwoFaGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('/channels')
  async getNotJoinedChannels(@Req() req: RequestWithDbUser) {
    const channels = await this.channelService.getNotJoinedVisibleChannels(
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
  async getChannel(@Param('id', ParseUUIDPipe) id: string) {
    const channel = await this.channelService.getChannel(id, {
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
      type: createChannel.type,
      userId: req.user.id,
      password: createChannel.password,
    })
    return new ChannelEntity(channel)
  }

  @Post('/pms')
  async createPms(
    @Req() req: RequestWithDbUser,
    @Body() createPm: CreatePmDto,
  ) {
    const channel = await this.channelService.createPm({
      userId: req.user.id,
      targetId: createPm.targetId,
    })
    if (!channel) throw new BadRequestException('Invalid target ID')
    return new ChannelEntity(channel)
  }

  @Post('/channels/:id/join')
  @UseGuards(UserIsNotBanFromChannelGuard)
  async joinChannel(
    @Req() req: RequestWithDbUser,
    @Param('id', ParseUUIDPipe) channelId: string,
    @Body('password') password?: string,
  ) {
    const channel = await this.channelService.joinChannel(
      req.user.id,
      channelId,
      password,
    )
    this.chatGateway.emitUserJoinChannel(channelId, req.user.id)
    return new ChannelEntity(channel)
  }

  @Post('/channels/:id/leave')
  async leaveChannel(
    @Req() req: RequestWithDbUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.channelService.leaveChannel(req.user.id, id)
    this.chatGateway.emitUserLeaveChannel(id, req.user.id)
  }

  @Post('/channels/:id/kick')
  async kickUserFromChannel(
    @Param('id', ParseUUIDPipe) channelId: string,
    @Body() body: UserActionDto,
  ) {
    await this.channelService.leaveChannel(body.userId, channelId)
    this.chatGateway.emitUserLeaveChannel(channelId, body.userId)
  }

  @Post('/channels/:id/ban')
  async banUserFromChannel(
    @Param('id', ParseUUIDPipe) channelId: string,
    @Body() body: UserActionDto,
  ) {
    await this.channelService.applyBanAction(channelId, body.userId)
    await this.channelService.leaveChannel(body.userId, channelId)
    this.chatGateway.emitUserLeaveChannel(channelId, body.userId)
  }

  @Post('/channels/:id/mute')
  async muteUserFromChannel(
    @Param('id', ParseUUIDPipe) channelId: string,
    @Body() body: UserActionDto,
  ) {
    const until = new Date()
    until.setMinutes(until.getMinutes() + 5)
    await this.channelService.applyBanAction(channelId, body.userId, until)
  }
}
