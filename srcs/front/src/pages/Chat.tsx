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
    <div className='h-full'>
      <h1 className='flex text-2xl text-center justify-center items-center border-b-2'>Chat</h1>
      <div className='grid grid-cols-12 px-2'>
        <div className='flex flex-col border-r-2 overflow-y-auto col-start-1 col-span-4'>
          <ChatSelection />
        </div>
        <div className='col-start-5 col-span-12'>
          {channel?.data ? (
            <div className='grid grid-cols-12'>
              <div className='relative space-x-4 bg-white py-3 border-b-2 border-gray-200 col-start-1 col-span-10'>
                <ChatConv me={user} />
              </div>
              <div className='relative flex flex-col space-x-4 border-l-2 col-end-13 col-span-2'>
                <ChatUsers members={channel.data.members ?? []} />
              </div>
            </div>
          ) : (
            <div className='lg:w-8/12 w-12/12'>
              <div className='flex justify-center items-center'>
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
