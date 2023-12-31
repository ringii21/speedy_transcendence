import { ChannelMessage as PrismaChannelMessage } from '@prisma/client'

export class ChannelMessageEntity implements PrismaChannelMessage {
  id: number
  content: string
  channelId: number
  senderId: number
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date

  constructor(partial: Partial<ChannelMessageEntity>) {
    Object.assign(this, partial)
  }
}
