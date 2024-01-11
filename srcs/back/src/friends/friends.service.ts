import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Friends, Prisma } from '@prisma/client'

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async findFriend(friendId: number, friendOfId: number) {
    return this.prisma.friends.findFirst({
      where: {
        friendId,
        friendOfId,
      },
    })
  }

  async getMyFriends(userId: number) {
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

  async create(friendId: number, friendOfId: number) {
    return this.prisma.friends.create({
      data: {
        friendId,
        friendOfId,
        confirmed: false,
      },
    })
  }

  async addFriends(friendId: number, friendOfId: number) {
    await this.prisma.friends.update({
      where: {
        friendId_friendOfId: {
          friendId,
          friendOfId,
        },
      },
      data: {
        confirmed: true,
      },
    })
  }

  //faux
  async delete(friendId: number, friendOfId: number): Promise<boolean> {
    const friend = await this.prisma.friends.delete({
      where: {
        friendId_friendOfId: {
          friendId,
          friendOfId,
        },
      },
    })
    return !!friend
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

  // async findFriendById(id: number) {
  //   const friend = await this.prisma.friends.findUnique({
  //     where: {
  //       id: id,
  //     }
  //   })
  //   if (!friend) throw new NotFoundException('Friend is not found')
  //   return friend
  // }

  async findManyFriends(params: {
    skip?: number
    take?: number
    cursor?: Prisma.FriendsWhereUniqueInput
    where?: Prisma.FriendsWhereInput
    orderBy?: Prisma.FriendsOrderByWithRelationInput
  }): Promise<Friends[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.friends.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }
}
