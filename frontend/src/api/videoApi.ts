import apiClient from './axios'
import type { ApiResponse, Video } from '../types'

export const videoApi = {
  getVideos: async (category?: string): Promise<Video[]> => {
    const params = category && category !== 'ALL' ? { category } : {}
    const response = await apiClient.get<ApiResponse<Video[]>>('/videos', { params })
    return response.data.data
  },
}
