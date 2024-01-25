import { useQueries, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { FrontEndMessage, IChannelMember, IChannelMessage } from '../../types/Chat'
import { IUser } from '../../types/User'
import { fetchAllUsers } from '../../utils/userHttpRequests'
import { BubbleChannelModal } from './BubbleChannelModal'

type ChatBubbleProps = {
  user: IUser
  message: FrontEndMessage
  members: IChannelMember[]
}

const ChatMessage: React.FC<ChatBubbleProps> = ({ user, message, members }) => {
  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser>()

  const sender = members.find((member) => member.userId === message.senderId)
  if (!sender) return <span>Error</span>

  const ref = useRef<HTMLDivElement>(null)
  const messagePosition = clsx({
    ['flex space-y-2 text-xs max-w-xs']: true,
    ['order-1 items-end mr-10']: message.senderId === user.id,
    ['order-2 items-start ml-10']: message.senderId !== user.id,
  })

  const messageStyle = clsx({
    ['px-4 py-2 inline-block rounded-lg']: true,
    ['bg-primary text-primary-content']: message.senderId === user.id,
    ['bg-gray-300 text-gray-600']: message.senderId !== user.id,
  })

  const messageJustify = clsx({
    ['flex items-end py-4']: true,
    ['justify-end mr-6']: message.senderId === user.id,
    ['justify-start ml-6']: message.senderId !== user.id,
  })

  const bubblePosition = clsx({
    ['flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 break-words overflow-hidden']: true,
    ['px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600']:
      message.senderId !== user.id,
    ['px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white']:
      message.senderId === user.id,
  })

  const imageStyle = clsx({
    ['w-6 h-6 rounded-full']: true,
    ['order-2 absolute bottom-0 right-0']: message.senderId === user.id,
    ['order-1 absolute bottom-0 left-0']: message.senderId !== user.id,
  })

  useEffect(() => {
    const checkIsOpen = (e: MouseEvent) => {
      const el = e.target as HTMLDivElement
      if (ref.current && !ref.current.contains(el)) {
        setOpenModal(false)
      }
    }
    document.addEventListener('click', checkIsOpen)
    return () => {
      document.removeEventListener('click', checkIsOpen)
    }
  }, [])
  return (
    <div className={messageJustify}>
      {message.senderId !== user.id ? (
        <div className='flex flex-row relative'>
          <div className={messagePosition}>
            <div className='flex flex-row relative'>
              <div className={bubblePosition}>
                {message.gameInvite && (
                  <Link className='link link-error font-bold no-underliner' to='/play'>
                    Play with me !
                  </Link>
                )}
                {!message.gameInvite && <span>{message.content}</span>}
              </div>
            </div>
          </div>
          <img src={sender.user.image} alt='My profile' className={imageStyle} />
        </div>
      ) : (
        <div className='flex flex-row relative'>
          <div className={messagePosition}>
            <div className='flex flex-row relative'>
              <div className={bubblePosition}>
                {message.senderId !== user.id ? message.content : message.content}
              </div>
            </div>
          </div>
          <img src={sender.user.image} alt='My profile' className={imageStyle} />
        </div>
      )}
    </div>
  )
}

export { ChatMessage }
