import { Query, QueryKey } from '@tanstack/react-query'

import { IFriends, IUser } from '../types/User'
import httpInstance from './httpClient'

export const createFriendRequest = async (friendOfId: number) => {
  await httpInstance().post<IFriends>(`/api/friends`, {
    friendOfId,
  })
}

export const removeFriend = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_, id] = queryKey
  const { data } = await httpInstance().get<IFriends>(`/api/friends/${id}`)
  return data
}

export const getFriends = async () => {
  const { data } = await httpInstance().get<IFriends[]>(`/api/friends`)
  return data
}
