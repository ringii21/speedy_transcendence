import { Logger, UseGuards, ValidationPipe } from '@nestjs/common'
import { Socket } from 'socket.io'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { FriendsService } from '../friends/friends.service'
import { UsersService } from 'src/users/users.service'
import { NotificationService } from '../notification/notification.service'
import { parse } from 'cookie'
import { NotificationDto } from './dto/notification.dto'
import { WsException } from '@nestjs/websockets'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import JwtTwoFaGuard from '../auth/jwt/jwt-2fa.guard'
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
  @UseGuards(JwtTwoFaGuard)
  async handleNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) notificationDto: NotificationDto,
  ) {
    try {
      const notification = await this.getNotification(socket)
      if (!notification) {
        socket.disconnect()
        return
      }
      const friend = await this.notificationService.getNonConfirmedFriends(
        notification.receivedId,
      )
      if (!friend) return
      console.log('Friend: ', friend)
      socket
        .to(notificationDto.receivedId.toString())
        .emit(NotificationSocketEvent.RECEIVED, friend)

      const confirmationEvent = await this.waitForClientConfirmation(socket)

      if (confirmationEvent) {
        console.log(
          'NotificationGateway - ConfirmationEvent:',
          confirmationEvent,
        )
        await this.getNotification(socket)
      } else {
        console.log(`Didn't receive the client validation`)
      }
      this.logger.log(`Client sent a friend request: ${socket.id}`)
    } catch (e) {
      this.logger.error(`Error handling notification: ${e}`)
      throw new WsException(
        'An error occurred while processing the notification',
      )
    }
  }

  private async waitForClientConfirmation(socket: Socket): Promise<boolean> {
    return new Promise((resolve) => {
      socket.once('clientNotificationConfirmation', (state: boolean) => {
        resolve(state)
      })
    })
  }

  async handleConnection(socket: Socket) {
    const notification = await this.getNotification(socket)
    if (!notification) {
      socket.disconnect()
      return
    }
    const friendNotification = await this.friendService.getMyFriends(
      notification.senderId,
    )
    socket.join(
      friendNotification.map((friend: any) => friend.senderId.toString()),
    )
    socket
      .to(friendNotification.map((friend: any) => friend.receivedId.toString()))
      .emit(NotificationSocketEvent.ACCEPTED, {
        senderId: notification.senderId,
      })
  }

  async handleDisconnect(socket: Socket) {
    const notification = await this.getNotification(socket)
    if (!notification) return
    const friendNotification = await this.friendService.getMyFriends(
      notification.senderId,
    )
    await Promise.all(
      friendNotification.map((friend) =>
        socket
          .to(friend.friendOfId.toString())
          .emit(NotificationSocketEvent.DECLINED, {
            senderId: notification.senderId,
          }),
      ),
    )
    this.logger.log(`Client disconnected: ${socket.id}`)
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
        state: true,
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
