import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Video } from '../../types'

interface VideoCardProps {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/study/${video.id}`)}
      className="cursor-pointer"
    >
      {/* 썸네일 */}
      <div
        className="relative rounded-[14px] overflow-hidden transition-all duration-200"
        style={{
          transform: hovered ? 'scale(1.035)' : 'scale(1)',
          boxShadow: hovered
            ? '0 18px 36px -14px rgba(0,0,0,.34)'
            : '0 1px 3px rgba(0,0,0,.06)',
        }}
      >
        <div className="aspect-video bg-[#f0f0ea] overflow-hidden">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#b7b7b1] text-sm">
              No Image
            </div>
          )}
        </div>

        {/* 재생시간 (옵셔널) */}
        {video.duration && (
          <div className="absolute right-2 bottom-2 bg-black/[0.78] text-white text-[11.5px] font-semibold px-1.5 py-0.5 rounded-md">
            {video.duration}
          </div>
        )}

        {/* hover 재생 버튼 */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/[0.18] transition-opacity duration-200"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div className="w-[54px] h-[54px] rounded-full bg-white/95 flex items-center justify-center">
            <div className="w-0 h-0 border-y-[9px] border-y-transparent border-l-[15px] border-l-[#ff4d3d] ml-1" />
          </div>
        </div>
      </div>

      {/* 정보 */}
      <div className="mt-[11px]">
        <h3 className="jp font-bold text-[14.5px] leading-snug tracking-tight line-clamp-2">
          {video.title}
        </h3>
        <div className="text-[12.5px] text-[#65676b] mt-1">
          {video.views && <span>조회 {video.views} · </span>}
          {new Date(video.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </div>
  )
}
