import React from 'react'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../providers/AuthProvider'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type FormValues = {
  username: string
  picture: FileList
  twoFaEnabled: boolean
}

const Settings = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: user?.username,
      twoFaEnabled: user?.twoFaEnabled,
    },
  })

  const onSubmit = (data: any) => console.log(data)
  console.log(watch('username'))
  console.log(watch('twoFaEnabled'))
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center">
        <h1>Profile settings</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text-alt">Username</span>
            </label>
            <input
              type="text"
              placeholder={user?.username}
              defaultValue={user?.username}
              {...register('username', { required: true })}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text-alt">Email</span>
            </label>
            <input
              type="text"
              placeholder={user?.email}
              value={user?.email}
              disabled
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Choose a picture</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              {...register('picture')}
            />
          </div>
          {user?.twoFaEnabled ? (
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text-alt">
                  Two authentication factor
                </span>
              </label>
              <input
                type="checkbox"
                {...register('twoFaEnabled')}
                className="checkbox"
              />
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/settings/2fa')}
            >
              Add 2fa
            </button>
          )}
          <div className="form-control w-full max-w-xs">
            <button className="btn btn-primary">
              <input type="submit" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { Settings }
