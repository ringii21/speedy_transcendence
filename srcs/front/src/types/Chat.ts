import { IChannelMessage } from './Message'
import { IUser } from './User'

export type ChannelType = 'public' | 'private' | 'protected' | 'direct'

export type IChannel = {
  id: number
  name: string | null
  channelType: ChannelType
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
  id: number
  userId: number
  channelId: number
  channel: IChannel
  user: IUser
}
