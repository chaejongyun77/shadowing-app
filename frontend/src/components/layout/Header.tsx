import { useNavigate } from 'react-router-dom'

const CHIPS = ['전체', '애니메이션', '드라마', 'JLPT', '회화', '발음', '비즈니스', '여행']

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white/[0.86] backdrop-blur-md backdrop-saturate-150 border-b border-[#efefea]">
      <div className="max-w-[1320px] mx-auto px-6 py-3.5 flex items-center gap-6">
        {/* 로고 */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-[30px] h-[30px] rounded-[9px] bg-[#ff4d3d] flex items-center justify-center shadow-[0_4px_12px_rgba(255,77,61,0.35)]">
            <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-0.5" />
          </div>
          <span className="font-black text-[21px] tracking-tight">Shadowing</span>
        </div>

        {/* 검색바 */}
        <div className="flex-1 max-w-[520px] mx-auto flex items-center gap-2 bg-[#f5f5f1] border border-[#ececE6] rounded-full px-4 py-2.5">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8a8a85" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            placeholder="일본어 영상, JLPT, 회화 검색"
            className="border-none bg-transparent outline-none text-[14.5px] w-full text-[#0f0f0f]"
          />
        </div>

        {/* 우측 */}
        <div className="shrink-0 flex items-center gap-3.5">
          <span className="text-[13px] text-[#65676b] font-medium">🔥 7일 연속</span>
          <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#ffb199] to-[#ff4d3d] border-2 border-white shadow-[0_0_0_1px_#efefea] cursor-pointer"
            onClick={() => navigate('/admin')}
            title="관리자 페이지"
          />
        </div>
      </div>

      {/* 카테고리 칩 */}
      <div className="no-bar max-w-[1320px] mx-auto px-6 pb-3 flex gap-2.5 overflow-x-auto">
        {CHIPS.map((chip, i) => (
          <button
            key={chip}
            className={`shrink-0 text-[13.5px] px-[15px] py-2 rounded-full whitespace-nowrap border transition-colors ${
              i === 0
                ? 'font-bold bg-[#0f0f0f] text-white border-[#0f0f0f]'
                : 'font-medium bg-[#f5f5f1] text-[#3f4042] border-[#ececE6] hover:bg-[#ececE6]'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </header>
  )
}
