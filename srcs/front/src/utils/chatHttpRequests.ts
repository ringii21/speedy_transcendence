import { QueryKey } from '@tanstack/react-query'

import { ChannelType, IChannel } from '../types/Chat'
import httpInstance from './httpClient'

export const getMyChannels = async () => {
  const { data } = await httpInstance().get<IChannel[]>('/api/chat/channels/mine')
  return data
}

export const getChannel = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_, channelId] = queryKey
  if (!channelId) throw new Error('channelId is required')
  const { data } = await httpInstance().get<IChannel>(`/api/chat/channels/${channelId}`)
  return data
}

export const getPubChannels = async () => {
  const { data } = await httpInstance().get<IChannel[]>(`/api/chat/channels`)
  return data
}

export const joinChannel = async (channelId: number) => {
  const { data } = await httpInstance().post(`/api/chat/channels/${channelId}/join`)
  return data
}

export const createChannel = async (data: {
  name?: string
  channelType: ChannelType
  password?: string
}) => httpInstance().post<IChannel>('/api/chat/channels', data)
