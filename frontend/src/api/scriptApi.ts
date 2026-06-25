import apiClient from './axios'
import type { ApiResponse, Script } from '../types'

export const scriptApi = {
  getScripts: async (videoId: number): Promise<Script[]> => {
    const response = await apiClient.get<ApiResponse<Script[]>>(
      `/videos/${videoId}/scripts`
    )
    return response.data.data
  },

  updateScript: async (
    scriptId: number,
    data: { startTime: number; endTime: number; translation: string }
  ): Promise<Script> => {
    const response = await apiClient.put<ApiResponse<Script>>(
      `/scripts/${scriptId}`,
      data
    )
    return response.data.data
  },
}
