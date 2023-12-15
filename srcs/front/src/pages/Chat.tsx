import React, { useState } from 'react'
import { BrowserView, MobileView, TabletView } from 'react-device-detect'
import { Navigate } from 'react-router-dom'

import { ChatConv, ChatSelection, ChatUsers } from '../components/Chat'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useChat } from '../providers/ChatProvider'
import { useSocket } from '../providers/SocketProvider'

const Chat = () => {
  const { user } = useAuth()
  const [showUserList, setShowUserList] = useState(true)
  const [openShowConv, setShowConv] = useState(false)

  if (!user) return <Navigate to='/login' replace />
  const { socket, isConnected } = useSocket()
  if (!isConnected) socket?.connect()
  const { channel } = useChat()

  const handleChatSelectionOpen = () => {
    setShowConv(true)
    setShowUserList(false)
  }

  const handleChatSelectionClose = () => {
    setShowUserList(true)
    setShowConv(false)
  }

  const showUsersChannel = (): React.ReactNode => {
    let content: React.ReactNode = null
    if (channel?.data) {
      content = (
        <div className='ml-4 flex bg-gray-100 w-2/6 relative'>
          <ChatUsers members={channel.data.members ?? []} />
        </div>
      )
    } else content = <div></div>
    return content
  }

  const showUsersList = (): React.ReactNode => {
    let content: React.ReactNode = null
    if (channel?.data) {
      content = (
        <div className='w-2/5'>
          <ChatConv me={user} onClickEvent={null} />
        </div>
      )
    } else {
      content = (
        <div className='flex flex-col items-center mt-4'>
          <span className='text-xl'>Select a channel</span>
        </div>
      )
    }
    return content
  }

  const showUsersMobile = (): React.ReactNode => {
    let content: React.ReactNode = null
    if (channel?.data?.id && openShowConv && !showUserList) {
      content = (
        <div className='h-screen w-screen'>
          <ChatConv me={user} onClickEvent={handleChatSelectionClose} />
        </div>
      )
    } else {
      content = (
        <div className='bg-gray-100 relative'>
          <ChatSelection onClick={() => handleChatSelectionOpen()} />
        </div>
      )
    }
    return content
  }
  return (
    <div>
      <BrowserView>
        <div className='flex justify-between h-screen w-screen'>
          <div className='bg-gray-100 relative'>
            <ChatSelection onClick={null} />
          </div>
          {showUsersList()}
          {showUsersChannel()}
        </div>
      </BrowserView>
      <TabletView>
        <div className='flex justify-between h-screen w-screen'>
          <div className='bg-gray-100 relative'>
            <ChatSelection onClick={null} />
          </div>
          {showUsersList()}
          {showUsersChannel()}
        </div>
      </TabletView>
      <MobileView>
        <div className='flex justify-between w-screen h-screen'>{showUsersMobile()}</div>
      </MobileView>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
