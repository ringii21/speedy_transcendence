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
      'bg-base-200 border-b border-gray-300': selected,
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

  let idConv = 0
  const handleClickEvent = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent> | null,
    id: number,
  ) => {
    if (id > 0) idConv = id
    if (onClick && e && idConv) {
      console.log('Child event')
      console.log('id: ' + id)
      onClick(e)
    }
  }

  return (
    <div className='flex flex-col space-y-4 items-center pl-4 pr-4 lg:pr-4 mt-6 gap-12 w-screen lg:w-full md:w-full relative'>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
      <div className='flex lg:flex-row md:flex-row sm:flex-col justify-evenly flex-col gap-4 border-b pb-8'>
        <button
          onClick={(e) => {
            e.preventDefault()
            setCreateModalOpen(!isCreateModalOpen)
          }}
          className='btn btn-primary '
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
                        idConv = channel.id
                        setSelectedChannel(channel.id)
                        if (e) handleClickEvent(e, channel.id)
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
