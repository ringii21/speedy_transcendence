import { Menu, Transition } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import React, { Fragment, useEffect } from 'react'

import { IUser } from '../types/User'
import { getAllFriends } from '../utils/friendService'
import httpInstance from '../utils/httpClient'

type FriendsListModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  user: IUser | null
}

const ModalFriendsList: React.FC<FriendsListModal> = ({ openModal, setOpenModal, user }) => {
  const getFriends = useQuery<IUser | undefined>({
    queryKey: ['friend'],
    queryFn: getAllFriends,
    enabled: openModal,
  })

  useEffect(() => {
    if (openModal) {
      getFriends.refetch()
    }
  }, [openModal])

  return (
    <Menu as='div'>
      <Transition appear show={openModal} as={Fragment}>
        <Menu.Items
          id='dropdown'
          onClick={() => setOpenModal(false)}
          className='absolute z-50 overflow-y-auto flex justify-center items-center inset-10 top-48'
        >
          <div className='relative bg-white rounded-lg shadow dark:bg-gray-800'>
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
                <Menu.Item>
                  {user?.friends ? (
                    user?.friends.map((friend) => {
                      return (
                        <ol className='flex flex-row' key={friend.id}>
                          <img src={friend.image} className='rounded-full h-12 w-12' />
                          <p className='bottom-0 right-0 pt-2 pl-4 font-semibold'>
                            {friend.username}
                          </p>
                        </ol>
                      )
                    })
                  ) : (
                    <ol className='flex flex-row' key={user?.id}>
                      <img src={user?.image} className='rounded-full h-12 w-12' />
                      <p className='bottom-0 right-0 pt-2 pl-4 font-semibold'>{user?.username}</p>
                    </ol>
                  )}
                </Menu.Item>
              </div>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export { ModalFriendsList }
