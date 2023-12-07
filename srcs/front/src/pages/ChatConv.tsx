import React, { useEffect } from 'react'
import { ChatProfil } from '../components/Chat/chatProfil'
import { useAuth } from '../providers/AuthProvider'
import { ChatBubble } from '../components/Chat/chatBubble'
import { WithNavbar } from '../hoc/WithNavbar'
import { useState } from 'react'
import { ChatSelection } from '../components/ChatContact'
import { IUser } from '../types/User'
import { FindFriends } from '../components/Chat/FindFriends'
import { Navigate, useNavigate } from 'react-router-dom'
import { ChatInput } from '../components/Chat/ChatInput'

type SelectedChat = IChannel | null

const ChatConv = () => {
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
      </div>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col">
        <div className="flex sm:items-center py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <ChatProfil name={userInfo.name} img={userInfo.img} />
          </div>
        </div>
        <div className="overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-screen bottom-0 h-full">
          <div id="messages" className="flex flex-col space-y-4 elliotp-3">
            {messages.map(
              (mymessage) =>
                user && (
                  <ChatBubble
                    key={mymessage.author.id}
                    message={mymessage}
                    user={user}
                  />
                ),
            )}
          </div>
        </div>
        <ChatInput />
      </div>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(ChatConv)

export { ChatWithNavbar }
