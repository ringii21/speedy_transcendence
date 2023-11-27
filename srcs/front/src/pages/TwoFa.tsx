import React, { useEffect } from 'react'
import getHttpInstance from '../utils/httpClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { useForm } from 'react-hook-form'

type FormValues = {
  code: string
}

const TwoFa = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async (code: FormValues) => {
    try {
      const { data } = await getHttpInstance().post(
        '/api/2fa/authenticate',
        code,
      )
      if (data) {
        navigate('/', { replace: true })
      }
    } catch (e) {
      setError('code', { message: 'Invalid code' })
    }
  }

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [])

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text-alt">2fa code</span>
            </label>
            <input
              type="text"
              placeholder="2fa code"
              max={6}
              min={6}
              autoComplete="off"
              maxLength={6}
              {...register('code', {
                required: true,
                maxLength: 6,
                minLength: 6,
              })}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <button className="btn btn-secondary" type="submit">
            Send code
          </button>
        </form>
        {errors.code && (
          <span className="text-xs text-red-500">This field is required</span>
        )}
      </div>
    </div>
  )
}

export { TwoFa }
