import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'

import { IChannelMember } from '../../types/Chat'
import { IChannelMessage } from '../../types/Message'
import { IUser } from '../../types/User'

type ChatBubbleProps = {
  user: IUser
  message: IChannelMessage
  members: IChannelMember[]
}

const ChatBubble = ({ user, message, members }: ChatBubbleProps) => {
  const sender = members.find((member) => member.userId === message.senderId)
  if (!sender) return <span>Error</span>

  const messagePosition = clsx({
    ['flex space-y-2 text-xs max-w-xs mx-2']: true,
    ['order-1 items-end']: message.senderId === user.id,
    ['order-2 items-start']: message.senderId !== user.id,
  })

  const messageJustify = clsx({
    ['flex items-end mb-4']: true,
    ['justify-end']: message.senderId === user.id,
    ['justify-start']: message.senderId !== user.id,
  })
  const messageStyle = clsx({
    ['px-4 py-2 rounded-lg inline-block']: true,
    ['bg-primary text-primary-content']: message.senderId === user.id,
    ['bg-gray-300 text-gray-600']: message.senderId !== user.id,
  })
  const imageStyle = clsx({
    ['w-6 h-6 rounded-full']: true,
    ['order-2']: message.senderId === user.id,
    ['order-1']: message.senderId !== user.id,
  })

  return (
    <div className={messageJustify}>
      <div className={messagePosition}>
        <div>
          <span className={messageStyle}>{message.content}</span>
        </div>
      </div>
      <Link to='/profile'>
        <img src={sender.user.image} alt='My profile' className={imageStyle} />
      </Link>
    </div>
  )
}

export { ChatBubble }
