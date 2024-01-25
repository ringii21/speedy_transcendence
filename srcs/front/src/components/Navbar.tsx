// import './../styles/navbar.css'

import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { Link, Navigate } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import { useNotification } from '../providers/NotificationProvider'
import { useSocket } from '../providers/SocketProvider'
import { NotificationSocketEvent } from '../types/Events'
import { getNotification } from '../utils/notificationService'
import { notificationSocket as socket } from '../utils/socketService'
import { NotificationModal } from './NotificationModal'

const Navbar = () => {
  const { user, signout } = useAuth()

  const [activeNotification, setActiveNotification] = useState<string[] | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [bellColor, setBellColor] = useState('btn-ghost')

  if (!user) return <Navigate to='/login' state={{ from: location }} replace />

  const ref = useRef<HTMLDivElement>(null)
  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const [isState, setIsState] = useState(false)
  const { notificationSocket } = useSocket()
  const { friends } = useNotification()

  const removeNotification = (friendOfId: string) => {
    setActiveNotification((prevActiveNotification) => {
      if (!prevActiveNotification) return prevActiveNotification

      console.log('prevActiveNotification', prevActiveNotification)

      const updatedNotification = prevActiveNotification.filter((id) => id !== friendOfId)
      notificationSocket.emit(NotificationSocketEvent.DELETED, friendOfId)

      console.log('updatedNotification: ', updatedNotification)

      return updatedNotification
    })
  }
  useEffect(() => {
    if (!notificationSocket.connect()) {
      notificationSocket.connect()
    }
  }, [])

  useEffect(() => {
    if (!friends) return undefined
    const newActiveNotification = friends
      .filter((friend: any) => friend.confirmed === false && friend.friendOfId)
      .map((friend: any) => friend.friendOfId.toString())
    if (newActiveNotification.length > 0) {
      const event = (data: any) => {
        console.log('Data: ', data)
        newActiveNotification
      }
      setOpenModal(false)
      notificationSocket.emit(NotificationSocketEvent.RECEIVED, event)
      setActiveNotification((prevActiveNotification) => [
        ...(prevActiveNotification || []),
        ...newActiveNotification,
      ])
      notificationSocket.on(NotificationSocketEvent.RECEIVED, event)
      setBellColor('text-blue-500')
      return () => {
        notificationSocket.off(NotificationSocketEvent.RECEIVED, event)
        notificationSocket.disconnect()
      }
    }
  }, [friends, setOpenModal, setActiveNotification, setBellColor, notificationSocket])

  useEffect(() => {
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
  }, [friends])

  const notificationLine = () => {
    if (!setIsState || !activeNotification) return <></>

    const notificationActive = activeNotification.includes(user?.id.toString())

    return (
      <div ref={ref} className='right-0'>
        <button
          role='button'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpenModal(!openModal)
            setBellColor('btn-ghost')
          }}
          className={`btn btn-ghost changeBellColor`}
        >
          <FaBell
            tabIndex={0}
            size={20}
            className={`${notificationActive && user?.id ? bellColor : 'btn-ghost'}`}
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
        friends={friends}
        me={user}
        removeNotification={removeNotification}
      />
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-white'
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
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/chat'>Chat</Link>
            </li>
            <li>
              <Link to='/play'>Game</Link>
            </li>
          </ul>
        </div>
        <Link to={'/'} className='btn btn-ghost text-white text-xl pongBtn invisible lg:visible'>
          Pong
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1 flex gap-40'>
          <li>
            <button type='button' className='btn-menu btn-one letterMove'>
              <Link className='font-bold text-white' to='/chat'>
                Chat
              </Link>
            </button>
          </li>
          <li>
            <button type='button' className='btn-menu btn-one letterMove'>
              <Link className='text-base-content' to='/play'>
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
