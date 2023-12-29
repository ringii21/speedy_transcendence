import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useState } from 'react'
import { FaHashtag, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { useSelectedChannel } from '../../hooks/Channel.hook'
import { useAuth } from '../../providers/AuthProvider'
import { IChannel, IChannelMember } from '../../types/Chat'
import { getMyChannels } from '../../utils/chatHttpRequests'
import { CreateChannelModal } from './CreateChannelModal'
import { JoinChannelModal } from './JoinChannelModal'

type ChannelProps = {
  channel: IChannel
  selectedChannel?: string
  openChannelList: () => void
}

const Channel = ({ channel, selectedChannel, openChannelList }: ChannelProps) => {
  const { user } = useAuth()
  if (!user) return <></>
  const findNotMe = (members?: IChannelMember[]) => {
    return members?.find((member) => member.userId !== user.id)?.user.username || 'No Name'
  }
  const chatClass = (id: string, selectedId?: string) =>
    clsx({
      ['flex p-2 hover:bg-base-300 cursor-pointer']: true,
      ['bg-base-300']: id === selectedId,
    })

  const wrapper = (divs: React.JSX.Element) => (
    <Link
      onClick={() => {
        openChannelList()
      }}
      to={`/chat/${channel.id}`}
      className={chatClass(channel.id, selectedChannel)}
    >
      <div className='flex items-center mr-4'>{divs}</div>
      <div className='flex-grow text-right'>{channel.members?.length || 0}</div>
    </Link>
  )
  if (channel.type === 'direct') {
    return wrapper(
      <>
        <FaUser size={12} className='text-base-content' />
        <span className='ml-2 font-normal'>{findNotMe(channel.members)}</span>
      </>,
    )
  } else {
    return wrapper(
      <>
        <FaHashtag size={12} className='text-base-content' />
        <span className='ml-2 font-normal'>{channel.name}</span>
      </>,
    )
  }
}

type ChatSelectionProps = {
  openChannelList: () => void
}

const ChatSelection = ({ openChannelList }: ChatSelectionProps) => {
  const { channelId } = useSelectedChannel()

  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)

  const channelsData = useQuery<IChannel[]>({
    queryKey: ['channels', 'joined'],
    queryFn: getMyChannels,
  })

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
      <div tabIndex={0}>
        <div className='p-2'>
          <h2 className='text-center text-base-content'>Channels</h2>
          <div className='m-2'>
            {channelsData.data &&
              channelsData.data.map((channel, i) => (
                <Channel
                  channel={channel}
                  key={i}
                  selectedChannel={channelId}
                  openChannelList={openChannelList}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ChatSelection }
