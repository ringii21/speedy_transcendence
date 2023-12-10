import React from 'react'
import { HiHashtag } from 'react-icons/hi2'

import { useChat } from '../../providers/ChatProvider'
import { IUser } from '../../types/User'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'

type ChatChannelProps = {
  me: IUser
}

const ChatConv = ({ me }: ChatChannelProps) => {
  const { channel, messages } = useChat()
  if (!channel) return <span>Select a channel</span>

  if (channel.isLoading) return <span className='loading loading-lg'></span>
  if (channel.isError) return <span>Error</span>
  if (!channel.data) return <span>No data</span>

  return (
    <div className='flex flex-col gap-6 box-content border-4 w-96 fixed'>
      <div className='flex align-middle space-x-2 ml-2'>
        {channel.data.channelType === 'public' && <HiHashtag size={12} className='mt-1.5' />}
        <span>{channel.data.name}</span>
      </div>
      <div className='flex flex-col mx-4'>
        {messages[channel.data.id] &&
          messages[channel.data.id].map((message, i) => (
            <ChatBubble key={i} message={message} user={me} members={channel.data.members} />
          ))}
      </div>
      <ChatInput channel={channel.data} />
    </div>
  )
}

export { ChatConv }
