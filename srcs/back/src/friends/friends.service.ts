import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { User, Friends, Prisma } from '@prisma/client'
import { userInfo } from 'os'
import { IsNumber } from 'class-validator';
import { FriendEntity } from "./entity/friends.entity";

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async findFriend(
    userId: number,
  ) {
    return this.prisma.friends.findUnique({
      where: {
        id: userId,
      },
    })
  }
  
  async create(data: Prisma.FriendsCreateInput): Promise<Friends> {
    return this.prisma.friends.create({
      data,
    })
  }

  async addFriends(
    userId: number,
    id: number,
    ) {
    const friend = await this.findFriend(userId)
    console.log('Friend service: ', friend)
    return friend
  }
    
  async delete(where: Prisma.FriendsWhereUniqueInput): Promise<boolean> {
    const friend = await this.prisma.friends.delete({
      where,
    })
    return !!friend
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
