import { useNavigate } from 'react-router-dom'
import type { Video } from '../../types'

interface PlayerSidebarProps {
  video: Video
  sNo: number
  sTotal: number
  upNext: Video[]
}

export default function PlayerSidebar({ video, sNo, sTotal, upNext }: PlayerSidebarProps) {
  const navigate = useNavigate()

  return (
    <aside className="player-side w-[340px] shrink-0 flex flex-col gap-[18px] max-[920px]:w-full">
      {/* 영상 정보 카드 */}
      <div className="bg-white border border-[#ececE6] rounded-2xl p-[18px]">
        <div className="jp font-extrabold text-lg leading-snug">{video?.title}</div>
        <div className="flex gap-3 mt-3.5">
          <div className="flex-1 text-center bg-[#faf9f6] rounded-xl px-2 py-3">
            <div className="text-[22px] font-black text-[#ff4d3d]">
              {sNo}/{sTotal}
            </div>
            <div className="text-[11.5px] text-[#65676b] mt-0.5">구간 진행</div>
          </div>
          <div className="flex-1 text-center bg-[#faf9f6] rounded-xl px-2 py-3">
            <div className="text-[22px] font-black">{sTotal}</div>
            <div className="text-[11.5px] text-[#65676b] mt-0.5">전체 문장</div>
          </div>
        </div>
      </div>

      {/* 쉐도잉 팁 */}
      <div className="bg-gradient-to-br from-[#fff4f2] to-white border border-[#ffe1da] rounded-2xl p-[18px]">
        <div className="font-extrabold text-sm text-[#ff4d3d] mb-2">🎙 쉐도잉 팁</div>
        <p className="m-0 text-[13.5px] text-[#5a5b5d] leading-relaxed">
          자막을 보지 말고 소리에 0.5초 늦게 따라 말해보세요. 발음·억양이 자연스러워집니다.
        </p>
      </div>

      {/* 다음 영상 */}
      {upNext.length > 0 && (
        <div>
          <h3 className="m-0 mb-3 text-[15px] font-extrabold">다음 영상</h3>
          <div className="flex flex-col gap-3">
            {upNext.map((v) => (
              <div
                key={v.id}
                onClick={() => navigate(`/study/${v.id}`)}
                className="flex gap-[11px] cursor-pointer"
              >
                <div className="relative w-[130px] shrink-0 aspect-video rounded-[10px] overflow-hidden bg-[#f0f0ea]">
                  {v.thumbnailUrl && (
                    <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="jp font-bold text-[13.5px] leading-[1.32] line-clamp-2">
                    {v.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
