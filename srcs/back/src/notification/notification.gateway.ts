import { Logger, UseGuards } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { FriendsService } from '../friends/friends.service'
import { UsersService } from 'src/users/users.service'
import { NotificationService } from '../notification/notification.service'
import { parse } from 'cookie'
import { NotificationDto } from './dto/notification.dto'
import { WsException } from '@nestjs/websockets'
import { PrismaService } from 'src/prisma/prisma.service'
import JwtTwoFaGuard from '../auth/jwt/jwt-2fa.guard'
import { AuthService } from '../auth/auth.service'
import { OnEvent } from '@nestjs/event-emitter'
import { FriendRequestEvent } from './events/notification.event'
import {
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets'
enum NotificationSocketEvent {
  RECEIVED = 'notification_received',
  DELETED = 'notification_deleted',
  ERROR = 'notification_error',
}

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
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly friendService: FriendsService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  @OnEvent(FriendRequestEvent.name)
  async sentFriendRequest({ friendOfId }: FriendRequestEvent) {
    console.log('Im here')
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
  // async updateNotification(userId: number, state: boolean) {
  //   return this.prisma.friends.updateMany({
  //     where: {
  //       OR: [
  //         {
  //           friendId: userId,
  //         },
  //         {
  //           friendOfId: userId,
  //         },
  //       ],
  //     },
  //     data: {
  //       confirmed: state,
  //     },
  //     include: {
  //       friend: true,
  //       friendOf: true,
  //     },
  //   })
  // }
  // async handleDisconnect(socket: Socket) {
  //   const user = await this.getNotification(socket)
  //   if (!user) return
  //   const friendRequest = await this.friendsService.getMyFriends(user.id)
  //   await Promise.all(
  //     friendRequest.map((friends) =>
  //       socket
  //         .to(friends.friend.id.toString())
  //         .emit(FriendSocketEvent.DECLINED, {
  //           username: user.username,
  //           image: user.image,
  //         }),
  //     ),
  //   )
  //   this.logger.log(`Client declined a friend request: ${socket.id}`)
  // }
}
