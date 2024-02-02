import clsx from 'clsx'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useSocket } from '../../providers/SocketProvider'
import { FrontEndMessage, IChannelMember } from '../../types/Chat'
import { ChatSocketEvent } from '../../types/Events'
import { IUser } from '../../types/User'

type ChatMessageProps = {
  user: IUser
  message: FrontEndMessage
  members: IChannelMember[]
  blocked: boolean
}

const ChatMessage = ({ user, message, members, blocked }: ChatMessageProps) => {
  const { gameSocket, isGameConnected, chatSocket, isChatConnected } = useSocket()
  if (!isGameConnected) gameSocket.connect()
  const sender = members.find((member) => member.userId === message.senderId)
  if (!sender) return <span>Error</span>
  gameSocket.on('errorPartyPerso', (msgError: string) => {
    console.log('Je passe bien dans le on de la socket')
    toast.error(msgError, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    })
  })
  const messagePosition = clsx({
    ['flex space-y-2 text-xs max-w-xs mx-2']: true,
    ['order-1 items-end']: message.senderId === user.id,
    ['order-2 items-start']: message.senderId !== user.id,
  })

  const messageJustify = clsx({
    ['flex items-end mb-4 pt-2']: true,
    ['justify-end mr-6']: message.senderId === user.id,
    ['justify-start ml-6']: message.senderId !== user.id,
  })

  const messageStyle = clsx({
    ['px-4 py-2 rounded-lg inline-block']: true,
    ['bg-primary text-primary-content']: message.senderId === user.id,
    ['bg-gray-300 text-gray-600']: message.senderId !== user.id,
  })

  const imageStyle = clsx({
    ['w-6 rounded-full']: true,
    ['order-2']: message.senderId === user.id,
    ['order-1']: message.senderId !== user.id,
  })

  const acceptGame = (message: any) => {
    if (user.id === message.senderId) {
      toast.error("You can't join your own party!", {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      })
      return
    }
    chatSocket?.emit(ChatSocketEvent.UPDATE, {
      messageId: message.id,
      channelId: message.channelId,
      content: message.content,
    })
    gameSocket?.emit('acceptGameInvite', { partyNumber: message.content })
  }

  return (
    <>
      {blocked ? (
        <div className={messageJustify}>
          <div className={messagePosition}>
            <div>
              {message.gameInvite && (
                <a
                  className='link-success'
                  href='#'
                  onClick={(e) => {
                    e.preventDefault() // Empêche le comportement par défaut du lien
                    // Ici, appelez votre fonction
                    acceptGame(message)
                  }}
                >
                  Play with me!
                </a>
              )}
              {!message.gameInvite && <span className={messageStyle}>{message.content}</span>}
            </div>
          </div>
          <Link to={`/profile/${sender.userId}`}>
            <img src={sender.user.image} alt='My profile' className={imageStyle} />
          </Link>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export { ChatMessage }
