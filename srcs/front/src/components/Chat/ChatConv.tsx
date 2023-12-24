import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'

import { useChat } from '../../providers/ChatProvider'
import { IUser } from '../../types/User'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'

type ChatChannelProps = {
  me: IUser
  openChannelList: () => void
  openUserList: () => void
}

const ChatConv: React.FC<ChatChannelProps> = ({ me, openChannelList, openUserList }) => {
  const { channel, messages } = useChat()

  if (!channel) return <span>Select a channel</span>

  if (channel.isLoading) return <span className='loading loading-lg'></span>
  if (channel.isError) return <span>Error</span>
  if (!channel.data) return <span>No data</span>

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
      className='flex flex-col gap-6 box-content rounded-b-lg justify-between bg-base-100 relative'
    >
      <div
        // ref={currentRef}
        className='flex flex-col scroll rounded-lg overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-900 scrollbar-thumb-rounded-md'
      >
        {messages[channel.data.id] &&
          messages[channel.data.id].map((message, i) => (
            <ChatBubble key={i} message={message} user={me} members={channel.data.members} />
          ))}
      </div>
      <div className='flex flex-col rounded-lg'>
        <ChatInput channel={channel.data} />
      </div>
    </main>
  )
}

export { ChatConv }
