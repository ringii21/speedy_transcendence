// import './../styles/navbar.css'

import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { Link, Navigate } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import { useNotification } from '../providers/NotificationProvider'
import { useSocket } from '../providers/SocketProvider'
import { NotificationModal } from './NotificationModal'

const Navbar = () => {
  const { user, signout } = useAuth()

  const [activeNotification, setActiveNotification] = useState<string[]>([])
  const [openModal, setOpenModal] = useState(false)

  if (!user) return <Navigate to='/login' state={{ from: location }} replace />

  const ref = useRef<HTMLDivElement>(null)
  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const [isState, setIsState] = useState(false)
  const { notifier } = useNotification()

  useEffect(() => {
    if (!notifier) return undefined

    notifier.forEach((not: any) => {
      if (not.state === true && not.receivedId) {
        setOpenModal(false)

        setActiveNotification((prevActiveNotification) => [
          ...prevActiveNotification,
          not.receivedId.toString(),
        ])
      }
    })

    const isOpen = (e: MouseEvent) => {
      const el = e.target as HTMLDivElement
      if (ref.current && !ref.current.contains(el)) {
        setOpenModal(false)
      }
    }

    document.addEventListener('click', isOpen)
    return () => {
      document.removeEventListener('click', isOpen)
    }
  }, [notifier])

  const notificationLine = () => {
    if (!setIsState) return <></>

    const isNotificationActive = activeNotification.includes(user?.id.toString())

    return (
      <div ref={ref} className='right-0'>
        <button
          role='button'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpenModal(!openModal)
          }}
          className={`btn btn-ghost changeBellColor`}
        >
          <FaBell
            tabIndex={0}
            size={20}
            className={`${isNotificationActive ? 'text-blue-500' : ''}`}
          />
        </button>
      </div>
    )
  }

  return (
    <div className='navbar nav relative bg-gray-900'>
      <NotificationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        notifier={notifier}
        me={user}
      />
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </div>
          <ul className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
            <li>
              <Link to='/chat'>Chat</Link>
            </li>
            <li>
              <Link to='/game'>Game</Link>
            </li>
          </ul>
        </div>
        <Link to={'/'} className='btn btn-ghost text-xl pongBtn invisible lg:visible'>
          Pong
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1 flex gap-40'>
          <li>
            <button type='button' className='btn-menu btn-one letterMove'>
              <Link className='text-base-content' to='/chat'>
                Chat
              </Link>
            </button>
          </li>
          <li>
            <button type='button' className='btn-menu btn-one letterMove'>
              <Link className='text-base-content' to='/game'>
                Game
              </Link>
            </button>
          </li>
        </ul>
      </div>
      <div className='navbar-end'>
        <div className='dropdown dropdown-end'>
          <div className='flex flex-row'>
            <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar btn-avatar'>
              <div className='w-10 rounded-full'>
                <img alt='avatar' src={user?.image} />
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <Link className='justify-between' to='/profile/me'>
                Profile
              </Link>
            </li>
            <li>
              <Link to='/settings'>Settings</Link>
            </li>
            <li>
              <a onClick={onButtonClick}>Logout</a>
            </li>
          </ul>
        </div>
        <div>{notificationLine()}</div>
      </div>
    </div>
  )
}

export { Navbar }
