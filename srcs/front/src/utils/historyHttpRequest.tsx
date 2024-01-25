import { QueryKey } from '@tanstack/react-query'

import httpInstance from './httpClient'

export const getStats = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_, id] = queryKey
  const { data } = await httpInstance().get(`/api/game/stats/${id}`)
  return data
}
