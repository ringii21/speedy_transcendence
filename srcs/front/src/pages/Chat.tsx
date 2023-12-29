import clsx from 'clsx'
import React, { useState } from 'react'
import { FaArrowLeft, FaHashtag, FaLock, FaUser } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { Navigate } from 'react-router-dom'

import { ChatConversation, ChatSelection, ChatUsers } from '../components/Chat'
import { WithNavbar } from '../hoc/WithNavbar'
import { useSelectedChannel } from '../hooks/Channel.hook'
import { useAuth } from '../providers/AuthProvider'
import { useSocket } from '../providers/SocketProvider'

const Chat = () => {
  const { user } = useAuth()
  const { channelData, isLoading } = useSelectedChannel()

  if (!user) return <Navigate to='/login' replace />

  const [channelList, setChannelList] = useState(false)
  const [userChannelList, setUserChannelList] = useState(false)

  const { socket, isConnected } = useSocket()
  if (!isConnected) socket?.connect()

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
          <div className='w-3/12'>
            <ChatSelection openChannelList={openChannelList} />
          </div>
          <div className='w-6/12'>
            <ChatConversation
              me={user}
              openChannelList={openChannelList}
              openUserList={openUserList}
            />
          </div>
          <div className='w-3/12'>
            <ChatUsers />
          </div>
        </div>
      )
    } else {
      return (
        <>
          {channelList || userChannelList ? (
            <>
              {channelList && <ChatSelection openChannelList={openChannelList} />}
              {userChannelList && <ChatUsers />}
            </>
          ) : (
            <ChatConversation
              me={user}
              openChannelList={openChannelList}
              openUserList={openUserList}
            />
          )}
        </>
      )
    }
  }

  const getChannelName = () => {
    if (channelData) {
      if (['public', 'private', 'protected'].includes(channelData.type)) {
        if (channelData.type === 'public') return `#${channelData.name}`
        if (channelData.type === 'private') return `🔒${channelData.name}`
        if (channelData.type === 'protected') return `🔒${channelData.name}`
      } else {
        return (
          <>
            <FaUser />
            {channelData?.members.map(({ user: mu }) => (mu.id !== user?.id ? mu.username : ''))}
          </>
        )
      }
    }
  }

  // no channel selected
  if (!channelData) {
    if (isDesktop) {
      return (
        <div className='w-screen md:flex'>
          <div className='flex flex-col items-center mt-4 w-3/12'>
            <ChatSelection openChannelList={openChannelList} />
          </div>
          <div className='w-6/12'>
            <div className='flex flex-col items-center mt-4'>
              <h1 className='text-2xl'>Select a channel</h1>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <ChatSelection openChannelList={openChannelList} />
      </div>
    )
  }

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between gap-6 mt-4 border-b pb-4'>
        <div className={arrowSubWrapperStyle}>
          <button type='button' className='btn btn-ghost' onClick={openChannelList}>
            <FaArrowLeft size={18} className='text-base-content mt-1' />
          </button>
        </div>
        {channelData && (
          <div className='flex justify-center items-center w-full'>{getChannelName()}</div>
        )}
        <div className={buttonArrowStyle}>
          <button type='button' className='btn btn-ghost' onClick={openUserList}>
            <FaUser size={18} className='text-base-content mt-1' />
          </button>
        </div>
      </div>
      {conditionnalRender()}
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
