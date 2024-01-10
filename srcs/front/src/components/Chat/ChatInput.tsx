import React, { useEffect, useState } from 'react'
import { MdSend } from 'react-icons/md'

import { useAuth } from '../../providers/AuthProvider'
import { useChat } from '../../providers/ChatProvider'
import { useSocket } from '../../providers/SocketProvider'
import { IChannel } from '../../types/Chat'
import { IChannelMessage } from '../../types/Message'

type GetChannel = {
  channel: IChannel
}

const ChatInput: React.FC<GetChannel> = ({ channel }) => {
  const { chatSocket, isChatConnected } = useSocket()
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
      chatSocket?.emit('message', newMessage)
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

    chatSocket?.on('message', messageListener)
  }, [chatSocket])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage()
  }

  if (!isChatConnected) return <></>
  return (
    <div className='relative mx-4 mb-20 border-t inline-flex'>
      <input
        type='text'
        value={inputMessage}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder='Message'
        className='block ps-4 text-gray-600 pl-4 bg-gray-200 rounded-lg py-3 mt-4 w-full'
      />
      <div>
        <button
          type='button'
          onClick={handleSendMessage}
          className='btn absolute btn-primary end-0 bottom-0'
          disabled={!inputMessage.trim()}
        >
          <span className='font-bold text-white '>Send</span>
          <MdSend className='text-lg' />
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
