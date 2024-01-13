import { UseMutateFunction, useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import React from 'react'
import { FaEyeSlash, FaHashtag, FaLock } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { useChat } from '../../providers/ChatProvider'
import { IChannel, IChannelMember } from '../../types/Chat'
import { leaveChannel } from '../../utils/chatHttpRequests'

type ChannelProps = {
  channel?: IChannel
  selectedChannel?: string
  mutate: UseMutateFunction<IChannelMember, Error, string, unknown>
}

const Channel = ({ channel, selectedChannel, mutate }: ChannelProps) => {
  const { user } = useAuth()
  if (!user || !channel) return <></>

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
      <Link to={`/chat/${channel.id}`} className='flex p-2 cursor-pointer'>
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
  channelId?: string
}

const ChatSelection = ({ channelId }: ChatSelectionProps) => {
  const { myChannels, channelMap } = useChat()

  const { mutate } = useMutation({
    mutationFn: (channelId: string) => leaveChannel(channelId),
  })
  return (
    <div className='items-center gap-12'>
      <div className='p-2'>
        <h2 className='text-center text-base-content text-lg'>Channels</h2>
        <div className='m-2 scroll-auto'>
          {myChannels
            // .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            .map((channel) => (
              <Channel
                channel={channelMap.find((c) => c.id === channel.id)}
                key={channel.id}
                selectedChannel={channelId}
                mutate={mutate}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export { ChatSelection }
