import React, { useState } from 'react'
import { FaRocket } from 'react-icons/fa'
import { MdPartyMode, MdSend } from 'react-icons/md'

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
  const { chatSocket, isChatConnected, gameSocket, isGameConnected } = useSocket()
  const { user } = useAuth()
  const [inputMessage, setInputMessage] = useState<string>('')

  if (!user) return <></>

  const sendMessage = async (message: FrontEndMessage) => {
    if (!isChatConnected) return
    console.log(chatSocket)
    console.log(isGameConnected)
    if (!isGameConnected) gameSocket.connect()
    if (message.gameInvite && isGameConnected) {
      gameSocket?.emit('createGamePerso')

      const partyNumber = await new Promise<number>((resolve) => {
        gameSocket?.once('gamePersoCreated', ({ partyNumber }) => {
          resolve(partyNumber)
        })
      })
      message.content = partyNumber.toString()
      chatSocket.emit(ChatSocketEvent.MESSAGE, message)
      setMessage((messages) => [...messages, message])
    } else {
      chatSocket.emit(ChatSocketEvent.MESSAGE, message)
      setMessage((messages) => [...messages, message])
    }
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
        className='input input-bordered input-primary w-full'
      />
      <div className='absolute right-0 items-center inset-y-0 flex'>
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
          <span className='font-bold text-primary-content'>Send</span>
          <MdSend className='text-primary-content text-lg' />
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
