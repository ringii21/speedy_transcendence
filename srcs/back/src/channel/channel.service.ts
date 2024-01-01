import { BadRequestException, Injectable } from '@nestjs/common'
import { ChannelType, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { createHmac, randomBytes } from 'crypto'

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Retrieves the channels associated with a given user.
   * @param userId - The ID of the user.
   * @param options - Additional options for retrieving channel data.
   * @param options.withMembers - Set to true to include member data in the result.
   * @param options.withMessages - Set to true to include message data in the result.
   * @param options.withActions - Set to true to include action data in the result.
   * @returns A promise that resolves to an array of channels.
   */
  async getMyChannels(
    userId: number,
    { withMembers = false, withMessages = false, withActions = false },
  ) {
    return this.prismaService.channel.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        messages: withMessages,
        members: {
          include: {
            user: withMembers && {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        },
        actions: withActions,
      },
    })
  }

  /**
   * Checks if a user is a member of a channel.
   * @param userId - The ID of the user.
   * @param channelId - The ID of the channel.
   * @returns A boolean indicating whether the user is a member of the channel.
   */
  async isUserInChannel(userId: number, channelId: number) {
    const channelMember = await this.prismaService.channelMember.findFirst({
      where: {
        userId,
        channelId,
      },
    })
    return !!channelMember
  }

  /**
   * Joins a channel with the specified user ID and channel ID.
   * @param userId - The ID of the user joining the channel.
   * @param channelId - The ID of the channel to join.
   * @param password - (Optional) The password for the channel, if required.
   * @returns A Promise that resolves to the created channel member.
   * @throws BadRequestException if the channel is not found, the user is already in the channel,
   * the channel is a direct message, the channel type does not match the password requirement,
   * or the provided password is invalid.
   */
  async joinChannel(userId: number, channelId: number, password?: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
    })
    if (!channel) throw new BadRequestException('Channel not found')
    if (channel.channelType === ChannelType.direct)
      throw new BadRequestException('You cannot join a direct message')
    if (await this.isUserInChannel(userId, channelId))
      throw new BadRequestException('You are already in this channel')
    if (password) {
      if (channel.channelType === ChannelType.public)
        throw new BadRequestException('Public channels cannot have passwords')
      if (channel.channelType === ChannelType.private)
        throw new BadRequestException(
          'Private channels must not have passwords',
        )
      const hashedPassword = createHmac(
        'sha256',
        randomBytes(32).toString('hex'),
      )
        .update(password)
        .digest('hex')
      if (hashedPassword !== channel.password)
        throw new BadRequestException('Invalid password')
    }
    return this.prismaService.channelMember.create({
      data: {
        userId,
        channelId,
      },
    })
  }

  /**
   * Removes a user from a channel.
   * @param userId - The ID of the user.
   * @param channelId - The ID of the channel.
   * @returns A promise that resolves to the number of channel members deleted.
   */
  async leaveChannel(userId: number, channelId: number) {
    return this.prismaService.channelMember.deleteMany({
      where: {
        userId,
        channelId,
      },
    })
  }

  async getChannel(
    id: number,
    userId: number,
    {
      withMessages = false,
      withMembers = false,
      withActions = false,
    }: {
      withMessages?: boolean
      withMembers?: boolean
      withActions?: boolean
    },
  ) {
    return this.prismaService.channel.findUnique({
      where: {
        id,
        AND: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        actions: withActions,
        messages: withMessages,
        members: {
          include: {
            user: withMembers && {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Creates a new channel based on the provided parameters.
   * @param name - The name of the channel (optional for some channel types).
   * @param password - The password for the channel (optional for some channel types).
   * @param channelType - The type of the channel (direct, protected, public, private).
   * @param userId - The ID of the user creating the channel.
   * @returns A Promise that resolves to the created channel.
   * @throws BadRequestException if the provided parameters are invalid.
   */
  async createChannel({
    name,
    password,
    channelType,
    userId,
  }: {
    name?: string
    password?: string
    channelType: ChannelType
    userId: number
  }) {
    if (channelType === ChannelType.direct) {
      if (name || password)
        throw new BadRequestException('Pms cannot have names or passwords')
    } else if (channelType === ChannelType.protected) {
      if (!name) throw new BadRequestException('Channels must be named')
      if (!password)
        throw new BadRequestException('Channels cannot have passwords')
    } else if (channelType === ChannelType.public) {
      if (!name) throw new BadRequestException('Channels must be named')
      if (password)
        throw new BadRequestException('Public channels cannot have passwords')
    } else if (channelType === ChannelType.private) {
      if (!name) throw new BadRequestException('Channels must be named')
      if (password)
        throw new BadRequestException(
          'Private channels must not have passwords',
        )
    }
    if (password) {
      password = createHmac('sha256', randomBytes(32).toString('hex'))
        .update(password)
        .digest('hex')
    }
    const data: Prisma.ChannelCreateInput = {
      name,
      channelType,
      password: password ?? undefined,
      owner: {
        connect: {
          id: userId,
        },
      },
      members: {
        create: {
          userId,
          role: 'owner',
        },
      },
    }
      return this.prismaService.channel.create({
      data,
    })
  }

  /**
   * Retrieves the members of a channel.
   * @param channelId - The ID of the channel.
   * @returns A promise that resolves to an array of channel members, including their ID, username, and image.
   */
  async getMembers(channelId: number) {
    return this.prismaService.channelMember.findMany({
      where: {
        channelId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    })
  }

  /**
   * Retrieves all public channels where user isnt part of.
   * @returns A promise that resolves to an array of public or protected channels.
   */
  async getNotJoinedPublicChannels(userId: number) {
    return this.prismaService.channel.findMany({
      where: {
        channelType: {
          in: [ChannelType.public, ChannelType.protected],
        },
        members: {
          none: {
            userId,
          },
        },
      },
    })
  }
}
