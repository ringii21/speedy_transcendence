import React, { useEffect, useRef } from 'react'

import { useSelectedChannel } from '../../hooks/Channel.hook'
import { useChat } from '../../providers/ChatProvider'
import { IUser } from '../../types/User'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'

type ChatChannelProps = {
  me: IUser
  openChannelList: () => void
  openUserList: () => void
}

const ChatConversation = ({ me, openChannelList, openUserList }: ChatChannelProps) => {
  const { channelData } = useSelectedChannel()
  const { messages } = useChat()

  if (!channelData) return <span>Select a channel</span>

  const currentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollTo({
        top: currentRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  return (
    <main
      data-component-name='chat-conv'
      className='flex-1 p:2 pb-36 justify-between flex flex-col h-screen'
    >
      <div
        ref={currentRef}
        className='flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
      >
        {messages[channelData.id] &&
          messages[channelData.id].map((message, i) => (
            <ChatMessage key={i} message={message} user={me} members={channelData.members} />
          ))}
      </div>
      <div className='border-t-2 border-base-content px-4 pt-4 mb-2'>
        <ChatInput channel={channelData} />
      </div>
    </main>
  )
}

export { ChatConversation }
