import { Logger, UseGuards, ValidationPipe } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { MessageService } from '../message/message.service'
import { ChannelService } from '.././channel/channel.service'
import { MessageDto } from './dto/message.dto'
import { Server } from 'socket.io'
import { ChatSocketEvent } from './types/ChatEvent'
import { UserIsNotBanFromChannelGuard } from './guard/user-ban-from-channel.guard'
import JwtTwoFaGuard from 'src/auth/jwt/jwt-2fa.guard'
import { User } from '@prisma/client'

type SocketWithUser = Socket & { handshake: { user: User } }

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.FRONT_URL ?? 'http://localhost:3001',
    credentials: true,
  },
})
@UseGuards(JwtTwoFaGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChatGateway')

  @WebSocketServer() socket: Server

  constructor(
    private readonly messageService: MessageService,
    private readonly channelService: ChannelService,
  ) {}

  @SubscribeMessage(ChatSocketEvent.MESSAGE)
  @UseGuards(JwtTwoFaGuard)
  async handleMessage(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody(new ValidationPipe()) messageDto: MessageDto,
  ) {
    if (!socket.handshake.user) {
      socket.disconnect()
      return
    }
    const msg = await this.messageService.saveChannelMessage(
      socket.handshake.user.id,
      messageDto.channelId,
      messageDto.content,
    )
    if (!msg) return
    socket.to(messageDto.channelId).emit(ChatSocketEvent.MESSAGE, msg)
    this.logger.log(`Client sent message: ${socket.id}`)
  }

  emitUserJoinChannel(channelId: string, userId: number) {
    this.socket.to(channelId).emit(ChatSocketEvent.JOIN_CHANNEL, {
      channelId,
      userId,
    })
  }

  emitUserLeaveChannel(channelId: string, userId: number) {
    this.socket.to(channelId).emit(ChatSocketEvent.LEAVE_CHANNEL, {
      channelId,
      userId,
    })
  }

  async handleConnection(socket: SocketWithUser) {
    const usersChannels = await this.channelService.getMyChannels(
      socket.handshake.user.id,
      {},
    )
    socket.join(usersChannels.map((channel) => channel.id.toString()))
    usersChannels.forEach((channel) =>
      socket.emit(ChatSocketEvent.CONNECTED, {
        channelId: channel.id,
        userId: socket.handshake.user.id,
      }),
    )
    socket.emit(ChatSocketEvent.CONNECTED, { userId: socket.handshake.user.id })
  }

  async handleDisconnect(socket: SocketWithUser) {
    const user = {} as any
    if (!user) return
    const usersChannels = await this.channelService.getMyChannels(
      socket.handshake.user.id,
      {},
    )

    usersChannels.forEach((channel) => {
      const channelId = channel.id.toString()
      socket.to(channelId).emit(ChatSocketEvent.DISCONNECTED, {
        channelId,
        userId: socket.handshake.user.id,
      })
      socket.leave(channelId)
    })
    this.logger.log(`Client disconnected: ${socket.id}`)
  }
}
