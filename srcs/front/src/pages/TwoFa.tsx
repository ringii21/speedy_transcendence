import React, { useEffect, useRef } from 'react'
import getHttpInstance from '../utils/httpClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

const TwoFa = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const inputsRef = useRef<HTMLInputElement[] | null[]>([])
  const [error, setError] = React.useState<boolean>(false)

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = event.target.value
    if (value.length === 1 && index < 5) {
      inputsRef.current[index + 1]?.focus()
    } else if (value.length === 0 && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (index === 5) {
      sendCode()
    }
  }

  const sendCode = async () => {
    const code = inputsRef.current.map((input) => input?.value).join('')
    try {
      const { data } = await getHttpInstance().post('/api/2fa/authenticate', {
        code,
      })
      if (data) {
        navigate('/', { replace: true })
      }
    } catch (e) {
      setError(true)
    }
  }

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (error) {
      timer = setTimeout(() => {
        setError(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [error])

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Two-Factor Authentication</h1>
        <div className="flex space-x-2">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              className="input input-bordered input-primary w-12 text-center"
              type="text"
              maxLength={1}
              pattern="[0-9]*"
              inputMode="numeric"
              onChange={(e) => handleInputChange(e, i)}
            />
          ))}
        </div>
      </div>
      {error ? (
        <div className="toast toast-center">
          <div className="alert alert-error">
            <span>Invalid two factor code</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { TwoFa }
