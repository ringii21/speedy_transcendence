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
    private readonly userService: UsersService,
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
      console.log(`Event received from namespace: ${socket.nsp.name}`)
      const user = await this.getUser(socket)
      if (!user) {
        socket.disconnect()
        return
      }
      const friend = await this.notificationService.getNonConfirmedFriends(
        user.id,
      )
      if (!friend) {
        console.log(`There's not friend here`)
        return
      }
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
    this.logger.log(`Client connected: ${socket.id}`)
  }

  async handleDisconnect(socket: Socket) {
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
