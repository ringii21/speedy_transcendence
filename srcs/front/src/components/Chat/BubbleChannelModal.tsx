import { Dialog, Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React, { Fragment, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { IChannelMessage } from '../../types/Message'
import { IUser } from '../../types/User'

type BubbleModal = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  message: IChannelMessage
  user: IUser
}

// rediriger le user vers le profil de l'utilisateur en ce basant sur son id

const BubbleChannelModal: React.FC<BubbleModal> = ({ openModal, setOpenModal, message, user }) => {
  const justifyPosition = clsx({
    ['block z-20 bg-gray-900 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute left-14 m-2']:
      message.senderId !== user.id,
    ['block z-20 bg-gray-900 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute right-14 m-2']:
      message.senderId === user.id,
  })
  return (
    <Menu as='div'>
      <Transition appear show={openModal} as={Fragment}>
        <Menu.Items id='dropdown' onClick={() => setOpenModal(false)} className={justifyPosition}>
          <div className='overflow-y-auto rounded-lg focus:outline-none relative'>
            <div className='flex flex-col min-h-full items-center justify-center text-center bg-gray-900 relative'>
              <Menu.Item>
                <Link
                  to='/profile/me'
                  className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full'
                >
                  Profile
                </Link>
              </Menu.Item>
              <Menu.Item>
                <a
                  href='#'
                  className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full'
                >
                  Invite
                </a>
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
