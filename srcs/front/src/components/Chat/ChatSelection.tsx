import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useState } from 'react'
import { HiHashtag, HiMiniPlusCircle } from 'react-icons/hi2'

import { useChat } from '../../providers/ChatProvider'
import { IChannel } from '../../types/Chat'
import { getMyChannels } from '../../utils/chatHttpRequests'
import { CreateChannelModal } from './CreateChannelModal'
import { JoinChannelModal } from './JoinChannelModal'

const ChatSelection = () => {
  const { selectedChannel, setSelectedChannel } = useChat()
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)

  const channelsData = useQuery<IChannel[]>({
    queryKey: ['channels', 'joined'],
    queryFn: getMyChannels,
  })
  return (
    <div className='flex flex-col space-y-4 h-screen bg-gray-900 pl-4 pr-4'>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
      <div className='flex justify-evenly mt-2 gap-2'>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              setCreateModalOpen(!isCreateModalOpen)
            }}
            className='btn btn-primary'
          >
            <HiMiniPlusCircle size={18} />
            Add Channel
          </button>
        </div>
        <div className=''>
          <button
            onClick={(e) => {
              e.preventDefault()
              setJoinModalOpen(!isJoinModalOpen)
            }}
            className='btn btn-secondary'
          >
            <HiMiniPlusCircle size={18} />
            Join Channel
          </button>
        </div>
      </div>
      <div tabIndex={0} className='collapse collapse-arrow bg-white'>
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium'>Channels</div>
        <div className='collapse-content'>
          <table className='table'>
            <thead>
              <tr>
                <th className='text-left'>Name</th>
                <th className='text-left'>Type</th>
                <th className='text-left'>User count</th>
              </tr>
            </thead>
            <tbody>
              {channelsData.isLoading && (
                <tr>
                  <td colSpan={2}>
                    <span className='loading loading-lg'></span>
                  </td>
                </tr>
              )}
              {!channelsData.isLoading &&
                channelsData.data &&
                channelsData.data.map((channel, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={clsx({
                      'bg-base-200': channel.id === (selectedChannel ?? null),
                    })}
                  >
                    <td className='flex'>
                      <HiHashtag size={10} />
                      {channel.name}
                    </td>
                    <td>{channel.channelType}</td>
                    <td>{0}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div tabIndex={0} className='collapse collapse-arrow bg-white'>
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium'>Private Messages</div>
        <div className='collapse-content'>
          {channelsData.isLoading && <span className='loading loading-lg'></span>}
          pms
        </div>
      </div>
    </div>
  )
}

export { ChatSelection }
