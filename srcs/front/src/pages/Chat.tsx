import React, { useEffect, useState } from 'react'
import { FaHashtag, FaLock } from 'react-icons/fa'
import { IoEyeOffSharp } from 'react-icons/io5'
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
  const { chatSocket } = useSocket()

  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<IChannel | undefined>(undefined)

  if (!user) return <Navigate to='/login' replace />

  useEffect(() => {
    const currChannel = allChannels.find((channel) => channel.id === channelId)
    setCurrentChannel(currChannel)
  }, [channelId, allChannels])

  useEffect(() => {
    if (!chatSocket.connected) {
      chatSocket.connect()
    }
    return () => {
      chatSocket.disconnect()
    }
  }, [])

  const getChannelName = () => {
    if (currentChannel) {
      if (currentChannel.type === 'public') {
        return (
          <div className='flex items-center'>
            <FaHashtag className='mr-2' />
            {currentChannel.name}
          </div>
        )
      }
      if (currentChannel.type === 'private') {
        return (
          <div className='flex items-center'>
            <IoEyeOffSharp className='mr-2' />
            {currentChannel.name}
          </div>
        )
      }
      if (currentChannel.type === 'protected') {
        return (
          <div className='flex items-center'>
            <FaLock className='mr-2' />
            {currentChannel.name}
          </div>
        )
      }
      if (currentChannel.type === 'direct') {
        return (
          <div className='flex items-center'>
            {currentChannel.members.find((member) => member.userId !== user.id)?.user.username}
          </div>
        )
      }
    }
  }

  return (
    <div className='container mx-auto'>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
      <div className='gap-6 mt-4 border-b pb-4'>
        <div className='flex justify-center align-middle items-center w-full h-5'>
          {getChannelName()}
        </div>
      </div>
      <div className='flex flex-row'>
        <div className='w-3/12'>
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
          <ChatSelection channelId={channelId} />
        </div>
        {!currentChannel ? (
          <div className='w-9/12 items-center text-center'>
            <h1 className='text-2xl mt-32'>Select a channel</h1>
          </div>
        ) : (
          <>
            <div className='w-6/12'>
              <ChatConversation currentChannel={currentChannel} me={user} />
            </div>
            <div className='w-3/12'>
              <ChatUsers channel={currentChannel} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(Chat)
export { ChatWithNavbar }
