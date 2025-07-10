import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Volume2, CheckCircle, X, RotateCcw, Trophy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import VoicePractice from '../components/VoicePractice'
import { API_BASE_URL } from '../config/api'


const LessonPage = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState('vocabulary') // vocabulary, pronunciation, exercises, results
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [pronunciationProgress, setPronunciationProgress] = useState([])
  const [currentPronunciationIndex, setCurrentPronunciationIndex] = useState(0)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}`)
      const data = await response.json()
      setLesson(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching lesson:', error)
      setLoading(false)
    }
  }

  const handleStartPronunciation = () => {
    setCurrentStep('pronunciation')
    setCurrentPronunciationIndex(0)
    setPronunciationProgress([])
  }

  const handleStartExercises = () => {
    setCurrentStep('exercises')
    setCurrentExercise(0)
    setUserAnswers([])
    setScore(0)
  }

  const handlePronunciationSuccess = (similarity) => {
    const newProgress = [...pronunciationProgress]
    newProgress[currentPronunciationIndex] = { success: true, similarity }
    setPronunciationProgress(newProgress)

    // Avanzar al siguiente vocabulario o ir a ejercicios
    if (currentPronunciationIndex < lesson.vocabulary.length - 1) {
      setCurrentPronunciationIndex(currentPronunciationIndex + 1)
    } else {
      // Completó toda la pronunciación, ir a ejercicios
      setTimeout(() => {
        handleStartExercises()
      }, 2000)
    }
  }

  const handlePronunciationError = (similarity) => {
    // Permitir continuar después de varios intentos
    const newProgress = [...pronunciationProgress]
    newProgress[currentPronunciationIndex] = { success: false, similarity }
    setPronunciationProgress(newProgress)
  }

  const handleAnswerSubmit = (answer) => {
    const exercise = lesson.exercises[currentExercise]
    const isCorrect = answer === exercise.correctAnswer
    
    const newAnswers = [...userAnswers, {
      exerciseIndex: currentExercise,
      userAnswer: answer,
      correctAnswer: exercise.correctAnswer,
      isCorrect
    }]
    
    setUserAnswers(newAnswers)
    
    if (isCorrect) {
      setScore(score + 10)
    }

    // Avanzar al siguiente ejercicio o mostrar resultados
    if (currentExercise < lesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
    } else {
      setCurrentStep('results')
      completeLesson(score + (isCorrect ? 10 : 0))
    }
  }

  const completeLesson = async (finalScore) => {
    try {
      await fetch(`${API_BASE_URL}/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          score: finalScore
        })
      })
      console.log('Lección completada con score:', finalScore)
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  const restartLesson = () => {
    setCurrentStep('vocabulary')
    setCurrentExercise(0)
    setUserAnswers([])
    setScore(0)
    setShowResults(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando lección...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lección no encontrada</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Unidad {lesson.unit}</p>
              <p className="text-lg font-bold text-blue-600">Lección {lesson.lessonNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Vocabulary Section */}
        {currentStep === 'vocabulary' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Vocabulario</h2>
            
            <div className="grid gap-4 mb-8">
              {lesson.vocabulary.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl font-bold text-blue-600">{item.word}</span>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      <p className="text-gray-600 mb-1">{item.translation}</p>
                      <p className="text-sm text-gray-500">{item.pronunciation}</p>
                      <p className="text-sm text-gray-700 italic mt-2">"{item.example}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleStartPronunciation}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Practicar Pronunciación
              </button>
            </div>
          </div>
        )}

        {/* Pronunciation Section */}
        {currentStep === 'pronunciation' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎤 Práctica de Pronunciación</h2>
              <p className="text-gray-600">
                Palabra {currentPronunciationIndex + 1} de {lesson.vocabulary.length}
              </p>
            </div>

            {/* Progreso */}
            <div className="mb-8">
              <div className="flex justify-center space-x-2 mb-4">
                {lesson.vocabulary.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < currentPronunciationIndex
                        ? pronunciationProgress[index]?.success
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                        : index === currentPronunciationIndex
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentPronunciationIndex / lesson.vocabulary.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Componente de práctica de voz */}
            {lesson.vocabulary[currentPronunciationIndex] && (
              <VoicePractice
                text={lesson.vocabulary[currentPronunciationIndex].word}
                language={lesson.languageCode}
                onSuccess={handlePronunciationSuccess}
                onError={handlePronunciationError}
                difficulty={lesson.level}
              />
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('vocabulary')}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Volver al Vocabulario
              </button>

              <div className="space-x-4">
                {currentPronunciationIndex > 0 && (
                  <button
                    onClick={() => setCurrentPronunciationIndex(currentPronunciationIndex - 1)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Anterior
                  </button>
                )}

                {currentPronunciationIndex < lesson.vocabulary.length - 1 ? (
                  <button
                    onClick={() => setCurrentPronunciationIndex(currentPronunciationIndex + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleStartExercises}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Ir a Ejercicios →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exercises Section */}
        {currentStep === 'exercises' && lesson.exercises.length > 0 && (
          <ExerciseComponent
            exercise={lesson.exercises[currentExercise]}
            exerciseNumber={currentExercise + 1}
            totalExercises={lesson.exercises.length}
            onAnswer={handleAnswerSubmit}
          />
        )}

        {/* Results Section */}
        {currentStep === 'results' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Lección Completada!</h2>
              <p className="text-gray-600">Has terminado "{lesson.title}"</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-2xl font-bold text-blue-600 mb-2">
                Puntuación: {score}/{lesson.exercises.length * 10}
              </p>
              <p className="text-gray-600">
                {Math.round((score / (lesson.exercises.length * 10)) * 100)}% de respuestas correctas
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={restartLesson}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Repetir Lección
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuar Aprendiendo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para ejercicios individuales
const ExerciseComponent = ({ exercise, exerciseNumber, totalExercises, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSubmit = () => {
    if (!selectedAnswer) return
    
    setShowFeedback(true)
    setTimeout(() => {
      onAnswer(selectedAnswer)
      setSelectedAnswer('')
      setShowFeedback(false)
    }, 2000)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Ejercicio {exerciseNumber} de {totalExercises}
          </h2>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {exercise.type}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(exerciseNumber / totalExercises) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{exercise.question}</h3>

        {exercise.type === 'multiple-choice' && (
          <div className="space-y-3">
            {exercise.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                disabled={showFeedback}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {exercise.type === 'translation' && (
          <input
            type="text"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            disabled={showFeedback}
            placeholder="Escribe tu respuesta..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        {exercise.type === 'fill-blank' && (
          <input
            type="text"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            disabled={showFeedback}
            placeholder="Completa la frase..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-6 ${
          selectedAnswer === exercise.correctAnswer
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            {selectedAnswer === exercise.correctAnswer ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <X className="w-5 h-5 text-red-600 mr-2" />
            )}
            <span className={`font-medium ${
              selectedAnswer === exercise.correctAnswer ? 'text-green-800' : 'text-red-800'
            }`}>
              {selectedAnswer === exercise.correctAnswer ? '¡Correcto!' : 'Incorrecto'}
            </span>
          </div>
          {selectedAnswer !== exercise.correctAnswer && (
            <p className="text-red-700 mb-2">
              Respuesta correcta: <strong>{exercise.correctAnswer}</strong>
            </p>
          )}
          <p className="text-gray-700 text-sm">{exercise.explanation}</p>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || showFeedback}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {showFeedback ? 'Procesando...' : 'Enviar Respuesta'}
        </button>
      </div>
    </div>
  )
}

export default LessonPage
