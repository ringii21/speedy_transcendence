import { useQuery } from '@tanstack/react-query'
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

import { IChannel } from '../types/Chat'
import { IChannelMessage } from '../types/Message'
import { getMyChannels } from '../utils/chatHttpRequests'

interface ChatContextData {
  channels: IChannel[]
  messages: Record<string, IChannelMessage[]>
  setMessages: Dispatch<SetStateAction<Record<string, IChannelMessage[]>>>
}

type Props = {
  children: ReactNode
}

export const ChatContext = createContext<ChatContextData>({
  channels: [],
  messages: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMessages: () => {},
})

export const ChatProvider = ({ children }: Props) => {
  const [messages, setMessages] = useState<Record<number, IChannelMessage[]>>({})
  const [channels, setChannels] = useState<IChannel[]>([])

  const { data } = useQuery<IChannel[]>({
    queryKey: ['channels'],
    queryFn: getMyChannels,
  })

  useEffect(() => {
    if (!data) return
    setChannels(data)
  }, [data])

  const values = {
    messages,
    channels,
    setMessages,
  }

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
}

export const useChat = () => useContext(ChatContext)
