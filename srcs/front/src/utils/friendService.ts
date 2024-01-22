import { Query, QueryKey } from '@tanstack/react-query'

import { IFriends, IUser } from '../types/User'
import httpInstance from './httpClient'

export const createFriendRequest = async (friendOfId: number) => {
  await httpInstance().post<IFriends>(`/api/friends`, {
    friendOfId,
  })
}

export const acceptFriendRequest = async (friendOfId: number) => {
  const response = await httpInstance().post<IFriends>(`/api/friends/add`, {
    friendOfId,
  })
  return response.data
}

export const removeFriend = async (friendOfId: number) => {
  await httpInstance().delete<IFriends>(`/api/friends/add`, {
    data: {
      friendOfId,
    },
  })
}

export const getFriends = async () => {
  const { data } = await httpInstance().get<IFriends[]>(`/api/friends`)
  return data
}
