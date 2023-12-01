import React, { useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { WithNavbar } from '../hoc/WithNavbar'
import { ThemeSelector } from '../components/ThemeSelector'
import { IUser } from '../types/User'
import { AddDelUser } from '../components/AddDelUser'
import { UsersService } from '../../../back/src/users/users.service'
import {useParams}
const Profil = () => {
  const {username} = useParams()
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
          <h1 className="mb-5 text-5xl font-bold text-purple-100">
            {myusers.username}
          </h1>
          <div className="avatar">
            <div className="w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start">
              <img src={myusers.image} alt="avatar" />
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
          {/* <AddDelUser users /> */}
        </div>
      </div>
    </div>
  )
}
const ProfilWithNavbar = WithNavbar(Profil)
export { Profil, ProfilWithNavbar }
