import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Play, CheckCircle, Lock, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { API_BASE_URL } from '../config/api'


const LearnPage = () => {
  const { languageCode } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [language, setLanguage] = useState(null)
  const [lessons, setLessons] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState('beginner')

  useEffect(() => {
    fetchLanguageData()
    fetchLessons()
    if (user) {
      fetchUserProgress()
    }
  }, [languageCode, selectedLevel, user])

  const fetchLanguageData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/languages`)
      const languages = await response.json()
      const currentLanguage = languages.find(l => l.code === languageCode)
      setLanguage(currentLanguage)
    } catch (error) {
      console.error('Error fetching language:', error)
    }
  }

  const fetchLessons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/languages/${languageCode}/lessons?level=${selectedLevel}`)
      const data = await response.json()
      setLessons(data)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/progress?languageCode=${languageCode}`)
      const data = await response.json()
      setUserProgress(data[0] || null)
    } catch (error) {
      console.error('Error fetching user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const isLessonCompleted = (unit, lessonNumber) => {
    if (!userProgress) return false
    return userProgress.completedLessons.some(
      l => l.unit === unit && l.lesson === lessonNumber
    )
  }

  const isLessonUnlocked = (unit, lessonNumber) => {
    if (unit === 1 && lessonNumber === 1) return true // Primera lección siempre desbloqueada
    
    if (!userProgress) return false
    
    // Verificar si la lección anterior está completada
    if (lessonNumber > 1) {
      return isLessonCompleted(unit, lessonNumber - 1)
    } else {
      // Primera lección de una unidad, verificar última lección de unidad anterior
      const previousUnit = unit - 1
      if (previousUnit < 1) return true
      
      const previousUnitLessons = lessons.filter(l => l.unit === previousUnit)
      if (previousUnitLessons.length === 0) return true
      
      const lastLessonOfPreviousUnit = Math.max(...previousUnitLessons.map(l => l.lessonNumber))
      return isLessonCompleted(previousUnit, lastLessonOfPreviousUnit)
    }
  }

  const getLessonScore = (unit, lessonNumber) => {
    if (!userProgress) return 0
    const completedLesson = userProgress.completedLessons.find(
      l => l.unit === unit && l.lesson === lessonNumber
    )
    return completedLesson ? completedLesson.score : 0
  }

  const startLesson = (lessonId) => {
    navigate(`/lesson/${lessonId}`)
  }

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.unit]) {
      acc[lesson.unit] = []
    }
    acc[lesson.unit].push(lesson)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando lecciones...</p>
        </div>
      </div>
    )
  }

  if (!language) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Idioma no encontrado</h2>
          <button
            onClick={() => navigate('/languages')}
            className="text-blue-600 hover:text-blue-800"
          >
            Volver a idiomas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/languages')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{language.flag}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{language.name}</h1>
                  <p className="text-gray-600">Aprende {language.nativeName}</p>
                </div>
              </div>
            </div>
            
            {/* Level Selector */}
            <div className="flex space-x-2">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level === 'beginner' ? 'Principiante' : 
                   level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {userProgress && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userProgress.completedLessons.length}</div>
                <div className="text-sm text-gray-600">Lecciones Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userProgress.totalScore}</div>
                <div className="text-sm text-gray-600">Puntos Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{userProgress.streak}</div>
                <div className="text-sm text-gray-600">Racha (días)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userProgress.currentUnit}.{userProgress.currentLesson}
                </div>
                <div className="text-sm text-gray-600">Lección Actual</div>
              </div>
            </div>

            {/* Botones de práctica */}
            <div className="mt-6 text-center space-x-4">
              <button
                onClick={() => navigate(`/ai-tutor/${language.code}`)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              >
                <span>🤖</span>
                <span>Tutor de IA</span>
              </button>
              <button
                onClick={() => navigate(`/practice/${language.code}`)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <span>🎤</span>
                <span>Practicar Pronunciación</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lessons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {Object.keys(groupedLessons).map((unit) => (
          <div key={unit} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Unidad {unit}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedLessons[unit].map((lesson) => {
                const isCompleted = isLessonCompleted(lesson.unit, lesson.lessonNumber)
                const isUnlocked = isLessonUnlocked(lesson.unit, lesson.lessonNumber)
                const score = getLessonScore(lesson.unit, lesson.lessonNumber)

                return (
                  <div
                    key={lesson._id}
                    className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
                      isUnlocked ? 'hover:shadow-lg cursor-pointer' : 'opacity-50'
                    }`}
                    onClick={() => isUnlocked && startLesson(lesson._id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">
                          {lesson.unit}.{lesson.lessonNumber}
                        </span>
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {!isUnlocked && <Lock className="h-4 w-4 text-gray-400" />}
                      </div>
                      {isCompleted && score > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-yellow-600">{score}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {lesson.exercises.length} ejercicios
                        </span>
                      </div>
                      {isUnlocked && (
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium">
                          <Play className="h-4 w-4" />
                          <span className="text-sm">
                            {isCompleted ? 'Repasar' : 'Comenzar'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay lecciones disponibles para este nivel
            </h3>
            <p className="text-gray-600">
              Prueba seleccionando un nivel diferente o vuelve más tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LearnPage
