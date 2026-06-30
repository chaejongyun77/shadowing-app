// 백엔드 공통 응답 래퍼 (ApiResponse<T>)
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}

// 카테고리 Enum (백엔드 VideoCategory와 일치)
export type VideoCategory = 'ANIME' | 'DRAMA' | 'MOVIE' | 'EDUCATION' | 'OTHER'

export const CATEGORY_LABELS: Record<string, string> = {
  ALL:       '전체',
  ANIME:     '애니메이션',
  DRAMA:     '드라마',
  MOVIE:     '영화',
  EDUCATION: '교육',
  OTHER:     '기타',
}

// 영상 (GET /api/videos)
export interface Video {
  id: number
  youtubeVideoId: string
  title: string
  thumbnailUrl: string | null
  category: VideoCategory
  createdAt: string
  duration?: string
  views?: string
  sentences?: number
}

// 단어/문법 노트 (Gemini가 추출, Script.wordNotes에 JSON으로 저장)
export interface WordNote {
  word: string        // 일본어 단어 (예: 今日)
  reading: string      // 히라가나 발음 (예: きょう)
  meaning: string       // 한국어 의미 (예: 오늘)
}

export interface GrammarNote {
  pattern: string      // 문법 패턴 (예: 〜だね)
  explanation: string  // 설명
}

// 스크립트 (GET /api/videos/{id}/scripts) - 백엔드 응답 그대로
export interface Script {
  id: number
  startTime: number
  endTime: number
  japaneseText: string
  pronunciation: string | null
  translation: string
  wordNotes?: WordNote[]
  grammarNotes?: GrammarNote[]
}

// 쉐도잉 문장 (UI 렌더링용 - Script를 변환한 형태)
export interface Sentence {
  jp: string
  reading?: string
  ko?: string
  time?: string
  startTime: number
  endTime: number
  wordNotes?: WordNote[]
  grammarNotes?: GrammarNote[]
}
