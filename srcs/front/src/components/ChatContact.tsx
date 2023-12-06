import React, { useState } from 'react'
import { IUser } from '../types/User'
import { IMessage } from '../types/Message'
import { FindFriends } from './FindFriends'
import { Profil } from '../pages/Profil'
import { Link } from 'react-router-dom'

const ChatContact = ({
  data,
  setSelectedUser,
  setSelectUserMessage,
}: {
  data: Partial<IUser & { messages: Partial<IMessage[]> }>
  setSelectedUser: React.Dispatch<React.SetStateAction<Partial<IUser | null>>>
  setSelectUserMessage: React.Dispatch<
    React.SetStateAction<Partial<(IUser & Partial<IMessage[]>) | null>>
  >
}) => {
  if (!data.messages) return <></>
  const selectUser = () => {
    setSelectedUser(data)
  }
  const selectUserMessage = () => {
    setSelectUserMessage(data)
  }
  return (
    <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
      <div className="w-1/4">
        <button
          className="shadow-lg rounded-full "
          type="button"
          onClick={selectUser}
          title="profil"
        >
          <img
            src={data.image}
            className="h-12 w-12 object-cover rounded-full transition duration-300 delay-75 hover:delay-100 hover:scale-110 hover:-translate-y-0 ease-in-out"
            alt=""
          />
        </button>
      </div>
      <div className="w-full">
        <button
          type="button"
          className="text-base hover:text-lg"
          title="message"
        >
          <p className="text-base hover:text-lg font-semibold">
            {data.username}
          </p>
        </button>
        <span className="text-gray-500">
          {data.messages[data.messages.length - 1]?.content}
        </span>
      </div>
    </div>
  )
}

export { ChatContact }
