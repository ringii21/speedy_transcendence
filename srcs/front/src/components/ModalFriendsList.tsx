import { Menu, Transition } from '@headlessui/react'
import React, { Dispatch, Fragment, SetStateAction } from 'react'

import { IFriends, IUser } from '../types/User'

type FriendsListModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  user: IUser | null
}

const ModalFriendsList: React.FC<FriendsListModal> = ({ openModal, setOpenModal, user }) => {
  console.log(openModal)
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
                <Menu.Item>
                  <a
                    href='#'
                    className='flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white'
                  >
                    <svg
                      aria-hidden='true'
                      className='h-4'
                      viewBox='0 0 40 38'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M39.0728 0L21.9092 12.6999L25.1009 5.21543L39.0728 0Z'
                        fill='#E17726'
                      />
                      <path
                        d='M0.966797 0.0151367L14.9013 5.21656L17.932 12.7992L0.966797 0.0151367Z'
                        fill='#E27625'
                      />
                    </svg>
                    <span className='flex-1 ms-3 whitespace-nowrap'>MetaMask</span>
                    <span className='inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400'>
                      Popular
                    </span>
                  </a>
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
