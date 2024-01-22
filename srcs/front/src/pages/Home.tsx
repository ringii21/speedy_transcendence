import './../styles/home.css'

import React from 'react'
import { Link } from 'react-router-dom'

import { RatingModal } from '../components/RatingModal'
import { WithNavbar } from '../hoc/WithNavbar'
import { useSocket } from '../providers/SocketProvider'
import pongTheme from './../assets/boardcard_pong.png'
const Home = () => {
  const { socket } = useSocket()
  socket?.connect()
  return (
    <div className='w-screen'>
      <h1 className='text-center text-4xl uppercase welcome md:text-7xl'>Welcome</h1>
      <Link
        to='#'
        className='flex flex-col items-center btnImg justify-center w-screen bg-black shadow md:flex-row'
      >
        <div className='flex flex-col'>
          <img className='object-cover md:rounded-none' src={pongTheme} alt='' />
        </div>
      </Link>
      <div className='flex flex-col justify-between p-4 leading-normal pt-10'>
        <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Noteworthy technology acquisitions 2021
        </h5>
        <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
          Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
          chronological order.
        </p>
      </div>
    </div>
  )
}

const HomeWithNavbar = WithNavbar(Home)

export { HomeWithNavbar }
