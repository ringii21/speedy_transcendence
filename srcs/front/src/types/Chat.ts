import { IUser } from './User'

export type ChannelType = 'public' | 'private' | 'protected'

export type IChannel = {
  id: string
  name: string
  type: ChannelType
  ownerId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  members: IChannelMember[]
  messages: IChannelMessage[]
  actions: unknown[]
}

export type IChannelMember = {
  role: 'admin' | 'user' | 'owner'
  userId: number
  channelId: string
  channel: IChannel
  present: boolean
  user: IUser
}

export type IChannelMessage = {
  id: number
  content: string
  senderId: number
  channelId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
