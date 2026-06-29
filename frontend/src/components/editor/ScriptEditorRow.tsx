import { useState, useEffect, useRef } from 'react'
import type { Script } from '../../types'

interface ScriptEditorRowProps {
  script: Script
  index: number
  isOpen: boolean
  isDirty: boolean
  currentTime: number
  onToggle: () => void
  onDone: (id: number, startTime: number, endTime: number, japaneseText: string, translation: string) => void
}

// 컴포넌트 외부 순수 함수
const toFixed2 = (n: number) => n.toFixed(2)

// 시작/종료 시간 입력 필드 (중복 제거용 서브 컴포넌트)
function TimeInput({
  label,
  value,
  onChange,
  onSetCurrent,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onSetCurrent: () => void
}) {
  return (
    <div className="flex-1">
      <div className="text-[12px] font-bold text-[#65676b] mb-1.5">{label}</div>
      <div className="flex gap-[7px]">
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 border border-[#ececE6] rounded-[11px] px-3 text-[14.5px] font-mono bg-[#fafaf7] outline-none focus:border-[#ff4d3d] focus:bg-white"
        />
        <button
          onClick={onSetCurrent}
          className="shrink-0 h-11 px-[11px] border border-[#ffccc4] bg-white text-[#ff4d3d] text-[12px] font-bold rounded-[11px] cursor-pointer whitespace-nowrap"
        >
          현재
        </button>
      </div>
    </div>
  )
}

export default function ScriptEditorRow({
  script,
  index,
  isOpen,
  isDirty,
  currentTime,
  onToggle,
  onDone,
}: ScriptEditorRowProps) {
  const [startTime, setStartTime] = useState(toFixed2(script.startTime))
  const [endTime, setEndTime] = useState(toFixed2(script.endTime))
  const [japaneseText, setJapaneseText] = useState(script.japaneseText)
  const [translation, setTranslation] = useState(script.translation)
  const rowRef = useRef<HTMLDivElement>(null)

  // 외부에서 script가 업데이트되면 로컬 상태 동기화
  useEffect(() => {
    setStartTime(toFixed2(script.startTime))
    setEndTime(toFixed2(script.endTime))
    setJapaneseText(script.japaneseText)
    setTranslation(script.translation)
  }, [script])

  // 열릴 때 편집 영역이 보이도록 스크롤
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
    }
  }, [isOpen])

  const borderColor = isOpen ? '#ffd9d1' : isDirty ? '#ffe1da' : '#ececE6'

  return (
    <div
      ref={rowRef}
      className="rounded-[16px] overflow-hidden transition-all duration-150"
      style={{ border: `1px solid ${borderColor}`, background: isOpen ? '#fff6f4' : '#fff' }}
    >
      {/* 헤더 */}
      <div
        onClick={onToggle}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        className="flex items-start gap-[14px] px-[18px] py-4 cursor-pointer select-none"
      >
        <div
          className="w-7 h-7 shrink-0 rounded-[9px] flex items-center justify-center text-[13px] font-bold"
          style={{ background: isOpen ? '#ff4d3d' : '#f0f0ea', color: isOpen ? '#fff' : '#9a9a95' }}
        >
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="jp font-bold text-[17px] leading-[1.9] tracking-tight"
            dangerouslySetInnerHTML={{ __html: script.japaneseText }}
          />
          <div className="text-[13.5px] text-[#65676b] mt-0.5">{translation}</div>
          <div className="inline-flex items-center gap-1.5 mt-[9px] font-mono text-[12px] font-semibold text-[#ff4d3d] bg-[#fff0ee] px-[9px] py-1 rounded-[7px]">
            ⏱ {toFixed2(script.startTime)}s ~ {toFixed2(script.endTime)}s
          </div>
        </div>

        <div
          className="w-[34px] h-[34px] shrink-0 rounded-[10px] flex items-center justify-center"
          style={{
            background: isOpen ? '#fff0ee' : '#f5f5f1',
            border: `1px solid ${isOpen ? '#ffccc4' : '#ececE6'}`,
          }}
        >
          {isOpen ? (
            <span className="text-[13px] font-bold text-[#ff4d3d]">✕</span>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#65676b" strokeWidth="2">
              <path d="M4 20l4-1L19 8l-3-3L5 16z" />
            </svg>
          )}
        </div>
      </div>

      {/* 편집 영역 */}
      {isOpen && (
        <div
          className="px-[18px] pb-[18px] pt-1 border-t border-[#ffe1da]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 일본어 원문 (HTML 직접 편집) */}
          <div className="mb-[14px]">
            <div className="text-[12px] font-bold text-[#65676b] mb-1.5">
              일본어 원문
              <span className="text-[#b0b0a9] font-normal ml-1">
                · ruby 태그 포함 HTML 직접 수정 가능
              </span>
            </div>
            <textarea
              rows={3}
              value={japaneseText}
              onChange={(e) => setJapaneseText(e.target.value)}
              className="w-full border border-[#ececE6] rounded-[11px] px-[14px] py-[11px] text-[13.5px] font-mono leading-relaxed bg-[#fafaf7] outline-none focus:border-[#ff4d3d] focus:bg-white resize-y"
              spellCheck={false}
            />
            {/* 미리보기 */}
            <div className="mt-2 text-[11.5px] text-[#b0b0a9] mb-1">미리보기</div>
            <div
              className="jp text-[15px] font-bold bg-[#f5f5f1] border border-[#ececE6] rounded-[11px] px-[14px] py-3 text-[#3f4042] leading-[1.9]"
              dangerouslySetInnerHTML={{ __html: japaneseText }}
            />
          </div>

          {/* 시작/종료 시간 */}
          <div className="flex gap-[14px] mb-[14px]">
            <TimeInput
              label="시작 시간 (초)"
              value={startTime}
              onChange={setStartTime}
              onSetCurrent={() => setStartTime(toFixed2(currentTime))}
            />
            <TimeInput
              label="종료 시간 (초)"
              value={endTime}
              onChange={setEndTime}
              onSetCurrent={() => setEndTime(toFixed2(currentTime))}
            />
          </div>

          {/* 한국어 번역 */}
          <div className="mb-4">
            <div className="text-[12px] font-bold text-[#65676b] mb-1.5">한국어 번역</div>
            <textarea
              rows={2}
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="w-full border border-[#ececE6] rounded-[11px] px-[14px] py-[11px] text-[14.5px] leading-relaxed bg-[#fafaf7] outline-none focus:border-[#ff4d3d] focus:bg-white resize-y"
            />
          </div>

          {/* 완료 */}
          <div className="flex justify-end">
            <button
              onClick={() => onDone(script.id, parseFloat(startTime), parseFloat(endTime), japaneseText, translation)}
              className="bg-[#ff4d3d] text-white border-none font-bold text-[14px] px-[26px] py-[11px] rounded-[11px] cursor-pointer shadow-[0_8px_18px_-8px_rgba(255,77,61,0.5)]"
            >
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
