import { UseBaseQueryResult, useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { findSourceMap } from 'module'
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import { parseArgs } from 'util'

import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { IUser } from '../types/User'
import { addFriend, getAllFriends, getNonFriends, removeFriend } from '../utils/friendService'
import httpInstance from '../utils/httpClient'
import { fetchAllUsers, fetchUser } from '../utils/userHttpRequests'
import { IMe } from './../../../back/src/auth/42/42-oauth.types'

export const loader = async () => await fetchUser()
const Profile = () => {
  const { user: loggedIn, signout } = useAuth()
  const { id } = useParams()
  const [profilUser, setProfilUser] = useState<IUser>()

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const [selectedUser, setSelectedUser] = useState<number | undefined>(undefined)
  const findUsers = useQuery<IUser[]>({
    queryKey: ['user', selectedUser],
    queryFn: fetchAllUsers,
  })

  useEffect(() => {
    if (findUsers.data && Array.isArray(findUsers.data)) {
      const userId = findUsers.data.map((user) => user.id)
      const userName = findUsers.data.map((user) => user.username)
      console.log('ID: ', userId)
      console.log('Username: ', userName)
    }
  }, [findUsers.data])

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

  const navigation = useNavigate()
  const location: any = useLocation()

  const idUrl = () => {
    const id: number = parseInt(location.pathname.split('/').pop(), 10)
    if (!isNaN(id)) return id
  }

  const idFromUrl = async (id: number) => {
    await httpInstance()
      .get<IUser>(`http://localhost:3000/api/users/${id}`)
      .then((response) => {
        if (!response) {
          throw new Error('Network or servor error')
        }
        if (response.status === 404) navigation('*')
        return response
      })
      .catch((error) => {
        console.error('Error fetching user data: ', error)
      })
  }

  const meFromUrl = async () => {
    await httpInstance()
      .get<IUser>(`http://localhost:3000/api/users/me`)
      .then((response) => {
        if (!response) {
          throw new Error('Network or servor error')
        }
        if (response.status === 404) navigation('*')
        return response
      })
      .catch((error) => {
        console.error('Error fetching user data: ', error)
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (findUsers.data && Array.isArray(findUsers.data)) {
        for (const users of findUsers.data) {
          if (!window.location.hostname.includes('me')) {
            setSelectedUser(idUrl())
            return idFromUrl(users.id)
          } else return meFromUrl()
        }
      }
    }
    fetchData()
  }, [setProfilUser, findUsers])

  let userData
  if (Array.isArray(findUsers.data)) {
    userData = findUsers.data.find((user) => user.id === selectedUser)
  }

  const isFriends = () => {
    if (loggedIn && loggedIn.friends) {
      const friends = loggedIn.friends.flat()
      if (friends) return friends.some((friend) => friend.id)
    }
    return false
  }

  const isUserId = () => {
    if (Array.isArray(findUsers.data)) {
      if (!window.location.pathname.includes('me') && selectedUser !== loggedIn?.id) {
        return (
          <div className='flex justify-evenly'>
            {!isFriends() ? (
              <button className='btn btn-primary drop-shadow-xl rounded-lg'>Follow</button>
            ) : (
              <button className='btn btn-primary drop-shadow-xl rounded-lg'>Unfollow</button>
            )}
            <button className='btn btn-secondary drop-shadow-xl rounded-lg'>Message</button>
          </div>
        )
      } else {
        return (
          <div>
            <button className='btn btn-primary drop-shadow-xl rounded-lg' onClick={onButtonClick}>
              Logout
            </button>
          </div>
        )
      }
    }
  }

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
            {userData ? <span>{userData.username}</span> : <span>{loggedIn?.username}</span>}
          </h1>
          <div className='avatar'>
            <div className='w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start'>
              <img src={userData ? userData.image : loggedIn?.image} alt='avatar' />
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
