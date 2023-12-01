import React from 'react'
import { IUser } from '../types/User'
import { useAuth } from '../providers/AuthProvider'

const AddDelUser = ({ users }: { users: IUser[] }) => {
  const { signout } = useAuth()
  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  function isUserId(myuser: IUser): React.ReactNode {
    if (!myuser?.username) {
      if (!myuser?.friends) {
        return (
          <div>
            <button className="btn btn-primary drop-shadow-xl rounded-lg">
              Follow
            </button>
          </div>
        )
      } else {
        return (
          <div>
            <button className="btn btn-primary drop-shadow-xl rounded-lg">
              Unfollow
            </button>
          </div>
        )
      }
    } else {
      return (
        <div>
          <button
            className="btn btn-primary drop-shadow-xl rounded-lg"
            onClick={onButtonClick}
          >
            Logout
          </button>
        </div>
      )
    }
  }
  return (
    <div>
      {users.map((myuser, i) => (
        <div key={i}>{isUserId(myuser)}</div>
      ))}
    </div>
  )
}

export { AddDelUser }
