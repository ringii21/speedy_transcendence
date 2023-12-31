import { IUser } from '../types/User'
import httpInstance from './httpClient'

export const logout = async () => httpInstance().get('/api/auth/logout')
export const fetchUser = async () => (await httpInstance().get<IUser>('/api/users/me')).data
export const updateUser = async (user: FormData) =>
  httpInstance().patch<IUser>('/api/users/me', user, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
