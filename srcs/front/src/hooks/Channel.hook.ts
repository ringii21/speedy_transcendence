import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { IChannel } from '../types/Chat'
import { getChannel } from '../utils/chatHttpRequests'

export const useSelectedChannel = () => {
  const { channelId } = useParams<{ channelId: string | undefined }>()
  const channelQuery = useQuery<IChannel>({
    queryKey: ['channels', channelId],
    queryFn: getChannel,
    enabled: !!channelId, // prevent query from running if channelId is undefined
  })

  return {
    channelId,
    channelData: channelQuery.data,
    isLoading: channelQuery.isLoading,
    isError: channelQuery.isError,
  }
}
