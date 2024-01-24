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
import { INotification } from '../types/User'
import { getNotification } from '../utils/notificationService'
import { notificationSocket } from '../utils/socketService'
import { useAuth } from './AuthProvider'
import { useSocket } from './SocketProvider'

interface NotificationContextData {
  myNotification: Pick<INotification, 'receivedId'>[]
  notifier: INotification[]
}

type Props = {
  children: ReactNode
}

const NotificationContext = createContext<NotificationContextData>({
  notifier: [],
  myNotification: [],
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
      queryKey: [notification.receivedId],
      queryFn: () => getNotification(),
    })),
  })

  useEffect(() => {
    notificationSocket.on(
      NotificationSocketEvent.RECEIVED,
      async (data: { senderId: number; receivedId: number }) => {
        if (data.receivedId === user?.id) {
          await myNotificationQuery.refetch()
        } else {
          await queryClient.invalidateQueries({
            queryKey: [data.receivedId],
          })
        }
      },
    )

    return () => {
      notificationSocket.off(NotificationSocketEvent.DELETED)
    }
  }, [user])

  const values = {
    notifier: notificationQuery
      .flatMap((notification) => notification.data || [])
      .filter((notification): notification is INotification => notification !== undefined),
    myNotification: myNotificationQuery.data,
  }

  return <NotificationContext.Provider value={values}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext)
