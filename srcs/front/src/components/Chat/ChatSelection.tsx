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
import { IChannel, IChannelMember } from '../../types/Chat'
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

const Channel = ({ channel, selectedChannel, mutate, user }: ChannelProps) => {
  const me = channel.members.find((m) => m.user.id === user?.id)
  const [isInviteModalOpen, setInviteModalOpen] = React.useState(false)
  const [isEditChannelModalOpen, setEditChannelModalOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const wrapperClass = clsx({
    ['flex hover:bg-base-300 items-center justify-between p-1 rounded']: true,
    ['bg-base-300']: channel.id === selectedChannel,
  })

  if (!me) return <></>
  return (
    <div className={wrapperClass}>
      {EditChannelModal({ isEditChannelModalOpen, setEditChannelModalOpen, channel })}
      {InviteChannelModal({ isInviteModalOpen, setInviteModalOpen, channel })}
      <div>
        <button
          onClick={() => {
            mutate(channel.id)
          }}
          className='btn btn-ghost btn-sm'
        >
          <IoCloseSharp />
        </button>
        {(me.role === 'admin' || me.role === 'owner') && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setInviteModalOpen(true)
            }}
            className='btn btn-ghost btn-sm'
          >
            <FaPlus />
          </button>
        )}
        {me.role === 'owner' && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setEditChannelModalOpen(true)
            }}
            className='btn btn-ghost btn-sm'
          >
            <HiDotsVertical />
          </button>
        )}
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
          {channel.type === 'private' && <FaEyeSlash size={12} className='text-base-content' />}
          {channel.type === 'protected' && <FaLock size={12} className='text-base-content' />}
          {channel.type === 'public' && <FaHashtag size={12} className='text-base-content' />}
          <span className='ml-2 font-normal overflow-ellipsis'>{channel.name}</span>
        </div>
        <div>{channel.members.filter((m) => m.present).length ?? 0}</div>
      </Link>
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

  return (
    <div className='items-center gap-12'>
      <div className='p-2'>
        <h2 className='text-center text-base-content text-lg'>Channels</h2>
        <div className='m-2 overflow-y-auto max-h-screen'>
          {allChannels.map((channel) => (
            <Channel
              channel={channel}
              key={channel.id}
              selectedChannel={channelId}
              mutate={mutate}
              user={user}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export { ChatSelection }
