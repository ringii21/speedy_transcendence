import React, { useState } from 'react'
import {
  BrowserView,
  isBrowser,
  isDesktop,
  isMobile,
  isTablet,
  MobileOnlyView,
  MobileView,
  TabletView,
} from 'react-device-detect'
import { RxHamburgerMenu } from 'react-icons/rx'
import { Link, Navigate } from 'react-router-dom'

import { ChatConv, ChatSelection, ChatUsers } from '../components/Chat'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useChat } from '../providers/ChatProvider'
import { useSocket } from '../providers/SocketProvider'

const Chat = () => {
  const { user } = useAuth()
  const [channelList, setChannelList] = useState(true)
  const [conv, setConv] = useState(false)
  const [userChannelList, setUserChannelList] = useState(false)
  if (!user) return <Navigate to='/login' replace />
  const { socket, isConnected } = useSocket()
  if (!isConnected) socket?.connect()
  const { channel } = useChat()

  const handleChatSelectionOpen = () => {
    setConv(true)
    setChannelList(false)
    setUserChannelList(false)
  }

  const handleChatSelectionClose = () => {
    setChannelList(true)
    setConv(false)
    setUserChannelList(false)
  }

  const handleUserChannelList = () => {
    setConv(false)
    setUserChannelList(true)
    setChannelList(false)
  }

  const showUsersChannel = (): React.ReactNode => {
    let content: React.ReactNode = null
    if (channel?.data) {
      content = (
        <div className='bg-gray-100 w-2/6'>
          <ChatUsers members={channel.data.members ?? []} onClickConv={null} />
        </div>
      )
    } else content = <div></div>
    return content
  }

  const showUsersList = (): React.ReactNode => {
    let content: React.ReactNode = null
    if (channel?.data) {
      content = (
        <div className='h-screen w-screen'>
          <ChatConv me={user} onClickChannelList={null} onClickUserChannelList={null} />
        </div>
      )
    } else {
      content = (
        <div className='md:flex flex-col items-center mt-4 hidden'>
          <span className='text-xl'>Select a channel</span>
        </div>
      )
    }
    return content
  }

  const showUsersMobile = (): React.ReactNode => {
    let content: React.ReactNode = null
    if (channel?.data?.id) {
      if (conv && !channelList && !userChannelList) {
        content = (
          <div className='h-screen w-screen'>
            <ChatConv
              me={user}
              onClickChannelList={handleChatSelectionClose}
              onClickUserChannelList={handleUserChannelList}
            />
          </div>
        )
      } else if (!conv && !channelList && userChannelList) {
        content = (
          <div className='h-screen w-screen relative'>
            <ChatUsers members={channel.data.members ?? []} onClickConv={handleChatSelectionOpen} />
          </div>
        )
      } else {
        content = (
          <div className='bg-gray-100 relative sm:flex'>
            <ChatSelection onClick={() => handleChatSelectionOpen()} />
          </div>
        )
      }
    } else {
      content = (
        <div className='bg-gray-100 relative sm:flex'>
          <ChatSelection onClick={() => handleChatSelectionOpen()} />
        </div>
      )
    }
    return content
  }

  const changeWinFormat = () => {
    if (isMobile) {
      return (
        <MobileView>
          <div className='flex justify-between w-screen h-screen'>{showUsersMobile()}</div>
        </MobileView>
      )
    } else if (isDesktop || isTablet) {
      return (
        <div className='flex h-screen w-screen justify-between'>
          <div className='bg-gray-100 relative'>
            <ChatSelection onClick={null} />
          </div>
          {showUsersList()}
          {showUsersChannel()}
        </div>
      )
    }
  }
  return <div>{changeWinFormat()}</div>
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
