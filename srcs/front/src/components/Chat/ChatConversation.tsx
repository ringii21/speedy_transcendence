import React, { useEffect, useRef, useState } from 'react'

import { useSocket } from '../../providers/SocketProvider'
import { IChannel, IChannelMessage } from '../../types/Chat'
import { ChatSocketEvent } from '../../types/Events'
import { IUser } from '../../types/User'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'

type ChatChannelProps = {
  currentChannel: IChannel
  me: IUser
}

const ChatConversation = ({ currentChannel, me }: ChatChannelProps) => {
  const currentRef = useRef<HTMLDivElement>(null)
  const { socket } = useSocket()
  const [messages, setMessages] = useState<IChannelMessage[]>([])
  useEffect(() => setMessages(currentChannel.messages), [currentChannel])
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollTo({
        top: currentRef.current.scrollHeight,
        behavior: 'auto',
      })
    }
  }, [messages])

  useEffect(() => {
    socket.on(ChatSocketEvent.MESSAGE, (newMessage: IChannelMessage) => {
      if (newMessage.channelId === currentChannel.id) {
        setMessages((messages) => [...messages, newMessage])
      }
    })
  }, [])

  return (
    <main
      data-component-name='chat-conv'
      className='flex-1 p:2 pb-36 justify-between flex flex-col h-screen'
    >
      <div
        ref={currentRef}
        className='flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
      >
        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} user={me} members={currentChannel.members} />
        ))}
      </div>
      <div className='px-4 pt-4 mb-2'>
        <ChatInput channelId={currentChannel.id} setMessage={setMessages} />
      </div>
    </main>
  )
}

export { ChatConversation }