import React, { useState } from 'react'
import { IUser } from '../types/User'
import { IMessage } from '../types/Message'

const ChatContact = ({
  data,
  key,
  setSelectedUser,
}: {
  data: Partial<IUser & { messages: Partial<IMessage[]> }>
  key: number
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>
}) => {
  if (!data.messages) return <></>
  const selectUser = () => {
    setSelectedUser(data.id ?? '')
  }
  return (
    <div onClick={selectUser}>
      {/* <div className="border-b-2 py-4 px-2"> */}
      {/* <input
          type="text"
          placeholder="search chatting"
          className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
        /> */}
      {/* </div> */}
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
