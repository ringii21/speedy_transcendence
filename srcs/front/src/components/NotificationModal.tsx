import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

import { IFriends, INotification, IUser } from '../types/User'

type FriendsListModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  notifier?: INotification[]
  me: IUser
}

const getCorrectFriend = (notifier: INotification, me: IUser | undefined) => {
  if (!notifier || !me) return undefined
  if (me.id === notifier.senderId) return
  return notifier.sender
}

const line = (sender: IUser | undefined, index: number) => {
  if (!sender) return undefined
  return (
    <Menu.Item key={index}>
      <a
        href='#'
        className='flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white'
      >
        <div className='avatar'>
          <div className='w-12 rounded-full'>
            <img className='img' src={sender.image} alt='img' />
          </div>
        </div>
        <span className='flex-1 ms-3 whitespace-nowrap'>{sender.username}</span>
      </a>
    </Menu.Item>
  )
}

const NotificationModal: React.FC<FriendsListModal> = ({
  openModal,
  setOpenModal,
  notifier,
  me,
}) => {
  return (
    <Menu as='div'>
      <Transition appear show={openModal} as={Fragment}>
        <Menu.Items
          id='dropdown'
          onClick={() => setOpenModal(false)}
          className='absolute z-50 overflow-y-auto flex justify-center top-6 right-0'
        >
          <div className='p-4 md:p-5 relative'>
            <div className='my-4 space-y-3'>
              {notifier && notifier.map((f, i) => line(getCorrectFriend(f, me), i))}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
export { NotificationModal }
