import React from 'react'
import '../styles/home.css'
import Pong from '../components/Pong'
import { Navbar } from '../components/Navbar'

const Home = () => {
  return (
    <div className="">
      <Navbar />
      <Pong />
    </div>
  )
}

export default Home
