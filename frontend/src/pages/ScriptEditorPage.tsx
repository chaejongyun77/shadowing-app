import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import YouTube, { type YouTubeEvent, type YouTubePlayer } from 'react-youtube'
import { useVideos } from '../hooks/useVideos'
import { useScripts } from '../hooks/useScripts'
import { scriptApi } from '../api/scriptApi'
import ScriptEditorRow from '../components/editor/ScriptEditorRow'
import type { Script } from '../types'

export default function ScriptEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoId = Number(id)

  const { data: videos } = useVideos()
  const { data: sentences = [], isLoading } = useScripts(videoId)
  const video = videos?.find((v) => v.id === videoId)

  const playerRef = useRef<YouTubePlayer | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [openId, setOpenId] = useState<number | null>(null)
  const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set())
  const [scripts, setScripts] = useState<Script[] | null>(null) // 수정된 스크립트 로컬 캐시
  const [isSaving, setIsSaving] = useState(false)

  // sentences(Sentence[])를 Script[]로 역변환하기 위해 원본 스크립트를 별도 쿼리로 가져옴
  const { data: rawScripts = [] } = useScripts(videoId)

  // 원본 데이터를 Script 형태로 사용 (useScripts가 Sentence로 변환하므로 별도 상태 유지)
  const [localScripts, setLocalScripts] = useState<Map<number, Script>>(new Map())

  // rawScripts가 로드되면 localScripts 초기화
  // (Sentence가 아닌 원본 Script 필요 → scriptApi 직접 사용)
  const [scriptList, setScriptList] = useState<Script[]>([])

  // 실제 Script 데이터 로딩 (scriptApi 직접 호출)
  const [loaded, setLoaded] = useState(false)
  if (!loaded && videoId > 0) {
    setLoaded(true)
    scriptApi.getScripts(videoId).then((data) => {
      setScriptList(data)
    })
  }

  const handleReady = (e: YouTubeEvent) => {
    playerRef.current = e.target
  }

  // 0.25초마다 현재 시간 업데이트
  const handleStateChange = (e: YouTubeEvent) => {
    if (e.data === 1) {
      const interval = setInterval(async () => {
        const t = await playerRef.current?.getCurrentTime()
        if (t !== undefined) setCurrentTime(t)
      }, 250)
      // 재생 멈추면 인터벌 해제 (단순화 버전)
      ;(playerRef.current as any)._pollInterval = interval
    } else {
      clearInterval((playerRef.current as any)?._pollInterval)
    }
  }

  const handleSetStart = () => {
    // 열린 행의 시작 시간을 현재 시간으로 (ScriptEditorRow 내부에서 처리)
  }

  const handleDone = async (
    scriptId: number,
    startTime: number,
    endTime: number,
    translation: string
  ) => {
    setOpenId(null)
    setDirtyIds((prev) => new Set(prev).add(scriptId))
    // 로컬 상태 업데이트
    setScriptList((prev) =>
      prev.map((s) =>
        s.id === scriptId ? { ...s, startTime, endTime, translation } : s
      )
    )
  }

  const handleSaveAll = async () => {
    if (dirtyIds.size === 0) return
    setIsSaving(true)
    try {
      await Promise.all(
        scriptList
          .filter((s) => dirtyIds.has(s.id))
          .map((s) =>
            scriptApi.updateScript(s.id, {
              startTime: s.startTime,
              endTime: s.endTime,
              translation: s.translation,
            })
          )
      )
      setDirtyIds(new Set())
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setDirtyIds(new Set())
    // 원본 데이터로 복원
    scriptApi.getScripts(videoId).then((data) => setScriptList(data))
  }

  const hasChanges = dirtyIds.size > 0
  const fmt = (n: number) => {
    const s = Math.floor(n)
    const cs = Math.round((n - s) * 100)
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }

  if (isLoading || !video) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#9a9a95] text-sm">
        불러오는 중...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-[90px]">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ececE6]">
        <div className="max-w-[1320px] mx-auto px-6 py-[14px] flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/study/${videoId}`)}
            className="inline-flex items-center gap-2 text-[#0f0f0f] border border-[#ececE6] bg-white font-semibold text-[14px] px-[15px] py-[9px] rounded-[11px] cursor-pointer shrink-0 hover:bg-[#faf9f6]"
          >
            ← 돌아가기
          </button>
          <div className="text-center min-w-0">
            <div className="text-[11.5px] text-[#65676b] font-semibold">스크립트 수정</div>
            <div className="jp font-extrabold text-[17px] tracking-tight truncate">{video.title}</div>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={!hasChanges || isSaving}
            className="shrink-0 border-none rounded-[11px] font-bold text-[14px] px-[22px] py-[10px] cursor-pointer transition-all"
            style={{
              background: hasChanges ? '#ff4d3d' : '#f0f0ea',
              color: hasChanges ? '#fff' : '#b0b0a9',
              boxShadow: hasChanges ? '0 8px 18px -8px rgba(255,77,61,0.5)' : 'none',
            }}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </header>

      <main className="max-w-[1320px] mx-auto px-6 pt-[26px] flex gap-7 items-start">
        {/* 좌측 — 영상 패널 */}
        <div className="w-[40%] shrink-0 sticky top-[96px]">
          {/* 유튜브 플레이어 */}
          <div className="relative rounded-[18px] overflow-hidden aspect-video bg-[#0c0c0e] shadow-[0_20px_44px_-20px_rgba(0,0,0,0.45)]">
            <YouTube
              videoId={video.youtubeVideoId}
              opts={{ width: '100%', height: '100%', playerVars: { controls: 1, rel: 0 } }}
              onReady={handleReady}
              onStateChange={handleStateChange}
              className="absolute inset-0 w-full h-full"
              iframeClassName="w-full h-full"
            />
          </div>

          {/* 시간 패널 */}
          <div className="mt-4 bg-white border border-[#ececE6] rounded-[16px] p-[18px]">
            <div className="flex items-center justify-between mb-[14px]">
              <span className="text-[13px] text-[#65676b] font-semibold">현재 재생 시간</span>
              <span className="jp text-[26px] font-extrabold tracking-tight">{fmt(currentTime)}</span>
            </div>
            <div className="h-[5px] rounded-full bg-[#efefea] overflow-hidden mb-4">
              <div className="h-full bg-[#ff4d3d] rounded-full" style={{ width: '24%' }} />
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={handleSetStart}
                className="flex-1 bg-white border border-[#ffccc4] text-[#ff4d3d] font-bold text-[13.5px] py-3 rounded-[11px] cursor-pointer"
              >
                시작 시간으로 설정
              </button>
              <button
                onClick={() => {}}
                className="flex-1 bg-white border border-[#ffccc4] text-[#ff4d3d] font-bold text-[13.5px] py-3 rounded-[11px] cursor-pointer"
              >
                종료 시간으로 설정
              </button>
            </div>
            {openId !== null && (
              <div className="mt-3 text-[12px] text-[#65676b] text-center">
                → 구간 {scriptList.findIndex((s) => s.id === openId) + 1} 편집 중
              </div>
            )}
          </div>
        </div>

        {/* 우측 — 스크립트 목록 */}
        <div className="w-[60%] shrink-0">
          <div className="flex items-center gap-2 mb-[14px] text-[#65676b]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff4d3d" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="11" x2="12" y2="16" />
              <circle cx="12" cy="8" r="1" fill="#ff4d3d" stroke="none" />
            </svg>
            <span className="text-[13.5px]">클릭하면 해당 구간을 편집할 수 있어요</span>
          </div>

          <div className="flex flex-col gap-[11px] pb-6">
            {scriptList.map((script, i) => (
              <ScriptEditorRow
                key={script.id}
                script={script}
                index={i}
                isOpen={openId === script.id}
                isDirty={dirtyIds.has(script.id)}
                currentTime={currentTime}
                onToggle={() => setOpenId((prev) => (prev === script.id ? null : script.id))}
                onDone={handleDone}
              />
            ))}
          </div>
        </div>
      </main>

      {/* 플로팅 저장 바 */}
      {hasChanges && (
        <div className="fixed left-0 right-0 bottom-0 z-40 bg-[#0f0f0f] text-white animate-[slideup_0.3s_ease]">
          <div className="max-w-[1320px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-[11px]">
              <span className="w-[9px] h-[9px] rounded-full bg-[#ff4d3d] inline-block" />
              <span className="text-[14.5px] font-semibold">
                <b className="text-[#ff8a7d]">{dirtyIds.size}개</b> 항목이 수정되었습니다
              </span>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={handleDiscard}
                className="bg-transparent border border-white/30 text-white font-semibold text-[14px] px-[18px] py-[11px] rounded-[11px] cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-[#ff4d3d] border-none text-white font-bold text-[14px] px-6 py-[11px] rounded-[11px] cursor-pointer"
              >
                {isSaving ? '저장 중...' : '전체 저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
