import { UseBaseQueryResult, useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { findSourceMap } from 'module'
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { IFriends, IUser } from '../types/User'
import { addFriend, getAllFriends, getNonFriends, removeFriend } from '../utils/friendService'
import { fetchFindUser, getUserById } from '../utils/userHttpRequests'

const Profile = () => {
  const { user: loggedInUser, signout } = useAuth()
  const [profilUser, setProfilUser] = useState<IUser | null>(null)
  /*
  const [addFriends, setAddFriends] = useState<IFriends>()
  const [nonFriends, setNonFriends] = useState<IUser[]>([])
  const [friends, setFriends] = useState<IUser[]>([])
  */

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  // const findUsers = useQuery<IUser, Error>({
  //   queryKey: ['user', selectedUser],
  //   queryFn: fetchFindUser,
  // })

  const otherUser = useQuery<IUser>({
    queryKey: ['user', selectedUser],
    queryFn: getUserById,
  })

  // useEffect(() => {
  //   setSelectedUser(6)
  //   try {
  //     if (findUsers.data) {
  //       console.log('userId: ' + findUsers.data?.id)
  //       console.log('username: ' + findUsers.data?.username)
  //     }
  //   } catch (e) {
  //     const err = e as AxiosError
  //     console.log(`Error: ` + err.response?.data)
  //   }
  // })

  // useEffect(() => {
  //   async function getNonFriend() {
  //     try {
  //       const response = await getNonFriends()
  //       console.log('Non friend: ' + response)
  //       setNonFriends(response)
  //     } catch (e) {
  //       const err = e as AxiosError
  //       console.log('Error in Non Friends', err.response?.data)
  //     }
  //   }
  //   getNonFriend()
  // }, [])

  // useEffect(() => {
  //   async function getAllFriend() {
  //     try {
  //       const response = await getAllFriends()
  //       console.log('All friends: ' + response)
  //     } catch (e) {
  //       const err = e as AxiosError
  //       console.log('Error in All Friends', err.response?.data)
  //     }
  //   }
  //   getAllFriend()
  // }, [])

  // async function addNewFriends(userId: number) {
  //   try {
  //     const response = await addFriend(userId)
  //     console.log('Add new friend: ' + response.data)
  //   } catch (e) {
  //     console.log(`Error in ${addNewFriends.name}`, (e as Error).message)
  //   }
  // }

  // async function removeFriends(userId: number) {
  //   try {
  //     const response = await removeFriend(userId)
  //     console.log('Remove friends: ' + response)
  //   } catch (e) {
  //     console.log(`Error in ${addNewFriends.name}`, (e as Error).message)
  //   }
  // }

  const isUserId = () => {
    if (loggedInUser) {
      return (
        <div>
          <button className='btn btn-primary drop-shadow-xl rounded-lg' onClick={onButtonClick}>
            Logout
          </button>
        </div>
      )
      /*
    } else {
      return (
        <div className='flex justify-evenly'>
          {loggedInUser?.id ? (
            <button className='btn btn-primary drop-shadow-xl rounded-lg'>Follow</button>
          ) : (
            <button className='btn btn-primary drop-shadow-xl rounded-lg'>Unfollow</button>
          )}

          <button className='btn btn-secondary drop-shadow-xl rounded-lg'>Message</button>
        </div>
      )
    */
    }
  }

  const navigation = useNavigate()
  const location: any = useLocation()
  useEffect(() => {
    const userIdFromUrl: number = parseInt(location.pathname.split('/').pop(), 10)
    console.log('Url: ' + userIdFromUrl)
    if (!isNaN(userIdFromUrl) || window.location.pathname.includes('me')) {
      setSelectedUser(userIdFromUrl)
    } else navigation('*')
    const fetchData = async () => {
      console.log(`UserIds: ` + otherUser.data?.id)
      console.log(`LoggedIn: ` + loggedInUser?.id)
      try {
        let response
        if (!window.location.pathname.includes('me')) {
          response = await fetch(`http://localhost:3000/api/users/${userIdFromUrl}`)
        } else {
          response = await fetch(`http://localhost:3000/api/users/me`)
        }
        console.log(response)
        if (response && response.ok) {
          console.log('response ok')
          const userData = await response.json()
          setProfilUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user data: ', error)
      }
    }
    fetchData()
  }, [loggedInUser])
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
