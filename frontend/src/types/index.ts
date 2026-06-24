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

// 스크립트 (GET /api/videos/{id}/scripts) - 백엔드 응답 그대로
export interface Script {
  id: number
  startTime: number
  endTime: number
  japaneseText: string
  pronunciation: string | null
  translation: string
}

// 쉐도잉 문장 (UI 렌더링용 - Script를 변환한 형태)
export interface Sentence {
  jp: string
  reading?: string
  ko?: string
  time?: string
  startTime: number
  endTime: number
}
