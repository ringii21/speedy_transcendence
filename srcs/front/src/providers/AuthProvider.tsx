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
  signout(): Promise<void>
}

type Props = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
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

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await login()
        if (data) setUser(data)
      } catch (e) {
        navigate('/login', { replace: true })
      }
    })()
  }, [])

  const memoedValue = useMemo<AuthContextData>(
    () => ({
      user,
      signout,
    }),
    [user],
  )

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
