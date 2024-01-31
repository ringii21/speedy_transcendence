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
    <div className='relative flex'>
      <input
        type='text'
        value={inputMessage}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder='Message'
        className='input ring-offset-1 ring-2 ring-gray-900 w-full focus:ring-2 bg-white shadow-2xl'
      />
      <div className='absolute right-0 items-center inset-y-0 flex flex-row'>
        <button
          type='button'
          onClick={() => {
            sendMessage({
              channelId,
              content: 'lobbyId',
              gameInvite: true,
              senderId: user.id,
            })
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
          <span className='font-bold'>Send</span>
          <MdSend className='text-lg' />
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
