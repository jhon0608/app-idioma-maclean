import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, RotateCcw, CheckCircle, XCircle, Play } from 'lucide-react'

const VoicePractice = ({ 
  text, 
  language = 'en-US', 
  onSuccess, 
  onError,
  difficulty = 'beginner' 
}) => {
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userSpeech, setUserSpeech] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [similarity, setSimilarity] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [isSupported, setIsSupported] = useState(true)

  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  // Mapeo de códigos de idioma para Speech API
  const languageMap = {
    'en': 'en-US',
    'es': 'es-ES', 
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'pt': 'pt-PT',
    'ru': 'ru-RU',
    'nl': 'nl-NL',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'hi': 'hi-IN',
    'ar': 'ar-SA',
    'he': 'he-IL',
    'sv': 'sv-SE',
    'no': 'no-NO'
  }

  useEffect(() => {
    // Verificar soporte del navegador
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false)
      return
    }

    // Configurar reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = languageMap[language] || language

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim()
      setUserSpeech(transcript)
      analyzePronunciation(transcript, text.toLowerCase().trim())
      setIsListening(false)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setFeedback({
        type: 'error',
        message: 'Error al escuchar. Inténtalo de nuevo.'
      })
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, text])

  // Función para reproducir el texto
  const speakText = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true)
      
      // Cancelar cualquier síntesis anterior
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = languageMap[language] || language
      utterance.rate = difficulty === 'beginner' ? 0.8 : difficulty === 'intermediate' ? 0.9 : 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onend = () => {
        setIsPlaying(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        setFeedback({
          type: 'error',
          message: 'Error al reproducir el audio'
        })
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  // Función para iniciar el reconocimiento de voz
  const startListening = () => {
    if (!recognitionRef.current || isListening) return

    setIsListening(true)
    setFeedback(null)
    setAttempts(prev => prev + 1)
    
    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting recognition:', error)
      setIsListening(false)
    }
  }

  // Función para detener el reconocimiento
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  // Función para analizar la pronunciación
  const analyzePronunciation = (userText, targetText) => {
    // Algoritmo simple de similitud (Levenshtein distance normalizada)
    const similarity = calculateSimilarity(userText, targetText)
    setSimilarity(similarity)

    let feedback_type, message, threshold

    // Ajustar umbral según dificultad
    switch (difficulty) {
      case 'beginner':
        threshold = 0.6
        break
      case 'intermediate':
        threshold = 0.75
        break
      case 'advanced':
        threshold = 0.85
        break
      default:
        threshold = 0.7
    }

    if (similarity >= threshold) {
      feedback_type = 'success'
      message = '¡Excelente pronunciación! 🎉'
      if (onSuccess) onSuccess(similarity)
    } else if (similarity >= threshold - 0.2) {
      feedback_type = 'warning'
      message = '¡Casi perfecto! Inténtalo una vez más 👍'
    } else {
      feedback_type = 'error'
      message = 'Sigue practicando. Escucha de nuevo y repite 🔄'
      if (onError) onError(similarity)
    }

    setFeedback({ type: feedback_type, message, similarity })
  }

  // Función para calcular similitud entre textos
  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const distance = levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  // Algoritmo de distancia de Levenshtein
  const levenshteinDistance = (str1, str2) => {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  const resetPractice = () => {
    setUserSpeech('')
    setFeedback(null)
    setSimilarity(0)
    setAttempts(0)
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          ⚠️ Tu navegador no soporta reconocimiento de voz. 
          Prueba con Chrome, Edge o Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {/* Texto a practicar */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Practica la pronunciación:</h3>
        <p className="text-2xl font-bold text-blue-600 mb-4 p-4 bg-blue-50 rounded-lg">
          "{text}"
        </p>
      </div>

      {/* Controles de audio */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={speakText}
          disabled={isPlaying}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isPlaying 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <Play className="h-5 w-5 animate-pulse" />
              <span>Reproduciendo...</span>
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" />
              <span>Escuchar</span>
            </>
          )}
        </button>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5" />
              <span>Detener</span>
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              <span>Hablar</span>
            </>
          )}
        </button>

        {attempts > 0 && (
          <button
            onClick={resetPractice}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reiniciar</span>
          </button>
        )}
      </div>

      {/* Estado de escucha */}
      {isListening && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
            <Mic className="h-5 w-5 animate-pulse" />
            <span>Escuchando... Habla ahora</span>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`p-4 rounded-lg border ${
          feedback.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800'
            : feedback.type === 'warning'
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {feedback.type === 'error' && <XCircle className="h-5 w-5" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
          
          {feedback.similarity !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Precisión:</span>
                <span>{Math.round(feedback.similarity * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    feedback.similarity >= 0.8 ? 'bg-green-500' :
                    feedback.similarity >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${feedback.similarity * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lo que escuchó la app */}
      {userSpeech && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Escuché:</p>
          <p className="font-medium text-gray-900">"{userSpeech}"</p>
        </div>
      )}

      {/* Estadísticas */}
      {attempts > 0 && (
        <div className="text-center text-sm text-gray-500">
          Intentos: {attempts}
        </div>
      )}
    </div>
  )
}

export default VoicePractice
