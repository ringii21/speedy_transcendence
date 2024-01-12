import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, Notification } from '@prisma/client'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async find(
    notificationWhereUniqueInput: Prisma.NotificationWhereUniqueInput,
  ): Promise<Notification | null> {
    return this.prisma.notification.findUnique({
      where: notificationWhereUniqueInput,
    })
  }

  async createNotification(senderId: number, receivedId: number) {
    return this.prisma.notification.create({
      data: {
        senderId,
        receivedId,
      },
    })
  }

  async getNonConfirmedFriends(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            receivedId: userId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        received: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
      },
    })
  }
}
