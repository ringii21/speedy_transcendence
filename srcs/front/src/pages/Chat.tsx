import React from 'react'
import { Navigate } from 'react-router-dom'

import { ChatConv, ChatSelection, ChatUsers } from '../components/Chat'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useChat } from '../providers/ChatProvider'
import { useSocket } from '../providers/SocketProvider'

const Chat = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' replace />
  const { socket, isConnected } = useSocket()
  if (!isConnected) socket?.connect()
  const { channel } = useChat()

  return (
    <div className='flex justify-between h-screen w-screen'>
      <div className=' bg-gray-100 relative'>
        <ChatSelection />
      </div>
      {/* {channel?.data ? (
        <div className='w-4/6'>
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
      )} */}
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)

export { ChatWithNavbar }
