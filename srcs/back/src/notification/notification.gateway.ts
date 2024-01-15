import { Logger, UseGuards, ValidationPipe } from '@nestjs/common'
import { WsAuthGuard } from '../auth/ws-auth.guard'
import { Socket } from 'socket.io'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { FriendsService } from '../friends/friends.service'
import { UsersService } from 'src/users/users.service'
import { NotificationService } from '../notification/notification.service'
import { parse } from 'cookie'
// import { Prisma, Notification } from '@prisma/client'
import { NotificationDto } from './dto/notification.dto'
import { WsException } from '@nestjs/websockets'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import {
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets'

enum NotificationSocketEvent {
  RECEIVED = 'notification_received',
  ACCEPTED = 'notification_accepted',
  DECLINED = 'notification_declined',
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
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly friendService: FriendsService,
    private readonly prisma: PrismaService,
  ) {}

  @SubscribeMessage(NotificationSocketEvent.RECEIVED)
  @UseGuards(WsAuthGuard)
  async handleNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) notificationDto: NotificationDto,
  ) {
    const notification = await this.getNotification(socket)
    if (!notification) {
      socket.disconnect()
      return
    }
    const friend = await this.notificationService.getNonConfirmedFriends(
      notification.receivedId,
    )
    if (!friend) return
    socket
      .to(notificationDto.receivedId.toString())
      .emit(NotificationSocketEvent.RECEIVED, friend)
    this.logger.log(`Client sent a friend request: ${socket.id}`)
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Logique à exécuter lorsqu'un client se connecte
    console.log(`Client ${client.id} connected`)
  }

  handleDisconnect(client: Socket) {
    // Logique à exécuter lorsqu'un client se déconnecte
    console.log(`Client ${client.id} disconnected`)
  }

  async getNotification(socket: Socket) {
    const jwtCookie = socket.handshake.headers.cookie
    if (!jwtCookie) return null
    const parsed = parse(jwtCookie)
    if (!parsed.jwt) return null
    try {
      const jwt = await this.jwtAuthService.verify(parsed.jwt)
      if (!jwt || !jwt.sub) return null
      const whereUniqueInput: Prisma.NotificationWhereUniqueInput = {
        senderId_receivedId: {
          receivedId: jwt.sub,
          senderId: jwt.sub,
        },
      }
      const notification = await this.notificationService.find(whereUniqueInput)
      if (!notification) return null
      return notification
    } catch (e) {
      throw new WsException('Invalid token')
    }
  }
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

  // async getNotification(socket: Socket) {
  //   const jwtCookie = socket.handshake.headers.cookie
  //   if (!jwtCookie) return null
  //   const parsed = parse(jwtCookie)
  //   if (!parsed.jwt) return null
  //   try {
  //     const jwt = await this.jwtAuthService.verify(parsed.jwt)
  //     if (!jwt || !jwt.sub) return null
  //     const user = await this.notificationService.find({ senderId: jwt.sub })
  //     if (!user) return null
  //     return user
  //   } catch (e) {
  //     throw new WsException('Invalid token')
  //   }
  // }
}
