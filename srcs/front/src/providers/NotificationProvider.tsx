import React, { createContext, ReactNode, useContext, useEffect } from 'react'

import { useGetFriends } from '../components/hook/Friends.hook'
import { notificationSocket } from '../utils/socketService'

type Props = {
  children: ReactNode
}

export enum NotificationEvent {
  REFRESH = 'refresh',
}

const NotificationContext = createContext({})

export const NotificationProvider = ({ children }: Props) => {
  const getFriendQuery = useGetFriends()

  useEffect(() => {
    notificationSocket.on(NotificationEvent.REFRESH, async () => {
      await getFriendQuery.refetch()
    })
    return () => {
      notificationSocket.off(NotificationEvent.REFRESH)
    }
  }, [])

  const values = {}

  return <NotificationContext.Provider value={values}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext)
