import React from 'react'
import '../styles/home.css'
import Pong from '../components/Pong'
import { WithNavbar } from '../hoc/WithNavbar'
import { url } from 'inspector'
import pongTheme from './../assets/boardcard_pong.png'

const Home = () => {
  return (
    <div>
      <h1 className="text-center text-7xl uppercase text-white">Welcome</h1>
      <div className="shadow-lg shadow-black/10 rounded-lg px-px">
        <div className="columns-2">
          <div className="relative rounded-lg">
            <img
              className="rounded-l-lg bg-cover bg-no-repeat"
              src={pongTheme}
              alt=""
            />
          </div>
        </div>
        <div className="relative">
          <button
            type="submit"
            className={`absolute rounded-lg btn btn-primary w-25 right-3 bottom-3`}
          >
            Launch game
          </button>
        </div>
      </div>
    </div>
  )
}

const HomeWithNavbar = WithNavbar(Home)

export { HomeWithNavbar }
