import React from 'react'
import { WithNavbar } from '../hoc/WithNavbar'
import { useParams } from 'react-router-dom'
import { IUser } from '../types/User'
import { useEffect, useState } from 'react'

interface ProfilUsersWithNavbar {
  FakeUsers: IUser[]
}

const ProfilUsers: React.FC<ProfilUsersWithNavbar> = ({
  FakeUsers,
}: {
  FakeUsers: IUser[]
}) => {
  const { id, username } = useParams<{ id: string; username: string }>()
  const [userData, setUserData] = useState<IUser>()
  const [buttonFollow, setButtonFollow] = useState<string>('Follow')

  const handleFollow = () => {
    if (userData) {
      const userToFollow = FakeUsers.find((u) => u.id == id)
      if (userToFollow && !userData.friends.includes(userToFollow.id)) {
        setUserData((current) => {
          if (current) {
            current.friends.push(userToFollow.id)
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
          (users) => users !== current.id,
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
      const userToFollow = FakeUsers.find((u) => u.id === id)
      if (userToFollow) {
        return (
          <button
            onClick={
              userData?.friends.includes(userToFollow?.id)
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
    const users = FakeUsers.find((u) => u.id == id && u.username == username)
    setUserData(users)
  }, [id, username, FakeUsers])
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
              {userData ? userData.username : 'Loading...'}
            </h2>
          </div>
          <div className="avatar">
            <div className="w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start">
              <img
                src={userData ? userData.image : 'Loading...'}
                alt="myimage"
              />
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
            <div className="grid-cols-2 space-x-0 rounded-lg shadow-xl">
              <p className="font-bold drop-shadow-md">Friends</p>
              <p className="px-10 text-black rounded-b-lg backdrop-opacity-10 backdrop-invert bg-white/50">
                5
              </p>
            </div>
          </div>
          <div className="space-x-0">
            <div>{addUser()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfilUserWithNavbar = WithNavbar(ProfilUsers)
export { ProfilUsers, ProfilUserWithNavbar }
