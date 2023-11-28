import { IUser } from '../types/User'
import httpInstance from './httpClient'

export const logout = async () => httpInstance().get('/api/auth/logout')
export const fetchUser = async () =>
  (await httpInstance().get<IUser>('/api/users/me')).data
export const updateUser = async (
  user: Partial<Pick<IUser, 'image' | 'twoFaEnabled' | 'username'>>,
) => httpInstance().patch<IUser>('/api/users/me', user)
