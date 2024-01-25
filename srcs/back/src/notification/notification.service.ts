import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, Friends } from '@prisma/client'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async find(
    friendsWhereUniqueInput: Prisma.FriendsWhereUniqueInput,
  ): Promise<Friends | null> {
    return this.prisma.friends.findUnique({
      where: friendsWhereUniqueInput,
    })
  }

  async createNotification(friendId: number, friendOfId: number) {
    return this.prisma.friends.create({
      data: {
        friendId,
        friendOfId,
        confirmed: false,
      },
    })
  }

  async getNonConfirmedFriends(userId: number) {
    return this.prisma.friends.findMany({
      where: {
        OR: [
          {
            friendId: userId,
          },
          {
            friendOfId: userId,
          },
        ],
        confirmed: false,
      },
      include: {
        friend: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        friendOf: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
      },
    })
  }

  async deleteRequest(friendId: number, friendOfId: number) {
    const sender = await this.prisma.friends.deleteMany({
      where: {
        OR: [
          {
            friendId: friendOfId,
            friendOfId: friendId,
          },
          {
            friendId: friendId,
            friendOfId: friendOfId,
          },
        ],
        confirmed: false,
      },
    })
    return sender.count > 0
  }

  async waitForClientConfirmation(userId: number, state: boolean) {
    return this.prisma.friends.updateMany({
      where: {
        AND: [
          {
            friendId: userId,
          },
          {
            friendOfId: userId,
          },
        ],
      },
      data: {
        confirmed: state,
      },
    })
  }

  async getConfirmedFriends(userId: number) {
    return this.prisma.friends.findMany({
      where: {
        AND: [
          {
            friendId: userId,
          },
          {
            friendOfId: userId,
          },
        ],
        confirmed: true,
      },
      include: {
        friend: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        friendOf: {
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
