import axios, { type AxiosError } from 'axios'

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? '') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 응답 인터셉터 - success: false 처리
apiClient.interceptors.response.use(
  (response) => {
    if (response.data.success === false) {
      return Promise.reject(new Error(response.data.message))
    }
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default apiClient
