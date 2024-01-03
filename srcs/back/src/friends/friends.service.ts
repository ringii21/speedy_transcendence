import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { User, Friends } from '@prisma/client'
import { userInfo } from 'os'
import { IsNumber } from 'class-validator';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

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
