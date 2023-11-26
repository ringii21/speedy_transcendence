import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { IUser } from '../types/User'
import { login, logout } from '../utils/authService'

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
      const { data } = await login()
      if (data) setUser(data)
      return data
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await login()
        if (data) setUser(data)
      } catch (e) {}
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
