import { useQuery } from '@tanstack/react-query'
import { videoApi } from '../api/videoApi'

export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: videoApi.getVideos,
  })
}
