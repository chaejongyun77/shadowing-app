import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useVideos } from '../hooks/useVideos'
import VideoStage from '../components/player/VideoStage'
import TransportBar from '../components/player/TransportBar'
import SentenceList from '../components/player/SentenceList'
import PlayerSidebar from '../components/player/PlayerSidebar'
import type { Sentence } from '../types'

// TODO: 스크립트 API 연동 전까지 사용하는 더미 문장
const DUMMY_SENTENCES: Sentence[] = [
  { jp: 'おはよう。今日はいい天気だね。', reading: 'おはよう。きょうはいいてんきだね。', ko: '좋은 아침. 오늘 날씨 좋네.', time: '00:04' },
  { jp: 'ねえ、ちょっと聞いてもいい？', reading: 'ねえ、ちょっときいてもいい？', ko: '저기, 잠깐 물어봐도 돼?', time: '00:12' },
  { jp: 'もちろん。なんでも聞いて。', reading: 'もちろん。なんでもきいて。', ko: '물론이지. 뭐든 물어봐.', time: '00:19' },
  { jp: 'この近くにおいしいカフェ、知らない？', reading: 'このちかくにおいしいカフェ、しらない？', ko: '이 근처에 맛있는 카페 알아?', time: '00:27' },
  { jp: 'あるよ。駅の前のお店がおすすめ。', reading: 'あるよ。えきのまえのおみせがおすすめ。', ko: '있어. 역 앞 가게 추천해.', time: '00:35' },
  { jp: 'じゃあ、一緒に行こうか。', reading: 'じゃあ、いっしょにいこうか。', ko: '그럼 같이 갈까?', time: '00:43' },
]

const SPEED_OPTIONS = [1, 0.75, 0.5]

export default function StudyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: videos, isLoading } = useVideos()

  const [sIdx, setSIdx] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [recording, setRecording] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [ab, setAb] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#9a9a95] text-sm">
        불러오는 중...
      </div>
    )
  }

  const video = videos?.find((v) => v.id === Number(id))
  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-[#65676b]">영상을 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="text-[#ff4d3d] font-semibold cursor-pointer"
        >
          홈으로 돌아가기
        </button>
      </div>
    )
  }

  const sentences = DUMMY_SENTENCES
  const total = sentences.length
  const upNext = videos.filter((v) => v.id !== video.id).slice(0, 3)

  const cycleSpeed = () => {
    const next = SPEED_OPTIONS[(SPEED_OPTIONS.indexOf(speed) + 1) % SPEED_OPTIONS.length]
    setSpeed(next)
  }
  const prevS = () => setSIdx((i) => Math.max(0, i - 1))
  const nextS = () => setSIdx((i) => Math.min(total - 1, i + 1))

  const speedLabel = speed.toFixed(2).replace(/0$/, '') + '×'
  const progressPct = Math.round(((sIdx + 1) / total) * 100) + '%'

  return (
    <main className="max-w-[1320px] mx-auto px-6 pt-5 pb-20">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 bg-none border-none text-[#65676b] font-semibold text-[14.5px] cursor-pointer py-2 mb-3.5 hover:text-[#0f0f0f]"
      >
        ‹ 홈으로
      </button>

      <div className="player-cols flex gap-[30px] items-start max-[920px]:flex-col">
        {/* 좌측 */}
        <div className="flex-1 min-w-0">
          <VideoStage
            video={video}
            sentence={sentences[sIdx]}
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
            sNo={sIdx + 1}
            sTotal={total}
          />
          <TransportBar
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
            onPrev={prevS}
            onNext={nextS}
            speedLabel={speedLabel}
            onCycleSpeed={cycleSpeed}
            ab={ab}
            onToggleAB={() => setAb((v) => !v)}
            recording={recording}
            onToggleRec={() => setRecording((v) => !v)}
            progressPct={progressPct}
          />
          <SentenceList
            sentences={sentences}
            currentIdx={sIdx}
            onPick={(i) => {
              setSIdx(i)
              setPlaying(true)
            }}
          />
        </div>

        {/* 우측 */}
        <PlayerSidebar video={video} sNo={sIdx + 1} sTotal={total} upNext={upNext} />
      </div>
    </main>
  )
}
