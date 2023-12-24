import clsx from 'clsx'
import React, { useState } from 'react'
import { FaHashtag, FaList, FaLock, FaUser } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { Navigate } from 'react-router-dom'

import { ChatConv, ChatSelection, ChatUsers } from '../components/Chat'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useChat } from '../providers/ChatProvider'
import { useSocket } from '../providers/SocketProvider'

const Chat = () => {
  const { user } = useAuth()
  const [channelList, setChannelList] = useState(false)
  const [userChannelList, setUserChannelList] = useState(false)
  if (!user) return <Navigate to='/login' replace />

  const { socket, isConnected } = useSocket()
  if (!isConnected) socket?.connect()
  const { channel, selectedChannel } = useChat()

  const isDesktop = useMediaQuery({ minWidth: 1224 })
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })

  const openChannelList = () => {
    if (userChannelList) setUserChannelList(!userChannelList)
    setChannelList(!channelList)
  }
  const openUserList = () => {
    if (channelList) setChannelList(!channelList)
    setUserChannelList(!userChannelList)
  }

  const arrowSubWrapperStyle = clsx({
    ['flex space-x-2 pl-4']: isTabletOrMobile,
    ['flex space-x-2 pl-4 md:hidden']: !isTabletOrMobile,
  })
  const buttonArrowStyle = clsx({
    ['flex justify-end space-x-2 pr-4']: isTabletOrMobile,
    ['flex justify-end space-x-2 pr-4 md:hidden']: !isTabletOrMobile,
  })

  const conditionnalRender = (): React.ReactNode => {
    if (isDesktop) {
      return (
        <div className='flex flex-row'>
          <div>
            <ChatSelection openChannelList={openChannelList} />
          </div>
          <div>
            <ChatConv me={user} openChannelList={openChannelList} openUserList={openUserList} />
          </div>
          <ChatUsers members={channel?.data?.members ?? []} />
        </div>
      )
    } else {
      return (
        <div className='flex flex-col'>
          {channelList || userChannelList ? (
            <div className='flex flex-col'>
              {channelList && <ChatSelection openChannelList={openChannelList} />}
              {userChannelList && <ChatUsers members={channel?.data?.members ?? []} />}
            </div>
          ) : (
            <ChatConv me={user} openChannelList={openChannelList} openUserList={openUserList} />
          )}
        </div>
      )
    }
  }

  // no channel selected
  if (!selectedChannel) {
    return (
      <div className='md:flex flex-col items-center mt-4'>
        <ChatSelection openChannelList={openChannelList} />
      </div>
    )
  }

  return (
    <div>
      <div className='flex justify-between gap-6 mt-4 border-b pb-4'>
        <div className={arrowSubWrapperStyle}>
          <button type='button' className='btn btn-ghost' onClick={openChannelList}>
            <FaList size={18} className='text-gray-500 mt-1' />
          </button>
        </div>
        {channel?.data && (
          <div className='flex items-center'>
            {channel.data.channelType === 'public' && <FaHashtag size={12} />}
            {['private', 'protected'].includes(channel.data.channelType) && <FaLock size={12} />}
            {channel.data.name}
          </div>
        )}
        <div className={buttonArrowStyle}>
          <button type='button' className='btn btn-ghost' onClick={openUserList}>
            <FaUser size={18} className='text-gray-500 mt-1' />
          </button>
        </div>
      </div>
      {conditionnalRender()}
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
