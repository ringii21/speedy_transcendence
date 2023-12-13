import React, { useState } from 'react'
import { BrowserView, isDesktop, isMobile, MobileView, TabletView } from 'react-device-detect'
import { Navigate } from 'react-router-dom'

import { ChatConv, ChatSelection, ChatUsers } from '../components/Chat'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useChat } from '../providers/ChatProvider'
import { useSocket } from '../providers/SocketProvider'

const Chat = () => {
  const { user } = useAuth()
  const [showUserList, setShowUserList] = useState(false)
  const [openShowChannel, setShowUserChannel] = useState(false)
  const [openShowConv, setShowConv] = useState(false)

  if (!user) return <Navigate to='/login' replace />
  const { socket, isConnected } = useSocket()
  if (!isConnected) socket?.connect()
  const { channel } = useChat()

  const handleChatSelectionOpen = () => {
    setShowConv(false)
    setShowUserList(true)
  }

  const handleChatSelectionClose = () => {
    setShowUserList(false)
    setShowConv(true)
  }

  const handleChatConvOpen = () => {
    setShowConv(true)
  }

  const handleChatConvClose = () => {
    setShowConv(false)
  }

  const print = () => {
    console.log('HEY')
  }

  const showUsers = () => {
    if (channel?.data) {
      return (
        <div>
          {ChatConv({openShowConv, setShowConv})}
          <div className='h-screen w-screen'>
            <ChatConv me={user} />
          </div>
        </div>
        )
      }
    } else {
      return (
        <div className='bg-gray-100 relative'>
          <ChatSelection />
        </div>
      )
    }
  }

  return (
    <div>
      <BrowserView>
        <div className='flex justify-between h-screen w-screen'>
          <div className='bg-gray-100 relative'>
            <ChatSelection />
          </div>
          {channel?.data ? (
            <div className='w-2/5'>
              <ChatConv me={user} onClickCallback={null} />
            </div>
          ) : (
            <div className='flex flex-col items-center mt-4'>
              <span className='text-xl'>Select a channel</span>
            </div>
          )}
          {channel?.data ? (
            <div className='ml-4 flex bg-gray-100 w-2/6 relative'>
              <ChatUsers members={channel.data.members ?? []} />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </BrowserView>
      <TabletView>
        <div className='flex justify-between h-screen w-screen'>
          <div className='bg-gray-100 relative'>
            <ChatSelection />
          </div>
          {channel?.data ? (
            <div className='w-2/5'>
              <ChatConv me={user} onClickCallback={null} />
            </div>
          ) : (
            <div className='flex justify-center items-center'>
              <span className='text-xl'>Select a channel</span>
            </div>
          )}
          {channel?.data ? (
            <div className='ml-4 flex bg-gray-100 w-2/6 relative'>
              <ChatUsers members={channel.data.members ?? []} />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </TabletView>
      <MobileView>
        <div className='flex justify-between w-screen h-screen'>
          {showUsers(showUserList, openShowConv, openShowChannel)}
        </div>
      </MobileView>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
