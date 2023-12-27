import { QueryKey } from '@tanstack/react-query'

import { IUser } from '../types/User'
import httpInstance from './httpClient'

export const logout = async () => httpInstance().get('/api/auth/logout')
export const fetchUser = async () => (await httpInstance().get<IUser>('/api/users/me')).data
export const updateUser = async (user: FormData) =>
  httpInstance().patch<IUser>('/api/users/me', user, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const fetchAllUsers = async () => (await httpInstance().post<IUser[]>('/api/users')).data
export const getAllUsers = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_, id] = queryKey
  if (!id) throw new Error('Id is required')
  const { data } = await httpInstance().get<IUser[]>(`/api/users/${id}`)
  return data
}
