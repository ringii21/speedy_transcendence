import { useQuery, UseQueryResult } from '@tanstack/react-query'
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { IChannel } from '../types/Chat'
import { IChannelMessage } from '../types/Message'
import { getChannel } from '../utils/chatHttpRequests'

interface ChatContextData {
  channel?: UseQueryResult<IChannel, Error>
  selectedChannel: number | null
  setSelectedChannel: Dispatch<SetStateAction<number | null>>
  messages: Record<number, IChannelMessage[]>
  setMessages: Dispatch<SetStateAction<Record<number, IChannelMessage[]>>>
}

type Props = {
  children: ReactNode
}

export const ChatContext = createContext<ChatContextData>({
  channel: undefined,
  selectedChannel: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedChannel: () => {},
  messages: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMessages: () => {},
})

export const ChatProvider = ({ children }: Props) => {
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null)
  const [messages, setMessages] = useState<Record<number, IChannelMessage[]>>({})

  const channel = useQuery<IChannel>({
    queryKey: ['channels', selectedChannel],
    queryFn: getChannel,
  })

  useEffect(() => {
    if (channel.isSuccess && channel.data) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [channel.data.id]: channel.data.messages,
      }))
    }
  }, [channel.isSuccess, channel.data])

  const memoedValue = useMemo<ChatContextData>(
    () => ({
      channel,
      selectedChannel,
      setSelectedChannel,
      messages,
      setMessages,
    }),
    [selectedChannel, messages, channel],
  )

  return <ChatContext.Provider value={memoedValue}>{children}</ChatContext.Provider>
}

export const useChat = () => useContext(ChatContext)
