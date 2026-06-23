import { useParams } from 'react-router-dom'

export default function StudyPage() {
  const { id } = useParams()

  return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      학습 페이지 준비 중... (videoId: {id})
    </div>
  )
}
