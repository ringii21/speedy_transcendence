import { Menu, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { Fragment, useEffect, useState } from 'react'
import { RxCheckCircled, RxCrossCircled } from 'react-icons/rx'

import { useNotification } from '../providers/NotificationProvider'
import { useSocket } from '../providers/SocketProvider'
import { IFriends, IUser } from '../types/User'
import { acceptFriendRequest, removeFriend } from '../utils/friendService'
import { notificationSocket } from '../utils/socketService'

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
  const queryClient = useQueryClient()

  const deleteFriendMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: removeFriend,
  })

  const friendAcceptedMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: acceptFriendRequest,
  })

  const line = (sender: IUser, id: number) => {
    console.log(sender.id)
    const isFriend = friends.find((friend) => friend.confirmed === true)
    if (isFriend || friends === undefined) return
    else if (!isFriend) {
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
              onClick={() => {
                friendAcceptedMutation.mutate(sender.id, {
                  onSuccess: async () => {
                    await queryClient.invalidateQueries({
                      queryKey: ['friends'],
                    })
                  },
                  onError: (error) => {
                    console.error('Error accepting friend request', error)
                  },
                })
              }}
              size={20}
              className='text-green-500 hover:w-6 hover:h-6'
            />
            <RxCrossCircled
              role='button'
              onClick={() => {
                if (sender.id !== me?.id) {
                  deleteFriendMutation.mutate(sender.id, {
                    onSuccess: async () => {
                      await queryClient.invalidateQueries({
                        queryKey: ['friends'],
                      })
                      removeNotification(id.toString())
                    },
                  })
                }
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
