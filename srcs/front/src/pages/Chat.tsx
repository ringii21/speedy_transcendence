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
    <div>
      <h1 className='text-2xl text-center'>Chat</h1>
      <hr />
      <div className='flex'>
        <div className='lg:w-4/12 w-12/12'>
          <ChatSelection />
        </div>
        <div className='lg:w-8/12'>
          {channel?.data ? (
            <div className='flex'>
              <div className='lg:w-3/4'>
                <ChatConv me={user} />
              </div>
              <div className='lg:w-1/4'>
                <ChatUsers members={channel.data.members ?? []} />
              </div>
            </div>
          ) : (
            <div className='lg:w-8/12 w-12/12'>
              <div className='flex justify-center items-center h-full'>
                <span className='text-xl'>Select a channel</span>
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
