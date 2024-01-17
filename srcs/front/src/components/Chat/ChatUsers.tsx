import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { FC, HTMLAttributes } from 'react'
import { FaCrown, FaGavel, FaUser } from 'react-icons/fa'
import { PiSwordFill } from 'react-icons/pi'
import { Link } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { EChannelType, IChannel, IChannelMember } from '../../types/Chat'
import { IUser } from '../../types/User'
import { createPm } from '../../utils/chatHttpRequests'
import { UserActionModal } from './Modals/UserActionModal'

type UserProps = HTMLAttributes<HTMLDivElement> & {
  member: IChannelMember
  index: number
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  modalOpen: boolean
  setSelectedUser: React.Dispatch<React.SetStateAction<IUser | null>>
  showActionModal: boolean
  user: IUser
}

const User: FC<UserProps> = ({
  member,
  index,
  setModalOpen,
  modalOpen,
  setSelectedUser,
  showActionModal,
  user,
}) => {
  const userStyle = clsx({
    'flex justify-between cursor-pointer hover:bg-accent hover:text-accent-content text-base-content':
      true,
    'bg-base-100': index % 2 === 0,
    'bg-base-200': index % 2 === 1,
  })

  const { mutate } = useMutation({
    mutationFn: createPm,
  })

  const onClickAction = () => {
    setSelectedUser(member.user)
    setModalOpen(!modalOpen)
  }

  const onClickOnUserInList = () => {
    if (member.user.id === user.id) return
    mutate(member.userId)
  }

  return (
    <div className={userStyle}>
      <div onClick={onClickOnUserInList} className='flex items-center'>
        {member.role == 'owner' && <FaCrown className='text-error mt-1 m-1' />}
        {member.role == 'admin' && <PiSwordFill className='text-warning mt-1 m-1' />}
        {member.role == 'user' && <FaUser className='text-base mt-1 m-1' />}
        {member.user.username}
      </div>
      <div className='flex items-center gap-2'>
        {showActionModal && (
          <button onClick={onClickAction} className='btn btn-xs btn-error'>
            <FaGavel />
          </button>
        )}
        {member.user.id !== user?.id && (
          <Link className='btn btn-xs btn-primary' to={`/profile/${member.user.id}`}>
            <FaUser />
          </Link>
        )}
      </div>
    </div>
  )
}

const directMessageChannelRender = (user: IUser, channel: IChannel) => {
  const notMe = channel.members.find((m) => m.user.id !== user?.id)
  if (!notMe) return <></>
  return (
    <div className='grid place-items-center mt-4'>
      <Link className='w-1/2 avatar' to={`/profile/${notMe.userId}`}>
        <div className='rounded'>
          <img src={notMe.user.image} alt='My profile' />
        </div>
      </Link>
      <span className='text-lg'>{notMe.user.username}</span>
    </div>
  )
}

const userRender = ({
  user,
  channel,
  setModalOpen,
  setSelectedUser,
  showActionModal,
  isModalOpen,
}: {
  user: IUser
  channel: IChannel
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedUser: React.Dispatch<React.SetStateAction<IUser | null>>
  showActionModal: (member: IChannelMember) => boolean
  isModalOpen: boolean
}) => {
  return (
    <div>
      <h1 className='text-lg text-base-content text-center'>Users</h1>
      <div className='p-2'>
        {channel.members
          .filter((member) => member.present)
          .sort((a, b) => (a.user.username > b.user.username ? 1 : -1))
          .map((member, i) => (
            <User
              key={i}
              member={member}
              index={i}
              setModalOpen={setModalOpen}
              modalOpen={isModalOpen}
              setSelectedUser={setSelectedUser}
              user={user}
              showActionModal={showActionModal(member)}
            />
          ))}
      </div>
    </div>
  )
}

const ChatUsers = ({ channel }: { channel: IChannel }) => {
  const { user } = useAuth()
  const [userChannelList, setUserChannelList] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  useEffect(() => {
    if (userChannelList) setUserChannelList(false)
  }, [userChannelList])

  const findRole = (userId: number, members?: IChannelMember[]) =>
    members?.find((member) => member.userId === userId)?.role

  const showActionModal = (member: IChannelMember) => {
    if (userRole === 'user') return false
    if (userRole === 'admin') return member.role === 'user'
    if (userRole === 'owner') return member.role !== 'owner'
    return false
  }
  if (!user) return <></>
  const userRole = findRole(user.id, channel.members)

  return (
    <div>
      {isModalOpen && selectedUser && (
        <UserActionModal
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          channelId={channel.id}
          userId={selectedUser.id}
        />
      )}
      {channel.type === EChannelType.direct
        ? directMessageChannelRender(user, channel)
        : userRender({
            user,
            channel,
            setModalOpen,
            setSelectedUser,
            showActionModal,
            isModalOpen,
          })}
    </div>
  )
}

export { ChatUsers }
