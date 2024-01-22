import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { FC, HTMLAttributes } from 'react'
import { isMobile, isTablet } from 'react-device-detect'
import { FaCrown, FaGavel, FaUser } from 'react-icons/fa'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
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
    'flex justify-between cursor-pointer hover:bg-accent hover:text-accent-content text-base-content p-2 rounded':
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
        {member.role == 'owner' && <FaCrown className='text-error mt-1 m-1 mr-5' />}
        {member.role == 'admin' && <PiSwordFill className='text-warning mt-1 m-1 mr-5' />}
        {member.role == 'user' && <FaUser className='text-base mt-1 m-1 mr-5' />}
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
    <div className='flex flex-col'>
      <div className='mr-3 ml-2 border-b'>
        <h1 className='font-bold text-base-content text-center pb-3'>Users</h1>
      </div>
      <div className='flex flex-row pt-3 ml-3'>
        <Link className='w-1/12 avatar' to={`/profile/${notMe.userId}`}>
          <img src={notMe.user.image} alt='My profile' className='rounded-full' />
        </Link>
        <span className='text-lg pl-5'>{notMe.user.username}</span>
      </div>
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
    <div className='flex flex-col gap-3 mt-2 w-screen'>
      <div className='flex flex-col gap-3 p-2 mr-2'>
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

type handleUserChannelList = HTMLAttributes<HTMLDivElement> & {
  channel: IChannel
  onClickConv: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | null
}

const ChatUsers: FC<handleUserChannelList> = ({ channel, onClickConv }) => {
  const { user } = useAuth()
  if (!user) return <></>
  const findRole = (userId: number, members?: IChannelMember[]) =>
    members?.find((member) => member.userId === userId)?.role

  const userRole = findRole(user.id, channel.members)

  const [userChannelList, setUserChannelList] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  const handleClickConv = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
    setUserChannelList(false)
    if (onClickConv && e) onClickConv(e)
  }
  const showActionModal = (member: IChannelMember) => {
    if (userRole === 'user') return false
    if (userRole === 'admin') return member.role === 'user'
    if (userRole === 'owner') return member.role !== 'owner'
    return false
  }

  useEffect(() => {
    if (userChannelList) setUserChannelList(false)
  }, [userChannelList])
  const arrowMobile = () => {
    return (
      <>
        <div className='flex flex-row justify-evenly gap-5 mt-1.5 border-b'>
          <div className='flex space-x-2 pl-3.5'>
            <button
              type='button'
              className='btn btn-ghost text-gray-500 rounded-full hover:text-black'
              onClick={handleClickConv}
            >
              <IoIosArrowBack size={18} className='text-gray-500' />
            </button>
          </div>
          <div className='flex align-items mt-3'>
            <h1 className='text-gray-500'>Users</h1>
          </div>
          <div className='flex justify-end space-x-2 pr-4 invisible'>
            <span>
              <IoIosArrowForward size={18} className='text-gray-500' />
            </span>
          </div>
        </div>
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
      </>
    )
  }

  return <div>{arrowMobile()}</div>
}

export { ChatUsers }
