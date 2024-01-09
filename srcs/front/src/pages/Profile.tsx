import {
  QueryKey,
  UseBaseQueryResult,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Response } from 'express'
import { findSourceMap } from 'module'
import React, { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import { parseArgs } from 'util'

import { ModalFriendsList } from '../components/ModalFriendsList'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { IFriends, IUser } from '../types/User'
import { addFriends, getAllFriends, removeFriend } from '../utils/friendService'
import httpInstance from '../utils/httpClient'
import { fetchAllUsers, fetchUser, getUser } from '../utils/userHttpRequests'
import { IMe } from './../../../back/src/auth/42/42-oauth.types'

export const loader = async () => await fetchUser()

const Profile = () => {
  const { user, signout } = useAuth()
  const { id } = useParams()

  const [profilUser, setProfilUser] = useState<IUser>()
  const [isFollow, setIsFollow] = useState('follow')
  const [openModal, setOpenModal] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
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
  }, [])

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const [selectedUser, setSelectedUser] = useState<number | undefined>()
  const findUsers = useQuery<IUser[]>({
    queryKey: ['user', selectedUser],
    queryFn: fetchAllUsers,
  })

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

  const byId = useQuery<IUser[]>({
    queryKey: ['user', selectedUser],
    queryFn: () => getUser(selectedUser as number),
  })

  const foundFriendById = async (userId: number) => {
    try {
      if (!byId.data) return undefined
      const user: IUser | undefined = byId.data.find((u) => u.id === userId)
      if (!user) {
        console.error(`User with ID ${userId} not found`)
        return undefined
      }
      // console.log('user: ', user)
      return user
    } catch (e: any) {
      console.error('Error: ', e.message)
      return undefined
    }
  }

  function buttonFollow(id: number) {
    const fetchData = async () => {
      try {
        const dataUser = await foundFriendById(id)
        if (!dataUser) console.error(`Error can not found userId ${id}`)
        console.log(dataUser)
        const addFriendResponse = await addFriends({
          userId: dataUser,
        })

        console.log('Friend added: ', addFriendResponse.data)
        return addFriendResponse
        // resolve(dataUser)
      } catch (e: any) {
        console.error('Error: ', e.message)
        // reject(e)
      }
    }
    return fetchData()
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
    if (user && user.friends) {
      const friends = user.friends.flat()
      if (friends) return friends.some((friend) => friend.id)
    }
    return false
  }

  const isUserId = () => {
    if (Array.isArray(findUsers.data)) {
      if (!window.location.pathname.includes('me') && selectedUser !== user?.id) {
        const currentUser = findUsers.data.find((friend) => friend.id === selectedUser)
        if (!currentUser) return
        return (
          <div className='flex justify-evenly'>
            <button
              onClick={() => buttonFollow(selectedUser as number)}
              className='btn btn-primary drop-shadow-xl rounded-lg'
            >
              {isFollow}
            </button>
            <button className='btn btn-secondary drop-shadow-xl rounded-lg'>Message</button>
          </div>
        )
      } else {
        return (
          <div ref={ref} className='flex justify-evenly'>
            <button className='btn btn-primary drop-shadow-xl rounded-lg' onClick={onButtonClick}>
              Logout
            </button>
            {ModalFriendsList({ openModal, setOpenModal, user })}
            <button
              type='button'
              className='btn btn-secondary drop-shadow-xl rounded-lg'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpenModal(!openModal)
              }}
            >
              Friends
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
            {userData ? <span>{userData.username}</span> : <span>{user?.username}</span>}
          </h1>
          <div className='avatar'>
            <div className='w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start'>
              <img src={userData ? userData.image : user?.image} alt='avatar' />
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
