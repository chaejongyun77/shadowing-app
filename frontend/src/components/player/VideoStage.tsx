import type { Video, Sentence } from '../../types'

interface VideoStageProps {
  video: Video
  sentence: Sentence
  playing: boolean
  onTogglePlay: () => void
  sNo: number
  sTotal: number
}

export default function VideoStage({ video, sentence, playing, onTogglePlay, sNo, sTotal }: VideoStageProps) {
  return (
    <div className="relative rounded-[18px] overflow-hidden bg-[#0c0c0e] aspect-video shadow-[0_24px_50px_-22px_rgba(0,0,0,0.5)]">
      {/* 배경 썸네일 */}
      {video?.thumbnailUrl && (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(.9) brightness(.62)' }}
        />
      )}

      {/* 좌상단 배지 */}
      <div className="absolute left-4 top-3.5 flex gap-2">
        <span className="bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
          구간 {sNo} / {sTotal}
        </span>
      </div>

      {/* 중앙 재생 버튼 */}
      <div
        onClick={onTogglePlay}
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
      >
        <div className="w-[84px] h-[84px] rounded-full bg-white/[0.16] backdrop-blur-md border-[1.5px] border-white/50 flex items-center justify-center">
          {playing ? (
            <div className="flex gap-[7px]">
              <span className="w-[7px] h-[30px] bg-white rounded-sm" />
              <span className="w-[7px] h-[30px] bg-white rounded-sm" />
            </div>
          ) : (
            <div className="w-0 h-0 border-y-[16px] border-y-transparent border-l-[26px] border-l-white ml-1.5" />
          )}
        </div>
      </div>

      {/* 자막 오버레이 */}
      <div className="absolute left-0 right-0 bottom-0 pt-[46px] px-[30px] pb-[26px] bg-gradient-to-t from-black/[0.78] to-transparent text-center">
        {sentence?.reading && (
          <div className="jp text-[13px] text-white/70 mb-1.5">{sentence.reading}</div>
        )}
        <div className="jp font-extrabold text-white leading-[1.25] tracking-tight text-[clamp(22px,3vw,34px)]">
          {sentence?.jp}
        </div>
        {sentence?.ko && (
          <div className="text-[15px] text-white/[0.82] mt-2">{sentence.ko}</div>
        )}
      </div>
    </div>
  )
}
