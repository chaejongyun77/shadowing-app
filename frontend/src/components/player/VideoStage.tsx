import YouTube, { type YouTubeProps, type YouTubeEvent } from 'react-youtube'
import type { Video, Sentence } from '../../types'

interface VideoStageProps {
  video: Video
  sentence?: Sentence
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
    controls: 0, // 유튜브 기본 컨트롤 숨김 (우리 TransportBar로 제어)
  },
}

export default function VideoStage({
  video,
  sentence,
  sNo,
  sTotal,
  onReady,
  onStateChange,
}: VideoStageProps) {
  return (
    <div className="relative rounded-[18px] overflow-hidden bg-[#0c0c0e] aspect-video shadow-[0_24px_50px_-22px_rgba(0,0,0,0.5)]">
      {/* YouTube 플레이어 */}
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

      {/* 자막 오버레이 (현재 구간) */}
      {sentence && (
        <div className="absolute left-0 right-0 bottom-0 z-10 pointer-events-none pt-[46px] px-[30px] pb-[26px] bg-gradient-to-t from-black/[0.78] to-transparent text-center">
          {sentence.reading && (
            <div className="jp text-[13px] text-white/70 mb-1.5">{sentence.reading}</div>
          )}
          <div className="jp font-extrabold text-white leading-[1.25] tracking-tight text-[clamp(22px,3vw,34px)]">
            {sentence.jp}
          </div>
          {sentence.ko && (
            <div className="text-[15px] text-white/[0.82] mt-2">{sentence.ko}</div>
          )}
        </div>
      )}
    </div>
  )
}
