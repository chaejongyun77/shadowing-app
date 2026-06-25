import { useEffect, useRef, useState } from 'react'
import type { YouTubeEvent, YouTubePlayer } from 'react-youtube'
import type { Sentence } from '../types'

const SPEED_OPTIONS = [1, 0.75, 0.5]
const SYNC_INTERVAL_MS = 250 // 자막 동기화 폴링 주기

// YouTube IFrame Player 상태값
const YT_PLAYING = 1
const YT_PAUSED = 2
const YT_ENDED = 0

/**
 * 플레이어 UI 상태와 YouTube 플레이어 제어를 캡슐화한 훅.
 * (현재 구간, 재생/녹음 토글, 배속, A-B 반복, 구간 이동, 자막 자동 동기화 등)
 */
export function usePlayer(sentences: Sentence[]) {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const total = sentences.length

  // 폴링에서 항상 최신 sentences를 참조하기 위한 ref
  // (sentences 배열 참조가 바뀌어도 인터벌을 재생성하지 않도록)
  const sentencesRef = useRef(sentences)
  sentencesRef.current = sentences

  const [sIdx, setSIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [ab, setAb] = useState(false)

  // ab/sIdx도 폴링에서 최신 값 참조하기 위한 ref
  const abRef = useRef(ab)
  abRef.current = ab
  const sIdxRef = useRef(sIdx)
  sIdxRef.current = sIdx

  // 파생 값
  const sNo = total > 0 ? sIdx + 1 : 0
  const speedLabel = `${speed}×`
  const progressPct = total > 0 ? `${Math.round((sNo / total) * 100)}%` : '0%'

  // 재생 중일 때 현재 시간을 추적해 해당 구간을 자동 하이라이트 + A-B 반복 처리
  useEffect(() => {
    if (!playing) return

    const id = setInterval(async () => {
      const player = playerRef.current
      if (!player) return

      const t = await player.getCurrentTime()
      const sentences = sentencesRef.current

      // A-B 반복: 현재 구간의 endTime을 넘으면 startTime으로 되돌림
      if (abRef.current) {
        const current = sentences[sIdxRef.current]
        if (current && t >= current.endTime - 0.1) {
          player.seekTo(current.startTime, true)
          return
        }
      }

      // 자막 자동 동기화
      const idx = sentences.findIndex((s) => t >= s.startTime && t < s.endTime)
      if (idx !== -1) {
        setSIdx((prev) => (prev === idx ? prev : idx))
      }
    }, SYNC_INTERVAL_MS)

    return () => clearInterval(id)
  }, [playing])

  // YouTube 플레이어 이벤트
  const handleReady = (e: YouTubeEvent) => {
    playerRef.current = e.target
  }
  // 유튜브에서 직접 재생/정지해도 우리 상태가 따라가도록 (양방향 동기화)
  const handleStateChange = (e: YouTubeEvent) => {
    if (e.data === YT_PLAYING) setPlaying(true)
    else if (e.data === YT_PAUSED || e.data === YT_ENDED) setPlaying(false)
  }

  // 특정 구간으로 이동 (인덱스 → 해당 문장 시작 시간으로 점프 + 재생)
  const goTo = (index: number) => {
    if (total === 0) return
    const clamped = Math.max(0, Math.min(total - 1, index))
    setSIdx(clamped)

    const player = playerRef.current
    if (player) {
      player.seekTo(sentences[clamped].startTime, true)
      player.playVideo()
    }
  }

  // 조작 (재생 상태는 handleStateChange가 단일 출처로 갱신)
  const togglePlay = () => {
    const player = playerRef.current
    if (!player) {
      setPlaying((p) => !p)
      return
    }
    if (playing) player.pauseVideo()
    else player.playVideo()
  }
  const toggleAB = () => setAb((v) => !v)
  const cycleSpeed = () =>
    setSpeed((s) => SPEED_OPTIONS[(SPEED_OPTIONS.indexOf(s) + 1) % SPEED_OPTIONS.length])
  const prev = () => goTo(sIdx - 1)
  const next = () => goTo(sIdx + 1)
  const pick = (i: number) => goTo(i)

  return {
    sIdx,
    sNo,
    playing,
    speedLabel,
    ab,
    progressPct,
    handleReady,
    handleStateChange,
    togglePlay,
    toggleAB,
    cycleSpeed,
    prev,
    next,
    pick,
  }
}
