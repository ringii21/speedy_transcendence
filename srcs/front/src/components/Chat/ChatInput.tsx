import React, { useEffect, useState } from 'react'
import { MdSend } from 'react-icons/md'

import { useAuth } from '../../providers/AuthProvider'
import { useChat } from '../../providers/ChatProvider'
import { useSocket } from '../../providers/SocketProvider'
import { IChannel } from '../../types/Chat'
import { IChannelMessage } from '../../types/Message'

const ChatInput = ({ channel }: { channel: IChannel }) => {
  const { socket, isConnected } = useSocket()
  const { setMessages } = useChat()
  const { user } = useAuth()

  if (!user) return <></>
  const [inputMessage, setInputMessage] = useState<string>('')

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        channelId: channel.id,
        content: inputMessage,
        senderId: user.id,
      }
      socket?.emit('message', newMessage)
      setMessages((prevMessages) => ({
        ...prevMessages,
        [channel.id]: [...(prevMessages[channel.id] ?? []), newMessage],
      }))
      setInputMessage('')
    }
  }

  useEffect(() => {
    const messageListener = (message: IChannelMessage) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [message.channelId]: [...(prevMessages[message.channelId] ?? []), message],
      }))
    }

    socket?.on('message', messageListener)
  }, [socket])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage()
  }

  if (!isConnected) return <></>
  return (
    <div className='border-t-2 border-gray-200 px-4 pt-12 mb-2'>
      <div className='relative flex'>
        <input
          type='text'
          value={inputMessage}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder='Message'
          className='w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-200 rounded-md py-3'
        />
        <div className='absolute right-1 items-center inset-y-1'>
          <button
            type='button'
            onClick={handleSendMessage}
            className='inline-flex items-center justify-center rounded-lg px-4 py-2 ransition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none'
            disabled={!inputMessage.trim()}
          >
            <span className='font-bold'>Send</span>
            <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
            <MdSend className='ml-2 text-lg' />
          </button>
        </div>
      </div>
    </div>
  )
}

export { ChatInput }
