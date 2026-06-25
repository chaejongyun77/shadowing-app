interface TransportBarProps {
  playing: boolean
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
  ab: boolean
  onToggleAB: () => void
  progressPct: string
}

export default function TransportBar({
  playing,
  onTogglePlay,
  onPrev,
  onNext,
  ab,
  onToggleAB,
  progressPct,
}: TransportBarProps) {
  return (
    <div className="mt-4 bg-white border border-[#ececE6] rounded-2xl px-[18px] py-3.5 shadow-[0_6px_18px_-10px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* 이전 */}
        <button
          onClick={onPrev}
          className="w-11 h-11 rounded-[11px] border border-[#ececE6] bg-white cursor-pointer flex items-center justify-center hover:bg-[#faf9f6]"
        >
          <div className="flex items-center">
            <span className="w-[3px] h-4 bg-[#0f0f0f] rounded-sm mr-px" />
            <div className="w-0 h-0 border-y-[8px] border-y-transparent border-r-[11px] border-r-[#0f0f0f]" />
          </div>
        </button>

        {/* 재생/일시정지 */}
        <button
          onClick={onTogglePlay}
          className="w-[58px] h-[58px] rounded-[14px] border-none bg-[#ff4d3d] cursor-pointer flex items-center justify-center shadow-[0_8px_18px_rgba(255,77,61,0.32)]"
        >
          {playing ? (
            <div className="flex gap-[5px]">
              <span className="w-[5px] h-5 bg-white rounded-sm" />
              <span className="w-[5px] h-5 bg-white rounded-sm" />
            </div>
          ) : (
            <div className="w-0 h-0 border-y-[11px] border-y-transparent border-l-[18px] border-l-white ml-1" />
          )}
        </button>

        {/* 다음 */}
        <button
          onClick={onNext}
          className="w-11 h-11 rounded-[11px] border border-[#ececE6] bg-white cursor-pointer flex items-center justify-center hover:bg-[#faf9f6]"
        >
          <div className="flex items-center">
            <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[11px] border-l-[#0f0f0f]" />
            <span className="w-[3px] h-4 bg-[#0f0f0f] rounded-sm ml-px" />
          </div>
        </button>

        <div className="w-px h-[30px] bg-[#ededE7] mx-1" />

        {/* A-B 반복 */}
        <button
          onClick={onToggleAB}
          className="h-11 px-4 rounded-[11px] cursor-pointer font-bold text-sm border transition-colors"
          style={{
            borderColor: ab ? '#ff4d3d' : '#ececE6',
            background: ab ? '#fff0ee' : '#fff',
            color: ab ? '#ff4d3d' : '#0f0f0f',
          }}
        >
          A-B 반복
        </button>

      </div>

      {/* 진행바 */}
      <div className="mt-3.5 h-1.5 rounded-full bg-[#efefea] overflow-hidden">
        <div
          className="h-full bg-[#ff4d3d] rounded-full transition-[width] duration-300"
          style={{ width: progressPct }}
        />
      </div>
    </div>
  )
}
