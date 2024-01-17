import { IUser } from './User'

export type TChannelType = 'public' | 'private' | 'protected'
export type TRole = 'admin' | 'user' | 'owner'

export type IChannel = {
  id: string
  name: string
  type: TChannelType
  ownerId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  members: IChannelMember[]
  messages: IChannelMessage[]
  actions: unknown[]
}

export type IChannelMember = {
  role: TRole
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
