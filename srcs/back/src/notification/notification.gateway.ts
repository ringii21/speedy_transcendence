import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { AuthService } from '../auth/auth.service'
import { OnEvent } from '@nestjs/event-emitter'
import {
  FriendRequestEvent,
} from './events/notification.event'
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: process.env.FRONT_URL ?? 'http://localhost:3001',
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger('NotificationGateway')

  @WebSocketServer() socket: Server
  userSockets = new Map<number, Socket>()
  socketUsers = new Map<string, number>()

  constructor(
    private readonly authService: AuthService,
  ) {}

  @OnEvent(FriendRequestEvent.name)
  async sentFriendRequest({ friendOfId }: FriendRequestEvent) {
    this.getSocketByUserId(friendOfId)?.emit('refresh')
  }

  async handleConnection(socket: Socket) {
    const user = await this.authService.getSocketUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    this.addSocketToUser(user.id, socket)
    this.logger.log(`Client connected: ${socket.id}`)
    console.log('Connection: ', this.socketUsers)
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.authService.getSocketUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    this.removeSocketFromUser(user.id, socket.id)
    this.logger.log(`Client disconnected: ${socket.id}`)
  }

  getSocketByUserId(userId: number) {
    return this.userSockets.get(userId)
  }

  private addSocketToUser(userId: number, socket: Socket) {
    this.userSockets.set(userId, socket)
    this.socketUsers.set(socket.id, userId)
  }

  private removeSocketFromUser(userId: number, socketId: string) {
    this.userSockets.delete(userId)
    this.socketUsers.delete(socketId)
  }
}
