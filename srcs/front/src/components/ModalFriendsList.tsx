import { Menu, Transition } from '@headlessui/react'
import { useMutation } from '@tanstack/react-query'
import React, { Fragment } from 'react'
import { RxCheckCircled, RxCrossCircled } from 'react-icons/rx'

import { IFriends, IUser } from '../types/User'
import { removeFriend } from '../utils/friendService'

type NotificationListModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  friends?: IFriends[]
  me: IUser
}

const ModalFriendsList: React.FC<NotificationListModal> = ({
  openModal,
  setOpenModal,
  friends,
  me,
}) => {
  const getCorrectFriend = (friend: IFriends, me: IUser) => {
    if (me.id === friend.friendId) return friend.friendOf
    return friend.friend
  }
  const deleteFriendMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: removeFriend,
  })

  const line = (friend: IUser, index: number) => {
    if (!friend) return <></>
    return (
      <Menu.Item key={index}>
        <a
          href='#'
          className='flex items-center p-3 gap-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white'
        >
          <div className='avatar'>
            <div className='w-12 rounded-full'>
              <img className='img' src={friend.image} alt='img' />
            </div>
          </div>
          <span className='flex-1 ms-3 whitespace-nowrap'>{friend.username}</span>
          <RxCrossCircled
            role='button'
            onClick={() => {
              deleteFriendMutation.mutate(friend.id)
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
          className='absolute z-50 overflow-y-auto flex justify-center items-center inset-10 top-48'
        >
          <div className='relative bg-white rounded-lg shadow dark:bg-gray-600'>
            <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Friends List</h3>
              <button
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                data-modal-toggle='crypto-modal'
              >
                <svg
                  className='w-3 h-3'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </button>
            </div>
            <div className='p-4 md:p-5'>
              <div className='my-4 space-y-3'>
                {friends &&
                  friends.length > 0 &&
                  friends.map((f, i) => line(getCorrectFriend(f, me), i))}
              </div>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export { ModalFriendsList }
