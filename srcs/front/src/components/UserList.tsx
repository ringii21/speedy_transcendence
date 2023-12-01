import React from 'react'
import { IUser } from '../types/User'
import { Link } from 'react-router-dom'

interface UserListProps {
  users: IUser[]
}

const UserList: React.FC<UserListProps> = ({ users }: { users: IUser[] }) => {
  return (
    <div>
      <h1>User list</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={'/profil/${user.username}'}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { UserList }
