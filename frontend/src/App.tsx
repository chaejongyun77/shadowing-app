import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import StudyPage from './pages/StudyPage'
import AdminPage from './pages/AdminPage'
import ScriptEditorPage from './pages/ScriptEditorPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/study/:id/edit" element={<ScriptEditorPage />} />
          <Route path="/*" element={
            <div className="min-h-screen bg-white">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/study/:id" element={<StudyPage />} />
              </Routes>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
