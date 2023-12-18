import { Dialog, Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

type BubbleModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const BubbleChannelModal: React.FC<BubbleModal> = ({ openModal, setOpenModal }) => {
  return (
    <Menu as='div'>
      <Transition as={Fragment}>
        <Menu.Items
          id='dropdown'
          className='z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'
        >
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href='#'
                    className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                  >
                    Dashboard
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href='#'
                    className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href='#'
                    className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                  >
                    Earnings
                  </a>
                )}
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export { BubbleChannelModal }
