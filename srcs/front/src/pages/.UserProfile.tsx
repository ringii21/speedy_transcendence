import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { WithNavbar } from '../hoc/WithNavbar'
import { IUser } from '../types/User'
import httpInstance from '../utils/httpClient'
import { fetchAllUsers, fetchUser, getUser } from '../utils/userHttpRequests'

// export const loader = async () => await fetchUser()

const UserProfil = () => {
  const [isFollow, setIsFollow] = useState('follow')
  const [selectedUser, setSelectedUser] = useState<number | undefined>()

  const { id } = useParams()

  const findUsers = useQuery<IUser[]>({
    queryKey: ['user', selectedUser],
    queryFn: fetchAllUsers,
  })

  const navigation = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await httpInstance()
          .get<IUser>(`http://localhost:3000/api/users/${id}`)
          .then((response) => {
            if (!response) throw new Error('Network or servor error')
            if (response.status === 404) navigation('*')
            return response
          })
          .catch((error) => {
            console.error('Error fetching user data: ', error)
          })
      } catch (e) {
        console.error('Error: ', e)
      }
    }
    fetchData()
  }, [])

  const byId = useQuery<IUser[]>({
    queryKey: ['user', selectedUser],
    queryFn: () => getUser(selectedUser as number),
  })

  const buttonFollow = async () => {
    const users = byId.data
    if (users && Array.isArray(users)) {
      users.find((user) => {
        if (user.id) console.log(user)
      })
    }
  }

  // const addNewFriend = async (id: number) => {
  //   await httpInstance()
  //     .post<IFriends>(`/api/friends/new/2`)
  //     .then((responseData) => {
  //       setIsFollow('unfollow')
  //       console.log('Added friend successfully', responseData.data)
  //     })
  //     .catch((error) => {
  //       console.error('Error adding friend: ', error)
  //       // Gérer les erreurs ici
  //     })
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (findUsers.data && Array.isArray(findUsers.data)) {
  //       for (const users of findUsers.data) {
  //         if (!window.location.hostname.includes('me')) {
  //           setSelectedUser(idUrl())
  //           return idFromUrl(users.id)
  //         } else return meFromUrl()
  //       }
  //     }
  //   }
  //   fetchData()
  // }, [setProfilUser, findUsers])

  let userData: IUser | undefined
  if (Array.isArray(findUsers.data)) {
    userData = findUsers.data.find((user) => user.id === selectedUser)
  }
  1
  // const isFriends = () => {
  //   if (user && user.friends) {
  //     const friends = user.friends.flat()
  //     if (friends) return friends.some((friend) => friend.id)
  //   }
  //   return false
  // }

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
            <span>{userData ? userData.username : ''}</span>
          </h1>
          <div className='avatar'>
            <div className='w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start'>
              <img src={userData ? userData.image : ''} alt='avatar' />
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
          <div className='flex justify-evenly'>
            <button
              onClick={() => buttonFollow()}
              className='btn btn-primary drop-shadow-xl rounded-lg'
            >
              {isFollow}
            </button>
            <button className='btn btn-secondary drop-shadow-xl rounded-lg'>Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}
const ProfileWithNavbar = WithNavbar(UserProfil)
export { ProfileWithNavbar, UserProfil }
