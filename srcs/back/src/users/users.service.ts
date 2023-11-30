import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, User } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async find(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async findMany(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<boolean> {
    const user = await this.prisma.user.delete({
      where,
    })
    return !!user
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return this.prisma.user.update({
      where,
      data,
    })
  }

  async findOrCreate(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    data: Prisma.UserCreateInput,
  ): Promise<User> {
    const user = await this.find(userWhereUniqueInput)
    if (user) return user
    return this.create(data)
  }

  async is2faEnabled(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    const user = await this.find(userWhereUniqueInput)
    if (!user) return false
    return user.twoFaEnabled
  }

  async enable2fa(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.update({
      where: userWhereUniqueInput,
      data: { twoFaEnabled: true },
    })
  }
}
