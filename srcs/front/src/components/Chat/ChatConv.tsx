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
    <div className='flex flex-col relative min-h-screen'>
      <div className='flex items-center ml-3'>
        {channel.data.channelType === 'public' && <HiHashtag size={12} />}
        <span>{channel.data.name}</span>
      </div>
      <div className='overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-screen'>
        <div className='flex flex-col space-y-4 elliotp-3 mb-4 mr-3 ml-3'>
          {messages[channel.data.id] &&
            messages[channel.data.id].map((message, i) => (
              <ChatBubble key={i} message={message} user={me} members={channel.data.members} />
            ))}
        </div>
      </div>
      <ChatInput channel={channel.data} />
    </div>
  )
}

export { ChatConv }
