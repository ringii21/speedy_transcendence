import { IChannelMessage } from './Message'
import { IUser } from './User'

export type ChannelType = 'public' | 'private' | 'protected' | 'direct'

export type IChannel = {
  id: string
  name: string | null
  type: ChannelType
  ownerId: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  members: IChannelMember[]
  messages: IChannelMessage[]
  actions: unknown[]
}

export type IChannelMember = {
  role: 'admin' | 'user' | 'owner'
  userId: number
  channelId: string
  channel: IChannel
  user: IUser
}
