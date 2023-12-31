import { Exclude } from 'class-transformer'
import { $Enums, ChannelAction as PrismaChannelAction } from '@prisma/client'

export class ChannelActionEntity implements PrismaChannelAction {
  id: number
  actionType: $Enums.ActionType
  channelId: number
  userId: number

  @Exclude()
  createdAt: Date
  @Exclude()
  deletedAt: Date | null
  @Exclude()
  updatedAt: Date

  constructor(partial: Partial<ChannelActionEntity>) {
    Object.assign(this, partial)
  }
}
