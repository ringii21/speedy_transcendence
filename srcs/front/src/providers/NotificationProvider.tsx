import {
  QueryClient,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query'
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

import { NotificationSocketEvent } from '../types/Events'
import { IFriends } from '../types/User'
import { getNotification } from '../utils/notificationService'
import { notificationSocket } from '../utils/socketService'
import { useAuth } from './AuthProvider'
import { useSocket } from './SocketProvider'

interface NotificationContextData {
  myFriends: Pick<IFriends, 'friendOfId'>[]
  friends: IFriends[]
}

type Props = {
  children: ReactNode
}

const NotificationContext = createContext<NotificationContextData>({
  friends: [],
  myFriends: [],
})

export const NotificationProvider = ({ children }: Props) => {
  const { user } = useAuth()
  const { notificationSocket } = useSocket()
  const queryClient = useQueryClient()

  const myNotificationQuery = useQuery({
    queryKey: ['notification'],
    queryFn: getNotification,
    initialData: [],
    enabled: !!user,
  })

  const notificationQuery = useQueries({
    queries: myNotificationQuery.data.map((notification) => ({
      queryKey: [notification.friendOfId],
      queryFn: () => getNotification(),
    })),
  })

  useEffect(() => {
    notificationSocket.on(
      NotificationSocketEvent.RECEIVED,
      async (data: { friendId: number; friendOfId: number }) => {
        if (data.friendOfId === user?.id) {
          await myNotificationQuery.refetch()
        } else {
          await queryClient.invalidateQueries({
            queryKey: [data.friendOfId],
          })
        }
      },
    )

    return () => {
      notificationSocket.off(NotificationSocketEvent.DELETED)
    }
  }, [user])

  const values = {
    friends: notificationQuery
      .flatMap((notification) => notification.data || [])
      .filter((notification): notification is IFriends => notification !== undefined),
    myFriends: myNotificationQuery.data,
  }

  return <NotificationContext.Provider value={values}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext)
