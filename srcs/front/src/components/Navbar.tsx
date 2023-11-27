import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

const Navbar = () => {
  const { user, signout } = useAuth()
  const navigate = useNavigate()

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a
          onClick={() => {
            navigate('/')
          }}
          className="btn btn-ghost text-xl"
        >
          Pong
        </a>
      </div>
      <div className="flex-none gap-2">
        <span>{user?.username}</span>
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar btn-lg"
          >
            <div className="rounded-full">
              <img alt="avatar" src={user?.image} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
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
