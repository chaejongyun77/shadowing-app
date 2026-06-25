import type { Sentence } from '../../types'

interface ScriptDisplayProps {
  sentence?: Sentence
  sNo: number
  sTotal: number
}

export default function ScriptDisplay({ sentence, sNo, sTotal }: ScriptDisplayProps) {
  if (!sentence) return null

  return (
    <div className="mt-4 rounded-2xl border border-[#ececE6] bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] overflow-hidden">

      {/* 본문 */}
      <div className="px-8 py-7 text-center">
        {/* 일본어 원문 — ruby HTML을 그대로 렌더링 */}
        <div
          className="jp font-extrabold tracking-tight leading-[1.8]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}
          dangerouslySetInnerHTML={{ __html: sentence.jp }}
        />


        {/* 한국어 해석 */}
        {sentence.ko && (
          <p
            className="m-0 text-[#65676b] leading-snug"
            style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}
          >
            {sentence.ko}
          </p>
        )}
      </div>


    </div>
  )
}
