import { IFriends } from '../types/User'
import httpInstance from './httpClient'

export const createNotification = async (friendOfId: number) => {
  await httpInstance().post<IFriends>(`/api/notification`, {
    friendOfId,
  })
}

export const getNotification = async () =>
  (await httpInstance().get<IFriends[]>(`/api/notification`)).data

export const deleteNotification = async (friendOfId: number) => {
  await httpInstance().delete<IFriends>(`/api/notification`, {
    data: { friendOfId },
  })
}
