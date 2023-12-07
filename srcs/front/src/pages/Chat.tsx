import React, { useEffect } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { WithNavbar } from '../hoc/WithNavbar'
import { useState } from 'react'
import { ChatSelection } from '../components/Chat/ChatSelection'
import { FindFriends } from '../components/Chat/FindFriends'
import { Navigate } from 'react-router-dom'
import { IChannel } from '../types/Chat'
import { ChatConv } from '../components/Chat/ChatConv'

type SelectedChat = IChannel | null

const Chat = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  const [selectedChat, setSelectedChat] = useState<SelectedChat>(null)
  return (
    <div className="flex bg-white px-2 h-full">
      <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
        <FindFriends />
        <ChatSelection
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col">
          {selectedChat ? (
            <div className="flex sm:items-center py-3 border-b-2 border-gray-200">
              <div className="relative flex items-center space-x-4">
                <ChatConv me={user} selectedChat={selectedChat || null} />
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
