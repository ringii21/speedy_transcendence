import { Menu, Transition } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

import { FrontEndMessage } from '../../types/Chat'
import { IUser } from '../../types/User'
import { fetchAllUsers } from '../../utils/userHttpRequests'

type BubbleModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  message: FrontEndMessage
  user: IUser
}

const BubbleChannelModal: React.FC<BubbleModal> = ({ openModal, setOpenModal, message, user }) => {
  const justifyPosition = clsx({
    ['block z-20 bg-gray-900 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute left-14 m-2']:
      message.senderId !== user.id,
    ['block z-20 bg-gray-900 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute right-14 m-2']:
      message.senderId === user.id,
  })

  const messageStyle = clsx({
    ['px-4 py-2 rounded-lg inline-block']: true,
    ['bg-primary text-primary-content']: message.senderId === user.id,
    ['bg-gray-300 text-gray-600']: message.senderId !== user.id,
  })

  const [selectedUser, setSelectedUser] = useState<number>()

  const getUser = useQuery({
    queryKey: ['user', selectedUser],
    queryFn: fetchAllUsers,
  })

  let userData
  if (Array.isArray(getUser.data)) {
    userData = getUser.data?.find((users) => users.id === message.senderId)
  }
  return (
    <Menu as='div'>
      <Transition appear show={openModal} as={Fragment}>
        <Menu.Items id='dropdown' onClick={() => setOpenModal(false)} className={justifyPosition}>
          <div className='overflow-y-auto rounded-lg focus:outline-none relative'>
            <div className='flex flex-col min-h-full items-center justify-center text-center bg-gray-900 relative'>
              <Menu.Item>
                <Link
                  to={`/profile/${userData?.id}`}
                  className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full'
                >
                  Profile
                </Link>
              </Menu.Item>
              <Menu.Item>
                {message.gameInvite && (
                  <Link to='/play' state={{ invite: true }}>
                    Play with me!
                  </Link>
                )}
                {!message.gameInvite && <span className={messageStyle}>{message.content}</span>}
              </Menu.Item>
              <Menu.Item>
                <a
                  href='#'
                  className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full'
                >
                  Private message
                </a>
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export { BubbleChannelModal }
