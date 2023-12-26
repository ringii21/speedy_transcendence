import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from '@prisma/client'
import { userInfo } from 'os'

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async findUser(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        friends: true
      },
    })
  }

  async addFriend(userId: number, friendId: number): Promise<User> {
    return await this.prisma.user.update({
      where: {id: userId},
      data: {
        friends : {
          connect: [{id: friendId}]
        }
      },
      include: {
        friends: true
      }
    })
  }

  async allFriends(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        friends: true
      }
    })
  }

  async isNotFriend(userId: number, friendId: number): Promise<User> {
    const user = await this.findUser(userId)
    if (user) {
      const friendExist = user.friends.some((friend) => friend.id === friendId)
      if (!friendExist) {
        return this.addFriend(userId, friendId)
      }
      return user
    }
    throw new NotFoundException(`User ${userId} is not found`)
  }

  async deleteFriend(userId: number, friendId: number): Promise<User> {
    return await this.prisma.user.update({
      where: {id: userId},
      data: {
        friends : {
          disconnect: [{id: friendId}]
        }
      },
      include: {
        friends: false
      }
    })
  }
}
