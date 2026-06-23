import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/HomePage'
import StudyPage from './pages/StudyPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study/:id" element={<StudyPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
