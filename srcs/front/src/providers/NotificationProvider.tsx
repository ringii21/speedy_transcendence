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

interface NotificationContextData {
  notifier?: {
    data: INotification[] | undefined
    isError: boolean
    isLoading: boolean
  }
  sendedNotification: number | null
  setSendedNotification: Dispatch<SetStateAction<number | null>>
  notification: { [key: string]: boolean }
  setNotification: Dispatch<SetStateAction<{ [key: string]: boolean }>>
}

type Props = {
  children: ReactNode
}

const NotificationContext = createContext<NotificationContextData>({
  notifier: undefined,
  sendedNotification: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSendedNotification: () => {},
  notification: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNotification: () => {},
})

export const NotificationProvider = ({ children }: Props) => {
  const [sendedNotification, setSendedNotification] = useState<number | null>(null)
  const [notification, setNotification] = useState<{ [key: string]: boolean }>({})

  const {
    data: notifier,
    isError: isErrorNotifier,
    isLoading: isLoadingNotifier,
  } = useQuery({
    queryKey: ['notification'],
    queryFn: getNotification,
  })

  const getNotificationQuery = useQuery({
    queryKey: ['notification', sendedNotification],
    queryFn: getNotification,
  })

  const getNotificationData = useMemo(() => getNotificationQuery.data, [getNotificationQuery.data])

  useEffect(() => {
    if (!getNotificationData) return undefined
    getNotificationData.forEach((not) => {
      setNotification((prevNot) => {
        const updatedNotification = { ...prevNot }
        return {
          ...updatedNotification,
          [not.receivedId.toString()]: not.state,
        }
      })
    })
  }, [getNotificationData])

  const memoedValue = useMemo<NotificationContextData>(() => {
    return {
      notifier: {
        data: notifier,
        isError: isErrorNotifier,
        isLoading: isLoadingNotifier,
      },
      sendedNotification,
      setSendedNotification,
      notification: notification,
      setNotification,
    }
  }, [sendedNotification, notification, notifier])

  return <NotificationContext.Provider value={memoedValue}>{children}</NotificationContext.Provider>
}

export const useNotification = () => useContext(NotificationContext)
