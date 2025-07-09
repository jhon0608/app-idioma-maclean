import React from 'react'
import { Globe, BookOpen, Trophy, Target, Clock, Star, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">3</h3>
            <p className="text-gray-600">Idiomas Activos</p>
          </div>

          <div className="card text-center">
            <div className="bg-secondary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
            <p className="text-gray-600">Logros Desbloqueados</p>
          </div>

          <div className="card text-center">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">85%</h3>
            <p className="text-gray-600">Progreso Promedio</p>
          </div>

          <div className="card text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">47h</h3>
            <p className="text-gray-600">Tiempo Total</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Mis Cursos Actuales</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Inglés', level: 'Intermedio', progress: 75, flag: '🇺🇸' },
                  { name: 'Francés', level: 'Básico', progress: 45, flag: '🇫🇷' },
                  { name: 'Japonés', level: 'Principiante', progress: 20, flag: '🇯🇵' }
                ].map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => navigate('/learn/en')}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{course.flag}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-600">{course.level}</p>
                        </div>
                      </div>
                      <button className="btn-primary text-sm" onClick={(e) => {
                        e.stopPropagation()
                        navigate('/learn/en')
                      }}>
                        Continuar
                      </button>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{course.progress}% completado</p>
                  </div>
                ))}
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

            {/* Recent Achievements */}
            <div className="card">
              <h3 className="font-semibold mb-4">Logros Recientes</h3>
              <div className="space-y-3">
                {[
                  { name: 'Primera Lección', icon: '🎯', date: 'Hoy' },
                  { name: 'Racha de 7 días', icon: '🔥', date: 'Ayer' },
                  { name: 'Vocabulario Básico', icon: '📚', date: '2 días' }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs text-gray-500">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full btn-primary text-sm py-2">
                  Lección Rápida
                </button>
                <button className="w-full btn-outline text-sm py-2">
                  Práctica de Vocabulario
                </button>
                <button className="w-full btn-outline text-sm py-2">
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
