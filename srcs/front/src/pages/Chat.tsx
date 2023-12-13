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
  const [openUserList, setOpenUserList] = useState(false)
  if (!user) return <Navigate to='/login' replace />
  const { socket, isConnected } = useSocket()
  if (!isConnected) socket?.connect()
  const { channel } = useChat()

  const handleShow = setOpenUserList(true)

  const showUsers = () => {
    if (channel?.data) {
      return (
        <div className='bg-gray-100 relative hidden'>
          <ChatSelection />
        </div>
      )
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
            <div>
              <ChatSelection />
            </div>
          </div>
          {channel?.data ? (
            <div className='lg:w-4/6 w-screen'>
              <ChatConv me={user} />
            </div>
          ) : (
            <div className='flex justify-center items-center sm:hidden'>
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
      <MobileView>
        <div className='flex justify-between h-screen w-screen'>
          {showUsers()}
          {channel?.data ? (
            <div>
              <div className='lg:w-4/6 w-screen'>
                <ChatConv me={user} />
              </div>
              <div className='ml-4 flex bg-gray-100 w-2/6 relative'>
                <ChatUsers members={channel.data.members ?? []} />
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </MobileView>
      <TabletView>
        <div className='flex justify-between h-screen w-screen'>
          {showUsers()}
          {channel?.data ? (
            <div>
              <div className='lg:w-4/6 w-screen'>
                <ChatConv me={user} />
              </div>
              <div className='ml-4 flex bg-gray-100 w-2/6 relative'>
                <ChatUsers members={channel.data.members ?? []} />
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </TabletView>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
