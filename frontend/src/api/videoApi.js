import apiClient from './axios'

export const videoApi = {
  getVideos: async () => {
    const response = await apiClient.get('/videos')
    return response.data.data
  },
}
