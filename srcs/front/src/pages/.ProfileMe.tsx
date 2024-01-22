import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ModalFriendsList } from '../components/ModalFriendsList'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { IUser } from '../types/User'
import httpInstance from '../utils/httpClient'
import { fetchUser } from '../utils/userHttpRequests'

const ProfileMe = () => {
  const { user, signout } = useAuth()

  // const [openModal, setOpenModal] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const isOpen = (e: MouseEvent) => {
  //     const el = e.target as HTMLDivElement
  //     if (ref.current && !ref.current.contains(el)) {
  //       setOpenModal(false)
  //     }
  //   }
  //   document.addEventListener('click', isOpen)
  //   return () => {
  //     document.removeEventListener('click', isOpen)
  //   }
  // }, [])

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  // const navigation = useNavigate()

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await httpInstance()
  //       .get<IUser>(`http://localhost:3000/api/users/me`)
  //       .then((response) => {
  //         if (!response) {
  //           throw new Error('Network or servor error')
  //         }
  //         if (response.status === 404) navigation('*')
  //         return response
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching user data: ', error)
  //       })
  //   }
  // })

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
            <span>{user?.username}</span>
          </h1>
          <div className='avatar'>
            <div className='w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start'>
              <img src={user?.image} alt='avatar' />
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
          <div ref={ref} className='flex justify-evenly'>
            <button className='btn btn-primary drop-shadow-xl rounded-lg' onClick={onButtonClick}>
              Logout
            </button>
            {/* {ModalFriendsList({ openModal, setOpenModal, user })}
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
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
const ProfileWithNavbar = WithNavbar(ProfileMe)
export { ProfileMe, ProfileWithNavbar }
