import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { HiHashtag } from 'react-icons/hi2'

import { IChannel } from '../../types/Chat'
import { IUser } from '../../types/User'
import { getChannel } from '../../utils/chatHttpRequests'
import { ChatInput } from './ChatInput'
import { ChatBubble } from './ChatBubble'

type ChatChannelProps = {
  me: IUser
  selectedChat: IChannel | null
}

const ChatConv = ({ me, selectedChat }: ChatChannelProps) => {
  if (!selectedChat) return <span>Select a channel</span>

  const selectedChannel = useQuery<IChannel>({
    queryKey: ['channels', selectedChat?.id],
    queryFn: getChannel,
  })
  const [messages, setMessages] = React.useState(
    selectedChannel.data?.messages || [],
  )

  if (selectedChannel.isLoading)
    return <span className="loading loading-lg"></span>
  if (selectedChannel.isError) return <span>Error</span>
  if (!selectedChannel.data) return <span>No data</span>

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        {selectedChannel.data.channelType === 'public' && (
          <HiHashtag size={12} />
        )}
        <span>{selectedChannel.data.name}</span>
      </div>
      <div className="flex flex-col justify-between">
        <div className="w-full">
          {messages.map((message, i) => (
            <ChatBubble
              key={i}
              message={message}
              user={me}
              members={selectedChannel.data.members}
            />
          ))}
        </div>
        <div>
          <ChatInput
            user={me}
            setMessages={setMessages}
            messages={messages}
            channel={selectedChat}
          />
        </div>
      </div>
    </div>
  )
}

export { ChatConv }
