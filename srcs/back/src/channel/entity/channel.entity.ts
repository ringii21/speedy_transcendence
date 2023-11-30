import { Exclude, Type } from 'class-transformer'
import { $Enums, Channel as PrismaChannel } from '@prisma/client'
import { ChannelMemberEntity } from './membership.entity'
import { ChannelActionEntity } from './action.entity'
import { ChannelMessageEntity } from '../../message/entity/message.entity'

export class ChannelEntity implements PrismaChannel {
  id: number
  name: string | null
  channelType: $Enums.ChannelType
  ownerId: number
  isPrivate: boolean

  @Type(() => ChannelEntity)
  members: ChannelMemberEntity[]

  @Type(() => ChannelEntity)
  actions: ChannelActionEntity[]

  @Type(() => ChannelEntity)
  messages: ChannelMessageEntity[]

  @Exclude()
  password: string | null
  @Exclude()
  createdAt: Date
  @Exclude()
  deletedAt: Date | null
  @Exclude()
  updatedAt: Date

  constructor(partial: Partial<ChannelEntity>) {
    Object.assign(this, partial)
  }
}
