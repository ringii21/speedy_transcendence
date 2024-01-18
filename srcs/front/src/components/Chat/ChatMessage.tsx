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
    ['flex space-y-2 text-xs max-w-xs mx-2']: true,
    ['order-1 items-end']: message.senderId === user.id,
    ['order-2 items-start']: message.senderId !== user.id,
  })

  const messageJustify = clsx({
    ['flex items-end mb-4']: true,
    ['justify-end mr-6']: message.senderId === user.id,
    ['justify-start ml-6']: message.senderId !== user.id,
  })

  const imageStyle = clsx({
    ['w-6 rounded-full']: true,
    ['order-2']: message.senderId === user.id,
    ['order-1 hover:shadow-lg hover:shadow-indigo-500/50']: message.senderId !== user.id,
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
      <div className={messagePosition}>
        {BubbleChannelModal({ openModal, setOpenModal, message, user })}
        {message.senderId !== user.id ? (
          <button
            type='button'
            className='block'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpenModal(!openModal)
            }}
          >
            <img src={sender.user.image} alt='My profile' className={imageStyle} />
          </button>
        ) : (
          <img src={sender.user.image} alt='My profile' className={imageStyle} />
        )}
      </div>
    </div>
  )
}

export { ChatMessage }
