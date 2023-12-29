import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { FC, HTMLAttributes } from 'react'
import { FaCrown, FaGavel, FaUser } from 'react-icons/fa'
import { PiSwordFill } from 'react-icons/pi'
import { Link, useNavigate } from 'react-router-dom'

import { useSelectedChannel } from '../../hooks/Channel.hook'
import { useAuth } from '../../providers/AuthProvider'
import { IChannelMember } from '../../types/Chat'
import { IUser } from '../../types/User'
import { createPm } from '../../utils/chatHttpRequests'
import { UserActionModal } from './UserActionModal'

type UserProps = HTMLAttributes<HTMLDivElement> & {
  member: IChannelMember
  index: number
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  modalOpen: boolean
  setSelectedUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const User: FC<UserProps> = ({ member, index, setModalOpen, modalOpen, setSelectedUser }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const userStyle = clsx({
    'flex justify-between cursor-pointer hover:bg-accent hover:text-accent-content text-base-content':
      true,
    'bg-base-100': index % 2 === 0,
    'bg-base-200': index % 2 === 1,
  })

  const { mutate } = useMutation({
    mutationFn: createPm,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['channels'],
      })
      navigate(`/chat/${data.id}`)
      console.log('success')
    },
    onError: () => {
      console.log('error')
    },
  })

  const onClickAction = () => {
    setSelectedUser(member.user)
    setModalOpen(!modalOpen)
  }

  return (
    <div
      onClick={() => {
        if (member.user.id !== user?.id) mutate(member.user.id)
      }}
      className={userStyle}
    >
      <div className='flex items-center'>
        {member.role == 'owner' && <FaCrown className='text-error mt-1 m-1' />}
        {member.role == 'admin' && <PiSwordFill className='text-warning mt-1 m-1' />}
        {member.role == 'user' && <FaUser className='text-base mt-1 m-1' />}
        {member.user.username}
      </div>
      <div className='flex items-center gap-2'>
        {member.user.id !== user?.id && (
          <Link className='btn btn-xs btn-primary' to={`/profile/${member.user.id}`}>
            <FaUser />
          </Link>
        )}
        {(member.role === 'owner' || member.role === 'admin') && member.user.id !== user?.id && (
          <button onClick={onClickAction} className='btn btn-xs btn-secondary'>
            <FaGavel />
          </button>
        )}
      </div>
    </div>
  )
}

const ChatUsers: FC = () => {
  const { channelData, channelId } = useSelectedChannel()
  const [userChannelList, setUserChannelList] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  useEffect(() => {
    if (userChannelList) setUserChannelList(false)
  }, [userChannelList])

  return (
    <div>
      {isModalOpen && selectedUser && channelId && (
        <UserActionModal
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          channelId={channelId}
          userId={selectedUser.id}
        />
      )}
      <h1 className='text-lg text-base-content text-center'>Users</h1>
      <div className='p-2'>
        {channelData?.members
          .sort((a, b) => (a.user.username > b.user.username ? 1 : -1))
          .map((member, i) => (
            <User
              key={i}
              member={member}
              index={i}
              setModalOpen={setModalOpen}
              modalOpen={isModalOpen}
              setSelectedUser={setSelectedUser}
            />
          ))}
      </div>
    </div>
  )
}

export { ChatUsers }
