import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
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
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient
