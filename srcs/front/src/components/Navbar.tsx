import './../styles/navbar.css'

import React from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
const Navbar = () => {
  const { user, signout } = useAuth()

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  return (
    <div className='navbar nav relative bg-gray-900'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-10 w-10'
              fill='none'
              viewBox='0 0 24 24'
              stroke='white'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </div>
          <ul className='menu menu-sm dropdown-content mt-3 z-[1] p-2 bg-base-100 w-52'>
            <li>
              <Link to='/chat'>Chat</Link>
            </li>
            <li>
              <Link to='/play'>Game</Link>
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
              <Link to='/chat'>Chat</Link>
            </button>
          </li>
          <li>
            <button type='button' className='btn-menu btn-one letterMove'>
              <Link to='/play'>Game</Link>
            </button>
          </li>
        </ul>
      </div>
      <div className='navbar-end'>
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar btn-avatar'>
            <div className='w-10 rounded-full'>
              <img alt='avatar' src={user?.image} />
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
      </div>
    </div>
  )
}

export { Navbar }
