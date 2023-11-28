import React from 'react'
import { Link, redirect } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
const Navbar = () => {
  const { user, signout } = useAuth()

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
    redirect('/login')
  }

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          Pong
        </Link>
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
              <Link className="justify-between" to="/profil">
                Profil
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
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
