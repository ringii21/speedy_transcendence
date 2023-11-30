import React, { useEffect, useState } from 'react'
import { MdSend } from 'react-icons/md'

import { useSocket } from '../../providers/SocketProvider'
import { IChannel } from '../../types/Chat'
import { IChannelMessage } from '../../types/Message'
import { IUser } from '../../types/User'
const ChatInput = ({
  user,
  setMessages,
  messages,
  channel,
}: {
  user: IUser
  setMessages: React.Dispatch<React.SetStateAction<IChannelMessage[]>>
  messages: IChannelMessage[]
  channel: IChannel
}) => {
  const { socket, isConnected } = useSocket()

  const [inputMessage, setInputMessage] = useState<string>('')

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        channelId: channel.id,
        content: inputMessage,
      }
      setMessages([
        ...messages,
        {
          ...newMessage,
          senderId: user.id,
          channelId: channel.id,
        },
      ])
      socket?.emit('message', newMessage)
      setInputMessage('')
    }
  }
  socket?.on('message', (message: IChannelMessage) => {
    setMessages([...messages, message])
  })
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage()
  }

  if (!isConnected) return <></>
  return (
    <div>
      <div className='relative'>
        <input
          type='text'
          value={inputMessage}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder='Message'
          className='w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-200 rounded-md py-3'
        />
        <div className='absolute right-1 items-center inset-y-0'>
          <button
            type='button'
            onClick={handleSendMessage}
            className='btn btn-primary focus:outline-none'
            disabled={!inputMessage.trim()}
          >
            <span className='font-bold'>Send</span>
            <MdSend className='ml-2 text-lg' />
          </button>
        </div>
      </div>
    </div>
  )
}

export { ChatInput }
