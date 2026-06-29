import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/axios'

type Status = 'idle' | 'loading' | 'done' | 'error'

interface ImportResult {
  videoId: number
  scriptCount: number
}

const STEPS = [
  '유튜브 자막 추출 중...',
  'Gemini AI 가공 중...',
  'DB 저장 중...',
]
const STEPS_DONE = [
  '유튜브 자막 추출 완료',
  'Gemini AI 가공 완료',
  'DB 저장 완료',
]

// YouTube URL에서 videoId 추출
function extractVideoId(url: string): string | null {
  const match = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/)
  return match ? match[1] : null
}

export default function AdminPage(){
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (status === 'loading') return

    const videoId = extractVideoId(url)
    if (!videoId) {
      setStatus('error')
      setErrorMsg('올바른 YouTube URL을 입력해주세요.')
      return
    }
    if (!title.trim()) {
      setStatus('error')
      setErrorMsg('영상 제목을 입력해주세요.')
      return
    }

    setStatus('loading')
    setStep(0)
    setResult(null)
    setErrorMsg('')

    // 단계별 UI 진행 시뮬레이션 (실제 API는 비동기로 처리)
    const t1 = setTimeout(() => setStep(1), 1200)
    const t2 = setTimeout(() => setStep(2), 2400)

    try {
      const res = await apiClient.post('/admin/videos/import', {
        youtubeVideoId: videoId,
        title: title.trim(),
      })
      clearTimeout(t1)
      clearTimeout(t2)
      setStep(3)
      setResult(res.data.data)
      setStatus('done')
    } catch (e: any) {
      clearTimeout(t1)
      clearTimeout(t2)
      setStatus('error')
      setErrorMsg(e.response?.data?.message ?? '서버 오류가 발생했습니다.')
    }
  }

  const handleRetry = () => {
    setStatus('idle')
    setStep(0)
    setResult(null)
    setErrorMsg('')
  }

  const isLoading = status === 'loading'

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-white/[0.88] backdrop-blur-md border-b border-[#ececE6]">
        <div className="max-w-[1320px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11.5px] font-extrabold tracking-widest text-[#ff4d3d] bg-[#fff0ee] px-[10px] py-[5px] rounded-[7px]">
              관리자
            </span>
            <h1 className="m-0 text-[21px] font-black tracking-tight">영상 등록</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-[#0f0f0f] border border-[#ececE6] bg-white font-semibold text-[14px] px-4 py-2.5 rounded-[11px] cursor-pointer hover:bg-[#faf9f6]"
          >
            ← 홈으로
          </button>
        </div>
      </header>

      <main className="max-w-[1320px] mx-auto px-6 pt-10 pb-20">
        {/* 메인 카드 */}
        <div className="max-w-[600px] mx-auto bg-white border border-[#ececE6] rounded-[18px] px-[34px] py-[36px] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.18)]">

          {/* URL 입력 */}
          <div className="mb-[22px]">
            <label className="block text-[13.5px] font-bold text-[#0f0f0f] mb-2">
              YouTube URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isLoading}
              className="w-full h-[52px] border border-[#ececE6] rounded-[13px] px-4 text-[15px] bg-[#fafaf7] outline-none focus:border-[#ff4d3d] focus:bg-white disabled:opacity-50"
            />
          </div>

          {/* 제목 입력 */}
          <div className="mb-[26px]">
            <label className="block text-[13.5px] font-bold text-[#0f0f0f] mb-2">
              영상 제목
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="영상 제목을 입력하세요"
              disabled={isLoading}
              className="w-full h-[52px] border border-[#ececE6] rounded-[13px] px-4 text-[15px] bg-[#fafaf7] outline-none focus:border-[#ff4d3d] focus:bg-white disabled:opacity-50"
            />
          </div>

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-[54px] flex items-center justify-center gap-[10px] border-none rounded-[13px] font-bold text-[16px] text-white cursor-pointer transition-opacity"
            style={{
              background: '#ff4d3d',
              boxShadow: '0 10px 22px -8px rgba(255,77,61,0.5)',
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            {isLoading && (
              <span className="w-[17px] h-[17px] border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? '처리 중...' : '자막 추출 및 등록'}
          </button>

          {/* 단계 진행 표시 */}
          {(isLoading || status === 'done') && (
            <div className="mt-6 border-t border-[#f0f0ea] pt-[22px] flex flex-col gap-[14px]">
              {STEPS.map((label, i) => {
                const done = step > i || status === 'done'
                const spinning = isLoading && step === i
                const waiting = !done && !spinning
                return (
                  <div key={i} className="flex items-center gap-[13px]">
                    {/* 아이콘 */}
                    <div
                      className="w-[26px] h-[26px] shrink-0 rounded-full flex items-center justify-center"
                      style={{ background: done ? '#1f8a4c' : spinning ? '#fff0ee' : '#f0f0ea' }}
                    >
                      {spinning && (
                        <span className="w-[15px] h-[15px] border-[2.5px] border-[#ffd2cb] border-t-[#ff4d3d] rounded-full animate-spin" />
                      )}
                      {done && <span className="text-white text-[13px] font-black">✓</span>}
                      {waiting && <span className="text-[12px] font-extrabold text-[#c8c8c1]">{i + 1}</span>}
                    </div>
                    {/* 텍스트 */}
                    <span
                      className="text-[14.5px]"
                      style={{
                        fontWeight: spinning ? 700 : 500,
                        color: done ? '#1f8a4c' : spinning ? '#0f0f0f' : '#b0b0a9',
                      }}
                    >
                      {done ? STEPS_DONE[i] : label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* 완료 */}
          {status === 'done' && result && (
            <div className="mt-6 bg-[#e8f7ee] border border-[#bfe9cf] rounded-[14px] p-5">
              <div className="text-[15.5px] font-extrabold text-[#1f8a4c]">✅ 등록 완료!</div>
              <div className="text-[14px] text-[#3f6b50] mt-1.5">
                영상 ID: <b>{result.videoId}</b> · 스크립트 <b>{result.scriptCount}</b>개 추출됨
              </div>
              <button
                onClick={() => navigate(`/study/${result.videoId}`)}
                className="mt-4 inline-flex items-center gap-2 bg-[#1f8a4c] text-white font-bold text-[14px] px-[18px] py-[11px] rounded-[11px] cursor-pointer border-none"
              >
                영상 보러가기 →
              </button>
            </div>
          )}

          {/* 실패 */}
          {status === 'error' && (
            <div className="mt-6 bg-[#fff0ee] border border-[#ffccc4] rounded-[14px] p-5">
              <div className="text-[15.5px] font-extrabold text-[#ff4d3d]">❌ 오류가 발생했습니다</div>
              <div className="text-[14px] text-[#b23a30] mt-1.5">{errorMsg}</div>
              <button
                onClick={handleRetry}
                className="mt-4 bg-white border border-[#ffccc4] text-[#ff4d3d] font-bold text-[14px] px-[18px] py-[11px] rounded-[11px] cursor-pointer"
              >
                다시 시도
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
