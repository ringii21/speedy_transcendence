import React from 'react'
import '../styles/home.css'
import Pong from '../components/Pong'
import { WithNavbar } from '../hoc/WithNavbar'

const Home = () => {
  return <div className="">{/* <Pong /> */}</div>
}

const HomeWithNavbar = WithNavbar(Home)

export { HomeWithNavbar }
