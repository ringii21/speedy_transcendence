import { Query, QueryKey } from '@tanstack/react-query'

import { IFriends, IUser } from '../types/User'
import httpInstance from './httpClient'

// export const getNonFriends = async () => {
//   const { data } = await httpInstance().get<IUser>('/api/users/nonFriends')
//   return data
// }

export const addFriend = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_, id] = queryKey
  const { data } = await httpInstance().post<IFriends>(`/api/friends/new`)
  return data
}

export const removeFriend = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_, id] = queryKey
  const { data } = await httpInstance().post<IFriends>(`/api/friends/remove/${id}`)
  return data
}

export const getAllFriends = async () => {
  const { data } = await httpInstance().get<IUser>(`/api/friends`)
  return data
}
