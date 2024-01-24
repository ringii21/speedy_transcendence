import { useQuery, UseQueryResult } from '@tanstack/react-query'
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { INotification } from '../types/User'
import { getNotification } from '../utils/notificationService'
import { useAuth } from './AuthProvider'

interface NotificationContextData {
  notifier: INotification[]
}

type Props = {
  children: ReactNode
}

const NotificationContext = createContext<NotificationContextData>({
  notifier: [],
})

export const NotificationProvider = ({ children }: Props) => {
  const { user } = useAuth()

  const { data: notifier } = useQuery({
    queryKey: ['notification'],
    queryFn: getNotification,
  })

  const memo = useMemo<NotificationContextData>(() => {
    return {
      notifier: notifier || [],
    }
  }, [notifier])

  return <NotificationContext.Provider value={memo}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext)
