import { useParams, useNavigate } from 'react-router-dom'
import { useVideos } from '../hooks/useVideos'
import { useScripts } from '../hooks/useScripts'
import { usePlayer } from '../hooks/usePlayer'
import VideoStage from '../components/player/VideoStage'
import ScriptDisplay from '../components/player/ScriptDisplay'
import TransportBar from '../components/player/TransportBar'
import SentenceList from '../components/player/SentenceList'
import PlayerSidebar from '../components/player/PlayerSidebar'

export default function StudyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoId = Number(id)

  const { data: videos, isLoading: videosLoading } = useVideos()
  const { data: sentences = [], isLoading: scriptsLoading } = useScripts(videoId)

  const total = sentences.length
  const player = usePlayer(sentences)

  if (videosLoading || scriptsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#9a9a95] text-sm">
        불러오는 중...
      </div>
    )
  }

  const video = videos?.find((v) => v.id === videoId)
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

  const upNext = videos.filter((v) => v.id !== video.id).slice(0, 3)

  return (
    <main className="max-w-[1320px] mx-auto px-6 pt-5 pb-20">
      <div className="flex items-center justify-between mb-3.5">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-none border-none text-[#65676b] font-semibold text-[14.5px] cursor-pointer py-2 hover:text-[#0f0f0f]"
        >
          ‹ 홈으로
        </button>
        <button
          onClick={() => navigate(`/study/${videoId}/edit`)}
          className="inline-flex items-center gap-2 border border-[#ececE6] bg-white text-[#65676b] font-semibold text-[13.5px] px-4 py-2 rounded-[11px] cursor-pointer hover:border-[#ff4d3d] hover:text-[#ff4d3d]"
        >
          ✏️ 스크립트 수정
        </button>
      </div>

      <div className="player-cols flex gap-[30px] items-start max-[920px]:flex-col">
        {/* 좌측 */}
        <div className="flex-1 min-w-0">
          <VideoStage
            video={video}
            sNo={player.sNo}
            sTotal={total}
            onReady={player.handleReady}
            onStateChange={player.handleStateChange}
          />

          {/* 대본 영역 (TransportBar 위) */}
          <ScriptDisplay
            sentence={total > 0 ? sentences[player.sIdx] : undefined}
            sNo={player.sNo}
            sTotal={total}
          />

          <TransportBar
            playing={player.playing}
            onTogglePlay={player.togglePlay}
            onPrev={player.prev}
            onNext={player.next}
            speedLabel={player.speedLabel}
            onCycleSpeed={player.cycleSpeed}
            ab={player.ab}
            onToggleAB={player.toggleAB}
            recording={player.recording}
            onToggleRec={player.toggleRec}
            progressPct={player.progressPct}
          />

          {total > 0 ? (
            <SentenceList
              sentences={sentences}
              currentIdx={player.sIdx}
              onPick={player.pick}
            />
          ) : (
            <div className="mt-[22px] flex items-center justify-center h-32 text-[#9a9a95] text-sm border border-[#f0f0ea] rounded-[13px]">
              등록된 스크립트가 없습니다.
            </div>
          )}
        </div>

        {/* 우측 */}
        <PlayerSidebar video={video} sNo={player.sNo} sTotal={total} upNext={upNext} />
      </div>
    </main>
  )
}
