import { UseMutateFunction, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import React from 'react'
import { FaEyeSlash, FaHashtag, FaLock, FaPlus } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { IoCloseSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { useChat } from '../../providers/ChatProvider'
import { EChannelType, IChannel, IChannelMember } from '../../types/Chat'
import { IUser } from '../../types/User'
import { leaveChannel } from '../../utils/chatHttpRequests'
import { EditChannelModal } from './Modals/EditChannelModal'
import { InviteChannelModal } from './Modals/InviteChannelModal'

type ChannelProps = {
  channel: IChannel
  selectedChannel?: string
  mutate: UseMutateFunction<IChannelMember, Error, string, unknown>
  user: IUser
}

const DirectMessageChannel = ({ channel, selectedChannel, mutate, user }: ChannelProps) => {
  const notMe = channel.members.find((m) => m.user.id !== user?.id)
  const queryClient = useQueryClient()
  const wrapperClass = clsx({
    ['flex hover:bg-base-300 items-center justify-between p-1 rounded']: true,
    ['bg-base-300']: channel.id === selectedChannel,
  })

  if (!notMe) return <></>
  return (
    <div className={wrapperClass}>
      <div>
        <button
          onClick={() => {
            mutate(channel.id)
          }}
          className='btn btn-ghost btn-sm'
        >
          <IoCloseSharp />
        </button>
      </div>
      <Link
        to={`/chat/${channel.id}`}
        className='flex cursor-pointer'
        onClick={async () => {
          await queryClient.invalidateQueries({
            queryKey: [channel.id],
          })
        }}
      >
        <div className='flex items-center mr-4'>
          <span className='ml-2 font-normal overflow-ellipsis'>{notMe.user.username}</span>
        </div>
      </Link>
    </div>
  )
}

const Channel = ({ channel, selectedChannel, mutate, user }: ChannelProps) => {
  const me = channel.members.find((m) => m.user.id === user?.id)
  const [isInviteModalOpen, setInviteModalOpen] = React.useState(false)
  const [isEditChannelModalOpen, setEditChannelModalOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const wrapperClass = clsx({
    ['flex hover:bg-base-100 items-center justify-between p-1 rounded border']: true,
    ['bg-base-100']: channel.id === selectedChannel,
  })

  if (!me) return <></>
  return (
    <div className={wrapperClass}>
      {EditChannelModal({ isEditChannelModalOpen, setEditChannelModalOpen, channel })}
      {InviteChannelModal({ isInviteModalOpen, setInviteModalOpen, channel })}
      <Link
        to={`/chat/${channel.id}`}
        className='flex cursor-pointer'
        onClick={async () => {
          await queryClient.invalidateQueries({
            queryKey: [channel.id],
          })
        }}
      >
        <div className='flex items-center mr-6 gap-4'>
          {channel.type === 'private' && <FaEyeSlash size={10} className='font-bold' />}
          {channel.type === 'protected' && <FaLock size={10} className='font-bold' />}
          {channel.type === 'public' && <FaHashtag size={10} className='font-bold' />}
          <span className='ml-2 font-normal overflow-ellipsis font-bold'>{channel.name}</span>
          {channel.members.filter((m) => m.present).length ?? 0}
        </div>
      </Link>
      <div className='mr-2'>
        {(me.role === 'admin' || me.role === 'owner') && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setInviteModalOpen(true)
            }}
            className='text-black hover:text-green-600 pl-3'
          >
            <FaPlus size={12} />
          </button>
        )}
        {me.role === 'owner' && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setEditChannelModalOpen(true)
            }}
            className='text-black hover:text-blue-600 pl-3'
          >
            <HiDotsVertical size={12} />
          </button>
        )}
        <button
          onClick={() => {
            mutate(channel.id)
          }}
          className='text-black hover:text-red-600 pl-3'
        >
          <IoCloseSharp size={12} />
        </button>
      </div>
    </div>
  )
}

type ChatSelectionProps = {
  channelId?: string
}

const ChatSelection = ({ channelId }: ChatSelectionProps) => {
  const { allChannels } = useChat()
  const { user } = useAuth()
  const { mutate } = useMutation({
    mutationFn: (channelId: string) => leaveChannel(channelId),
  })

  if (!user) return <></>

  const renderChannels = (channels: IChannel[]) => {
    return channels.map((channel) => {
      if (channel.type === EChannelType.direct) {
        return (
          <DirectMessageChannel
            channel={channel}
            key={channel.id}
            selectedChannel={channelId}
            mutate={mutate}
            user={user}
          />
        )
      }
      return (
        <Channel
          channel={channel}
          key={channel.id}
          selectedChannel={channelId}
          mutate={mutate}
          user={user}
        />
      )
    })
  }

  return (
    <div className='items-center gap-12'>
      <div className='p-2'>
        <h2 className='text-center text-base-content text-lg'>Channels</h2>
        <div className='m-2 overflow-y-auto max-h-screen'>{renderChannels(allChannels)}</div>
      </div>
    </div>
  )
}

export { ChatSelection }
