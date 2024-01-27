import { useQuery } from '@tanstack/react-query'
import React, { createContext, ReactNode, useContext, useEffect } from 'react'

import { IFriends } from '../types/User'
import { getMyFriends } from '../utils/friendService'
import { notificationSocket } from '../utils/socketService'
import { useAuth } from './AuthProvider'
interface NotificationContextData {
  friends: IFriends[]
  friendsSuccess: boolean
  friendsError: boolean
}

type Props = {
  children: ReactNode
}

const NotificationContext = createContext<NotificationContextData>({
  friends: [],
  friendsSuccess: false,
  friendsError: false,
})

export const NotificationProvider = ({ children }: Props) => {
  const { user } = useAuth()

  const myFriendsQuery = useQuery({
    queryKey: ['friends'],
    queryFn: getMyFriends,
    initialData: [],
    enabled: !!user,
  })

  useEffect(() => {
    if (!notificationSocket.connect()) {
      notificationSocket.connect()
    }
    notificationSocket.on('refresh', async () => {
      await myFriendsQuery.refetch()
    })
    notificationSocket.on('accepted', async () => {
      await myFriendsQuery.refetch()
    })
    return () => {
      notificationSocket.off('refresh')
      notificationSocket.off('accepted')
      notificationSocket.disconnect()
    }
  }, [user])

  const values = {
    friends: myFriendsQuery.data,
    friendsSuccess: myFriendsQuery.isSuccess,
    friendsError: myFriendsQuery.isError,
  }

  return <NotificationContext.Provider value={values}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext)
