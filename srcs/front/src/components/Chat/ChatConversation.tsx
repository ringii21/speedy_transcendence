import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { HiHashtag } from 'react-icons/hi2'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import { useChat } from '../../providers/ChatProvider'
import { useSocket } from '../../providers/SocketProvider'
import { FrontEndMessage, IChannel } from '../../types/Chat'
import { ChatSocketEvent } from '../../types/Events'
import { IUser } from '../../types/User'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'

type ChatChannelProps = {
  currentChannel: IChannel
  me: IUser
  onClickChannelList: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | null
  onClickUserChannelList: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | null
}

const ChatConversation = ({
  currentChannel,
  me,
  onClickChannelList,
  onClickUserChannelList,
}: ChatChannelProps) => {
  const currentRef = useRef<HTMLDivElement>(null)
  const { socket } = useSocket()
  const [messages, setMessages] = useState<FrontEndMessage[]>([])
  const [userChannelList, setUserChannelList] = useState(false)

  // if (!channel) return <span>Select a channel</span>

  // if (channel.isLoading) return <span className='loading loading-lg'></span>
  // if (channel.isError) return <span>Error</span>
  // if (!channel.data) return <span>No data</span>

  const handleChannelList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
    if (onClickChannelList && e !== null) onClickChannelList(e)
  }

  const handleUserList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
    setUserChannelList(true)
    if (onClickUserChannelList && e !== null) onClickUserChannelList(e)
  }

  useEffect(() => {
    if (!userChannelList) setUserChannelList(true)
  }, [userChannelList])

  useEffect(() => setMessages(currentChannel.messages), [currentChannel])

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollTo({
        top: currentRef.current.scrollHeight,
        behavior: 'auto',
      })
    }
  }, [messages])

  useEffect(() => {
    socket.on(ChatSocketEvent.MESSAGE, (newMessage: FrontEndMessage) => {
      if (newMessage.channelId === currentChannel.id) {
        setMessages((messages) => [...messages, newMessage])
      }
    })
  }, [])

  const arrowIsMobile = () => {
    if (isMobile) {
      return (
        <div className='flex justify-between gap-6 mt-4 border-b pb-4'>
          <div className='flex space-x-2 pl-4'>
            <button type='button' onClick={handleChannelList}>
              <IoIosArrowBack size={18} className='text-gray-500 mt-1' />
            </button>
          </div>
          <div className='flex align-items gap-2'>
            {currentChannel.type === 'public' && (
              <HiHashtag size={18} className='text-gray-500 mt-1' />
            )}
            <span className='text-gray-500'>{currentChannel.name}</span>
          </div>
          <div className='flex justify-end space-x-2 pr-4'>
            <button type='button' onClick={handleUserList}>
              <IoIosArrowForward size={18} className='text-gray-500 mt-1' />
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div className='flex justify-between gap-6 mt-4 border-b pb-4 ml-6 mr-6'>
          <div className='flex space-x-2 pl-4 md:hidden'>
            <button type='button' onClick={handleChannelList}>
              <IoIosArrowBack size={18} className='text-gray-500 mt-1' />
            </button>
          </div>
          <div className='flex align-items gap-2'>
            {currentChannel.type === 'public' && (
              <HiHashtag size={18} className='text-gray-500 mt-1' />
            )}
            <span className='text-gray-500'>{currentChannel.name}</span>
          </div>
          <div className='flex justify-end space-x-2 pr-4 md:hidden'>
            <button type='button' onClick={handleUserList}>
              <IoIosArrowForward size={18} className='text-gray-500 mt-1' />
            </button>
          </div>
        </div>
      )
    }
  }
  return (
    <div className='flex flex-col gap-6 box-content rounded-b-lg shadow-2xl h-3/4 justify-between bg-gray-100 relative'>
      {arrowIsMobile()}
      <div
        ref={currentRef}
        className='flex flex-col scroll rounded-lg overflow-y-auto scrollbar scrollbar-track-gray-200 scrollbar-thumb-gray-900 scrollbar-thin scrollbar-thumb-rounded-md'
      >
        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} user={me} members={currentChannel.members} />
        ))}
      </div>
      <div className='flex flex-col rounded-lg'>
        <ChatInput channelId={currentChannel.id} setMessage={setMessages} />
      </div>
    </div>
  )
}

export { ChatConversation }
