import { useNavigate } from 'react-router-dom'
import type { Video } from '../../types'

interface HeroSectionProps {
  video: Video
}

export default function HeroSection({ video }: HeroSectionProps) {
  const navigate = useNavigate()
  const goStudy = () => navigate(`/study/${video.id}`)

  return (
    <section className="hero-wrap flex gap-[34px] items-stretch mb-[54px] max-[920px]:flex-col">
      {/* 좌측 텍스트 */}
      <div className="flex-1 flex flex-col justify-center py-2">
        <div className="inline-flex items-center gap-[7px] self-start bg-[#fff0ee] text-[#ff4d3d] font-bold text-[12.5px] px-3 py-1.5 rounded-full mb-[18px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d3d]" />
          지금 가장 인기 있는 쉐도잉
        </div>

        <h1 className="jp m-0 font-black leading-[1.08] tracking-tight text-[clamp(30px,4.2vw,50px)]">
          {video.title}
        </h1>

        {/* 메타 (옵셔널 필드) */}
        <div className="flex gap-[18px] mt-[22px] mb-[26px] text-[13.5px] text-[#65676b] font-semibold">
          {video.duration && <span>{video.duration}</span>}
          {video.sentences && <span>· {video.sentences}문장</span>}
          {video.views && <span>· 조회 {video.views}</span>}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={goStudy}
            className="inline-flex items-center gap-2.5 bg-[#ff4d3d] text-white border-none font-bold text-base px-7 py-[15px] rounded-[14px] cursor-pointer shadow-[0_10px_24px_rgba(255,77,61,0.32)] hover:brightness-105 transition"
          >
            <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-white" />
            지금 쉐도잉 시작
          </button>
          <button className="inline-flex items-center gap-2.5 bg-white text-[#0f0f0f] border-[1.5px] border-[#e6e6e0] font-semibold text-base px-6 py-[15px] rounded-[14px] cursor-pointer hover:bg-[#faf9f6] transition">
            ＋ 저장
          </button>
        </div>
      </div>

      {/* 우측 썸네일 */}
      <div
        onClick={goStudy}
        className="hero-art w-[54%] shrink-0 cursor-pointer relative rounded-[22px] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.28)] max-[920px]:w-full"
      >
        <div className="aspect-video bg-[#f0f0ea]">
          {video.thumbnailUrl && (
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/35 to-transparent to-55%" />
        {video.duration && (
          <div className="absolute right-[18px] top-[18px] bg-black/55 text-white text-[12.5px] font-semibold px-2.5 py-[5px] rounded-lg">
            {video.duration}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[76px] h-[76px] rounded-full bg-white/[0.92] flex items-center justify-center shadow-[0_14px_30px_rgba(0,0,0,0.3)]">
            <div className="w-0 h-0 border-y-[13px] border-y-transparent border-l-[21px] border-l-[#ff4d3d] ml-[5px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
