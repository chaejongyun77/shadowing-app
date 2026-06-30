import type { WordNote, GrammarNote } from '../../types'

interface WordGrammarPanelProps {
  wordNotes?: WordNote[]
  grammarNotes?: GrammarNote[]
  sNo: number
}

export default function WordGrammarPanel({ wordNotes, grammarNotes, sNo }: WordGrammarPanelProps) {
  const hasWords = wordNotes && wordNotes.length > 0
  const hasGrammar = grammarNotes && grammarNotes.length > 0

  if (!hasWords && !hasGrammar) return null

  return (
    <div className="mt-4 bg-white border border-[#ececE6] rounded-2xl px-6 py-5 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="font-extrabold text-[15.5px] tracking-tight">이 구간 단어·문법</span>
        </div>
        <span className="text-[12px] font-semibold text-[#b0b0a9]">구간 {sNo}</span>
      </div>

      {/* 단어 */}
      {hasWords && (
        <div className="mb-2">
          <div className="text-[12px] font-bold text-[#9a9a95] mb-2">단어</div>
          <div className="flex flex-col gap-2">
            {wordNotes!.map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 bg-[#faf9f6] rounded-[12px] px-4 py-3"
              >
                <div>
                  <div className="jp font-extrabold text-[17px] tracking-tight">{w.word}</div>
                  <div className="text-[12px] text-[#b0b0a9] mt-0.5">{w.reading}</div>
                </div>
                <div className="text-[14.5px] text-[#3f4042] text-right shrink-0">{w.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 문법 포인트 */}
      {hasGrammar && (
        <div className={hasWords ? 'mt-5' : ''}>
          <div className="text-[12px] font-bold text-[#9a9a95] mb-2">문법 포인트</div>
          <div className="flex flex-col gap-2">
            {grammarNotes!.map((g, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#fff6f4] border border-[#ffe1da] rounded-[12px] px-4 py-3"
              >
                <span className="jp shrink-0 font-extrabold text-[13.5px] text-[#ff4d3d] bg-white border border-[#ffccc4] rounded-[8px] px-2.5 py-1">
                  {g.pattern}
                </span>
                <span className="text-[13.5px] text-[#5a5a55] leading-relaxed pt-0.5">
                  {g.explanation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
