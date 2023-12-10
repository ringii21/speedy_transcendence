import React from 'react'
import { FaCrown } from 'react-icons/fa'

import { IChannelMember } from '../../types/Chat'

type ChatUsersProps = {
  members: IChannelMember[]
}

const ChatUsers = ({ members }: ChatUsersProps) => {
  return (
    <div>
      <h1 className='text-lg'>Users</h1>
      {members.map((member, i) => (
        <div key={i} className='flex items-center'>
          {member.role == 'owner' && <FaCrown size={20} className='text-error' />}
          <span className='ml-0.5'>{member.user.username}</span>
        </div>
      ))}
    </div>
  )
}

export { ChatUsers }
