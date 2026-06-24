import { useVideos } from '../hooks/useVideos'
import HeroSection from '../components/video/HeroSection'
import VideoGrid from '../components/video/VideoGrid'

export default function HomePage() {
  const { data: videos, isLoading, isError, error } = useVideos()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#9a9a95] text-sm">
        불러오는 중...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#ff4d3d] text-sm">
        {error.message || '영상을 불러오지 못했습니다.'}
      </div>
    )
  }

  const hero = videos[0]

  return (
    <main className="max-w-[1320px] mx-auto px-6 pt-7 pb-20">
      {/* Hero */}
      {hero && <HeroSection video={hero} />}

      {/* 그리드 섹션 */}
      <section>
        <div className="flex items-end justify-between mb-[18px]">
          <div>
            <div className="text-[11.5px] font-bold tracking-[0.12em] text-[#ff4d3d] uppercase mb-[5px]">
              그리드 · Grid
            </div>
            <h2 className="m-0 text-[23px] font-extrabold tracking-tight">학습 영상</h2>
          </div>
          <button className="bg-none border-none text-[#65676b] font-semibold text-sm cursor-pointer">
            모두 보기 ›
          </button>
        </div>
        <VideoGrid videos={videos} />
      </section>
    </main>
  )
}
