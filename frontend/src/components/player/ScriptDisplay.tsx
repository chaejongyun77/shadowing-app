import type { Sentence } from '../../types'

interface ScriptDisplayProps {
  sentence?: Sentence
  sNo: number
  sTotal: number
}

function RubyText({ jp, reading }: { jp: string; reading?: string }) {
  if (!reading) {
    return (
      <span className="jp font-extrabold tracking-tight leading-[1.3]"
        style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
        {jp}
      </span>
    )
  }
  return (
    <ruby
      className="jp font-extrabold tracking-tight leading-[1.6]"
      style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', rubyAlign: 'center' } as React.CSSProperties}
    >
      {jp}
      <rt className="font-normal text-[#a3a39d]"
        style={{ fontSize: 'clamp(10px, 1.1vw, 14px)', letterSpacing: '0.05em' }}>
        {reading}
      </rt>
    </ruby>
  )
}

export default function ScriptDisplay({ sentence, sNo, sTotal }: ScriptDisplayProps) {
  if (!sentence) return null

  return (
    <div className="mt-4 rounded-2xl border border-[#ececE6] bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] overflow-hidden">

      {/* 본문 */}
      <div className="px-8 py-7 text-center">
        {/* 일본어 원문 + 요미가나 */}
        <div className="flex items-center justify-center">
          <RubyText jp={sentence.jp} reading={sentence.reading} />
        </div>

        {/* 한국어 해석 */}
        {sentence.ko && (
          <p className="m-0 text-[#65676b] leading-snug"
            style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}>
            {sentence.ko}
          </p>
        )}
      </div>

    </div>
  )
}
