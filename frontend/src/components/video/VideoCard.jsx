import { useNavigate } from 'react-router-dom'

export default function VideoCard({ video }) {
  const navigate = useNavigate()

  return (
    <div
      className="cursor-pointer rounded-xl overflow-hidden bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] hover:border-[#444] hover:scale-[1.02] transition-all duration-200 group"
      onClick={() => navigate(`/study/${video.id}`)}
    >
      {/* 썸네일 */}
      <div className="aspect-video bg-[#111] overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-3">
        <h3 className="font-medium text-gray-100 text-sm line-clamp-2 leading-snug">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1.5">
          {new Date(video.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>
    </div>
  )
}
