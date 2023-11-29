import React, { useState } from 'react'
import { IMessage } from '../types/Message'
import { IUser } from '../types/User'

function ChatBubble({ user, message }: { user: IUser; message: IMessage }) {
  const position = () => {
    if (message.author.username !== user.username)
      return (
        <div className="flex items-end justify-end">
          <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
            <div>
              <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                {message.content}
              </span>
            </div>
          </div>
          <img
            src={message.author.image}
            alt="My profile"
            className="w-6 h-6 rounded-full order-2"
          />
        </div>
      )
    else
      return (
        <div className="flex items-end">
          <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
            <div>
              <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                {message.content}
              </span>
            </div>
          </div>
          <img
            src={message.author.image}
            alt="My profile"
            className="w-6 h-6 rounded-full order-1"
          />
        </div>
      )
  }
  return (
    <div
      id="messages"
      className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch  overflow-y-auto"
    >
      <div>
        <div>{position()}</div>
      </div>
    </div>
  )
}

export { ChatBubble }
