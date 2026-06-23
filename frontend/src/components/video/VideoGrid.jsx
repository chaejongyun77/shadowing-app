import VideoCard from './VideoCard'

export default function VideoGrid({ videos }) {
  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        등록된 영상이 없습니다.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
