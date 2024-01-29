import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { MatchHistory } from '../components/MatchHistory'
import { ModalFriendsList } from '../components/ModalFriendsList'
import { RatingHistory } from '../components/RatingHistory'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useNotification } from '../providers/NotificationProvider'
import { useSocket } from '../providers/SocketProvider'
import { createFriendRequest, removeFriend } from '../utils/friendService'
import { fetchUser, getUser } from '../utils/userHttpRequests'

const Profile = () => {
  const { user, signout } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  if (!id) {
    navigate('*')
    return <></>
  }

  const [isFollow, setIsFollow] = useState('Follow')
  const [openModal, setOpenModal] = useState(false)
  const [isColor, setIsColor] = useState('btn-primary')
  const [activeNotification, setActiveNotification] = useState<string[]>([])

  const queryClient = useQueryClient()

  const ref = useRef<HTMLDivElement>(null)
  if (!user) return <Navigate to='/login' state={{ from: location }} replace />

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

  const removeNotification = (friendOfId: string) => {
    setActiveNotification((prevActiveNotification) => {
      if (!prevActiveNotification) return prevActiveNotification

      const updatedNotification = prevActiveNotification.filter((id) => id !== friendOfId)

      return updatedNotification
    })
  }

  const { data: profileUser } = useQuery(queryConfig)

  const friendRequestMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: createFriendRequest,
  })

  const deleteFriendMutation = useMutation({
    mutationKey: ['friends'],
    mutationFn: removeFriend,
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

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  const { friends, friendsSuccess, friendsError } = useNotification()

  const changeFriendStatus = (id: number) => {
    if (isFollow === 'Discard') {
      deleteFriendMutation.mutate(id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['friends'],
          })
        },
      })
    } else if (isFollow === 'Unfollow') {
      deleteFriendMutation.mutate(id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['friends'],
          })
        },
      })
    } else if (isFollow === 'Follow') {
      friendRequestMutation.mutate(id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['friends'],
          })
        },
      })
    }
  }

  // *********************************************************
  useEffect(() => {
    const notFriendYet = friends.find((friend) => friend.confirmed === false)
    const isFriend = friends.find((friend) => friend.confirmed === true)

    let followStatus = 'Follow'
    let color = 'btn-primary'

    if (!(notFriendYet || isFriend)) {
      followStatus = 'Follow'
      color = 'btn-primary'
    } else if (isFriend) {
      followStatus = isFriend ? 'Unfollow' : 'Follow'
      color = isFriend ? 'btn-error' : 'btn-primary'
    } else {
      followStatus = notFriendYet ? 'Discard' : 'Follow'
      color = notFriendYet ? 'btn-warning' : 'btn-primary'
    }
    setIsFollow(followStatus)
    setIsColor(color)
  }, [friends, friendsSuccess, friendsError, setIsColor])

  const isUserId = () => {
    if (profileUser === undefined) {
      return <></>
    }
    if (!(profileUser?.id === user?.id)) {
      return (
        <div className={`flex justify-evenly`}>
          <button
            onClick={() => {
              changeFriendStatus(profileUser.id)
            }}
            className={`btn ${isColor} followColorButton drop-shadow-xl rounded-lg flex flex-row`}
          >
            {isFollow}
          </button>
          {/* <button className='btn drop-shadow-xl rounded-lg'>
            <FaPaperPlane className='mb-1' />
            Message
          </button> */}
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

  const numberFriends = () => {
    if (friends) {
      if (friends.find((friend) => friend.confirmed === true))
        return <>{Math.round(friends.length / 2)}</>
      return <>0</>
    }
    return <>0</>
  }

  return (
    <div className='flex lg:flex-row flex-col justify-center align-middle'>
      <div
        className='hero'
        style={{
          padding: '10px',
        }}
      >
        {ModalFriendsList({ openModal, setOpenModal, friends, me: user, removeNotification })}
        <div className='hero-overlay bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-lg bg-opacity-60'></div>
        <div className='hero-content text-center text-neutral-content'>
          <div className='w-full pt-4'>
            <h1 className='mb-5 text-5xl font-bold text-purple-100'>
              {profileUser && <span>{profileUser?.username}</span>}
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
                  {numberFriends()}
                </p>
              </div>
            </div>
            <div>{isUserId()}</div>
          </div>
        </div>
      </div>
      <div
        className='hero invisible lg:visible'
        style={{
          padding: '10px',
        }}
      >
        <MatchHistory user={user} />
      </div>
    </div>
  )
}

const ProfileWithNavbar = WithNavbar(Profile)
export { Profile, ProfileWithNavbar }
