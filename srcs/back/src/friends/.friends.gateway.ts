import { Logger, UseGuards, ValidationPipe } from '@nestjs/common'
import { FriendsRequestDto } from './dto/friend-request.dto'
import { Socket } from 'socket.io'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { FriendsService } from './friends.service'
import { UsersService } from 'src/users/users.service'
import { parse } from 'cookie'
import { NotificationService } from '../notification/notification.service'
import { User } from '@prisma/client'
import JwtTwoFaGuard from '../../dist/auth/jwt/jwt-2fa.guard'
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
  ACCEPTED = 'request_accepted',
  DECLINED = 'request_declined',
}

type SocketWithUser = Socket & { handshake: { user: User } }

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
  @SubscribeMessage(FriendSocketEvent.ACCEPTED)
  @UseGuards(JwtTwoFaGuard)
  async handleFriend(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody(new ValidationPipe()) friendDto: FriendsRequestDto,
  ) {
    const user = await this.getFriend(socket)
    if (!user) return

    const isFriends = await this.notificationService.getConfirmedFriends(
      user.id,
    )
    socket
      .to(friendDto.friendOfId.toString())
      .emit(FriendSocketEvent.ACCEPTED, isFriends)
      this.logger.log(`Client accepted a friend request: ${socket.id}`)
  }

  @SubscribeMessage(FriendSocketEvent.DECLINED)
  async declineRequest(@ConnectedSocket() socket: SocketWithUser) {
    const user = await this.getFriend(socket)
    if (!user) return
    const friends = await this.notificationService.getNonConfirmedFriends(
      user.id,
    )
    friends.forEach((friend) => {
      socket.to(friendOf.friendOfId).emit(FriendSocketEvent.DECLINED, {
        friendId: user.id,
        friendOfId: friendOf.friendOfId,
      })
      socket.leave(friendOf)
    })
    socket.emit(FriendSocketEvent.DECLINED, { friendId: user.id })
  }
  async declineRequest()

  /**
   * Handles a new connection from a socket.
   * Retrieves the user associated with the socket and performs necessary actions.
   * @param socket The socket object representing the connection.
   * @returns Promise<void>
   */
  async handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`)
  }

  /**
   * Handles the disconnection of a socket.
   * Removes the socket from the user's channels and emits a DISCONNECTED event to the channels the user was connected to.
   * @param socket - The socket that disconnected.
   * @returns Promise<void>
   */
  async handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`)
  }

  async getFriend(socket: SocketWithUser) {
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
