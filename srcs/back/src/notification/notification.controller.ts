import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { NotificationService } from './notification.service'
import { RequestWithDbUser } from 'src/types/Request'
import { NotificationEntity } from './entity/notification.entity'
import { NotificationDto } from './dto/notification.dto'
import { FriendsService } from 'src/friends/friends.service'
import { DeleteNotificationDto } from './dto/deleteNotification.dto'
import { RequestWithDbNotification } from '../types/Request'
import {
  Body,
  Controller,
  Req,
  Get,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common'

@Controller('notification')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NotificationController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  async sendNotification(
    @Req() req: RequestWithDbUser,
    @Body() notificationDto: NotificationDto,
  ) {
    if (req.user.id === notificationDto.receivedId)
      throw new BadRequestException(
        'You cannot send a notification to yourself',
      )
    if (
      await this.friendsService.findFriend(
        req.user.id,
        notificationDto.receivedId,
      )
    )
      throw new BadRequestException('Already sent a friend request')
    return this.notificationService.createNotification(
      req.user.id,
      notificationDto.receivedId,
    )
  }

  @Get()
  async getNotification(@Req() req: RequestWithDbUser) {
    try {
      const notifications =
        await this.notificationService.getNonConfirmedFriends(req.user.id)
      const mappedNotification = notifications.map(
        (notification) => new NotificationEntity(notification),
      )
      return mappedNotification
    } catch (e) {
      console.error('Error in getNotification: ', e)
      throw e
    }
  }

  @Delete()
  async deleteNotification(
    @Req() req: RequestWithDbNotification,
    @Body() notificationDto: DeleteNotificationDto,
  ) {
    try {
      return this.notificationService.deleteRequest(
        req.user.receivedId,
        notificationDto.receivedId,
      )
    } catch (e) {
      console.error('Error deleting notification: ', e)
      throw e
    }
  }
}
