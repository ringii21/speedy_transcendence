import React from 'react'
import { useAuth } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Profil = () => {
  const { user, signout } = useAuth()

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await signout()
  }

  function isUserId(): React.ReactNode {
    if (!user?.username) {
      return (
        <div>
          <button className="btn btn-primary">Follow</button>
        </div>
      )
    } else {
      return (
        <div>
          <button className="btn btn-primary" onClick={onButtonClick}>
            Logout
          </button>
        </div>
      )
    }
  }

  return (
    <div
      className="hero pt-6"
      style={{
        padding: '10px',
      }}
    >
      <div className="hero-overlay rounded-t-lg bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content ">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold text-purple-100">
            {user?.username}
          </h1>
          <div className="avatar">
            <div className="w-36 rounded-full drop-shadow-lg hover:drop-shadow-xl justify-self-start">
              <img src={user?.image} alt="avatar" />
            </div>
          </div>
          <p className="mb-5">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <div>{isUserId()}</div>
        </div>
      </div>
    </div>
  )
}

export default Profil
