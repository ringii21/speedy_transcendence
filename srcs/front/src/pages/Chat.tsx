import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaUser } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { Navigate } from 'react-router-dom'

import { ChatConversation, ChatSelection, ChatUsers } from '../components/Chat'
import { CreateChannelModal } from '../components/Chat/CreateChannelModal'
import { JoinChannelModal } from '../components/Chat/JoinChannelModal'
import { WithNavbar } from '../hoc/WithNavbar'
import { useSelectedChannel } from '../hooks/Channel.hook'
import { useAuth } from '../providers/AuthProvider'
import { useChat } from '../providers/ChatProvider'
import { useSocket } from '../providers/SocketProvider'
import { ChatSocketEvent } from '../types/Events'
import { IChannelMessage } from '../types/Message'

const Chat = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)
  const { user } = useAuth()
  const { messages, setMessages } = useChat()
  const queryClient = useQueryClient()

  const { channelData } = useSelectedChannel()

  if (!user) return <Navigate to='/login' replace />

  const [channelList, setChannelList] = useState(false)
  const [userChannelList, setUserChannelList] = useState(false)

  const { socket, isConnected } = useSocket()
  if (!isConnected) socket.connect()

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

  useEffect(() => {
    if (!channelData) return
    setMessages((messages) => {
      return {
        ...messages,
        [channelData.id]: channelData.messages ?? [],
      }
    })
  }, [channelData])

  useEffect(() => {
    const messageListener = (message: IChannelMessage) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [message.channelId]: [...(prevMessages[message.channelId] ?? []), message],
      }))
    }
    socket.on('message', messageListener)
    socket.on(ChatSocketEvent.JOIN_CHANNEL, () => {
      queryClient.invalidateQueries({
        queryKey: ['channels'],
      })
    })
  }, [])

  const arrowSubWrapperStyle = clsx({
    ['flex space-x-2 pl-4']: isTabletOrMobile,
    ['flex space-x-2 pl-4 md:hidden']: !isTabletOrMobile,
  })

  const buttonArrowStyle = clsx({
    ['flex justify-end space-x-2 pr-4']: isTabletOrMobile,
    ['flex justify-end space-x-2 pr-4 md:hidden']: !isTabletOrMobile,
  })

  const selectionStyle = clsx({
    ['w-3/12']: isDesktop,
    ['w-full']: isTabletOrMobile,
  })

  const conversationStyle = clsx({
    ['w-6/12']: isDesktop,
    ['w-full']: isTabletOrMobile,
  })

  const userStyle = clsx({
    ['w-3/12']: isDesktop,
    ['w-full']: isTabletOrMobile,
  })

  const renderChannelsButtons = () => {
    return (
      <div className='flex flex-col gap-2 border-b p-4'>
        <button
          onClick={(e) => {
            e.preventDefault()
            setCreateModalOpen(!isCreateModalOpen)
          }}
          className='btn btn-primary'
        >
          Add Channel
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            setJoinModalOpen(!isJoinModalOpen)
          }}
          className='btn btn-secondary'
        >
          Join Channel
        </button>
      </div>
    )
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

  const promptRequestChannel = () => {
    return (
      <div className='w-9/12 items-center text-center'>
        <h1 className='text-2xl mt-32'>Select a channel</h1>
      </div>
    )
  }
  const renderChatSelection = () => {
    return (
      <>
        {renderChannelsButtons()}
        <ChatSelection openChannelList={openChannelList} />
      </>
    )
  }

  const renderChatConversation = () => {
    return (
      <ChatConversation
        messages={messages[channelData?.id ?? ''] ?? []}
        channel={channelData}
        me={user}
        openChannelList={openChannelList}
        openUserList={openUserList}
      />
    )
  }

  const renderUserList = () => {
    return <ChatUsers />
  }

  /**
   *
   * @return
   */
  const mobileRender = () => {
    if (!channelData) return <div className={selectionStyle}>{renderChatSelection()}</div>
    if (channelList || userChannelList) {
      return (
        <>
          {channelList && <div className={selectionStyle}>{renderChatSelection()}</div>}
          {userChannelList && <div className={conversationStyle}>{renderUserList()}</div>}
        </>
      )
    }
    return <div className={conversationStyle}>{renderChatConversation()}</div>
  }

  /**
   *
   * @return
   */
  const desktopRender = () => {
    return (
      <>
        <div className={selectionStyle}>{renderChatSelection()}</div>
        {!channelData ? (
          promptRequestChannel()
        ) : (
          <>
            <div className={conversationStyle}>{renderChatConversation()}</div>
            <div className={userStyle}>{renderUserList()}</div>
          </>
        )}
      </>
    )
  }

  return (
    <div className='container mx-auto'>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
      <div className='flex justify-between gap-6 mt-4 border-b pb-4'>
        <div className={arrowSubWrapperStyle}>
          <button type='button' className='btn btn-ghost' onClick={openChannelList}>
            <FaArrowLeft size={18} className='text-base-content mt-1' />
          </button>
        </div>
        <div className='flex justify-center align-middle items-center w-full h-5'>
          {getChannelName()}
        </div>
        <div className={buttonArrowStyle}>
          <button type='button' className='btn btn-ghost' onClick={openUserList}>
            <FaUser size={18} className='text-base-content mt-1' />
          </button>
        </div>
      </div>
      <div className='flex flex-row'>{isDesktop ? desktopRender() : mobileRender()}</div>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
