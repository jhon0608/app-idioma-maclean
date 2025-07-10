import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, Trophy, Target, RotateCcw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import VoicePractice from '../components/VoicePractice'
import { API_BASE_URL } from '../config/api'


const PronunciationPractice = () => {
  const { languageCode } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [language, setLanguage] = useState(null)
  const [practiceWords, setPracticeWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [completedWords, setCompletedWords] = useState([])
  const [totalScore, setTotalScore] = useState(0)
  const [loading, setLoading] = useState(true)

  // Palabras de práctica por idioma
  const practiceData = {
    'en': [
      { word: 'Hello', translation: 'Hola', difficulty: 'beginner' },
      { word: 'Thank you', translation: 'Gracias', difficulty: 'beginner' },
      { word: 'Good morning', translation: 'Buenos días', difficulty: 'beginner' },
      { word: 'How are you?', translation: '¿Cómo estás?', difficulty: 'beginner' },
      { word: 'Beautiful', translation: 'Hermoso', difficulty: 'intermediate' },
      { word: 'Pronunciation', translation: 'Pronunciación', difficulty: 'advanced' }
    ],
    'es': [
      { word: 'Hola', translation: 'Hello', difficulty: 'beginner' },
      { word: 'Gracias', translation: 'Thank you', difficulty: 'beginner' },
      { word: 'Buenos días', translation: 'Good morning', difficulty: 'beginner' },
      { word: '¿Cómo estás?', translation: 'How are you?', difficulty: 'beginner' },
      { word: 'Hermoso', translation: 'Beautiful', difficulty: 'intermediate' },
      { word: 'Pronunciación', translation: 'Pronunciation', difficulty: 'advanced' }
    ],
    'fr': [
      { word: 'Bonjour', translation: 'Hello', difficulty: 'beginner' },
      { word: 'Merci', translation: 'Thank you', difficulty: 'beginner' },
      { word: 'Comment allez-vous?', translation: 'How are you?', difficulty: 'intermediate' },
      { word: 'Magnifique', translation: 'Beautiful', difficulty: 'intermediate' },
      { word: 'Prononciation', translation: 'Pronunciation', difficulty: 'advanced' }
    ],
    'de': [
      { word: 'Hallo', translation: 'Hello', difficulty: 'beginner' },
      { word: 'Danke', translation: 'Thank you', difficulty: 'beginner' },
      { word: 'Wie geht es Ihnen?', translation: 'How are you?', difficulty: 'intermediate' },
      { word: 'Schön', translation: 'Beautiful', difficulty: 'intermediate' },
      { word: 'Aussprache', translation: 'Pronunciation', difficulty: 'advanced' }
    ],
    'it': [
      { word: 'Ciao', translation: 'Hello', difficulty: 'beginner' },
      { word: 'Grazie', translation: 'Thank you', difficulty: 'beginner' },
      { word: 'Come stai?', translation: 'How are you?', difficulty: 'intermediate' },
      { word: 'Bellissimo', translation: 'Beautiful', difficulty: 'intermediate' },
      { word: 'Pronuncia', translation: 'Pronunciation', difficulty: 'advanced' }
    ]
  }

  useEffect(() => {
    fetchLanguageData()
  }, [languageCode])

  const fetchLanguageData = async () => {
    try {
      // Obtener información del idioma
      const response = await fetch(`${API_BASE_URL}/api/languages`)
      const languages = await response.json()
      const currentLanguage = languages.find(lang => lang.code === languageCode)
      
      if (currentLanguage) {
        setLanguage(currentLanguage)
        // Usar palabras predefinidas o obtener de lecciones
        const words = practiceData[languageCode] || practiceData['en']
        setPracticeWords(words)
      }
    } catch (error) {
      console.error('Error fetching language data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePronunciationSuccess = (similarity) => {
    const newCompleted = [...completedWords]
    newCompleted[currentWordIndex] = {
      word: practiceWords[currentWordIndex].word,
      success: true,
      similarity,
      score: Math.round(similarity * 100)
    }
    setCompletedWords(newCompleted)
    setTotalScore(prev => prev + Math.round(similarity * 100))

    // Avanzar automáticamente después de éxito
    setTimeout(() => {
      if (currentWordIndex < practiceWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1)
      }
    }, 2000)
  }

  const handlePronunciationError = (similarity) => {
    // Registrar intento fallido pero permitir continuar
    const newCompleted = [...completedWords]
    if (!newCompleted[currentWordIndex]) {
      newCompleted[currentWordIndex] = {
        word: practiceWords[currentWordIndex].word,
        success: false,
        similarity,
        score: 0,
        attempts: 1
      }
    } else {
      newCompleted[currentWordIndex].attempts = (newCompleted[currentWordIndex].attempts || 0) + 1
    }
    setCompletedWords(newCompleted)
  }

  const resetPractice = () => {
    setCurrentWordIndex(0)
    setCompletedWords([])
    setTotalScore(0)
  }

  const getProgressPercentage = () => {
    return Math.round((currentWordIndex / practiceWords.length) * 100)
  }

  const getAverageScore = () => {
    const successfulWords = completedWords.filter(word => word && word.success)
    if (successfulWords.length === 0) return 0
    return Math.round(successfulWords.reduce((sum, word) => sum + word.score, 0) / successfulWords.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando práctica de pronunciación...</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/learn/${languageCode}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{language.flag}</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Práctica de Pronunciación - {language.name}
                  </h1>
                  <p className="text-gray-600">
                    Palabra {currentWordIndex + 1} de {practiceWords.length}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={resetPractice}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{getProgressPercentage()}%</p>
            <p className="text-sm text-gray-600">Progreso</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalScore}</p>
            <p className="text-sm text-gray-600">Puntos Totales</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{getAverageScore()}%</p>
            <p className="text-sm text-gray-600">Precisión Promedio</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {practiceWords.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  completedWords[index]?.success
                    ? 'bg-green-500'
                    : completedWords[index]
                    ? 'bg-yellow-500'
                    : index === currentWordIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Práctica de pronunciación */}
        {practiceWords[currentWordIndex] && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-600 mb-2">Traduce a:</p>
              <p className="text-xl font-medium text-gray-800">
                "{practiceWords[currentWordIndex].translation}"
              </p>
            </div>
            
            <VoicePractice
              text={practiceWords[currentWordIndex].word}
              language={languageCode}
              onSuccess={handlePronunciationSuccess}
              onError={handlePronunciationError}
              difficulty={practiceWords[currentWordIndex].difficulty}
            />
          </div>
        )}

        {/* Navegación */}
        <div className="flex justify-between">
          <button
            onClick={() => currentWordIndex > 0 && setCurrentWordIndex(currentWordIndex - 1)}
            disabled={currentWordIndex === 0}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentWordIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            ← Anterior
          </button>
          
          <button
            onClick={() => currentWordIndex < practiceWords.length - 1 && setCurrentWordIndex(currentWordIndex + 1)}
            disabled={currentWordIndex === practiceWords.length - 1}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentWordIndex === practiceWords.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Siguiente →
          </button>
        </div>

        {/* Resumen de progreso */}
        {completedWords.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Resumen de Práctica</h3>
            <div className="grid gap-2">
              {completedWords.map((word, index) => 
                word && (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{word.word}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        word.success ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {word.success ? '✓ Correcto' : `${word.attempts || 1} intentos`}
                      </span>
                      <span className="text-sm text-gray-600">{word.score}pts</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PronunciationPractice
