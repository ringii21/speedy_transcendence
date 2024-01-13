import { ChannelType, IChannel, IChannelMember } from '../types/Chat'
import httpInstance from './httpClient'

export const getMyChannels = async () => {
  const { data } = await httpInstance().get<Pick<IChannel, 'id'>[]>('/api/chat/channels/mine')
  return data
}

export const getChannel = async (channelId: string) => {
  const { data } = await httpInstance().get<IChannel>(`/api/chat/channels/${channelId}`)
  return data
}

export const getNotJoinedVisibleChannels = async () => {
  const { data } = await httpInstance().get<IChannel[]>(`/api/chat/channels`)
  return data
}

export const joinChannel = async (channelId: string, password: string) => {
  const { data } = await httpInstance().post(`/api/chat/channels/${channelId}/join`, {
    password,
  })
  console.log(data)
  return data
}

export const leaveChannel = async (channelId: string): Promise<IChannelMember> => {
  const { data } = await httpInstance().post(`/api/chat/channels/${channelId}/leave`)
  return data
}

export const createChannel = async (name: string, type: ChannelType, password?: string) => {
  const { data } = await httpInstance().post<IChannel>('/api/chat/channels', {
    name,
    type,
    password,
  })
  return data
}

export const createPm = async (targetId: number) => {
  const { data } = await httpInstance().post<IChannel>('/api/chat/pms', {
    targetId,
  })
  return data
}

export const userAction = async ({
  channelId,
  userId,
  action,
}: {
  channelId: string
  userId: number
  action: string
}) =>
  httpInstance().post(`/api/chat/channels/${channelId}/${action}`, {
    userId,
  })
