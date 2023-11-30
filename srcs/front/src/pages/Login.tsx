import React, { useState } from 'react'
import { Si42 } from 'react-icons/si'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import httpInstance from '../utils/httpClient'

const Login = () => {
  const { user, signin } = useAuth()
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" />

  const login42Click = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    window.open('http://localhost:3000/api/auth/42', '_self')
  }

  const loginDevClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await httpInstance().post('/api/auth/dev')
      await signin()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">ft_transcendence</h1>
            <div className="grid">
              <button
                onClick={login42Click}
                className="btn btn-lg btn-primary mt-10"
                disabled={loading}
              >
                <span
                  className={loading ? 'loading loading-spinner' : ''}
                ></span>
                Login with <Si42 style={{ fontSize: '2em' }} />
              </button>
              <button
                onClick={loginDevClick}
                className="btn btn-lg btn-secondary mt-10"
                disabled={loading}
              >
                <span
                  className={loading ? 'loading loading-spinner' : ''}
                ></span>
                Login dev
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
