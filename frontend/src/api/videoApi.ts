import apiClient from './axios'
import type { ApiResponse, Video } from '../types'

export const videoApi = {
  getVideos: async (): Promise<Video[]> => {
    const response = await apiClient.get<ApiResponse<Video[]>>('/videos')
    return response.data.data
  },
}
