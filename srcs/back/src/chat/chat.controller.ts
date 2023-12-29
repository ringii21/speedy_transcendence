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

@Controller('chat')
@UseGuards(JwtTwoFaGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(private readonly channelService: ChannelService) {}

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
  async getChannel(
    @Req() req: RequestWithDbUser,
    @Param('id', ParseUUIDPipe) id: string,
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
  async joinChannel(
    @Req() req: RequestWithDbUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('password') password?: string,
  ) {
    await this.channelService.joinChannel(req.user.id, id, password)
    return { success: true }
  }

  @Post('/channels/:id/leave')
  async leaveChannel(
    @Req() req: RequestWithDbUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.channelService.leaveChannel(req.user.id, id)
    return { success: true }
  }
}
