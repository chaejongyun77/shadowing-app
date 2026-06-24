import VideoCard from './VideoCard'
import type { Video } from '../../types'

interface VideoGridProps {
  videos: Video[]
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[#9a9a95]">
        등록된 영상이 없습니다.
      </div>
    )
  }

  return (
    <div
      className="grid gap-x-[22px] gap-y-[26px]"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
