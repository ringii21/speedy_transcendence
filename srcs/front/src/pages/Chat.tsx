import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { ChatConv } from '../components/Chat/ChatConv'
import { ChatSelection } from '../components/Chat/ChatSelection'
import { ChatUsers } from '../components/Chat/ChatUsers'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { IChannel } from '../types/Chat'

type SelectedChat = IChannel | null

const Chat = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  const [selectedChat, setSelectedChat] = useState<SelectedChat>(null)

  return (
    <div>
      <h1 className="text-2xl text-center">Chat</h1>
      <hr />
      <div className="flex">
        <div className="lg:w-4/12 w-12/12">
          <ChatSelection
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>
        <div className="lg:w-8/12">
          {selectedChat ? (
            <div className="flex">
              <div className="lg:w-3/4">
                <ChatConv me={user} selectedChat={selectedChat || null} />
              </div>
              <div className="lg:w-1/4">
                <ChatUsers members={selectedChat?.members ?? []} />
              </div>
            </div>
          ) : (
            <div className="lg:w-8/12 w-12/12">
              <div className="flex justify-center items-center h-full">
                <span className="text-xl">Select a channel</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)

export { ChatWithNavbar }
