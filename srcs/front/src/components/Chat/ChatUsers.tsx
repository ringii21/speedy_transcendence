import React from 'react'
import { FaCrown } from 'react-icons/fa'

import { IChannelMember } from '../../types/Chat'

type ChatUsersProps = {
  members: IChannelMember[]
}

const ChatUsers = ({ members }: ChatUsersProps) => {
  return (
    <div className='flex flex-col ml-4 pt-4 w-full'>
      <h1 className='text-lg text-gray-500'>Users</h1>
      {members.map((member, i) => (
        <div key={i} className='flex flex-col pt-4'>
          {member.role == 'owner' && <FaCrown className='text-error flex justify-end' />}
          <span className='text-gray-500'>{member.user.username}</span>
        </div>
      ))}
    </div>
  )
}

export { ChatUsers }
