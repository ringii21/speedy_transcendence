import React, { useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { WithNavbar } from '../hoc/WithNavbar'
import { FakeUsers } from '../types/FakeUser'
import { IUser } from '../types/User'
import { useParams } from 'react-router-dom'
import { IChannel, IChannelMember } from '../types/Chat'
import { IFriends } from '../types/User'

const Profil = () => {
  const { id } = useParams<{ id: string }>()
  const { user, signout } = useAuth()
  const [userData, setUserData] = useState<IUser>()
  const [userChannel, setUserChannel] = useState<IChannelMember>()
  const [isMe, setIsMe] = useState(false)
  const [buttonFollow, setButtonFollow] = useState<string>('Follow')
  // const checkUsers = [...Users, users]

  const handleFollow = () => {
    if (userData) {
      const userToFollow = userData.friends.find(
        (u) => u.id !== userChannel?.userId,
      )
      if (userToFollow) {
        setUserData((current) => {
          if (current) {
            current.friends.push(userToFollow)
            return current
          }
          return current
        })
        setButtonFollow('Unfollow')
        console.log(`Vous suivez maintenant ${userToFollow.username}`)
      }
    }
  }

  const handleUnfollow = () => {
    setUserData((current) => {
      if (current) {
        const newFriends = current.friends.filter(
          (users) => users.id !== current.id,
        )
        setButtonFollow('Follow')
        return {
          ...current,
          friends: newFriends,
        }
      }
      return current
    })
  }

  const addUser = () => {
    if (userData) {
      const userToFollow = userData.friends.find(
        (u) => u.id !== userChannel?.id,
      )
      if (userToFollow) {
        return (
          <button
            onClick={
              userData?.friends.includes(userToFollow)
                ? handleUnfollow
                : handleFollow
            }
            className="btn btn-lg btn-primary rounded-lg shadow-xl"
          >
            {buttonFollow}
          </button>
        )
      }
    }
  }

  useEffect(() => {
    const users = userData?.friends.find((u) => {
      if (u.id === users?.id) return true
      if (users === id) return true
      return false
    })
  }, [id, userData])

  useEffect(() => {
    const users = userData?.friends.find((u) => {
      if (id === 'me' && userData?.id === user?.id) return true
      if (userData.id === users?.id) return true
      if (users) {
        if (id === 'me') setIsMe(true)
        else setIsMe(false)
      } else return false
    })
  })
  return (
    <div
      className="hero pt-6"
      style={{
        padding: '10px',
      }}
    >
      <div className="hero-overlay bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md rounded-t-lg bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <div>
            <h2 className="text-center text-4xl uppercase text-white p-5">
              {userData?.username}
            </h2>
          </div>
          <div className="avatar">
            <div className="w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start">
              <img src={userData?.image} alt="myimage" />
            </div>
          </div>
          <div className="columns-3 flex-auto space-y-20">
            <div className="grid-cols-2 space-x-0 shadow-xl">
              <p className="font-bold rounded-t-lg drop-shadow-md">Win</p>
              <p className="px-10 text-black rounded-b-lg backdrop-opacity-10 backdrop-invert bg-white/50">
                5
              </p>
            </div>
            <div className="grid-cols-2 space-x-0 shadow-xl">
              <p className="font-bold rounded-t-lg drop-shadow-md">Lose</p>
              <p className="px-10 text-black rounded-b-lg backdrop-opacity-10 backdrop-invert bg-white/50">
                5
              </p>
            </div>
            <div className="grid-cols-2 space-x-0 rounded-lg  shadow-xl">
              <p className="font-bold drop-shadow-md">Friends</p>
              <p className="px-10 text-black rounded-b-lg backdrop-opacity-10 backdrop-invert bg-white/50">
                5
              </p>
            </div>
          </div>
          <div className="space-x-0">
            {isMe && (
              <button
                onClick={signout}
                className="btn btn-lg btn-primary rounded-lg shadow-xl"
              >
                Disconnect
              </button>
            )}
            {!isMe && addUser()}
          </div>
        </div>
      </div>
    </div>
  )
}
const ProfilWithNavbar = WithNavbar(Profil)
export { Profil, ProfilWithNavbar }
