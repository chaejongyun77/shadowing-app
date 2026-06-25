import type { Sentence } from '../../types'

interface SentenceListProps {
  sentences: Sentence[]
  currentIdx: number
  onPick: (index: number) => void
}

export default function SentenceList({ sentences, currentIdx, onPick }: SentenceListProps) {
  return (
    <div className="mt-[22px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="m-0 text-[17px] font-extrabold">문장별 쉐도잉</h3>
        <span className="text-[13px] text-[#65676b] font-semibold">탭하면 해당 구간부터 반복</span>
      </div>

      <div className="flex flex-col gap-[9px]">
        {sentences.map((s, i) => {
          const active = i === currentIdx
          return (
            <div
              key={i}
              onClick={() => onPick(i)}
              className="flex items-start gap-3.5 px-4 py-3.5 rounded-[13px] cursor-pointer transition-colors border"
              style={{
                borderColor: active ? '#ffd9d1' : '#f0f0ea',
                background: active ? '#fff6f4' : '#fff',
              }}
            >
              <div
                className="w-[26px] h-[26px] shrink-0 rounded-lg flex items-center justify-center text-[12.5px] font-bold"
                style={{
                  background: active ? '#ff4d3d' : '#f0f0ea',
                  color: active ? '#fff' : '#9a9a95',
                }}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="jp font-bold text-base tracking-tight leading-[1.8]"
                  dangerouslySetInnerHTML={{ __html: s.jp }}
                />
                {s.ko && <div className="text-[13.5px] text-[#65676b] mt-[3px]">{s.ko}</div>}
              </div>
              {s.time && (
                <div className="text-xs text-[#b7b7b1] font-semibold shrink-0">{s.time}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
