import { Query, QueryKey } from '@tanstack/react-query'

import { IFriends, IUser } from '../types/User'
import httpInstance from './httpClient'

export const addFriends = async (data: { userId: IUser | undefined }) =>
  httpInstance().post<IFriends>(`/api/friends`, data)

export const removeFriend = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_, id] = queryKey
  const { data } = await httpInstance().get<IFriends>(`/api/friends/${id}`)
  return data
}

export const getAllFriends = async () => {
  const { data } = await httpInstance().get<IFriends>(`/api/friends`)
  return data
}
