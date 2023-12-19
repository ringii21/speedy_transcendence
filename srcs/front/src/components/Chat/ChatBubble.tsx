import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { IChannelMember } from '../../types/Chat'
import { IChannelMessage } from '../../types/Message'
import { IUser } from '../../types/User'
import { BubbleChannelModal } from './BubbleChannelModal'

type ChatBubbleProps = {
  user: IUser
  message: IChannelMessage
  members: IChannelMember[]
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ user, message, members }) => {
  const [openModal, setOpenModal] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const sender = members.find((member) => member.userId === message.senderId)
  if (!sender) return <span>Error</span>

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
  const messageStyle = clsx({
    ['px-4 py-2 rounded-lg inline-block']: true,
    ['bg-primary text-primary-content']: message.senderId === user.id,
    ['bg-gray-300 text-gray-600']: message.senderId !== user.id,
  })
  const imageStyle = clsx({
    ['w-6 h-6 rounded-full']: true,
    ['order-2']: message.senderId === user.id,
    ['order-1 hover:w-8 hover:h-8 hover:border-blue hover:border-4 rounded-full']:
      message.senderId !== user.id,
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
        <div ref={ref}>
          <span className={messageStyle}>{message.content}</span>
        </div>
      </div>
      {BubbleChannelModal({ openModal, setOpenModal, message, user })}
      <button
        type='button'
        className='block'
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (message.senderId !== user.id) setOpenModal(!openModal)
        }}
      >
        <img src={sender.user.image} alt='My profile' className={imageStyle} />
      </button>
      {/* <Link
        to={message.senderId === user?.id ? '/profile/me' : '/profile/${member.userId}'}
        placeholder={'${members.userId}'}
      >
      </Link> */}
    </div>
  )
}

export { ChatBubble }
