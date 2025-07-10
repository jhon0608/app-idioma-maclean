import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'

import LanguageSelection from './pages/LanguageSelection'
import LearnPage from './pages/LearnPage'
import LessonPage from './pages/LessonPage'
import PronunciationPractice from './pages/PronunciationPractice'
import AITutorPage from './pages/AITutorPage'
import QuickTutor from './pages/QuickTutor'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/languages"
            element={
              <ProtectedRoute>
                <LanguageSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:languageCode"
            element={
              <ProtectedRoute>
                <LearnPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice/:languageCode"
            element={
              <ProtectedRoute>
                <PronunciationPractice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tutor/:languageCode"
            element={
              <ProtectedRoute>
                <AITutorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quick-tutor"
            element={
              <ProtectedRoute>
                <QuickTutor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
