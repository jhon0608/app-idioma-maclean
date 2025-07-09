import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, BookOpen, Star, Users, Clock, ArrowRight, Trophy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LanguagesPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [languages, setLanguages] = useState([])
  const [userProgress, setUserProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLanguages()
    if (user) {
      fetchUserProgress()
    }
  }, [user])

  const fetchLanguages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/languages')
      const data = await response.json()
      setLanguages(data)
    } catch (error) {
      console.error('Error fetching languages:', error)
    }
  }

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/progress`)
      const data = await response.json()
      
      // Convertir array a objeto para fácil acceso
      const progressMap = {}
      data.forEach(progress => {
        progressMap[progress.languageCode] = progress
      })
      setUserProgress(progressMap)
    } catch (error) {
      console.error('Error fetching user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = (languageCode) => {
    const progress = userProgress[languageCode]
    if (!progress) return 0
    
    const language = languages.find(l => l.code === languageCode)
    if (!language) return 0
    
    return Math.round((progress.completedLessons.length / language.totalLessons) * 100)
  }

  const startLearning = (languageCode) => {
    navigate(`/learn/${languageCode}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando idiomas...</p>
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
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Idiomas Disponibles</h1>
                <p className="text-gray-600">Elige un idioma para comenzar tu aventura de aprendizaje</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Languages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language) => {
            const progress = userProgress[language.code]
            const progressPercentage = getProgressPercentage(language.code)
            const isStarted = progress && progress.completedLessons.length > 0

            return (
              <div
                key={language.code}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => startLearning(language.code)}
              >
                {/* Card Header */}
                <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{language.flag}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(language.difficulty)}`}>
                      {language.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{language.name}</h3>
                  <p className="text-blue-100 text-sm">{language.nativeName}</p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Progress Bar */}
                  {isStarted && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso</span>
                        <span className="text-sm text-gray-500">{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <BookOpen className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm font-medium text-gray-700">Lecciones</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{language.totalLessons}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Trophy className="h-4 w-4 text-yellow-600 mr-1" />
                        <span className="text-sm font-medium text-gray-700">Completadas</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {progress ? progress.completedLessons.length : 0}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center group-hover:scale-105">
                    {isStarted ? 'Continuar Aprendiendo' : 'Comenzar Ahora'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>

                  {/* Last Study Date */}
                  {progress && progress.lastStudyDate && (
                    <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Última vez: {new Date(progress.lastStudyDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {languages.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay idiomas disponibles</h3>
            <p className="text-gray-600">Los idiomas se están cargando o no hay ninguno configurado.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LanguagesPage
