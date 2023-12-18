import React, { useEffect, useId, useState } from 'react'
import { useParams } from 'react-router-dom'

import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { IFriends, IUser } from '../types/User'

const Profile: React.FC = () => {
  const { user: loggedInUser, signout } = useAuth()
  const { userId } = useParams<{ userId: string }>()
  const [profilUser, setProfilUser] = useState<IUser>()
  const [isFriend, setIsFriend] = useState(false)
  const [addFriends, setAddFriends] = useState<IFriends>()
  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const isUserId = () => {
    if (loggedInUser && profilUser?.id !== loggedInUser.id) {
      return (
        <div>
          <button className='btn btn-primary drop-shadow-xl rounded-lg' onClick={onButtonClick}>
            Logout
          </button>
        </div>
      )
    } else {
      return (
        <div className='flex justify-evenly'>
          {addFriends?.id !== profilUser?.id ? (
            <button className='btn btn-primary drop-shadow-xl rounded-lg'>Follow</button>
          ) : (
            <button className='btn btn-primary drop-shadow-xl rounded-lg'>Unfollow</button>
          )}

          <button className='btn btn-secondary drop-shadow-xl rounded-lg'>Message</button>
        </div>
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response
        if (loggedInUser && profilUser?.id !== loggedInUser.id)
          response = await fetch(`localhost:3001/profile/${profilUser?.id}`)
        else if (loggedInUser) response = await fetch(`localhost:3001/profile/me`)
        if (response && response.ok) {
          const userData = await response.json()
          setProfilUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user data: ', error)
      }
    }
    fetchData()
  }, [loggedInUser, userId])
  return (
    <div
      className='hero pt-6'
      style={{
        padding: '10px',
      }}
    >
      <div className='hero-overlay bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-t-lg bg-opacity-60'></div>
      <div className='hero-content text-center text-neutral-content'>
        <div className='max-w-md'>
          <h1 className='mb-5 text-5xl font-bold text-purple-100'>
            {profilUser ? profilUser.username : loggedInUser?.username}
          </h1>
          <div className='avatar'>
            <div className='w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start'>
              <img src={profilUser ? profilUser.image : loggedInUser?.image} alt='avatar' />
            </div>
          </div>
          <div className='columns-3 flex-auto space-y-20'>
            <div className='grid-cols-2 space-x-0 shadow-xl'>
              <p className='font-bold rounded-t-lg drop-shadow-md'>Win</p>
              <p className='px-10 text-black rounded-b-lg backdrop-opacity-10 backdrop-invert bg-white/50'>
                5
              </p>
            </div>
            <div className='grid-cols-2 space-x-0 shadow-xl'>
              <p className='font-bold rounded-t-lg drop-shadow-md'>Lose</p>
              <p className='px-10 text-black rounded-b-lg backdrop-opacity-10 backdrop-invert bg-white/50'>
                5
              </p>
            </div>
            <div className='grid-cols-2 space-x-0 rounded-lg  shadow-xl'>
              <p className='font-bold drop-shadow-md'>Friends</p>
              <p className='px-10 text-black rounded-b-lg backdrop-opacity-10 backdrop-invert bg-white/50'>
                5
              </p>
            </div>
          </div>
          <div>{isUserId()}</div>
        </div>
      </div>
    </div>
  )
}
const ProfileWithNavbar = WithNavbar(Profile)
export { Profile, ProfileWithNavbar }
