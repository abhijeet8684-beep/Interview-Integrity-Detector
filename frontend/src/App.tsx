import { Navigate, Route, Routes } from 'react-router-dom'
import ConsentPage from './pages/ConsentPage'
import InterviewPage from './pages/InterviewPage'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
