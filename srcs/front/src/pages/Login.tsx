import React, { useEffect, useState } from 'react'
import { Si42 } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

const Login = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [])

  const onButtonClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    window.open('http://localhost:3000/api/auth/42', '_self')
  }

  return (
    <div className="">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">ft_transcendence</h1>
            <button
              onClick={onButtonClick}
              className="btn btn-lg btn-primary mt-10"
              disabled={loading}
            >
              <span className={loading ? 'loading loading-spinner' : ''}></span>
              Login with <Si42 style={{ fontSize: '2em' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
