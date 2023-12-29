import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import React from 'react'
import { FaEyeSlash, FaHashtag, FaLock, FaUser } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'

import { useSelectedChannel } from '../../hooks/Channel.hook'
import { useAuth } from '../../providers/AuthProvider'
import { useChat } from '../../providers/ChatProvider'
import { useSocket } from '../../providers/SocketProvider'
import { IChannel, IChannelMember } from '../../types/Chat'
import { leaveChannel } from '../../utils/chatHttpRequests'

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
        {channel.type === 'private' && <FaEyeSlash size={12} className='text-base-content' />}
        {channel.type === 'protected' && <FaLock size={12} className='text-base-content' />}
        {channel.type === 'public' && <FaHashtag size={12} className='text-base-content' />}
        <span className='ml-2 font-normal'>{channel.name}</span>
      </>,
    )
  }
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
    onSuccess: () => {
      // const prevChannel = channels?.findIndex((channel) => channel.id === channelId) ?? 0
      // const prevChannelId = channels[Math.max(prevChannel - 1, 0)]?.id
      queryClient.invalidateQueries({
        queryKey: ['channels'],
      })
      // channels.length !== 1 ? navigate(`/chat/${prevChannelId}`) : navigate(`/chat`)
      navigate(`/chat`)
      socket.emit('leaveChannel', channelId)
    },
  })

  const leave = (channelId: string) => mutate(channelId)

  return (
    <div className='items-center gap-12'>
      <div tabIndex={0}>
        <div className='p-2'>
          <h2 className='text-center text-base-content'>Channels</h2>
          <div className='m-2 scroll-auto'>
            {channels &&
              channels.map((channel) => (
                <div key={channel.id} className='flex items-center'>
                  <button onClick={() => leave(channel.id)} className='btn btn-ghost btn-sm'>
                    <IoCloseSharp />
                  </button>
                  <Channel
                    channel={channel}
                    key={channel.id}
                    selectedChannel={channelId}
                    openChannelList={openChannelList}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ChatSelection }
