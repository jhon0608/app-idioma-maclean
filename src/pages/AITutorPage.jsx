import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bot, Settings, BookOpen, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AITutor from '../components/AITutor'
import { API_BASE_URL } from '../config/api'

const AITutorPage = () => {
  const { languageCode } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [language, setLanguage] = useState(null)
  const [userLevel, setUserLevel] = useState('beginner')
  const [selectedTopic, setSelectedTopic] = useState('Conversación libre (de todo)')
  const [loading, setLoading] = useState(true)

  // Temas disponibles por idioma
  const topics = [
    'Conversación libre (de todo)',
    'Saludos y presentaciones',
    'Familia y amigos',
    'Comida y restaurantes',
    'Viajes y turismo',
    'Trabajo y profesiones',
    'Hobbies y tiempo libre',
    'Compras y dinero',
    'Salud y cuerpo',
    'Tiempo y clima',
    'Direcciones y lugares',
    'Cultura y tradiciones',
    'Música y entretenimiento',
    'Deportes y ejercicio',
    'Tecnología y redes sociales',
    'Amor y relaciones',
    'Estudios y educación',
    'Noticias y actualidad',
    'Películas y series',
    'Libros y literatura',
    'Arte y creatividad',
    'Naturaleza y medio ambiente',
    'Historia y geografía',
    'Cocina y recetas',
    'Moda y estilo',
    'Mascotas y animales',
    'Fiestas y celebraciones',
    'Sueños y metas',
    'Experiencias de vida',
    'Filosofía y reflexiones'
  ]

  useEffect(() => {
    fetchLanguageData()
  }, [languageCode])

  const fetchLanguageData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/languages`)
      const languages = await response.json()
      const currentLanguage = languages.find(lang => lang.code === languageCode)
      
      if (currentLanguage) {
        setLanguage(currentLanguage)
        // Establecer nivel basado en la dificultad del idioma
        if (currentLanguage.difficulty === 'advanced') {
          setUserLevel('intermediate')
        } else if (currentLanguage.difficulty === 'intermediate') {
          setUserLevel('beginner')
        }
      }
    } catch (error) {
      console.error('Error fetching language data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tutor de IA...</p>
        </div>
      </div>
    )
  }

  if (!language) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Idioma no encontrado</p>
          <button
            onClick={() => navigate('/languages')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a Idiomas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/learn/${languageCode}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Tutor de IA - {language.name}
                  </h1>
                  <p className="text-gray-600">
                    Conversación interactiva con inteligencia artificial
                  </p>
                </div>
              </div>
            </div>
            <span className="text-3xl">{language.flag}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de Configuración */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Configuración</h3>
              </div>

              {/* Nivel del Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu Nivel
                </label>
                <select
                  value={userLevel}
                  onChange={(e) => setUserLevel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              {/* Tema de Conversación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema de Conversación
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Información del Idioma */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Sobre {language.name}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Nombre nativo:</span>
                    <span className="font-medium">{language.nativeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dificultad:</span>
                    <span className={`font-medium ${
                      language.difficulty === 'beginner' ? 'text-green-600' :
                      language.difficulty === 'intermediate' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {language.difficulty === 'beginner' ? 'Principiante' :
                       language.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categoría:</span>
                    <span className="font-medium">{language.category}</span>
                  </div>
                </div>
              </div>

              {/* Consejos */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Consejos
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• El tutor habla en {language.name}</li>
                  <li>• Responde en {language.name} para practicar</li>
                  <li>• Haz preguntas si no entiendes</li>
                  <li>• Practica la pronunciación</li>
                  <li>• No tengas miedo de cometer errores</li>
                </ul>
              </div>

              {/* Test OpenAI */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Estado del Tutor</h4>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(`${API_BASE_URL}/api/test-openai`)
                      const data = await response.json()
                      alert(data.success ? '✅ Tutor de IA funcionando!' : '❌ Error: ' + data.error)
                    } catch (error) {
                      alert('❌ Error de conexión')
                    }
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg transition-colors"
                >
                  🧪 Probar Conexión IA
                </button>
              </div>

              {/* Acciones Rápidas */}
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/learn/${languageCode}`)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Ver Lecciones</span>
                </button>
                <button
                  onClick={() => navigate(`/practice/${languageCode}`)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                >
                  <span>🎤</span>
                  <span>Práctica de Voz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat del Tutor de IA */}
          <div className="lg:col-span-3">
            <AITutor 
              language={language}
              userLevel={userLevel}
              topic={selectedTopic}
              key={`${userLevel}-${selectedTopic}`} // Re-render cuando cambie configuración
            />
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ¿Cómo funciona el Tutor de IA?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Conversación Natural</h4>
              <p className="text-sm text-gray-600">
                Chatea como si fuera un profesor real. El tutor se adapta a tu nivel y responde de forma personalizada.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Bot className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Corrección Inteligente</h4>
              <p className="text-sm text-gray-600">
                El tutor corrige tus errores de forma constructiva y te ayuda a mejorar tu gramática y vocabulario.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-purple-600 text-xl">🎤</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Práctica de Voz</h4>
              <p className="text-sm text-gray-600">
                Usa el micrófono para hablar y el tutor puede reproducir las respuestas para practicar pronunciación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AITutorPage
