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
    <div className='flex flex-col gap-6 box-content rounded-b-lg shadow-2xl fixed w-1/3 h-2/3 justify-between bg-gray-900'>
      <div className='flex align-middle space-x-2 ml-2 '>
        {channel.data.channelType === 'public' && (
          <HiHashtag size={18} className='mt-1.5 text-white' />
        )}
        <span className='text-white'>{channel.data.name}</span>
      </div>
      <div className='flex flex-col mx-4 rounded-lg justify-center box-border overflow-y-auto bg-white'>
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
