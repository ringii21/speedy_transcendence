import { UseMutateFunction, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useState } from 'react'
import { FaEyeSlash, FaHashtag, FaLock, FaPlus, FaUser } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { IoCloseSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { useChat } from '../../providers/ChatProvider'
import { EChannelType, IChannel, IChannelMember } from '../../types/Chat'
import { IUser } from '../../types/User'
import { leaveChannel } from '../../utils/chatHttpRequests'
import { CreateChannelModal } from './Modals/CreateChannelModal'
import { EditChannelModal } from './Modals/EditChannelModal'
import { InviteChannelModal } from './Modals/InviteChannelModal'
import { JoinChannelModal } from './Modals/JoinChannelModal'

type ChannelProps = {
  channel: IChannel
  selectedChannel?: string
  mutate: UseMutateFunction<IChannelMember, Error, string, unknown>
  user: IUser
  onClickEvent: ((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void) | null
}

const DirectMessageChannel = ({
  channel,
  selectedChannel,
  mutate,
  user,
  onClickEvent,
}: ChannelProps) => {
  const notMe = channel.members.find((m) => m.user.id !== user?.id)
  const queryClient = useQueryClient()
  const wrapperClass = clsx({
    ['flex hover:bg-base-300 items-center justify-between p-1 rounded']: true,
    ['bg-base-100']: channel.id === selectedChannel,
  })

  if (!notMe) return <></>
  return (
    <div className='flex flex-col border-t-2'>
      <h1 className='font-bold text-center mt-3 border-b-2 pb-3'>Private Message</h1>
      <div className={wrapperClass}>
        <FaUser className='ml-5' />
        <Link
          to={`/chat/${channel.id}`}
          className='flex cursor-pointer'
          onClick={async (e) => {
            if (e && onClickEvent) {
              onClickEvent(e)
              await queryClient.invalidateQueries({
                queryKey: [channel.id],
              })
            }
          }}
        >
          <div className='flex items-center mr-4'>
            <span className='ml-6 overflow-ellipsis flex justify-center font-bold'>
              {notMe.user.username}
            </span>
          </div>
        </Link>
        <button
          onClick={() => {
            mutate(channel.id)
          }}
          className='btn btn-ghost btn-sm'
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  )
}

const Channel = ({ channel, selectedChannel, mutate, user, onClickEvent }: ChannelProps) => {
  const me = channel.members.find((m) => m.user.id === user?.id)
  const [isInviteModalOpen, setInviteModalOpen] = React.useState(false)
  const [isEditChannelModalOpen, setEditChannelModalOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const wrapperClass = clsx({
    ['grid grid-rows-1 hover:bg-base-300 items-center p-1 rounded']: true,
    ['bg-base-100']: channel.id !== selectedChannel,
  })

  if (!me) return <></>
  return (
    <div className={`${wrapperClass}`}>
      {EditChannelModal({ isEditChannelModalOpen, setEditChannelModalOpen, channel })}
      {InviteChannelModal({ isInviteModalOpen, setInviteModalOpen, channel })}
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row pl-3'>
          <FaUser className='mt-2' />
          <div className='pl-3 mt-1'>{channel.members.filter((m) => m.present).length ?? 0}</div>
        </div>
        <Link
          to={`/chat/${channel.id}`}
          className='flex cursor-pointer mt-1'
          onClick={async (e) => {
            if (onClickEvent && e) {
              onClickEvent(e)
            }
            await queryClient.invalidateQueries({
              queryKey: [channel.id],
            })
          }}
        >
          {channel.type === 'private' && (
            <FaEyeSlash size={12} className='text-base-content mt-2' />
          )}
          {channel.type === 'protected' && (
            <FaLock size={12} className='text-base-content mt-2 sm:w-5 sm:h-5' />
          )}
          {channel.type === 'public' && <FaHashtag size={12} className='text-base-content mt-2' />}
          <span className='ml-2 pr-7 overflow-ellipsis font-bold border-r-black'>
            {channel.name}
          </span>
        </Link>
        <div className='flex'>
          {(me.role === 'admin' || me.role === 'owner') && (
            <button
              onClick={(e) => {
                e.preventDefault()
                setInviteModalOpen(true)
              }}
              className='text-gray-700'
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
              className='text-gray-700 pl-3'
            >
              <HiDotsVertical size={12} />
            </button>
          )}
          <button
            onClick={() => {
              mutate(channel.id)
            }}
            className='btn btn-ghost btn-sm'
          >
            <IoCloseSharp />
          </button>
        </div>
      </div>
    </div>
  )
}

type ChatSelectionProps = {
  channelId?: string
  catchEvent: ((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void) | null
}

const ChatSelection = ({ channelId, catchEvent }: ChatSelectionProps) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setJoinModalOpen] = useState(false)

  const { allChannels } = useChat()
  const { user } = useAuth()
  const { mutate } = useMutation({
    mutationFn: (channelId: string) => leaveChannel(channelId),
  })

  if (!user) return <></>

  const channelPart = () => {
    return (
      <div className='flex flex-col gap-2 ml-3'>
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
        <h1 className='font-bold text-center pb-2 mt-3 border-b'>Channels</h1>
      </div>
    )
  }

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
            onClickEvent={catchEvent}
          />
        )
      }
      return (
        <div key={channel.id}>
          <Channel
            channel={channel}
            selectedChannel={channelId}
            mutate={mutate}
            user={user}
            onClickEvent={catchEvent}
          />
        </div>
      )
    })
  }

  return (
    <div className='flex flex-col justify-center space-y-4 pl-4 pr-4 mt-6 gap-12 w-screen md:w-full lg:w-full relative'>
      {CreateChannelModal({ isCreateModalOpen, setCreateModalOpen })}
      {JoinChannelModal({ isJoinModalOpen, setJoinModalOpen })}
      <div className='flex flex-col justify-around'>
        {channelPart()}
        {renderChannels(allChannels)}
      </div>
    </div>
  )
}

export { ChatSelection }
