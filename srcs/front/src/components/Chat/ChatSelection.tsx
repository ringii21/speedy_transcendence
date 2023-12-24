import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useState } from 'react'
import { FaHashtag } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import { useChat } from '../../providers/ChatProvider'
import { IChannel } from '../../types/Chat'
import { getMyChannels, getMyPrivateChannels } from '../../utils/chatHttpRequests'
import { CreateChannelModal } from './CreateChannelModal'
import { JoinChannelModal } from './JoinChannelModal'

const ChatSelection = ({ openChannelList }: { openChannelList: () => void }) => {
  const { channelId } = useParams()
  const { selectedChannel, setSelectedChannel } = useChat()
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)

  const channelsData = useQuery<IChannel[]>({
    queryKey: ['channels', 'joined'],
    queryFn: getMyChannels,
  })

  const privateChannelsData = useQuery<IChannel[]>({
    queryKey: ['private'],
    queryFn: getMyPrivateChannels,
  })

  const chatClass = (id: number, selectedId: number | null) =>
    clsx({
      ['flex p-2 hover:bg-gray-100 hover:rounded cursor-pointer']: true,
      ['flex p-2 hover:bg-gray-100 hover:rounded cursor-pointer bg-base-200']: id === selectedId,
    })

  const collapseClass = (open: boolean, hasChannels: boolean) =>
    clsx({
      ['collapse collapse-arrow']: true,
      ['collapse collapse-arrow collapse-open']: open && hasChannels,
      ['collapse collapse-arrow collapse-close']: open && hasChannels,
    })

  const hasChannelSelected = (selectedChannel: number | null) => {
    if (!selectedChannel) return false
    if (channelsData.data?.length === 0) return false
    const channel = channelsData.data?.find((channel) => channel.id === selectedChannel)
    if (!channel) return false
    if (channel.channelType !== 'direct') return true
    return false
  }

  const hasPrivateMessageSelected = (selectedChannel: number | null) => {
    if (!selectedChannel) return false
    if (privateChannelsData.data?.length === 0) return false
    const channel = privateChannelsData.data?.find((channel) => channel.id === selectedChannel)
    if (!channel) return false
    if (channel.channelType === 'direct') return true
    return false
  }

  return (
    <div className='items-center gap-12'>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
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
      <div
        tabIndex={0}
        className={collapseClass(
          hasChannelSelected(selectedChannel),
          (channelsData.data?.length ?? 0) > 0,
        )}
      >
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium'>Channels</div>
        <div className='collapse-content visible'>
          {channelsData.data &&
            channelsData.data.map((channel, i) => (
              <div
                key={i}
                className={chatClass(channel.id, selectedChannel)}
                onClick={(e) => {
                  e.preventDefault()
                  if (selectedChannel !== channel.id) {
                    setSelectedChannel(channel.id)
                    openChannelList()
                  }
                }}
              >
                <div className='flex items-center mr-4'>
                  <FaHashtag size={12} className='text-gray-500' />
                  <span className='ml-2 font-normal'>{channel.name}</span>
                </div>
                <div className='flex-grow text-right'>{channel.members?.length || 0}</div>
              </div>
            ))}
        </div>
      </div>
      <div
        tabIndex={0}
        className={collapseClass(
          hasPrivateMessageSelected(selectedChannel),
          (privateChannelsData.data?.length ?? 0) > 0,
        )}
      >
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium'>Private Messages</div>
        <div className='collapse-content'>
          {privateChannelsData.isLoading && <span className='loading loading-lg'></span>}
          {privateChannelsData.data &&
            privateChannelsData.data.map((channel, i) => (
              <div
                key={i}
                className={chatClass(channel.id, selectedChannel)}
                onClick={(e) => {
                  e.preventDefault()
                  if (selectedChannel !== channel.id) {
                    setSelectedChannel(channel.id)
                    openChannelList()
                  }
                }}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export { ChatSelection }
