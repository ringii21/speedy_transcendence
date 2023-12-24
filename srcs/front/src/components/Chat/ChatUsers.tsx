import React, { useEffect, useState } from 'react'
import { FaCrown } from 'react-icons/fa'

import { IChannelMember } from '../../types/Chat'

type ChatUsersProps = {
  members: IChannelMember[]
}

const ChatUsers: React.FC<ChatUsersProps> = ({ members }) => {
  const [userChannelList, setUserChannelList] = useState(true)

  useEffect(() => {
    if (userChannelList) setUserChannelList(false)
  }, [userChannelList])
  return (
    <div>
      <h1 className='text-lg text-gray-500 border-b border-gray-300 mr-8 ml-8 pb-3'>Users</h1>
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

export { ChatUsers }
