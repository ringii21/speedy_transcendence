import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { ChatConversation, ChatSelection, ChatUsers } from '../components/Chat'
import { CreateChannelModal } from '../components/Chat/CreateChannelModal'
import { JoinChannelModal } from '../components/Chat/JoinChannelModal'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useChat } from '../providers/ChatProvider'
import { IChannel } from '../types/Chat'

const Chat = () => {
  const { channelId } = useParams<{ channelId: string | undefined }>()
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)
  const { user } = useAuth()
  const { channelMap } = useChat()

  const [currentChannel, setCurrentChannel] = useState<IChannel | undefined>(undefined)
  if (!user) return <Navigate to='/login' replace />
  useEffect(() => {
    const currChannel = channelMap.find((channel) => channel.id === channelId)
    setCurrentChannel(currChannel)
  }, [channelId, channelMap])

  const getChannelName = () => {
    if (currentChannel) {
      if (['public', 'private', 'protected'].includes(currentChannel.type)) {
        if (currentChannel.type === 'public') return `#${currentChannel.name}`
        if (currentChannel.type === 'private') return `🔒${currentChannel.name}`
        if (currentChannel.type === 'protected') return `🔒${currentChannel.name}`
      }
    }
  }

  return (
    <div className='container mx-auto'>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
      <div className='flex justify-between gap-6 mt-4 border-b pb-4'>
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
          <div className='flex flex-col gap-2 p-4'>
            <ChatSelection channelId={channelId} />
          </div>
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
