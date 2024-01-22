import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import {
  BrowserView,
  isDesktop,
  isMobile,
  isTablet,
  MobileView,
  TabletView,
} from 'react-device-detect'
import { Navigate, useParams } from 'react-router-dom'

import { ChatConversation, ChatSelection, ChatUsers } from '../components/Chat'
import { CreateChannelModal } from '../components/Chat/Modals/CreateChannelModal'
import { JoinChannelModal } from '../components/Chat/Modals/JoinChannelModal'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useChat } from '../providers/ChatProvider'
import { useSocket } from '../providers/SocketProvider'
import { IChannel } from '../types/Chat'

const Chat = () => {
  const { channelId } = useParams<{ channelId: string | undefined }>()
  const { user } = useAuth()
  const { allChannels } = useChat()
  const { socket } = useSocket()

  const [currentChannel, setCurrentChannel] = useState<IChannel | undefined>(undefined)

  const [userChannelList, setUserChannelList] = useState(false)
  const [channelList, setChannelList] = useState(true)
  const [conv, setConv] = useState(false)

  if (!user) return <Navigate to='/login' replace />

  useEffect(() => {
    const currChannel = allChannels.find((channel) => channel.id === channelId)
    setCurrentChannel(currChannel)
  }, [channelId, allChannels])

  useEffect(() => {
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleChatSelectionOpen = () => {
    console.log('Enter: ', 1)
    setConv(true)
    setChannelList(false)
    setUserChannelList(false)
  }

  const handleChatSelectionClose = () => {
    console.log('Enter: ', 2)
    setChannelList(true)
    setConv(false)
    setUserChannelList(false)
  }

  const handleUserChannelList = () => {
    console.log('Enter: ', 3)
    setConv(false)
    setUserChannelList(true)
    setChannelList(false)
  }

  // const channelPart = () => {
  //   return (
  //     <div className='lg:w-3/12 w-4/5'>
  //       <div className='flex flex-col gap-2 border-b ml-3 p-4'>
  //         <button
  //           onClick={(e) => {
  //             e.preventDefault()
  //             setCreateModalOpen(!isCreateModalOpen)
  //           }}
  //           className='btn btn-primary'
  //         >
  //           Add Channel
  //         </button>
  //         <button
  //           onClick={(e) => {
  //             e.preventDefault()
  //             setJoinModalOpen(!isJoinModalOpen)
  //           }}
  //           className='btn btn-secondary'
  //         >
  //           Join Channel
  //         </button>
  //       </div>
  //       <ChatSelection channelId={channelId} />
  //     </div>
  //   )
  // }

  console.log(
    'UseState value: \n',
    'Conv: ',
    conv,
    '\n',
    'channelList: ',
    channelList,
    '\n',
    'userChannelList:',
    userChannelList,
  )

  const showUsersMobile = (): React.ReactNode => {
    let content: React.ReactNode = null
    content = (
      <div className='bg-gray-100 relative w-3/12'>
        <ChatSelection channelId={channelId} catchEvent={handleChatSelectionOpen} />
      </div>
    )
    allChannels.map((channel) => {
      if (channel.id && currentChannel) {
        if (conv && !channelList && !userChannelList) {
          content = (
            <div className='h-screen w-full relative'>
              <ChatConversation
                currentChannel={currentChannel}
                me={user}
                onClickChannelList={handleChatSelectionClose}
                onClickUserChannelList={handleUserChannelList}
              />
            </div>
          )
        } else if (!conv && !channelList && userChannelList) {
          content = (
            <div className='h-screen w-screen bg-gray-100'>
              <ChatUsers channel={currentChannel} onClickConv={handleChatSelectionOpen} />
            </div>
          )
        } else if (!conv && channelList && !userChannelList) {
          content = (
            <div className='bg-gray-100 relative w-full'>
              <ChatSelection channelId={channelId} catchEvent={handleChatSelectionOpen} />
            </div>
          )
        }
      }
    })
    return content
  }

  const mobileFormat = () => {
    if (isDesktop) {
      console.log('Desktop')
      return (
        <BrowserView>
          <div className='flex h-screen w-screen justify-between'>
            {!currentChannel ? (
              <div className='bg-gray-100'>
                <ChatSelection channelId={channelId} catchEvent={handleChatSelectionOpen} />
              </div>
            ) : (
              <div className='flex h-screen w-screen justify-between'>
                {!conv && !userChannelList && (
                  <div className='bg-gray-100'>
                    <ChatSelection channelId={channelId} catchEvent={handleChatSelectionOpen} />
                  </div>
                )}
                {!channelList && !userChannelList && conv && (
                  <div className='w-6/12'>
                    <ChatConversation
                      currentChannel={currentChannel}
                      me={user}
                      onClickChannelList={handleChatSelectionClose}
                      onClickUserChannelList={handleUserChannelList}
                    />
                  </div>
                )}
                {!conv && !channelList && (
                  <div className='bg-gray-100'>
                    <ChatUsers channel={currentChannel} onClickConv={handleChatSelectionOpen} />
                  </div>
                )}
              </div>
            )}
          </div>
        </BrowserView>
      )
    } else if (isMobile || isTablet) {
      console.log('Mobile')
      return (
        <MobileView>
          <div className='flex justify-between w-screen h-screen'>{showUsersMobile()}</div>
        </MobileView>
      )
    }
  }

  return <div className='flex h-screen justify-around gap-5'>{mobileFormat()}</div>
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
