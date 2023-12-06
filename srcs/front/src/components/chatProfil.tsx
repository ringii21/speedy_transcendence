import React, { useEffect, useState } from 'react'
import { IUser } from '../types/User'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { FakeUsers } from '../types/FakeUser'

const ChatProfil = () => {
  // const { username, image } = useParams<{ username: string; image: string }>()
  const { user } = useAuth()
  const [userData, setUserData] = useState<IUser>()
  const checkUsers = [...FakeUsers, user]

  // const userPicture = () => {
  //   if (userData) {
  //     const user = FakeUsers.find((u) => u.username !== username)
  //     if (user && userData.friends.includes(user.id)) {
  //       return (
  //         <img
  //           src={userData.image}
  //           alt=""
  //           className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
  //         />
  //       )
  //     }
  //   }
  // }

  return (
    <div className="relative">
      <button
        type="button"
        className="transition duration-300 delay-75 hover:delay-100 hover:scale-110 hover:-translate-y-0 hover:shadow-lg rounded-full"
      >
        <div>
          <img
            // src={users.image}
            alt=""
            className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
          />
        </div>
      </button>
      <div className="flex flex-col leading-tight">
        <div className="text-2xl mt-1 flex items-center">
          <span className="text-gray-700 mr-8 bottom-0"></span>
          <span className="absolute text-green-500 right-0 bottom-1">
            <svg width="20" height="20">
              <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export { ChatProfil }
