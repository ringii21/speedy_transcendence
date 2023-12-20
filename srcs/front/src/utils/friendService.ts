import { IUser } from '../types/User'
import httpInstance from './httpClient'

export const getNonFriends = async () => {
  const { data } = await httpInstance().get<IUser[]>('/api/users/nonFriends')
  return data
}

export const addFriend = async (userId: number) => {
  const { data } = await httpInstance().post(`/api/users/new/${userId}`)
  return data
}

export const removeFriend = async (userId: number) => {
  const { data } = await httpInstance().post(`/api/users/remove/${userId}`)
  return data
}

export const getAllFriends = async () => {
  const { data } = await httpInstance().get<IUser[]>(`/api/users/all`)
  return data
}
