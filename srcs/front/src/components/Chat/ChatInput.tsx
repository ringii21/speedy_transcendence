import React, { useState } from 'react'
import { MdSend } from 'react-icons/md'

import { useAuth } from '../../providers/AuthProvider'
import { useChat } from '../../providers/ChatProvider'
import { useSocket } from '../../providers/SocketProvider'
import { IChannel, IChannelMessage } from '../../types/Chat'
import { ChatSocketEvent } from '../../types/Events'

type GetChannel = {
  channel: IChannel
}

const ChatInput: React.FC<GetChannel> = ({ channel }) => {
  const { socket, isConnected } = useSocket()
  const { setMessages } = useChat()
  const { user } = useAuth()

  if (!user) return <></>
  const [inputMessage, setInputMessage] = useState<string>('')

  const handleSendMessage = () => {
    if (!socket || !isConnected) return
    if (inputMessage.trim() !== '') {
      const newMessage: IChannelMessage = {
        channelId: channel.id,
        content: inputMessage,
        senderId: user.id,
      } as IChannelMessage

      socket.emit(ChatSocketEvent.MESSAGE, newMessage)
      setMessages((prevMessages) => ({
        ...prevMessages,
        [channel.id]: [...(prevMessages[channel.id] ?? []), newMessage],
      }))
      setInputMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage()
  }

  return (
    <div className='relative flex'>
      <input
        type='text'
        value={inputMessage}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder='Message'
        className='input input-bordered input-primary w-full'
      />
      <div className='absolute right-0 items-center inset-y-0 flex'>
        <button
          type='button'
          onClick={handleSendMessage}
          className='btn btn-primary'
          disabled={!inputMessage.trim()}
        >
          <span className='font-bold text-base-content'>Send</span>
          <MdSend className='text-base-content text-lg' />
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
