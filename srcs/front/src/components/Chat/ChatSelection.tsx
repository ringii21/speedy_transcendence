import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { HiHashtag } from 'react-icons/hi2'

import { useChat } from '../../providers/ChatProvider'
import { IChannel } from '../../types/Chat'
import { getMyChannels } from '../../utils/chatHttpRequests'
import { CreateChannelModal } from './CreateChannelModal'
import { JoinChannelModal } from './JoinChannelModal'

interface PropsEvent {
  onClick: ((e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void) | null
}

const ChannelRow: React.FC<{
  channel: IChannel
  onClick: ((e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void) | null
  selected: boolean
}> = ({ channel, selected, onClick }) => (
  <tr
    onClick={onClick ? (e) => onClick(e) : undefined}
    className={clsx({
      'bg-base-200 border-b border-t border-gray-200': selected,
    })}
  >
    <td className='flex'>
      <HiHashtag size={10} />
      {channel.name}
    </td>
    <td>{channel.channelType}</td>
    <td>{0}</td>
  </tr>
)

const ChatSelection: React.FC<PropsEvent> = ({ onClick }) => {
  const { selectedChannel, setSelectedChannel } = useChat()
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)
  const channelsData = useQuery<IChannel[]>({
    queryKey: ['channels', 'joined'],
    queryFn: getMyChannels,
  })

  const handleClickEvent = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent> | null) => {
    if (onClick && e) onClick(e)
  }

  return (
    <div className='flex flex-col space-y-4 items-center pl-4 pr-4 lg:pr-4 mt-6 gap-12 w-screen lg:w-full md:w-full relative'>
      <div className='drawer'>
        <input id='my-drawer' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content'>
          <label htmlFor='my-drawer' className='btn btn-primary drawer-button'>
            Open drawer
          </label>
        </div>
        <div className='drawer-side'>
          <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
          <ul className='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
      <div className='flex justify-around'>
        <div className='flex flex-col sm:flex-row gap-4 border-b pb-8'>
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
            className='btn btn-secondary text-center'
          >
            Join Channel
          </button>
        </div>
      </div>
      <div className='collapse collapse-arrow'>
        <div tabIndex={0} className='collapse collapse-arrow'>
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
                    <ChannelRow
                      key={i}
                      channel={channel}
                      onClick={(e) => {
                        setSelectedChannel(channel.id)
                        if (e) handleClickEvent(e)
                      }}
                      selected={channel.id === (selectedChannel ?? null)}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div tabIndex={0} className='collapse collapse-arrow'>
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
