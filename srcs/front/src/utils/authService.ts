import getHttpInstance from './httpClient'
import { IUser } from '../types/User'

export const login = async () => getHttpInstance().get<IUser>('/api/users/me')
export const logout = async () => getHttpInstance().get('/api/auth/logout')
