import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { createContext, ReactNode, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { IChannel, IChannelMember } from '../types/Chat'
import { ChatSocketEvent } from '../types/Events'
import { getChannel, getMyChannels } from '../utils/chatHttpRequests'
import { useAuth } from './AuthProvider'
import { useSocket } from './SocketProvider'

interface ChatContextData {
  myChannels: Pick<IChannel, 'id'>[]
  allChannels: IChannel[]
}

type Props = {
  children: ReactNode
}

export enum ChatQueryKey {
  MY_CHANNELS = 'mine',
  CHANNEL_NOT_JOINED = 'channels-not-joined',
  CHANNEL = 'channels',
  USER_LIST = 'user-list',
}

export const ChatContext = createContext<ChatContextData>({
  myChannels: [],
  allChannels: [],
})

export const ChatProvider = ({ children }: Props) => {
  const { socket } = useSocket()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const myChannelQuery = useQuery({
    queryKey: [ChatQueryKey.MY_CHANNELS],
    queryFn: getMyChannels,
    initialData: [],
    enabled: !!user,
  })

  const channelsQuery = useQueries({
    queries: myChannelQuery.data.map((channel) => ({
      queryKey: [channel.id],
      queryFn: () => getChannel(channel.id),
    })),
  })

  useEffect(() => {
    socket.on(ChatSocketEvent.EDIT_CHANNEL, async (data: IChannelMember) => {
      await queryClient.invalidateQueries({
        queryKey: [data.channelId],
      })
    })

    socket.on(ChatSocketEvent.JOIN_CHANNEL, async (data: IChannelMember) => {
      if (data.userId === user?.id) {
        await myChannelQuery.refetch()
        navigate(`/chat/${data.channelId}`)
      } else {
        await queryClient.invalidateQueries({
          queryKey: [data.channelId],
        })
      }
    })

    socket.on(ChatSocketEvent.LEAVE_CHANNEL, async (data: IChannelMember) => {
      if (data.userId === user?.id) {
        await myChannelQuery.refetch()
        navigate(`/chat`)
      } else {
        await queryClient.invalidateQueries({
          queryKey: [data.channelId],
        })
      }
    })

    return () => {
      socket.off(ChatSocketEvent.EDIT_CHANNEL)
      socket.off(ChatSocketEvent.JOIN_CHANNEL)
      socket.off(ChatSocketEvent.LEAVE_CHANNEL)
    }
  }, [user])

  const values = {
    allChannels: channelsQuery
      .map((channel) => channel.data)
      .filter((channel): channel is IChannel => channel !== undefined),
    myChannels: myChannelQuery.data,
  }

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
}

export const useChat = () => useContext(ChatContext)
