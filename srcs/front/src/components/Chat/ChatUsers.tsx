import React, { useEffect, useState } from 'react'
import { isMobile, MobileView } from 'react-device-detect'
import { FaCrown } from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'

import { IChannelMember } from '../../types/Chat'

type ChatUsersProps = {
  members: IChannelMember[]
  onClickConv: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | null
}

const ChatUsers: React.FC<ChatUsersProps> = ({ members, onClickConv }) => {
  const [userChannelList, setUserChannelList] = useState(true)
  const handleClickConv = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
    setUserChannelList(false)
    if (onClickConv && e) onClickConv(e)
  }

  useEffect(() => {
    if (userChannelList) setUserChannelList(false)
  }, [userChannelList])
  const arrowMobile = () => {
    if (isMobile) {
      return (
        <div>
          <div className='flex space-x-2 ml-4'>
            <button type='button' onClick={handleClickConv}>
              <IoIosArrowBack size={18} className='text-black mt-1' />
            </button>
          </div>
          <h1 className='text-lg text-gray-500 border-b border-gray-200 mr-8 ml-8 pt-4'>Users</h1>
          <div className='mr-8 pt-2'>
            {members.map((member, i) => (
              <div key={i} className='flex pt-4 justify-between'>
                <span className='text-gray-500 ml-8'>{member.user.username}</span>
                {member.role == 'owner' && <FaCrown className='text-error' />}
              </div>
            ))}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <h1 className='text-lg text-gray-500 border-b border-gray-200 mr-8 ml-8 pb-3'>Users</h1>
          <div className='mr-8 pt-2'>
            {members.map((member, i) => (
              <div key={i} className='flex pt-4 justify-between'>
                <span className='text-gray-500 ml-8'>{member.user.username}</span>
                {member.role == 'owner' && <FaCrown className='text-error mt-1 ml-2' />}
              </div>
            ))}
          </div>
        </div>
      )
    }
  }
  return <div className='flex flex-col pt-4 w-full'>{arrowMobile()}</div>
}

export { ChatUsers }
