import { Logger, UseGuards, ValidationPipe } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets'
import { WsAuthGuard } from '../auth/ws-auth.guard'
import { Socket } from 'socket.io'
import { parse } from 'cookie'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { UsersService } from '../users/users.service'
import { MessageService } from '../message/message.service'
import { ChannelService } from '.././channel/channel.service'
import { MessageDto } from './dto/message.dto'
import { JoinLeaveChannelDto } from './dto/join-leave-channel.dto'
import { ChannelType } from '@prisma/client'

/**
 * sync with front/src/types/Events.ts
 */
enum ChatSocketEvent {
  SEND_MESSAGE = 'message',
  JOIN_CHANNEL = 'join_channel',
  LEAVE_CHANNEL = 'leave_channel',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.FRONT_URL ?? 'http://localhost:3001',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChatGateway')

  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly messageService: MessageService,
    private readonly channelService: ChannelService,
    private readonly userService: UsersService,
  ) {}

  @SubscribeMessage(ChatSocketEvent.SEND_MESSAGE)
  @UseGuards(WsAuthGuard)
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) messageDto: MessageDto,
  ) {
    const user = await this.getUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    const msg = await this.messageService.saveChannelMessage(
      user.id,
      messageDto.channelId,
      messageDto.content,
    )
    if (!msg) return
    socket
      .to(messageDto.channelId.toString())
      .emit(ChatSocketEvent.SEND_MESSAGE, msg)
    this.logger.log(`Client sent message: ${socket.id}`)
  }

  @SubscribeMessage(ChatSocketEvent.JOIN_CHANNEL)
  @UseGuards(WsAuthGuard)
  async handleJoinChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) joinChannelDto: JoinLeaveChannelDto,
  ) {
    const user = await this.getUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    socket.join(joinChannelDto.channelId.toString())
    socket
      .to(joinChannelDto.channelId.toString())
      .emit(ChatSocketEvent.JOIN_CHANNEL, {
        channelId: joinChannelDto.channelId,
      })
  }

  @SubscribeMessage(ChatSocketEvent.LEAVE_CHANNEL)
  @UseGuards(WsAuthGuard)
  async handleLeaveChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) leaveChannelDto: JoinLeaveChannelDto,
  ) {
    const user = await this.getUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    const channel = await this.channelService.getChannel(
      leaveChannelDto.channelId,
      user.id,
      {},
    )
    if (channel?.type === ChannelType.direct) return
    socket.leave(leaveChannelDto.channelId.toString())
    socket
      .to(leaveChannelDto.channelId.toString())
      .emit(ChatSocketEvent.LEAVE_CHANNEL, {
        channelId: leaveChannelDto.channelId,
      })
  }

  async handleConnection(socket: Socket) {
    const user = await this.getUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    const usersChannels = await this.channelService.getMyChannels(user.id, {})
    socket.join(usersChannels.map((channel) => channel.id.toString()))
    usersChannels.forEach((channel) =>
      socket.emit(ChatSocketEvent.CONNECTED, {
        channelId: channel.id,
        userId: user.id,
      }),
    )
    socket.emit(ChatSocketEvent.CONNECTED, { userId: user.id })
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.getUser(socket)
    if (!user) return
    const usersChannels = await this.channelService.getMyChannels(user.id, {})

    usersChannels.forEach((channel) => {
      const channelId = channel.id.toString()
      socket
        .to(channelId)
        .emit(ChatSocketEvent.DISCONNECTED, { channelId, userId: user.id })
      socket.leave(channelId)
    })
    this.logger.log(`Client disconnected: ${socket.id}`)
  }

  async getUser(socket: Socket) {
    const jwtCookie = socket.handshake.headers.cookie
    if (!jwtCookie) return null
    const parsed = parse(jwtCookie)
    if (!parsed.jwt) return null
    try {
      const jwt = await this.jwtAuthService.verify(parsed.jwt)
      if (!jwt || !jwt.sub) return null
      const user = await this.userService.find({ id: jwt.sub })
      if (!user) return null
      return user
    } catch (e) {
      throw new WsException('Invalid token')
    }
  }
}
