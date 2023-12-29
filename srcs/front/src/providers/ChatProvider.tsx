import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'

import { IChannelMessage } from '../types/Message'

interface ChatContextData {
  messages: Record<string, IChannelMessage[]>
  setMessages: Dispatch<SetStateAction<Record<string, IChannelMessage[]>>>
}

type Props = {
  children: ReactNode
}

export const ChatContext = createContext<ChatContextData>({
  messages: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMessages: () => {},
})

export const ChatProvider = ({ children }: Props) => {
  const [messages, setMessages] = useState<Record<number, IChannelMessage[]>>({})

  const memoedValue = useMemo<ChatContextData>(
    () => ({
      messages,
      setMessages,
    }),
    [messages],
  )

  return <ChatContext.Provider value={memoedValue}>{children}</ChatContext.Provider>
}

export const useChat = () => useContext(ChatContext)
