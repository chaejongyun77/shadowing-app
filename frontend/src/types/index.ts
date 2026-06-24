// 백엔드 공통 응답 래퍼 (ApiResponse<T>)
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}

// 영상 (GET /api/videos)
export interface Video {
  id: number
  youtubeVideoId: string
  title: string
  thumbnailUrl: string | null
  createdAt: string
  // 추가 예정 (옵셔널)
  duration?: string
  views?: string
  sentences?: number
}

// 쉐도잉 문장 (스크립트 API 연동 전까지 더미)
export interface Sentence {
  jp: string
  reading?: string
  ko?: string
  time?: string
}
