import React, { useState, useEffect } from 'react'
import { Globe, BookOpen, Trophy, Target, Clock, Star, LogOut, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [userProgress, setUserProgress] = useState([])
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      // Obtener idiomas
      const languagesResponse = await fetch('http://localhost:5000/api/languages')
      const languagesData = await languagesResponse.json()
      setLanguages(languagesData)

      // Obtener progreso del usuario
      if (user) {
        const progressResponse = await fetch(`http://localhost:5000/api/users/${user.id}/progress`)
        const progressData = await progressResponse.json()
        setUserProgress(progressData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      navigate('/')
    }
  }

  const getUserName = () => {
    console.log('🔍 Debug user data:', { user, profile })

    if (profile) {
      return `${profile.first_name} ${profile.last_name}`
    }
    if (user?.user_metadata) {
      return user.user_metadata.full_name || user.user_metadata.first_name || 'Usuario'
    }
    return user?.email?.split('@')[0] || 'Usuario'
  }

  const getUserInitials = () => {
    const name = getUserName()
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Calcular estadísticas reales
  const getTotalScore = () => {
    return userProgress.reduce((total, progress) => total + progress.totalScore, 0)
  }

  const getTotalLessonsCompleted = () => {
    return userProgress.reduce((total, progress) => total + progress.completedLessons.length, 0)
  }

  const getCurrentStreak = () => {
    if (userProgress.length === 0) return 0
    return Math.max(...userProgress.map(p => p.streak))
  }

  const getActiveLanguages = () => {
    return userProgress.length
  }

  const getRecentActivity = () => {
    const allCompletedLessons = []
    userProgress.forEach(progress => {
      progress.completedLessons.forEach(lesson => {
        const language = languages.find(l => l.code === progress.languageCode)
        allCompletedLessons.push({
          ...lesson,
          languageName: language?.name || progress.languageCode,
          languageFlag: language?.flag || '🌍'
        })
      })
    })

    return allCompletedLessons
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Maclean</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">¡Hola!</p>
                <p className="font-semibold">{getUserName()}</p>
              </div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{getUserInitials()}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a tu Dashboard!
          </h1>
          <p className="text-gray-600">
            Continúa tu aventura de aprendizaje de idiomas
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card text-center animate-pulse">
                <div className="bg-gray-200 w-12 h-12 rounded-full mx-auto mb-3"></div>
                <div className="bg-gray-200 h-6 w-8 mx-auto mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-20 mx-auto rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{getActiveLanguages()}</h3>
              <p className="text-gray-600">Idiomas Activos</p>
            </div>

            <div className="card text-center">
              <div className="bg-secondary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{getTotalScore()}</h3>
              <p className="text-gray-600">Puntos Totales</p>
            </div>

            <div className="card text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{getTotalLessonsCompleted()}</h3>
              <p className="text-gray-600">Lecciones Completadas</p>
            </div>

            <div className="card text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{getCurrentStreak()}</h3>
              <p className="text-gray-600">Racha Actual</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Mis Cursos Actuales</h2>
                <button
                  onClick={() => navigate('/languages')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver todos los idiomas
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div>
                          <div className="w-20 h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="w-16 h-3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2"></div>
                    </div>
                  ))
                ) : userProgress.length > 0 ? (
                  userProgress.map((progress) => {
                    const language = languages.find(l => l.code === progress.languageCode)
                    const totalPossibleLessons = language?.totalLessons || 10
                    const completedLessons = progress.completedLessons.length
                    const progressPercentage = Math.round((completedLessons / totalPossibleLessons) * 100)

                    return (
                      <div
                        key={progress.languageCode}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/learn/${progress.languageCode}`)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{language?.flag || '🌍'}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900">{language?.name || progress.languageCode}</h3>
                              <p className="text-sm text-gray-600 capitalize">{progress.level}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">
                              {completedLessons}/{totalPossibleLessons} lecciones
                            </div>
                            <button className="btn-primary text-sm" onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/learn/${progress.languageCode}`)
                            }}>
                              Continuar
                            </button>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-600">{progressPercentage}% completado</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{progress.totalScore} puntos</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      ¡Comienza tu aventura de aprendizaje!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Selecciona un idioma para comenzar a aprender
                    </p>
                    <button
                      onClick={() => navigate('/languages')}
                      className="btn-primary"
                    >
                      Explorar Idiomas
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Goal */}
            <div className="card">
              <h3 className="font-semibold mb-4">Meta Diaria</h3>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.7)}`}
                      className="text-primary-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">70%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">14/20 minutos completados</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="font-semibold mb-4">Actividad Reciente</h3>
              <div className="space-y-3">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-3 animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="w-24 h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="w-16 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : getRecentActivity().length > 0 ? (
                  getRecentActivity().map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-2xl">{activity.languageFlag}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Lección {activity.unit}.{activity.lesson} completada
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.languageName} • {activity.score} puntos
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      No hay actividad reciente
                    </p>
                    <p className="text-xs text-gray-400">
                      ¡Completa tu primera lección!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/languages')}
                  className="w-full btn-primary text-sm py-2"
                >
                  Explorar Idiomas
                </button>
                {userProgress.length > 0 && (
                  <button
                    onClick={() => navigate(`/learn/${userProgress[0].languageCode}`)}
                    className="w-full btn-outline text-sm py-2"
                  >
                    Continuar Aprendiendo
                  </button>
                )}
                <button
                  onClick={() => navigate('/languages')}
                  className="w-full btn-outline text-sm py-2"
                >
                  Nuevo Idioma
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
