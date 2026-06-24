import { useQuery } from '@tanstack/react-query'
import { scriptApi } from '../api/scriptApi'
import type { Script, Sentence } from '../types'

// 초(0.0) → mm:ss 표시용 포맷
const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// 백엔드 Script → UI Sentence 변환
const toSentence = (s: Script): Sentence => ({
  jp: s.japaneseText,
  reading: s.pronunciation ?? undefined,
  ko: s.translation,
  time: formatTime(s.startTime),
  startTime: s.startTime,
  endTime: s.endTime,
})

export const useScripts = (videoId: number) => {
  return useQuery({
    queryKey: ['scripts', videoId],
    queryFn: () => scriptApi.getScripts(videoId),
    select: (scripts) => scripts.map(toSentence),
    enabled: Number.isFinite(videoId) && videoId > 0,
  })
}
