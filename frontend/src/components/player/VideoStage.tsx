import YouTube, { type YouTubeProps, type YouTubeEvent } from 'react-youtube'
import type { Video } from '../../types'

interface VideoStageProps {
  video: Video
  sNo: number
  sTotal: number
  onReady: (e: YouTubeEvent) => void
  onStateChange: (e: YouTubeEvent) => void
}

const opts: YouTubeProps['opts'] = {
  width: '100%',
  height: '100%',
  playerVars: {
    autoplay: 0,
    rel: 0,
    modestbranding: 1,
    controls: 0,
  },
}

export default function VideoStage({ video, sNo, sTotal, onReady, onStateChange }: VideoStageProps) {
  return (
    <div className="relative rounded-[18px] overflow-hidden bg-[#0c0c0e] aspect-video shadow-[0_24px_50px_-22px_rgba(0,0,0,0.5)]">
      <YouTube
        videoId={video.youtubeVideoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        className="absolute inset-0 w-full h-full"
        iframeClassName="w-full h-full"
      />

      {/* 좌상단 구간 배지 */}
      {sTotal > 0 && (
        <div className="absolute left-4 top-3.5 z-10 pointer-events-none">
          <span className="bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            구간 {sNo} / {sTotal}
          </span>
        </div>
      )}
    </div>
  )
}
