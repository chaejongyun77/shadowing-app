import { useQuery } from '@tanstack/react-query'
import { videoApi } from '../api/videoApi'

export const useVideos = (category?: string) => {
  return useQuery({
    queryKey: ['videos', category],
    queryFn: () => videoApi.getVideos(category),
  })
}
