import { Menu, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { Fragment, useState } from 'react'
import { RxCheckCircled, RxCrossCircled } from 'react-icons/rx'

import { useSocket } from '../providers/SocketProvider'
import { NotificationSocketEvent } from '../types/Events'
import { IFriends, IUser } from '../types/User'
import { acceptFriendRequest, createFriendRequest, removeFriend } from '../utils/friendService'

type FriendsListModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  friends: IFriends[]
  me: IUser
  removeNotification: (friendOfId: string) => void
}

const NotificationModal: React.FC<FriendsListModal> = ({
  openModal,
  setOpenModal,
  friends,
  me,
  removeNotification,
}) => {
  const { notificationSocket } = useSocket()
  const queryClient = useQueryClient()

  const friendMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: createFriendRequest,
  })

  const deleteFriendMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: removeFriend,
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

  // ********************** REVOIR ************************** //
  const selectOption = (id: number) => {
    friendAcceptedMutation.mutate(id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['friends'],
        })
      },
    })
  }

  const delNotification = async (id: number) => {
    Promise.all([
      deleteFriendMutation.mutate(id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['friends'],
          })
          console.log('DeleteNotificationMutation success')
          notificationSocket.on(NotificationSocketEvent.DELETED, (data: any) => {
            console.log('data: ', data)
          })
        },
      }),
      removeNotification(id.toString()),
    ])
  }

  // ********************************************************

  const line = (sender: IUser, id: number) => {
    return (
      <Menu.Item key={id}>
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
              delNotification(sender.id)
            }}
            size={20}
            className='text-red-500 hover:w-6 hover:h-6'
          />
        </a>
      </Menu.Item>
    )
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
              {friends &&
                friends.length > 0 &&
                friends
                  .filter((friend) => {
                    return me.id !== friend.friendId
                  })
                  .filter((friend): friend is IFriends => friend.friend !== undefined)
                  .map((friend, i) => {
                    return line(friend.friend, i)
                  })}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
export { NotificationModal }
