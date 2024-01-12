import { Logger, UseGuards, ValidationPipe } from '@nestjs/common'
import { WsAuthGuard } from '../auth/ws-auth.guard'
import { FriendsRequestDto } from './dto/friend-request.dto'
import { Socket } from 'socket.io'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { FriendsService } from './friends.service'
import { UsersService } from 'src/users/users.service'
import { parse } from 'cookie'
import { NotificationService } from '../notification/notification.service'
// import { Prisma, Notification } from '@prisma/client'
import {
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets'

enum FriendSocketEvent {
  NOTIFICATION = 'notification',
  ACCEPTED = 'request_accepted',
  DECLINED = 'request_declined',
}

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: process.env.FRONT_URL ?? 'http://localhost:3001',
    credentials: true,
  },
})
export class FriendGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('FriendGateway')
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly notificationService: NotificationService,
  ) {}
  @SubscribeMessage(FriendSocketEvent.NOTIFICATION)
  @UseGuards(WsAuthGuard)
  async handleNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) friendDto: FriendsRequestDto,
  ) {
    const user = await this.getNotification(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    const friends = await this.notificationService.getNonConfirmedFriends(
      user.receivedId,
    )
    if (!friends) return
    socket
      .to(friendDto.friendOfId.toString())
      .emit(FriendSocketEvent.NOTIFICATION, friends)
    this.logger.log(`Client sent a friend request: ${socket.id}`)
  }

  async handleConnection(socket: Socket) {
    const user = await this.getNotification(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    const friendRequest = await this.notificationService.getNonConfirmedFriends(
      user.receivedId,
    )
    socket.join(friendRequest.map((friends) => friends.sender.id.toString()))
    socket
      .to(friendRequest.map((friends) => friends.sender.id.toString()))
      .emit(FriendSocketEvent.ACCEPTED, {
        id: user.receivedId,
      })
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.getNotification(socket)
    if (!user) return
    const friendRequest = await this.friendsService.getMyFriends(user.id)
    await Promise.all(
      friendRequest.map((friends) =>
        socket
          .to(friends.friend.id.toString())
          .emit(FriendSocketEvent.DECLINED, {
            username: user.username,
            image: user.image,
          }),
      ),
    )
    this.logger.log(`Client declined a friend request: ${socket.id}`)
  }

  async getNotification(socket: Socket) {
    const jwtCookie = socket.handshake.headers.cookie
    if (!jwtCookie) return null
    const parsed = parse(jwtCookie)
    if (!parsed.jwt) return null
    try {
      const jwt = await this.jwtAuthService.verify(parsed.jwt)
      if (!jwt || !jwt.sub) return null
      const user = await this.notificationService.find({ senderId: jwt.sub })
      if (!user) return null
      return user
    } catch (e) {
      throw new WsException('Invalid token')
    }
  }
}
