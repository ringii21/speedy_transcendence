import { Logger, UseGuards, ValidationPipe } from '@nestjs/common'
import { WsAuthGuard } from '../auth/ws-auth.guard'
import { FriendsRequestDto } from './dto/friend-request.dto'
import { Socket } from 'socket.io'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { FriendsService } from './friends.service'
import { UsersService } from 'src/users/users.service'
import { parse } from 'cookie'
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
  ) {}
  @SubscribeMessage(FriendSocketEvent.NOTIFICATION)
  @UseGuards(WsAuthGuard)
  async handleNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) friendDto: FriendsRequestDto,
  ) {
    const user = await this.getUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    const friends = await this.friendsService.getNonConfirmedFriends(user.id)
    if (!friends) return
    socket
      .to(friendDto.friendOfId.toString())
      .emit(FriendSocketEvent.NOTIFICATION, friends)
    this.logger.log(`Client sent a friend request: ${socket.id}`)
  }

  async handleConnection(socket: Socket) {
    const user = await this.getUser(socket)
    if (!user) {
      socket.disconnect()
      return
    }
    const friendRequest = await this.friendsService.getMyFriends(user.id)
    socket.join(friendRequest.map((friends) => friends.friend.id.toString()))
    socket
      .to(friendRequest.map((friends) => friends.friend.id.toString()))
      .emit(FriendSocketEvent.ACCEPTED, {
        username: user.username,
        image: user.image,
      })
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.getUser(socket)
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
