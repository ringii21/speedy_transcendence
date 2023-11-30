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
import { ChannelService } from 'src/channel/channel.service'
import { MessageDto } from './dto/message.dto'

/**
 * sync with front/src/types/Events.ts
 */
enum ChatSocketEvent {
  SEND_MESSAGE = 'message',
  JOIN_CHANNEL = 'join_channel',
  LEAVE_CHANNEL = 'leave_channel',
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

  async handleConnection(socket: Socket) {
    const user = await this.getUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    const usersChannels = await this.channelService.getMyChannels(user.id, {})
    socket.join(usersChannels.map((channel) => channel.id.toString()))
    socket
      .to(usersChannels.map((channel) => channel.id.toString()))
      .emit(ChatSocketEvent.JOIN_CHANNEL, {
        username: user.username,
      })
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.getUser(socket)
    if (!user) return
    const usersChannels = await this.channelService.getMyChannels(user.id, {})
    await Promise.all(
      usersChannels.map((channel) =>
        socket.to(channel.id.toString()).emit(ChatSocketEvent.LEAVE_CHANNEL, {
          username: user.username,
        }),
      ),
    )
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
