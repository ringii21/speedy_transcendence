import React, { useEffect } from 'react'
import '../styles/home.css'
import Pong from '../components/Pong'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../providers/AuthProvider'

const Home = () => {
  const { user, signin } = useAuth()
  useEffect(() => {
    signin()
  }, [])

  if (!user) return <div></div>
  else
    return (
      <div className="">
        <Navbar />
        <Pong />
      </div>
    )
}

export default Home
