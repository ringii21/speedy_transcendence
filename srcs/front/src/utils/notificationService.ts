import { INotification } from '../types/User'
import httpInstance from './httpClient'

export const createNotification = async (receivedId: number) => {
  await httpInstance().post<INotification>(`/api/notification`, {
    receivedId,
  })
}

export const getNotification = async () => {
  const { data } = await httpInstance().get<INotification[]>(`/api/notification`)
  return data
}

export const deleteNotification = async (receivedId: number) => {
  await httpInstance().delete<INotification>(`/api/notification`, {
    data: { receivedId },
  })
}
