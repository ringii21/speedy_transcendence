import React, { useState } from 'react'
import { FaRocket } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'

import { useAuth } from '../../providers/AuthProvider'
import { useSocket } from '../../providers/SocketProvider'
import { FrontEndMessage } from '../../types/Chat'
import { ChatSocketEvent } from '../../types/Events'

const ChatInput = ({
  channelId,
  setMessage,
}: {
  channelId: string
  setMessage: React.Dispatch<React.SetStateAction<FrontEndMessage[]>>
}) => {
  const { chatSocket, isChatConnected } = useSocket()
  const { user } = useAuth()
  const [inputMessage, setInputMessage] = useState<string>('')

  if (!user) return <></>

  const sendMessage = (message: FrontEndMessage) => {
    if (!isChatConnected) return
    console.log(chatSocket)
    chatSocket.emit(ChatSocketEvent.MESSAGE, message)
    setMessage((messages) => [...messages, message])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage()
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: FrontEndMessage = {
        channelId,
        content: inputMessage,
        senderId: user.id,
        gameInvite: false,
      }
      sendMessage(newMessage)
      setInputMessage('')
    }
  }

  return (
    <div className='relative mx-4 mb-20 border-t inline-flex'>
      <input
        type='text'
        value={inputMessage}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder='Message'
        className='block ps-4 text-gray-600 pl-4 bg-gray-200 rounded-lg input w-full'
      />
      <div className='absolute right-0 items-center inset-y-0 flex'>
        <button
          type='button'
          onClick={() => {
            sendMessage({
              channelId,
              content: 'Play with me !',
              gameInvite: true,
              senderId: user.id,
            })
          }}
          className='btn btn-error md:visible invisible'
        >
          <span className='font-bold text-accent-content'>Play</span>
          <FaRocket className='text-accent-content text-lg' />
        </button>
        <button
          type='button'
          onClick={handleSendMessage}
          className='btn btn-primary end-0 bottom-0'
          disabled={!inputMessage.trim()}
        >
          <span className='font-bold text-white'>Send</span>
          <MdSend className='text-lg' />
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
