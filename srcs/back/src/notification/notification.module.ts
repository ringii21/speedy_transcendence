import { Module } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { NotificationService } from './notification.service'
import { JwtAuthModule } from '../auth/jwt/jwt-auth.module'
import { UsersModule } from 'src/users/users.module'
import { NotificationController } from './notification.controller'
import { FriendsService } from '../friends/friends.service'
import { FriendsModule } from '../friends/friends.module'

@Module({
  providers: [NotificationService, PrismaService, UsersService, FriendsService],
  exports: [NotificationService],
  controllers: [NotificationController],
  imports: [JwtAuthModule, UsersModule, FriendsModule],
})
export class NotificationModule {}
