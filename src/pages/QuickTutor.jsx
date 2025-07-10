import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, Globe, MessageCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { API_BASE_URL } from '../config/api'


const QuickTutor = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/languages`)
      const data = await response.json()
      setLanguages(data.filter(lang => lang.isActive))
    } catch (error) {
      console.error('Error fetching languages:', error)
    } finally {
      setLoading(false)
    }
  }

  const popularLanguages = languages.filter(lang => 
    ['en', 'es', 'fr', 'de', 'it', 'pt'].includes(lang.code)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tutores de IA...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Bot className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Tutor de IA 24/7
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Conversa todo el día con tu tutor personal de idiomas
            </p>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-6 w-6" />
                <span>Conversación Natural</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6" />
                <span>16 Idiomas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎤</span>
                <span>Con Voz</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Idiomas Populares */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Idiomas Más Populares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularLanguages.map((language) => (
              <div
                key={language.code}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/ai-tutor/${language.code}`)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{language.flag}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {language.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{language.nativeName}</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      language.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      language.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {language.difficulty === 'beginner' ? 'Principiante' :
                       language.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                    </span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <span>Conversar Ahora</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Todos los Idiomas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Todos los Idiomas Disponibles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {languages.map((language) => (
              <div
                key={language.code}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all cursor-pointer text-center"
                onClick={() => navigate(`/ai-tutor/${language.code}`)}
              >
                <div className="text-3xl mb-2">{language.flag}</div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {language.name}
                </h4>
                <p className="text-xs text-gray-600">{language.nativeName}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            ¿Por qué nuestro Tutor de IA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Conversación Natural
              </h3>
              <p className="text-gray-600">
                Habla como si fuera un amigo real. El tutor se adapta a tu personalidad y mantiene conversaciones interesantes por horas.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Disponible 24/7
              </h3>
              <p className="text-gray-600">
                Tu tutor nunca duerme. Practica cuando quieras, a cualquier hora del día o la noche. Siempre está listo para conversar.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎤</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Con Voz Real
              </h3>
              <p className="text-gray-600">
                Habla por micrófono y escucha las respuestas. Practica pronunciación y comprensión auditiva de forma natural.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para conversar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Elige un idioma y comienza a hablar con tu tutor personal ahora mismo
          </p>
          <button
            onClick={() => navigate('/languages')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105"
          >
            Ver Todos los Idiomas
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickTutor
