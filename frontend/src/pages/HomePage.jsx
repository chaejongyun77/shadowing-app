import { useVideos } from '../hooks/useVideos'
import VideoGrid from '../components/video/VideoGrid'

export default function HomePage() {
  const { data: videos, isLoading, isError, error } = useVideos()

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* 헤더 */}
      <header className="border-b border-[#2a2a2a] px-8 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-2">
          <span className="text-xl">🗣️</span>
          <span className="text-white font-bold text-lg tracking-tight">shadowing</span>
          <span className="text-gray-500 text-sm ml-1">일본어 쉐도잉 학습</span>
        </div>
      </header>

      {/* 메인 */}
      <main className="max-w-screen-xl mx-auto px-8 py-8">
        {/* 섹션 타이틀 */}
        <h2 className="text-white font-semibold text-base mb-4">
          학습 영상
        </h2>

        {/* 상태별 렌더링 */}
        {isLoading && (
          <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
            불러오는 중...
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-64 text-red-400 text-sm">
            {error.message || '영상을 불러오지 못했습니다.'}
          </div>
        )}

        {videos && <VideoGrid videos={videos} />}
      </main>
    </div>
  )
}
