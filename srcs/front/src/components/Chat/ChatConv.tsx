import React from 'react'
import { HiHashtag } from 'react-icons/hi2'
import { IoIosArrowBack } from 'react-icons/io'
// import { ChatSelection } from './ChatSelection'
import { Link } from 'react-router-dom'
import { onCLS } from 'web-vitals'

import { useChat } from '../../providers/ChatProvider'
import { IUser } from '../../types/User'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'

type ChatChannelProps = {
  me: IUser
  onClickEvent: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | null
}

const ChatConv: React.FC<ChatChannelProps> = ({ me, onClickEvent }) => {
  const { channel, messages } = useChat()
  if (!channel) return <span>Select a channel</span>

  if (channel.isLoading) return <span className='loading loading-lg'></span>
  if (channel.isError) return <span>Error</span>
  if (!channel.data) return <span>No data</span>

  const handleEvent = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
    if (onClickEvent && e !== null) onClickEvent(e)
  }

  return (
    <div className='flex flex-col gap-6 box-content rounded-b-lg shadow-2xl h-3/4 justify-between bg-gray-100'>
      <div className='flex gap-6 mt-4 border-b pb-4'>
        <div className='flex space-x-2 pl-4'>
          <button type='button' onClick={handleEvent}>
            <IoIosArrowBack size={18} className='text-black mt-1' />
          </button>
        </div>
        <div className='flex align-items gap-2'>
          {channel.data.channelType === 'public' && (
            <HiHashtag size={18} className='text-black mt-1' />
          )}
          <span className='text-black'>{channel.data.name}</span>
        </div>
      </div>
      <div className='flex flex-col rounded-lg overflow-y-auto'>
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
