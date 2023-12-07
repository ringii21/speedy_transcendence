import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useState } from 'react'
import { HiHashtag, HiMiniPlusCircle } from 'react-icons/hi2'

import { IChannel } from '../../types/Chat'
import { getMyChannels } from '../../utils/chatHttpRequests'
import { CreateChannelModal } from './CreateChannelModal'
import { JoinChannelModal } from './JoinChannelModal'

type ChatSelectionProps = {
  selectedChat: IChannel | null
  setSelectedChat: React.Dispatch<React.SetStateAction<IChannel | null>>
}

const ChatSelection = ({
  selectedChat,
  setSelectedChat,
}: ChatSelectionProps) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)

  const channelsData = useQuery<IChannel[]>({
    queryKey: ['channels', 'joined'],
    queryFn: getMyChannels,
  })
  return (
    <div>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
      <div className="flex flex-col">
        <div className="flex w-full">
          <button
            onClick={(e) => {
              e.preventDefault()
              setCreateModalOpen(!isCreateModalOpen)
            }}
            className="btn btn-primary text-base w-1/2"
          >
            <HiMiniPlusCircle size={20} />
            Add Channel
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              setJoinModalOpen(!isJoinModalOpen)
            }}
            className="btn btn-secondary text-base w-1/2"
          >
            <HiMiniPlusCircle size={20} />
            Join Channel
          </button>
        </div>
        <div tabIndex={0} className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">Channels</div>
          <div className="collapse-content">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">User count</th>
                </tr>
              </thead>
              <tbody>
                {channelsData.isLoading && (
                  <tr>
                    <td colSpan={2}>
                      <span className="loading loading-lg"></span>
                    </td>
                  </tr>
                )}
                {!channelsData.isLoading &&
                  channelsData.data &&
                  channelsData.data.map((channel, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedChat(channel)}
                      className={clsx({
                        'bg-base-200':
                          channel.id === (selectedChat?.id ?? null),
                      })}
                    >
                      <td className="flex">
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
        <div tabIndex={0} className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            Private Messages
          </div>
          <div className="collapse-content">
            {channelsData.isLoading && (
              <span className="loading loading-lg"></span>
            )}
            pms
          </div>
        </div>
      </div>
    </div>
  )
}

export { ChatSelection }
