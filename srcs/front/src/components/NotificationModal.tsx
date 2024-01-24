import { Menu, Transition } from '@headlessui/react'
import { useMutation } from '@tanstack/react-query'
import React, { Fragment, useState } from 'react'
import { RxCheckCircled, RxCrossCircled } from 'react-icons/rx'

import { IFriends, INotification, IUser } from '../types/User'
import { acceptFriendRequest, createFriendRequest } from '../utils/friendService'
import { deleteNotification } from '../utils/notificationService'

type FriendsListModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  notifier: INotification[]
  me: IUser
}

const NotificationModal: React.FC<FriendsListModal> = ({
  openModal,
  setOpenModal,
  notifier,
  me,
}) => {
  const getCorrectFriend = (notifier: INotification, me: IUser | undefined) => {
    if (!notifier || !me) return undefined
    if (me.id === notifier.senderId) return
    return notifier.sender
  }

  const friendMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: createFriendRequest,
  })

  const deleteNotificationMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: deleteNotification,
  })

  const [isFriend, setIsFriend] = useState<IFriends[]>([])

  const friendAcceptedMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: acceptFriendRequest,
    onSuccess: (data: IFriends) => {
      setIsFriend((prevFriends: any) => [...prevFriends, data.confirmed])
      console.log('Friend request accepted succesfully!', data)
    },
    onError: (error) => {
      console.error('Error accepting friend request', error)
    },
  })

  const selectOption = async (id: number) => {
    try {
      await Promise.all([
        friendMutation.mutateAsync(id),
        friendAcceptedMutation.mutateAsync(id),
        deleteNotificationMutation.mutateAsync(id),
      ])
    } catch (e) {
      console.error('Error during mutations: ', e)
    }
  }

  const line = (sender: IUser | undefined) => {
    if (sender === undefined) return <></>
    if (!sender) {
      return <></>
    } else {
      return (
        <Menu.Item key={sender.id}>
          <a
            href='#'
            className='flex static items-center justify-evenly gap-3 p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white'
          >
            <div className='avatar'>
              <div className='w-12 rounded-full'>
                <img className='img' src={sender.image} alt='img' />
              </div>
            </div>
            <span className='flex-1 ms-3 whitespace-nowrap static'>{sender.username}</span>
            <RxCheckCircled
              role='button'
              onClick={() => selectOption(sender.id)}
              size={20}
              className='text-green-500 hover:w-6 hover:h-6'
            />
            <RxCrossCircled
              role='button'
              onClick={() => {
                deleteNotificationMutation.mutate(sender.id)
              }}
              size={20}
              className='text-red-500 hover:w-6 hover:h-6'
            />
          </a>
        </Menu.Item>
      )
    }
  }

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
              {notifier &&
                notifier.length > 0 &&
                notifier.map((f) => line(getCorrectFriend(f, me)))}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
export { NotificationModal }
