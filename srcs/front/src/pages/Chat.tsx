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
    <div className='flex flex-col'>
      <div className='flex'>
        <div className='lg:w-4/12 w-12/12 mr-4'>
          <ChatSelection />
        </div>
        {channel?.data ? (
          <div className='lg:w-8/12 mr-4 flex justify-end'>
            <ChatConv me={user} />
          </div>
        ) : (
          <div className='lg:w-8/12 w-12/12'>
            <div className='flex justify-center items-center'>
              <span className='text-xl'>Select a channel</span>
            </div>
          </div>
        )}
        {channel?.data ? (
          <div className='lg:w-8/12 border ml-6 flex justify-end'>
            <div className='lg:w-1/4'>
              <ChatUsers members={channel.data.members ?? []} />
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)

export { ChatWithNavbar }
