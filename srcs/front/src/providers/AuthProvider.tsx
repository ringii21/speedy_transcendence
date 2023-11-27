import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

import { IUser } from '../types/User'
import { login, logout } from '../utils/authService'
import { AxiosError } from 'axios'

const signInOr2fa = async (
  navigate: NavigateFunction,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
) => {
  try {
    const { data } = await login()
    setUser(data)
    navigate('/', { replace: true })
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401 && 'code' in e.response.data) {
        if (e.response.data.code === '2FA_REQUIRED') {
          console.log('2FA_REQUIRED')
          return navigate('/login/2fa', { replace: true })
        }
      }
      navigate('/login', { replace: true })
    }
  }
}

interface AuthContextData {
  user: IUser | null
  signin(): Promise<IUser | null>
  signout(): Promise<void>
}

type Props = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  signin: () => Promise.resolve(null),
  signout: () => Promise.resolve(),
})

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUser | null>(null)
  const navigate = useNavigate()

  const signout = async () => {
    await logout()
    setUser(null)
    navigate('/login', { replace: true })
  }

  const signin = async () => {
    try {
      await signInOr2fa(navigate, setUser)
      return user
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    ;(async () => {
      await signInOr2fa(navigate, setUser)
    })()
  }, [])

  const memoedValue = useMemo<AuthContextData>(
    () => ({
      user,
      signout,
      signin,
    }),
    [user],
  )

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
