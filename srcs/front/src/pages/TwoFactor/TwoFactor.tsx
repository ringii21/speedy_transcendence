import React from 'react'
import getHttpInstance from '../../utils/httpClient'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'

type FormValues = {
  code: string
}

const TwoFactor = () => {
  const { signin } = useAuth()
  const navigate = useNavigate()
  const [qrCode, setQrCode] = React.useState<string>('')
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>()

  const generateTwoFa = async () => {
    try {
      const { data } = await getHttpInstance({ responseType: 'blob' }).post(
        '/api/2fa/generate',
      )
      const blob = new Blob([data], { type: 'image/png' })
      const img = URL.createObjectURL(blob)
      setQrCode(img)
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      await getHttpInstance().post('/api/2fa/enable', data)
      await signin()
      navigate('/settings')
    } catch (error) {
      setError('code', { message: 'Invalid code' })
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <button className="btn btn-primary" onClick={generateTwoFa}>
        Generate 2fa QR code
      </button>
      {qrCode && (
        <div>
          <img src={qrCode} alt="2fa QR code" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text-alt">Two factor code</span>
              </label>
              <input
                type="text"
                placeholder="2fa code"
                max={6}
                min={6}
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
              Activate 2fa
            </button>
          </form>
          {errors.code && (
            <span className="text-xs text-red-500">This field is required</span>
          )}
        </div>
      )}
    </div>
  )
}

export { TwoFactor }
