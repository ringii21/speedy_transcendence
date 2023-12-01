import React, { useState } from 'react'
import { IUser } from '../types/User'
import { IMessage } from '../types/Message'
import { FindFriends } from './FindFriends'

const ChatContact = ({
  data,
  setSelectedUser,
}: {
  data: Partial<IUser & { messages: Partial<IMessage[]> }>
  setSelectedUser: React.Dispatch<React.SetStateAction<Partial<IUser | null>>>
}) => {
  if (!data.messages) return <></>
  const selectUser = () => {
    setSelectedUser(data)
  }
  return (
    <div onClick={selectUser}>
      <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
        <div className="w-1/4">
          <img
            src={data.image}
            className="object-cover h-12 w-12 rounded-full"
            alt=""
          />
        </div>
        <div className="w-full">
          <div className="text-lg font-semibold">{data.username}</div>
          <span className="text-gray-500">
            {data.messages[data.messages.length - 1]?.content}
          </span>
        </div>
      </div>
    </div>
  )
}

export { ChatContact }
