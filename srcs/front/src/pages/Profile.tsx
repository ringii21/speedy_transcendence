import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { FaMinus, FaPaperPlane, FaPlus } from 'react-icons/fa'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { ModalFriendsList } from '../components/ModalFriendsList'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { INotification } from '../types/User'
import { createFriendRequest, getFriends, removeFriend } from '../utils/friendService'
import {
  createNotification,
  deleteNotification,
  getNotification,
} from '../utils/notificationService'
import { fetchUser, getUser } from '../utils/userHttpRequests'

const Profile = () => {
  const { user, signout } = useAuth()
  if (!user) return <Navigate to='/login' state={{ from: location }} replace />
  const { id } = useParams()
  const navigate = useNavigate()
  if (!id) {
    navigate('*')
    return <></>
  }

  const [isFollow, setIsFollow] = useState('Follow')
  const [openModal, setOpenModal] = useState(false)
  const [isColor, setIsColor] = useState('btn-primary')
  const [isNotification, setIsNotification] = useState<INotification>()
  const ref = useRef<HTMLDivElement>(null)

  let queryConfig
  if (id === 'me') {
    queryConfig = {
      queryKey: ['profile', 'me'],
      queryFn: fetchUser,
    }
  } else {
    queryConfig = {
      queryKey: ['profile', id],
      queryFn: getUser,
    }
  }

  // requests
  const {
    data: friends,
    isError: isErrorFriends,
    isLoading: isLoadingFriends,
  } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
  })

  const { data: profileUser, isError } = useQuery(queryConfig)

  const notificationMutation = useMutation({
    mutationKey: ['notification'],
    mutationFn: createNotification,
  })

  const getNotificationQuery = useQuery({
    queryKey: ['notification'],
    queryFn: getNotification,
  })

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

  // Socket to handle and change notification state
  // useEffect(() => {
  //   const receivedNotification = (notification: INotification) => {
  //     setIsNotification((prevNotification) => ({
  //       ...prevNotification,
  //       [notification.senderId]: [...(prevNotification[notification.senderId] ?? [])],
  //     }))
  //   }

  //   notificationSocket?.on(RECEIVED, receivedNotification)
  // }, [])

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const deleteNotificationMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: deleteNotification,
  })

  const deleteFriendMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: removeFriend,
  })

  const followColorButton = () => {
    if (isFollow == 'Unfollow') setIsColor('btn-warning')
    else if (isFollow === 'Discard') setIsColor('btn-warning')
    else setIsColor('btn-primary')
  }

  const changeFriendStatus = (id: number) => {
    try {
      if (isFollow === 'Discard') {
        deleteNotificationMutation.mutate(id)
        console.log('1st step')
        return
      } else if (isFollow === 'Unfollow') {
        deleteFriendMutation.mutate(id)
        return
      } else {
        notificationMutation.mutate(id)
        return
      }
    } catch (e) {
      console.error('Error during mutations: ', e)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!(friends && friends.forEach)) return undefined
      friends.forEach((friend) => {
        if (friend.confirmed === true) {
          setIsFollow('Unfollow')
          followColorButton()
        }
      })
      if (!(getNotificationQuery && getNotificationQuery.data)) return undefined
      getNotificationQuery.data.map((not) => {
        if (not.state === true) {
          setIsFollow('Discard')
          followColorButton()
        }
      })
    }
    fetchData()
  }, [setIsFollow, isFollow, friends])

  const isUserId = () => {
    if (!profileUser) return <></>
    if (!(profileUser?.id === user?.id)) {
      return (
        <div className={`flex justify-evenly`}>
          <button
            onClick={() => changeFriendStatus(profileUser?.id)}
            className={`btn ${isColor} followColorButton drop-shadow-xl rounded-lg flex flex-row`}
          >
            {isFollow === 'Follow' ? <FaPlus className='mb-0.5' /> : <FaMinus className='mb-0.5' />}
            {isFollow}
          </button>
          <button className='btn drop-shadow-xl rounded-lg'>
            <FaPaperPlane className='mb-1' />
            Message
          </button>
        </div>
      )
    } else {
      return (
        <div ref={ref} className='flex justify-evenly'>
          <button className='btn btn-primary drop-shadow-xl rounded-lg' onClick={onButtonClick}>
            Logout
          </button>
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

  return (
    <div
      className='hero pt-6'
      style={{
        padding: '10px',
      }}
    >
      {ModalFriendsList({ openModal, setOpenModal, friends, me: user })}
      <div className='hero-overlay bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-t-lg bg-opacity-60'></div>
      <div className='hero-content text-center text-neutral-content'>
        <div className='max-w-md'>
          <h1 className='mb-5 text-5xl font-bold text-purple-100'>
            {profileUser && <span>{profileUser.username}</span>}
          </h1>
          <div className='avatar'>
            <div className='w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start'>
              <img src={profileUser?.image} alt='avatar' />
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
                {friends && friends.length}
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
