import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import { useNotification } from '../providers/NotificationProvider'
import { NotificationModal } from './NotificationModal'

const Navbar = () => {
  const { user, signout } = useAuth()
  const { pathname } = useLocation()
  const [activeNotification, setActiveNotification] = useState<string[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [bellColor, setBellColor] = useState('btn-ghost')

  if (!user) return <Navigate to='/login' state={{ from: location }} replace />

  const ref = useRef<HTMLDivElement>(null)
  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const { friends, friendsSuccess, friendsError } = useNotification()

  const removeNotification = (friendOfId: string) => {
    setActiveNotification((prevActiveNotification) => {
      if (!prevActiveNotification) return prevActiveNotification

      const updatedNotification = prevActiveNotification.filter((id) => id !== friendOfId)
      console.log(updatedNotification)

      return updatedNotification
    })
  }

  useEffect(() => {
    const notFriendYet = friends.find((friend) => friend.confirmed === false)
    const myNotif = friends.find((friend) => friend.friendOfId === user?.id)

    let followStatus = false
    let color = 'btn-ghost'

    if (!notFriendYet) {
      followStatus = false
      color = 'btn-ghost'
    } else if (notFriendYet && myNotif) {
      followStatus = false
      color = 'text-blue-600'
    }

    const newActiveNotification = friends
      .filter((friend) => friend.confirmed === false && friend.friendOfId)
      .map((friend) => friend.friendOfId.toString())
    if (newActiveNotification.length > 0) {
      setActiveNotification((prevActiveNotification) => [
        ...(prevActiveNotification || []),
        ...newActiveNotification,
      ])
    }
    if (myNotif) {
      setOpenModal(followStatus)
      setBellColor(color)
    }
  }, [friends, friendsSuccess, friendsError])

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

  const selectItemClass = (pathname: string, expectedPath: string) =>
    clsx({
      'font-bold': true,
      'text-base-content': pathname === expectedPath,
    })

  const notificationLine = () => {
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
    <div className='navbar nav relative bg-base-300'>
      {friends && (
        <NotificationModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          friends={friends}
          me={user}
          removeNotification={removeNotification}
        />
      )}
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-base-content'
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
              <Link className={selectItemClass(pathname, '/')} to='/'>
                Home
              </Link>
            </li>
            <li>
              <Link className={selectItemClass(pathname, '/chat')} to='/chat'>
                Chat
              </Link>
            </li>
            <li>
              <Link className={selectItemClass(pathname, '/play')} to='/play'>
                Game
              </Link>
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
            <Link
              className={selectItemClass(pathname, '/chat') + 'btn-menu btn-one letterMove'}
              to='/chat'
            >
              Chat
            </Link>
          </li>
          <li>
            <Link
              className={selectItemClass(pathname, '/play') + 'btn-menu btn-one letterMove'}
              to='/play'
            >
              Game
            </Link>
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
              <Link className='text-base-content' to='/profile/me'>
                Profile
              </Link>
            </li>
            <li>
              <Link className='text-base-content' to='/settings'>
                Settings
              </Link>
            </li>
            <li>
              <a className='text-base-content' onClick={onButtonClick}>
                Logout
              </a>
            </li>
          </ul>
        </div>
        <div>{notificationLine()}</div>
      </div>
    </div>
  )
}

export { Navbar }
