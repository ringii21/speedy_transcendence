import React, { useEffect, useRef } from 'react'

import { IChannel } from '../../types/Chat'
import { IChannelMessage } from '../../types/Message'
import { IUser } from '../../types/User'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'

type ChatChannelProps = {
  channel?: IChannel
  messages: IChannelMessage[]
  me: IUser
  openChannelList: () => void
  openUserList: () => void
}

const ChatConversation = ({
  channel,
  messages,
  me,
  openChannelList,
  openUserList,
}: ChatChannelProps) => {
  if (!channel) return <p>Select a channel</p>

  const currentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollTo({
        top: currentRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, channel])

  return (
    <main
      data-component-name='chat-conv'
      className='flex-1 p:2 pb-36 justify-between flex flex-col h-screen'
    >
      <div
        ref={currentRef}
        className='flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
      >
        {messages &&
          messages.map((message, i) => (
            <ChatMessage key={i} message={message} user={me} members={channel.members} />
          ))}
      </div>
      <div className='px-4 pt-4 mb-2'>
        <ChatInput channel={channel} />
      </div>
    </main>
  )
}

export { ChatConversation }
