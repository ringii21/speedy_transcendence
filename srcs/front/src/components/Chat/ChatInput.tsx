import React, { useState } from 'react'
import { FaRocket } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'

import { useAuth } from '../../providers/AuthProvider'
import { useSocket } from '../../providers/SocketProvider'
import { IChannelMessage } from '../../types/Chat'
import { ChatSocketEvent } from '../../types/Events'

const ChatInput = ({
  channelId,
  setMessage,
}: {
  channelId: string
  setMessage: React.Dispatch<React.SetStateAction<IChannelMessage[]>>
}) => {
  const { socket, isConnected } = useSocket()
  const { user } = useAuth()
  const [inputMessage, setInputMessage] = useState<string>('')

  if (!user) return <></>
  const handleSendMessage = () => {
    if (!isConnected) return
    if (inputMessage.trim() !== '') {
      const newMessage: IChannelMessage = {
        channelId,
        content: inputMessage,
        senderId: user.id,
      } as IChannelMessage

      socket.emit(ChatSocketEvent.MESSAGE, newMessage)
      setMessage((messages) => [...messages, newMessage])
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
          onClick={() => {
            console.log('play')
          }}
          className='btn btn-error'
        >
          <span className='font-bold text-accent-content'>Play</span>
          <FaRocket className='text-accent-content text-lg' />
        </button>
        <button
          type='button'
          onClick={handleSendMessage}
          className='btn btn-primary'
          disabled={!inputMessage.trim()}
        >
          <span className='font-bold text-primary-content'>Send</span>
          <MdSend className='text-primary-content text-lg' />
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
