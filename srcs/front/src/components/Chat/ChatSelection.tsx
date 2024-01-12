import { UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import React from 'react'
import { FaEyeSlash, FaHashtag, FaLock } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'

import { useSelectedChannel } from '../../hooks/Channel.hook'
import { useAuth } from '../../providers/AuthProvider'
import { useChat } from '../../providers/ChatProvider'
import { useSocket } from '../../providers/SocketProvider'
import { IChannel, IChannelMember } from '../../types/Chat'
import { ChatSocketEvent } from '../../types/Events'
import { leaveChannel } from '../../utils/chatHttpRequests'

type ChannelProps = {
  channel: IChannel
  selectedChannel?: string
  openChannelList: () => void
  mutate: UseMutateFunction<IChannelMember, Error, string, unknown>
}

const Channel = ({ channel, selectedChannel, openChannelList, mutate }: ChannelProps) => {
  const { user } = useAuth()
  if (!user) return <></>

  const wrapperClass = clsx({
    ['flex hover:bg-base-300 items-center justify-between']: true,
    ['bg-base-300']: channel.id === selectedChannel,
  })

  const wrapper = (divs: React.JSX.Element) => (
    <div className={wrapperClass}>
      <button
        onClick={() => {
          mutate(channel.id)
        }}
        className='btn btn-ghost btn-sm'
      >
        <IoCloseSharp />
      </button>
      <Link
        onClick={openChannelList}
        to={`/chat/${channel.id}`}
        className='flex p-2 cursor-pointer'
      >
        <div className='flex items-center mr-4'>{divs}</div>
        <div className='flex-grow text-right'>
          {channel.members.filter((m) => m.present).length ?? 0}
        </div>
      </Link>
    </div>
  )

  return wrapper(
    <>
      {channel.type === 'private' && <FaEyeSlash size={12} className='text-base-content' />}
      {channel.type === 'protected' && <FaLock size={12} className='text-base-content' />}
      {channel.type === 'public' && <FaHashtag size={12} className='text-base-content' />}
      <span className='ml-2 font-normal'>{channel.name}</span>
    </>,
  )
}

type ChatSelectionProps = {
  openChannelList: () => void
}

const ChatSelection = ({ openChannelList }: ChatSelectionProps) => {
  const queryClient = useQueryClient()
  const { channelId } = useSelectedChannel()
  const navigate = useNavigate()
  const { socket } = useSocket()
  const { channels } = useChat()

  const { mutate } = useMutation({
    mutationKey: ['channels'],
    mutationFn: (channelId: string) => leaveChannel(channelId),
    onSuccess: (data: IChannelMember) => {
      // const prevChannel = channels?.findIndex((channel) => channel.id === channelId) ?? 0
      // const prevChannelId = channels[Math.max(prevChannel - 1, 0)]?.id
      queryClient.invalidateQueries({
        queryKey: ['channels'],
      })
      // channels.length !== 1 ? navigate(`/chat/${prevChannelId}`) : navigate(`/chat`)
      navigate(`/chat`)
    },
  })

  return (
    <div className='items-center gap-12'>
      <div className='p-2'>
        <h2 className='text-center text-base-content text-lg'>Channels</h2>
        <div className='m-2 scroll-auto'>
          {channels &&
            channels
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
              .map((channel) => (
                <Channel
                  channel={channel}
                  key={channel.id}
                  selectedChannel={channelId}
                  openChannelList={openChannelList}
                  mutate={mutate}
                />
              ))}
        </div>
      </div>
    </div>
  )
}

export { ChatSelection }
